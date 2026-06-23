import { Client } from "langsmith";
import { evaluate } from "langsmith/evaluation";
import { reportGraph } from "../agent/graph";
import { readFileSync } from "fs";
import { join } from "path";

const goldenReport = readFileSync(join(__dirname, "goldenReport.md"), "utf-8");

async function targetFn(input: Record<string, string>) {
  const finalState = await reportGraph.invoke({
    clientName: input.clientName ?? "Acme Analytics",
    period: input.period ?? "May 25–31, 2026",
    guidance: "",
  });
  return { reportSpec: JSON.stringify(finalState.reportSpec, null, 2) };
}

function aiLeadsEvaluator({ outputs }: { outputs: Record<string, string> }) {
  const spec = JSON.parse(outputs.reportSpec ?? "{}");
  const hasAiSection = spec.aiVisibility && spec.aiVisibility.score;
  return { key: "ai_visibility_leads", score: hasAiSection ? 1 : 0 };
}

function numbersAccurateEvaluator({ outputs }: { outputs: Record<string, string> }) {
  const text = outputs.reportSpec ?? "";
  const hasClicks = text.includes("48200") || text.includes("48,200");
  const hasAiScore = text.includes('"score": 38') || text.includes('"score":38');
  return { key: "numbers_accurate", score: hasClicks && hasAiScore ? 1 : 0 };
}

function attributionNoteEvaluator({ outputs }: { outputs: Record<string, string> }) {
  const spec = JSON.parse(outputs.reportSpec ?? "{}");
  const note = spec.seo?.attributionNote ?? "";
  const hasCaveat = note.toLowerCase().includes("direct") || note.toLowerCase().includes("ai-referred");
  return { key: "attribution_caveat_present", score: hasCaveat ? 1 : 0 };
}

function recsCountEvaluator({ outputs }: { outputs: Record<string, string> }) {
  const spec = JSON.parse(outputs.reportSpec ?? "{}");
  const recs = spec.recommendations ?? [];
  return { key: "exactly_3_recommendations", score: recs.length === 3 ? 1 : 0 };
}

async function runEval() {
  const client = new Client();

  // Create dataset if it doesn't exist
  let dataset;
  try {
    dataset = await client.readDataset({ datasetName: "pepper-atlas-golden" });
  } catch {
    dataset = await client.createDataset("pepper-atlas-golden", {
      description: "Golden dataset for Pepper Atlas Reporting Agent — Acme Analytics demo scenario",
    });
    await client.createExamples({
      inputs: [{ clientName: "Acme Analytics", period: "May 25–31, 2026" }],
      outputs: [{ goldenReport }],
      datasetId: dataset.id,
    });
  }

  const results = await evaluate(targetFn, {
    data: dataset.name,
    evaluators: [
      aiLeadsEvaluator,
      numbersAccurateEvaluator,
      attributionNoteEvaluator,
      recsCountEvaluator,
    ],
    experimentPrefix: "pepper-atlas",
    client,
    maxConcurrency: 1,
  });

  console.log("Eval complete:", results.experimentName);
}

runEval().catch(console.error);
