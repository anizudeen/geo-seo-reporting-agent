export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextRequest } from "next/server";
import { Command } from "@langchain/langgraph";
import { reportGraph } from "@/lib/agent/graph";
import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";
import type { ProgressEvent } from "@/lib/agent/graph";

function sse(event: ProgressEvent) {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

// Phase 2 of a run: the human picked a focus, so resume the graph paused at the
// focusGate interrupt() and stream the Analyst + Reviewer work through to the spec.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const threadId: string | undefined = body.threadId;
  const choice: unknown = body.choice;
  // The first request already streamed (and the client already rendered) this many
  // progress events; skip them so the Collector's events aren't duplicated.
  const seenCount: number = typeof body.seenCount === "number" ? body.seenCount : 0;

  if (!threadId) {
    return new Response(`data: ${JSON.stringify({ type: "error", message: "missing threadId" })}\n\n`, {
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  const config = { configurable: { thread_id: threadId }, recursionLimit: 10, streamMode: "values" as const };

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let emitted = seenCount;
        let finalSpec: ProgressEvent["reportSpec"];
        const iter = await reportGraph.stream(new Command({ resume: choice }), config);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for await (const state of iter as AsyncIterable<any>) {
          const evs: ProgressEvent[] = state.progressEvents ?? [];
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
