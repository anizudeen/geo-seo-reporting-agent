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

  // One thread per run so the paused graph can be resumed from /api/report/resume.
  const threadId = crypto.randomUUID();
  const config = { configurable: { thread_id: threadId }, recursionLimit: 10, streamMode: "values" as const };

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Phase 1: run the Collector, then pause at the focusGate interrupt() for the
        // human-in-the-loop decision. streamMode "values" yields full accumulated state
        // after each super-step; we flush only newly-added progress events so the
        // client sees the Collector's work live before the decision appears.
        let emitted = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let interruptPayload: any = null;
        const iter = await reportGraph.stream(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { clientName, period, guidance } as any,
          config
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for await (const state of iter as AsyncIterable<any>) {
          const evs: ProgressEvent[] = state.progressEvents ?? [];
          for (; emitted < evs.length; emitted++) controller.enqueue(sse(evs[emitted]));
          const intr = state.__interrupt__;
          if (Array.isArray(intr) && intr.length) interruptPayload = intr[0]?.value ?? null;
        }
        // Fallback: read the pending interrupt off the checkpoint if it wasn't in the stream.
        if (!interruptPayload) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const snap: any = await reportGraph.getState(config);
          const task = snap?.tasks?.find((t: { interrupts?: { value?: unknown }[] }) => t.interrupts?.length);
          if (task) interruptPayload = task.interrupts[0]?.value ?? null;
        }
        if (interruptPayload) {
          controller.enqueue(sse({ type: "human_in_loop", threadId, seenCount: emitted, ...interruptPayload }));
        } else {
          // No interrupt fired (unexpected) — close cleanly so the client doesn't hang.
          controller.enqueue(sse({ type: "done" }));
        }
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
