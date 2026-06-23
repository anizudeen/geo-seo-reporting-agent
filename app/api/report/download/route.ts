export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { buildDeck } from "@/lib/deck/buildDeck";
import type { ReportSpec } from "@/lib/agent/reportSpec";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const spec = body.spec as ReportSpec;

  if (!spec || !spec.clientName) {
    return new Response("Missing spec", { status: 400 });
  }

  const buf = await buildDeck(spec);
  const filename = `${spec.clientName.replace(/\s+/g, "-")}-Weekly-Report.pptx`;
  const nodeBuf = Buffer.from(buf);

  return new Response(nodeBuf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buf.byteLength),
    },
  });
}
