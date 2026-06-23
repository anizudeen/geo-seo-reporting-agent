import { StateGraph, Annotation, messagesStateReducer } from "@langchain/langgraph";
import { HumanMessage, BaseMessage } from "@langchain/core/messages";
import { getModel, getDeepSeekModel, isQuotaError } from "./model";
import { ReportSpecSchema } from "./reportSpec";
import type { ReportSpec } from "./reportSpec";
import type { ProgressEvent } from "./graph";

const replace = <T>(a: T, b: T | undefined): T => b !== undefined ? b : a;

const RefineStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({ reducer: messagesStateReducer }),
  currentSpec: Annotation<ReportSpec | null>({ reducer: replace, default: () => null }),
  instruction: Annotation<string>({ reducer: replace, default: () => "" }),
  refinedSpec: Annotation<ReportSpec | null>({ reducer: replace, default: () => null }),
  progressEvents: Annotation<ProgressEvent[]>({ reducer: replace, default: () => [] }),
});

type RefineState = typeof RefineStateAnnotation.State;

const REFINE_PROMPT = `You are Agent 4 — the Rewriter for Pepper Atlas.

You have an existing report spec and a user instruction to apply. Make ONLY the changes requested.
Do NOT re-fetch data or change any metric numbers. Only adjust narrative, tone, length, or structure as instructed.

Instruction: {{instruction}}

Current ReportSpec:
{{spec}}

Return the updated ReportSpec JSON only.`;

async function rewriterNode(state: RefineState): Promise<Partial<RefineState>> {
  const events: ProgressEvent[] = [
    { type: "progress", agent: "Agent 4 — Rewriter", message: `Applying instruction: "${state.instruction}"` },
  ];

  const model = getModel(0);
  const structured = model.withStructuredOutput(ReportSpecSchema);

  const prompt = REFINE_PROMPT
    .replace("{{instruction}}", state.instruction)
    .replace("{{spec}}", JSON.stringify(state.currentSpec, null, 2));

  let refined: ReportSpec;
  try {
    refined = await structured.invoke([new HumanMessage(prompt)]) as ReportSpec;
  } catch (err) {
    if (isQuotaError(err) && process.env.DEEPSEEK_API_KEY) {
      events.push({ type: "progress", agent: "Agent 4 — Rewriter", message: "Gemini quota reached — switching to DeepSeek fallback…", severity: "warn" });
      const result = await getDeepSeekModel(0).invoke([new HumanMessage(prompt + "\n\nReturn ONLY valid JSON matching the ReportSpec schema.")]);
      const text = typeof result.content === "string" ? result.content : JSON.stringify(result.content);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("DeepSeek did not return valid JSON");
      refined = ReportSpecSchema.parse(JSON.parse(jsonMatch[0]));
    } else {
      throw err;
    }
  }

  events.push({
    type: "progress",
    agent: "Agent 4 — Rewriter",
    message: "✓ Rewrite complete.",
    severity: "info",
  });

  return {
    refinedSpec: refined,
    progressEvents: [...state.progressEvents, ...events],
  };
}

function buildRefineGraph() {
  const graph = new StateGraph(RefineStateAnnotation)
    .addNode("rewriter", rewriterNode)
    .addEdge("__start__", "rewriter")
    .addEdge("rewriter", "__end__");
  return graph.compile();
}

export const refineGraph = buildRefineGraph();
export type { RefineState };
