export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextRequest } from "next/server";
import { refineGraph } from "@/lib/agent/refineGraph";
import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";
import type { ProgressEvent } from "@/lib/agent/graph";
import type { ReportSpec } from "@/lib/agent/reportSpec";

function sseData(event: ProgressEvent) {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const currentSpec = body.spec as ReportSpec;
  const instruction: string = body.instruction ?? "";

  const stream = new ReadableStream({
    async start(controller) {
      const enc = (event: ProgressEvent) => new TextEncoder().encode(sseData(event));

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const streamIter = await refineGraph.stream({ currentSpec, instruction } as any, { streamMode: "values" });

        let lastState: Record<string, unknown> | null = null;
        for await (const state of streamIter) {
          lastState = state;
          const newEvents = (state.progressEvents ?? []) as ProgressEvent[];
          for (const event of newEvents) {
            controller.enqueue(enc(event));
          }
        }

        controller.enqueue(
          enc({ type: "done", reportSpec: (lastState?.refinedSpec ?? undefined) as ReportSpec | undefined })
        );
      } catch (err) {
        controller.enqueue(
          enc({ type: "error", message: err instanceof Error ? err.message : String(err) })
        );
      } finally {
        await awaitAllCallbacks();
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
