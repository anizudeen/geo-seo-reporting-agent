"use client";

import { useState } from "react";

const palette: Record<string, { bg: string; fg: string; dot: string }> = {
  GSC: { bg: "#eaf1fe", fg: "#1f5fd0", dot: "#2f6fe0" },
  GA4: { bg: "#fdeede", fg: "#b5631a", dot: "#e08a2f" },
  "Semrush AI": { bg: "#f0eafe", fg: "#6b3fd0", dot: "#7d52e8" },
  WordPress: { bg: "#e9eef2", fg: "#41566b", dot: "#5b7186" },
};
const confMap: Record<string, { bg: string; fg: string }> = {
  High: { bg: "#e6f6ee", fg: "#0f9a5a" },
  Medium: { bg: "#fdf2e0", fg: "#b5781f" },
  Low: { bg: "#fdeaea", fg: "#d93b41" },
};

export function SourceTag({ source = "GSC", confidence = "High", figure = "", showSources = true, showConfidence = false }: {
  source?: string; confidence?: string; figure?: string; showSources?: boolean; showConfidence?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const p = palette[source] || palette.GSC;
  const c = confMap[confidence] || confMap.High;
  const confLabel = confidence === "High" ? "High confidence" : confidence === "Medium" ? "Medium confidence" : "Low confidence";

  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 6, verticalAlign: "middle" }}>
      {showSources && (
        <button type="button" onClick={() => setOpen((o) => !o)} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: p.bg, color: p.fg, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 12, letterSpacing: ".02em", padding: "2px 8px", borderRadius: 999, lineHeight: 1.4 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.dot }} />
          {source}
        </button>
      )}
      {showConfidence && (
        <span style={{ background: c.bg, color: c.fg, fontWeight: 700, fontSize: 11, padding: "2px 8px", borderRadius: 999, letterSpacing: ".01em", whiteSpace: "nowrap" }}>{confLabel}</span>
      )}
      {open && (
        <span style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 40, width: 240, background: "#1d1b2e", color: "#fff", borderRadius: 10, padding: "11px 13px", boxShadow: "0 12px 32px rgba(20,18,31,.32)", fontSize: 12, lineHeight: 1.5 }}>
          <span style={{ display: "block", fontSize: 10, letterSpacing: ".07em", textTransform: "uppercase", color: "#a8a4d6", marginBottom: 4, fontWeight: 700 }}>Computed from source</span>
          <span style={{ display: "block", color: "#efeefb" }}>{figure}</span>
          <span style={{ position: "absolute", left: 16, top: -5, width: 10, height: 10, background: "#1d1b2e", transform: "rotate(45deg)" }} />
        </span>
      )}
    </span>
  );
}
