import { StateGraph, Annotation, messagesStateReducer, interrupt, MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { getModel, getDeepSeekModel, isQuotaError } from "./model";
import { agentTools, getGscData, getGa4Data, getSemrushData, getAiVisibilityData, getCmsData } from "./tools";
import { ReportSpecSchema } from "./reportSpec";
import type { ReportSpec } from "./reportSpec";

// Progress event types pushed into the SSE stream
export interface ProgressEvent {
  type: "progress" | "human_in_loop" | "done" | "error";
  agent?: string;
  node?: string;
  callLine?: string;  // "agent → call(args) ✓ result"
  message?: string;
  severity?: "info" | "warn" | "error";
  question?: string;
  hint?: string;
  options?: { key?: string; label: string; pitch: string; isOther?: boolean }[];
  threadId?: string;   // for human_in_loop: the checkpointer thread to resume
  seenCount?: number;  // for human_in_loop: progressEvents already streamed before the pause
  reportSpec?: ReportSpec;
}

const replace = <T>(a: T, b: T | undefined): T => b !== undefined ? b : a;

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({ reducer: messagesStateReducer, default: () => [] }),
  collectedData: Annotation<Record<string, unknown>>({ reducer: replace, default: () => ({}) }),
  reportSpec: Annotation<ReportSpec | null>({ reducer: replace, default: () => null }),
  reviewerNotes: Annotation<string>({ reducer: replace, default: () => "" }),
  needsRevision: Annotation<boolean>({ reducer: replace, default: () => false }),
  revisionCount: Annotation<number>({ reducer: replace, default: () => 0 }),
  progressEvents: Annotation<ProgressEvent[]>({ reducer: replace, default: () => [] }),
  clientName: Annotation<string>({ reducer: replace, default: () => "Acme Analytics" }),
  period: Annotation<string>({ reducer: replace, default: () => "May 25–31, 2026" }),
  guidance: Annotation<string>({ reducer: replace, default: () => "" }),
});

type State = typeof StateAnnotation.State;

const ANALYST_PROMPT = `You are the Analyst & Report Builder for Pepper Atlas, an AI-native platform for organic and AI search visibility.

You have just received structured data from all 5 data sources (GSC, GA4, Semrush, AI Visibility, CMS). Your job is to:
1. Interpret the data and write a professional, client-facing weekly performance report
2. Structure it in EXACTLY 5 sections in this order: AI visibility FIRST, then SEO, conversions, content health, recommendations
3. Fill the ReportSpec schema completely

CRITICAL RULES:
- AI visibility LEADS — it is the differentiator and fastest-growing discovery channel
- NEVER invent or estimate numbers — every metric must come directly from the tool outputs provided
- GA4 Dark Direct: explicitly note that ~31% of Direct traffic is likely AI-referred (stripped referrer). Surface this as an attribution caveat
- SOV: always report as frequency-based share of voice, never single-answer position
- Authority Score: mention as supporting context ONLY, never as a headline KPI
- Low confidence: flag if totalPromptsTracked < 100
- AI source platforms: AI engines increasingly cite Reddit (community) and YouTube (video). Factor the sourcePlatforms data into the AI-search read, and where it's the biggest lever, into a recommendation (e.g. engage the Reddit threads where the competitor wins the recommendation)
- Recommendations: exactly 3, URL-grounded, prioritized by AI/organic impact
- Keyword position change sign convention: the raw data uses negative = rank improved (position number went down, e.g. from 11 to 4 = change of -7). For the ReportSpec output, INVERT the sign: output POSITIVE numbers for improvements (e.g. change: +7 if rank went from 11→4), NEGATIVE for declines. This matches what the client deck will display.
- Tone: professional, concise, insight-forward — not a data dump
- What's next: "Pepper handles it" = services Pepper can provide; "Your team handles it" = self-service checklist

Client: {{clientName}}
Period: {{period}}
Additional guidance: {{guidance}}

Collected data from tools:
{{data}}

Respond ONLY with the ReportSpec JSON — no prose around it.`;

const REVIEWER_PROMPT = `You are the Quality Reviewer for Pepper Atlas reporting. Review this draft ReportSpec and check for:

1. All 5 sections present (execSummary, seo, aiVisibility, recommendations, whatNext)
2. AI visibility section leads (must have score, delta, sov, engineBreakdown)
3. GA4 attribution caveat mentioned in seo.attributionNote
4. SOV is described as frequency-based (not single-answer position)
5. Domain Authority Score is NOT a headline metric
6. Exactly 3 recommendations, each with label and brief
7. No hallucinated numbers (spot-check: clicks should be ~48,200, AI score ~38)
8. lowConfidence flag correctly set

Respond with:
- "APPROVED" if all checks pass
- "REVISION NEEDED: [specific issue]" if something must be fixed

Draft ReportSpec:
{{spec}}`;

// Exact JSON template shown to DeepSeek (thinking model — structured output unsupported).
// Uses concrete example values so the model produces real content, not literal "string" placeholders.
const REPORT_SPEC_TEMPLATE = JSON.stringify({
  clientName: "<client name from input>",
  period: "<week period e.g. May 25–31, 2026>",
  execSummary: {
    text: "<2-3 sentence executive summary of the week>",
    winOfWeek: "<single biggest win this week>",
    watch: "<one metric or trend to watch next week>",
  },
  seo: {
    metrics: [
      { label: "Organic clicks", value: "48,200", delta: "+12%" },
      { label: "Impressions", value: "1.2M", delta: "+8%" },
      { label: "Avg. position", value: "14.3", delta: "▲ 1.2" },
    ],
    keywordMovers: [{ kw: "<keyword>", pos: 4, change: 7, vol: 12000 }],
    topPages: [{ path: "/blog/example", clicks: 3200, stale: false, note: "<insight about this page>" }],
    competitorBenchmark: [{ label: "<metric name>", acme: "<acme value>", competitor: "<competitor value>" }],
    conversionNote: "<attribution insight about conversions>",
    attributionNote: "<GA4 dark direct / AI-referred traffic note>",
  },
  aiVisibility: {
    score: 38,
    delta: -4,
    sov: [{ brand: "<brand name>", pct: 0.14 }],
    engineBreakdown: [{ name: "ChatGPT", score: 16, change: -2 }],
    mentions: [{ platform: "ChatGPT", prompt: "<prompt text>", competitors: ["<competitor>"] }],
    citationOpportunity: "<specific action to improve AI citations>",
    lowConfidence: false,
  },
  recommendations: [
    { num: 1, label: "<action title>", brief: "<1-2 sentence description with URL or specific action>" },
    { num: 2, label: "<action title>", brief: "<1-2 sentence description>" },
    { num: 3, label: "<action title>", brief: "<1-2 sentence description>" },
  ],
  whatNext: {
    pepperHandles: ["<service Pepper provides>", "<another service>"],
    selfService: ["<task for client team>", "<another task>"],
    services: [{ title: "<service name>", tagline: "<short tagline>", desc: "<1 sentence description>" }],
  },
  slides: [{ slideNum: 1, label: "<slide label>" }],
}, null, 2);

async function collectorNode(state: State): Promise<Partial<State>> {
  const events: ProgressEvent[] = [];
  const collected: Record<string, unknown> = {};

  const tools = [
    { name: "GSC", fn: getGscData, label: "Fetching Google Search Console organic data" },
    { name: "GA4", fn: getGa4Data, label: "Fetching GA4 sessions, conversions & attribution data" },
    { name: "Semrush", fn: getSemrushData, label: "Fetching Semrush keyword rankings & competitive data" },
    { name: "AI Visibility", fn: getAiVisibilityData, label: "Fetching AI search visibility, SoV & buyer prompts" },
    { name: "CMS", fn: getCmsData, label: "Scanning CMS for stale pages & freshness signals" },
  ];

  // Fan-out: fetch all in parallel
  await Promise.all(
    tools.map(async (t) => {
      events.push({ type: "progress", agent: "Agent 1 — Collector", node: t.name, message: t.label });
      const result = await t.fn.invoke({});
      const resultStr = typeof result === "string" ? result : JSON.stringify(result);
      collected[t.name.toLowerCase().replace(/ /g, "_")] = result;
      events.push({
        type: "progress",
        agent: "Agent 1 — Collector",
        callLine: `collector → ${t.fn.name}() ✓ ${resultStr.slice(0, 80)}…`,
      });
    })
  );

  return {
    collectedData: collected,
    progressEvents: [...state.progressEvents, ...events],
    messages: [...state.messages, new HumanMessage("Data collection complete.")],
  };
}

// The one human-in-the-loop decision, surfaced AFTER the Collector has locked the
// numbers and BEFORE the Analyst drafts. Real LangGraph interrupt() — the graph
// pauses here (checkpointed) and resumes when the client sends Command({ resume }).
const FOCUS_INTERRUPT = {
  question: "Before Insights Writer drafts — which growth opportunity should this report build the case for?",
  hint: "Your pick steers the narrative and the expansion pitch to the client. Numbers stay the same either way.",
  options: [
    { key: "geo", label: "AI-search visibility", pitch: "Build the case for a GEO retainer" },
    { key: "content", label: "Content refresh", pitch: "Build the case for an editorial program" },
    { key: "competitive", label: "Competitive displacement", pitch: "Build the case for an “Acme vs Quanta” campaign" },
    { key: "other", label: "Other — type your own", pitch: "", isOther: true },
  ],
};

type FocusChoice = { key?: string; label?: string; pitch?: string } | string;

async function focusGateNode(state: State): Promise<Partial<State>> {
  // First pass: interrupt() throws GraphInterrupt and the graph pauses here (the
  // collector's events have already streamed). On resume the SAME node re-runs and
  // interrupt() returns the resumed value, so keep everything below it idempotent.
  const choice = interrupt(FOCUS_INTERRUPT) as FocusChoice;

  const label = typeof choice === "string" ? choice : (choice?.label || "the chosen focus");
  const pitch = typeof choice === "string" ? "" : (choice?.pitch || "");
  const focusText = `Report focus: ${label}${pitch ? ` — ${pitch}` : ""}.`;
  // Combine the chosen focus with the base guidance the run was started with.
  const guidance = [focusText, state.guidance].filter(Boolean).join(" ");

  return {
    guidance,
    progressEvents: [...state.progressEvents, {
      type: "progress",
      agent: "Agent 2 — Analyst",
      message: `Focus set — “${label}.” Prioritising the narrative and recommendations accordingly.`,
      severity: "info",
    }],
  };
}

async function analystNode(state: State): Promise<Partial<State>> {
  const events: ProgressEvent[] = [
    { type: "progress", agent: "Agent 2 — Analyst", message: "Interpreting data and drafting report narrative…" },
  ];

  const model = getModel(0);
  const structuredModel = model.withStructuredOutput(ReportSpecSchema);

  const revisionNote = state.reviewerNotes && !state.reviewerNotes.startsWith("APPROVED")
    ? `\n\nPREVIOUS DRAFT WAS REJECTED. Reviewer feedback to address:\n${state.reviewerNotes.replace("REVISION NEEDED: ", "")}\n\nFix this issue in your new draft.`
    : "";

  const prompt = ANALYST_PROMPT
    .replace("{{clientName}}", state.clientName)
    .replace("{{period}}", state.period)
    .replace("{{guidance}}", state.guidance || "None")
    .replace("{{data}}", JSON.stringify(state.collectedData, null, 2)) + revisionNote;

  events.push({
    type: "progress",
    agent: "Agent 2 — Analyst",
    callLine: "analyst → synthesize_report(gsc, ga4, semrush, ai_visibility, cms) ▶ drafting…",
  });

  let spec: ReportSpec;
  try {
    spec = await structuredModel.invoke([new HumanMessage(prompt)]) as ReportSpec;
  } catch (err) {
    if (isQuotaError(err) && process.env.DEEPSEEK_API_KEY) {
      events.push({ type: "progress", agent: "Agent 2 — Analyst", message: "Gemini quota reached — switching to DeepSeek fallback…", severity: "warn" });
      // DeepSeek V4 Flash is a thinking model — json_schema and tool_choice are both blocked.
      // Embed the exact schema in the prompt and parse the JSON response directly.
      const schemaHint = `\n\nYou MUST respond with a single JSON object matching EXACTLY this structure (use these exact field names, no extras):\n${REPORT_SPEC_TEMPLATE}`;
      const result = await getDeepSeekModel(0).invoke([new HumanMessage(prompt + schemaHint)]);
      const text = typeof result.content === "string" ? result.content : JSON.stringify(result.content);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("DeepSeek did not return valid JSON");
      spec = ReportSpecSchema.parse(JSON.parse(jsonMatch[0]));
    } else {
      throw err;
    }
  }

  events.push({
    type: "progress",
    agent: "Agent 2 — Analyst",
    message: "Report draft complete. Passing to Reviewer…",
    severity: "info",
  });

  return {
    reportSpec: spec,
    progressEvents: [...state.progressEvents, ...events],
    messages: [...state.messages, new AIMessage("Draft report generated.")],
  };
}

async function reviewerNode(state: State): Promise<Partial<State>> {
  const events: ProgressEvent[] = [
    { type: "progress", agent: "Agent 3 — Reviewer", message: "Quality-checking report: sections, attribution, SOV…" },
  ];

  if (!state.reportSpec) {
    return { progressEvents: [...state.progressEvents, ...events] };
  }

  const prompt = REVIEWER_PROMPT.replace("{{spec}}", JSON.stringify(state.reportSpec, null, 2));

  let reviewText: string;
  try {
    const result = await getModel(0).invoke([new HumanMessage(prompt)]);
    reviewText = typeof result.content === "string" ? result.content : String(result.content);
  } catch (err) {
    if (isQuotaError(err) && process.env.DEEPSEEK_API_KEY) {
      events.push({ type: "progress", agent: "Agent 3 — Reviewer", message: "Gemini quota reached — switching to DeepSeek fallback…", severity: "warn" });
      const result = await getDeepSeekModel(0).invoke([new HumanMessage(prompt)]);
      reviewText = typeof result.content === "string" ? result.content : String(result.content);
    } else {
      throw err;
    }
  }

  const approved = reviewText.startsWith("APPROVED");
  const MAX_REVISIONS = 2;

  if (approved) {
    events.push({
      type: "progress",
      agent: "Agent 3 — Reviewer",
      message: "✓ Report approved — all quality checks passed.",
      severity: "info",
    });
  } else if (state.revisionCount >= MAX_REVISIONS) {
    events.push({
      type: "progress",
      agent: "Agent 3 — Reviewer",
      message: `⚠ ${reviewText} — proceeding after ${MAX_REVISIONS} revision attempts.`,
      severity: "warn",
    });
  } else {
    events.push({
      type: "progress",
      agent: "Agent 3 — Reviewer",
      message: `${reviewText} — auto-fixing (attempt ${state.revisionCount + 1}/${MAX_REVISIONS})…`,
      severity: "warn",
    });
  }

  return {
    reviewerNotes: reviewText,
    needsRevision: !approved && state.revisionCount < MAX_REVISIONS,
    revisionCount: approved ? state.revisionCount : state.revisionCount + 1,
    progressEvents: [...state.progressEvents, ...events],
    messages: [...state.messages, new AIMessage(`Review: ${reviewText}`)],
  };
}

// In-process checkpointer — required for interrupt()/resume. Persists paused graph
// state keyed by thread_id for the life of the Node process (fine for local dev;
// swap for a Postgres/SQLite saver in a multi-instance deployment).
const checkpointer = new MemorySaver();

function buildGraph() {
  const graph = new StateGraph(StateAnnotation)
    .addNode("collector", collectorNode)
    .addNode("focusGate", focusGateNode)
    .addNode("analyst", analystNode)
    .addNode("reviewer", reviewerNode)
    .addEdge("__start__", "collector")
    .addEdge("collector", "focusGate")
    .addEdge("focusGate", "analyst")
    .addEdge("analyst", "reviewer")
    .addConditionalEdges("reviewer", (state) => state.needsRevision ? "analyst" : "__end__", {
      analyst: "analyst",
      __end__: "__end__",
    });

  return graph.compile({ checkpointer });
}

export const reportGraph = buildGraph();

export type { State };
