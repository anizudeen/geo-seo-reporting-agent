"use client";

import { useAtlas } from "../store";
import { Box } from "../ui";
import { visColor } from "@/lib/atlas/data";

export function BrandsScreen() {
  const a = useAtlas();
  return (
    <section style={{ padding: "30px 34px 60px", maxWidth: 1080, margin: "0 auto", animation: "fadeUp .35s ease both" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 27, fontWeight: 800, letterSpacing: "-.02em", color: "#1d1b2e" }}>Brands</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6f6f7b" }}>{a.brands.length} brands · Acme Analytics is live · the rest are demo samples</p>
        </div>
        <Box as="button" s="display:inline-flex;align-items:center;gap:8px;background:#5b54f5;color:#fff;border:none;border-radius:10px;padding:11px 18px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(91,84,245,.25)" h="background:#4a43d6" onClick={a.openAddBrand}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Add brand
        </Box>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(248px,1fr))", gap: 16 }}>
        {a.brands.map((b) => {
          const isAnomaly = b.statusKey === "anomaly";
          const isNever = !b.lastReport || b.lastReport === "Not generated yet";
          return (
            <Box
              key={b.name}
              s={`background:#fff;border:1px solid #e8e8ef;border-radius:16px;padding:18px 18px 16px;box-shadow:0 1px 3px rgba(20,18,31,.05);cursor:pointer;transition:box-shadow .15s,transform .15s${b.demo ? ";filter:grayscale(.6);opacity:.9" : ""}`}
              h="box-shadow:0 8px 22px rgba(20,18,31,.1);transform:translateY(-2px)"
              onClick={() => a.openBrand(b.name, isAnomaly)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: b.logoBg, color: b.logoFg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flex: "none" }}>{b.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1d1b2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: "#86868f" }}>{b.industry}</div>
                </div>
                {b.demo
                  ? <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "#86868f", background: "#f0f0f4", border: "1px solid #e3e3ea", borderRadius: 999, padding: "3px 8px", flex: "none", alignSelf: "flex-start" }}>Demo</span>
                  : <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "#0f8a52", background: "#e6f6ee", border: "1px solid #c9ead5", borderRadius: 999, padding: "3px 8px", flex: "none", alignSelf: "flex-start" }}>Live</span>}
              </div>
              <div style={{ display: "flex", gap: 18, padding: "13px 0", borderTop: "1px solid #f0f0f4" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#92929d", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>AI visibility</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ flex: 1, height: 6, borderRadius: 6, background: "#eef0f3", overflow: "hidden", display: "inline-block" }}>
                      <span style={{ display: "block", height: "100%", width: (b.vis || 0) + "%", background: visColor(b.vis) }} />
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1d1b2e" }}>{b.vis ? b.vis + "/100" : "—"}</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: "9px 0 8px", borderTop: "1px solid #f0f0f4", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#92929d" }}>Last report</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: isNever ? "#d93b41" : "#1d1b2e" }}>{b.lastReport || "—"}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #f0f0f4" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#86868f", fontWeight: 600 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9a9aa6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v4h-4" /></svg>
                  Synced {b.synced}
                </span>
                {isAnomaly && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, color: "#c0353a" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c0353a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg>
                    Needs attention
                  </span>
                )}
              </div>
            </Box>
          );
        })}

        <Box as="button" s="background:transparent;border:1.5px dashed #d3d3da;border-radius:16px;padding:18px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:172px;color:#86868f" h="border:1.5px dashed #5b54f5;color:#5b54f5;background:#faf9ff" onClick={a.openAddBrand}>
          <span style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0f0f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 700 }}>Add a new brand</span>
        </Box>
      </div>
    </section>
  );
}
