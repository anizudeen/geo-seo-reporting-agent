export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { reportGraph } from "@/lib/agent/graph";
import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";
import type { ProgressEvent } from "@/lib/agent/graph";

function sseData(event: ProgressEvent) {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const clientName: string = body.clientName ?? "Acme Analytics";
  const period: string = body.period ?? "May 25–31, 2026";
  const guidance: string = body.guidance ?? "";

  const stream = new ReadableStream({
    async start(controller) {
      const enc = (event: ProgressEvent) => new TextEncoder().encode(sseData(event));

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const finalState = await reportGraph.invoke(
          { clientName, period, guidance } as any,
          { recursionLimit: 10 }
        );

        // Stream all accumulated progress events
        for (const event of finalState.progressEvents as ProgressEvent[]) {
          controller.enqueue(enc(event));
        }

        // Emit the final done event with reportSpec
        controller.enqueue(
          enc({ type: "done", reportSpec: finalState.reportSpec ?? undefined })
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
