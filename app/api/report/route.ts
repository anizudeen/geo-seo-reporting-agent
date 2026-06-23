export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextRequest } from "next/server";
import { reportGraph } from "@/lib/agent/graph";
import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";
import type { ProgressEvent } from "@/lib/agent/graph";

function sse(event: ProgressEvent) {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const clientName: string = body.clientName ?? "Acme Analytics";
  const period: string = body.period ?? "May 25–31, 2026";
  const guidance: string = body.guidance ?? "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Stream the graph node-by-node (real-time) rather than invoking the whole
        // graph and dumping events at the end. streamMode "values" yields the full
        // accumulated state after each super-step; we flush only the newly-added
        // progress events so the client sees each agent's work as it happens.
        let emitted = 0;
        let finalSpec: ProgressEvent["reportSpec"];
        const iter = await reportGraph.stream(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { clientName, period, guidance } as any,
          { recursionLimit: 10, streamMode: "values" }
        );
        for await (const state of iter as AsyncIterable<{ progressEvents?: ProgressEvent[]; reportSpec?: ProgressEvent["reportSpec"] }>) {
          const evs = state.progressEvents ?? [];
          for (; emitted < evs.length; emitted++) controller.enqueue(sse(evs[emitted]));
          if (state.reportSpec) finalSpec = state.reportSpec;
        }
        controller.enqueue(sse({ type: "done", reportSpec: finalSpec ?? undefined }));
      } catch (err) {
        controller.enqueue(sse({ type: "error", message: err instanceof Error ? err.message : String(err) }));
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
