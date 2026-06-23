"use client";

import { useAtlas } from "../store";
import { Box } from "../ui";
import { DeckSlide } from "../DeckSlide";
import { exportDeck } from "@/lib/atlas/export";

export function ClientScreen() {
  const a = useAtlas();
  const title = a.deckTitle.trim() || `${a.selectedBrand} — Weekly report`;
  return (
    <section style={{ background: "#e8e8ef", minHeight: "100%", padding: "26px 0 60px" }}>
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6f6f7b", fontWeight: 700 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#92929d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          Client deck · what the client receives as a PowerPoint
        </span>
        <Box as="button" s="background:#fff;color:#5b5775;border:1px solid #d8d3ea;border-radius:9px;padding:8px 15px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#f5f5f8" onClick={a.goBrands}>← Back to Atlas</Box>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto 16px", background: "#fff", border: "1px solid #e8e8ef", borderRadius: 12, padding: "13px 18px", display: "flex", alignItems: "center", gap: 13 }}>
        <div style={{ width: 48, height: 33, borderRadius: 6, background: "linear-gradient(160deg,#221f3a,#191730)", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(25,23,48,.22)" }}>
          <span style={{ fontSize: 8, fontWeight: 800, color: "#fff" }}>{a.reportSpec?.aiVisibility.score ?? "—"}<span style={{ color: "#9a95c4" }}>/100</span></span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: "#1d1b2e" }}>{title}.pptx</div>
          <div style={{ fontSize: 12, color: "#6f6f7b", marginTop: 1 }}>PowerPoint · 12 slides · prepared by Pepper</div>
        </div>
        <Box as="button" s="display:inline-flex;align-items:center;gap:7px;background:#fff;color:#5b5775;border:1px solid #e6e3f2;border-radius:9px;padding:8px 13px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#f5f3fe;border:1px solid #d8d2f3" onClick={() => exportDeck(a.selectedBrand, a.reportSpec).catch(console.error)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 11l5 4 5-4M5 20h14" /></svg>Download
        </Box>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {[0, 1, 2, 3, 4].map((i) => <DeckSlide key={i} index={i} spec={a.reportSpec} />)}
        <div style={{ textAlign: "center", fontSize: 12, color: "#86868f", padding: "6px 0 4px" }}>+ 7 more slides · full data appendix · prepared by Pepper</div>
      </div>
    </section>
  );
}
