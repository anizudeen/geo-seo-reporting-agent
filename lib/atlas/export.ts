"use client";

import { goldenReportSpec } from "./goldenSpec";
import type { ReportSpec } from "@/lib/agent/reportSpec";

/** POST a ReportSpec to the deck builder and trigger a real .pptx download.
 *  Uses the live Gemini-generated spec when available, else the golden fallback. */
export async function exportDeck(clientName: string, generated?: ReportSpec | null): Promise<void> {
  const spec = { ...(generated ?? goldenReportSpec), clientName };
  const res = await fetch("/api/report/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spec }),
  });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${clientName.replace(/\s+/g, "-")}-Weekly-Report.pptx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
