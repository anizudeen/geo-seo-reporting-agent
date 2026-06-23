"use client";

import { useAtlas } from "../store";
import { Box } from "../ui";
import {
  overviewKpis, metricCards, keywordRows, pageRows, charts,
  aiTopCards, aiDonutGradient, aiDonutLegend, aiMentions, aiSourcePlatforms,
} from "@/lib/atlas/data";

function tabStyle(on: boolean): React.CSSProperties {
  return { padding: "9px 4px", fontSize: 14, fontWeight: on ? 800 : 600, color: on ? "#1d1b2e" : "#86868f", borderBottom: on ? "2px solid #5b54f5" : "2px solid transparent", cursor: "pointer", background: "none", border: "none", fontFamily: "inherit", marginBottom: -1 };
}

export function DashboardScreen() {
  const a = useAtlas();
  const b = a.brands.find((x) => x.name === a.selectedBrand) || a.brands[0];
  const tab = a.dashTab;

  return (
    <section style={{ padding: "24px 34px 60px", maxWidth: 1080, margin: "0 auto", animation: "fadeUp .35s ease both" }}>
      <Box as="button" s="display:inline-flex;align-items:center;gap:6px;background:none;border:none;color:#86868f;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;margin-bottom:16px" h="color:#5b54f5" onClick={a.goBrands}>← Brands</Box>

      {a.interim && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fdeaea", border: "1px solid #f4cccd", color: "#b22a30", borderRadius: 11, padding: "11px 16px", marginBottom: 16, fontSize: 13, fontWeight: 700 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#d93b41", flex: "none", display: "inline-block" }} />
          Anomaly detected · organic traffic −18% week-over-week. Consider an interim report.
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: b.logoBg, color: b.logoFg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, flex: "none" }}>{b.initials}</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: "-.02em", color: "#1d1b2e" }}>{b.name}</h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#86868f", display: "flex", alignItems: "center", gap: 7 }}>
            {b.industry} ·
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f9a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v4h-4" /></svg>
              Synced {b.synced} · auto-syncs hourly
            </span>
          </p>
        </div>
        {b.demo ? (
          <span title="Demo project — report generation is disabled" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ececf1", color: "#a3a3ad", border: "1px solid #e2e2ea", borderRadius: 11, padding: "12px 20px", fontSize: 14, fontWeight: 800, cursor: "not-allowed" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3a3ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            Generate report · Demo
          </span>
        ) : (
          <Box as="button" s="display:inline-flex;align-items:center;gap:8px;background:#5b54f5;color:#fff;border:none;border-radius:11px;padding:12px 20px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 5px 16px rgba(91,84,245,.3)" h="background:#4a43d6" onClick={a.startReport}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/atlas-mark-white.svg" alt="" width={16} height={16} style={{ display: "block" }} />
            {a.interim ? "Generate interim report" : "Generate report"}
          </Box>
        )}
      </div>

      <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #e8e8ef", marginBottom: 22 }}>
        <button type="button" onClick={() => a.setTab("overview")} style={tabStyle(tab === "overview")}>Overview</button>
        <button type="button" onClick={() => a.setTab("seo")} style={tabStyle(tab === "seo")}>SEO</button>
        <button type="button" onClick={() => a.setTab("aivis")} style={tabStyle(tab === "aivis")}>AI visibility</button>
      </div>

      {tab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 2px rgba(20,18,31,.04)", marginBottom: 16 }}>
            {overviewKpis.map((m) => (
              <div key={m.label} style={{ padding: "16px 18px", borderLeft: "1px solid #f0f0f4", marginLeft: -1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#86868f", marginBottom: 9 }}>{m.label}</div>
                <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-.02em", color: "#14121f", lineHeight: 1 }}>{m.value}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 9 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: m.deltaFg, background: m.deltaBg, padding: "2px 8px", borderRadius: 999 }}>{m.delta}</span>
                  <span style={{ fontSize: 11, color: "#9a9aa6" }}>{m.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1d1b2e" }}>Organic clicks · last 12 weeks</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#6f6f7b", fontWeight: 600 }}>
                  <span style={{ width: 18, height: 3, borderRadius: 2, background: "#5b54f5", display: "inline-block" }} />Clicks / week
                </span>
              </div>
              <svg viewBox="0 0 100 48" preserveAspectRatio="none" style={{ width: "100%", height: 150, display: "block", overflow: "visible" }}>
                <polygon points={charts.clicksTrend.fill} fill="#f0effe" />
                <polyline points={charts.clicksTrend.pts} fill="none" stroke="#5b54f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#a3a3ad", fontWeight: 600, marginTop: 8 }}>
                <span>Mar 1</span><span>Apr 1</span><span>May 1</span><span>May 31</span>
              </div>
            </div>
            <div style={{ background: "linear-gradient(160deg,#221f3a,#191730)", borderRadius: 14, padding: "17px 18px", color: "#eceaf7" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: "#fff" }}>AI search visibility</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#ff9ea1", background: "rgba(217,59,65,.16)", padding: "3px 9px", borderRadius: 999 }}>▼ 4 vs last wk</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 78, height: 78, borderRadius: "50%", background: "conic-gradient(#7d77ff 0% 38%,#34314f 38% 100%)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <div style={{ width: 58, height: 58, borderRadius: "50%", background: "#191730", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 21, fontWeight: 800, color: "#fff", lineHeight: 1 }}>38</span>
                    <span style={{ fontSize: 9.5, color: "#9a95c4" }}>/ 100</span>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, color: "#9a95c4", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em", marginBottom: 8 }}>Share of voice</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                    <span style={{ width: 44, fontSize: 11, fontWeight: 700, color: "#cfccf0", flex: "none" }}>Acme</span>
                    <span style={{ flex: 1, height: 9, borderRadius: 5, background: "rgba(255,255,255,.08)", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "14%", background: "linear-gradient(90deg,#7d77ff,#9b8cff)", borderRadius: 5 }} /></span>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff", flex: "none" }}>14%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 44, fontSize: 11, fontWeight: 700, color: "#9a95c4", flex: "none" }}>Quanta</span>
                    <span style={{ flex: 1, height: 9, borderRadius: 5, background: "rgba(255,255,255,.08)", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "29%", background: "#6f6a92", borderRadius: 5 }} /></span>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: "#cfccf0", flex: "none" }}>29%</span>
                  </div>
                </div>
              </div>
              <Box as="button" s="width:100%;background:rgba(255,255,255,.1);color:#fff;border:none;border-radius:9px;padding:9px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit" h="background:rgba(255,255,255,.18)" onClick={() => a.setTab("aivis")}>View AI-search detail →</Box>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13, background: "linear-gradient(100deg,#eef6f0,#fff)", border: "1px solid #cdead9", borderRadius: 14, padding: "16px 18px" }}>
              <span style={{ width: 38, height: 38, borderRadius: 11, background: "#0f9a5a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 5H4v1.5A3 3 0 0 0 7 9.5M17 5h3v1.5a3 3 0 0 1-3 3" /></svg>
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#0f8a52", marginBottom: 2 }}>Win of the week · organic</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1d3a2a", lineHeight: 1.4 }}>#4 for &quot;product analytics software&quot;, up from #11</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, background: "linear-gradient(100deg,#fdf6ea,#fff)", border: "1px solid #f0dcb8", borderRadius: 14, padding: "16px 18px" }}>
              <span style={{ width: 38, height: 38, borderRadius: 11, background: "#b5781f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg>
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#a06814", marginBottom: 2 }}>Watch · AI search</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#3a2a10", lineHeight: 1.4 }}>Lost the &quot;best product analytics tools&quot; citation on Perplexity</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "seo" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 2px rgba(20,18,31,.04)", marginBottom: 16 }}>
            {metricCards.map((m) => (
              <div key={m.label} style={{ padding: "16px 18px", borderLeft: "1px solid #f0f0f4", marginLeft: -1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#86868f", marginBottom: 9 }}>{m.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", color: "#14121f", lineHeight: 1 }}>{m.value}</div>
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: 28, marginTop: 11, display: "block", overflow: "visible" }}>
                  <polygon points={m.fill} fill="#f0effe" />
                  <polyline points={m.spark} fill="none" stroke="#5b54f5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "14px 18px", fontSize: 12.5, fontWeight: 800, color: "#1d1b2e", borderBottom: "1px solid #f0f0f4" }}>Keyword rankings &amp; movement</div>
            <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1.2fr 1fr", gap: 10, padding: "11px 18px", background: "#fafafc", borderBottom: "1px solid #e8e8ef", fontSize: 11, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#92929d" }}>
              <span>Keyword</span><span>Position</span><span>Change</span><span>Volume</span>
            </div>
            {keywordRows.map((k) => (
              <div key={k.kw} style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1.2fr 1fr", gap: 10, padding: "13px 18px", borderBottom: "1px solid #f0f0f4", alignItems: "center", fontSize: 13.5 }}>
                <span style={{ fontWeight: 600, color: "#2c2940" }}>{k.kw}</span>
                <span style={{ fontWeight: 800, color: "#14121f" }}>#{k.pos}</span>
                <span style={{ fontWeight: 800, color: k.changeColor }}>{k.change}</span>
                <span style={{ color: "#5f5f6b" }}>{k.vol}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", fontSize: 12.5, fontWeight: 800, color: "#1d1b2e", borderBottom: "1px solid #f0f0f4" }}>Top pages &amp; content</div>
            <div style={{ display: "grid", gridTemplateColumns: "2.6fr 1fr 1fr 1.4fr", gap: 10, padding: "11px 18px", background: "#fafafc", borderBottom: "1px solid #e8e8ef", fontSize: 11, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#92929d" }}>
              <span>Page</span><span>Clicks</span><span>Trend</span><span>Flag</span>
            </div>
            {pageRows.map((p) => (
              <div key={p.path} style={{ display: "grid", gridTemplateColumns: "2.6fr 1fr 1fr 1.4fr", gap: 10, padding: "13px 18px", borderBottom: "1px solid #f0f0f4", alignItems: "center", fontSize: 13.5 }}>
                <span style={{ fontWeight: 600, color: "#2c2940", fontFamily: "monospace", fontSize: 12.5 }}>{p.path}</span>
                <span style={{ fontWeight: 700, color: "#14121f" }}>{p.clicks}</span>
                <span style={{ fontWeight: 800, color: p.trendColor }}>{p.trend}</span>
                <span>{p.stale && <span style={{ fontSize: 11, fontWeight: 800, color: "#b5781f", background: "#fdf2e0", padding: "3px 9px", borderRadius: 999 }}>Stale · {p.note}</span>}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "aivis" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 2px rgba(20,18,31,.04)", marginBottom: 16 }}>
            {aiTopCards.map((c) => (
              <div key={c.title} style={{ padding: "18px 20px", borderLeft: "1px solid #f0f0f4", marginLeft: -1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#1d1b2e" }}>{c.title}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c7c7cf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.6h.01" /></svg>
                </div>
                <div style={{ fontSize: 11.5, color: "#92929d", lineHeight: 1.4, marginBottom: 14, minHeight: 32 }}>{c.desc}</div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.02em", color: "#14121f", lineHeight: 1 }}>{c.value}</div>
                    <span style={{ display: "inline-block", marginTop: 9, fontSize: 11.5, fontWeight: 800, color: c.deltaFg, background: c.deltaBg, padding: "3px 9px", borderRadius: 999 }}>{c.delta}</span>
                    <span style={{ fontSize: 11, color: "#9a9aa6", marginLeft: 5 }}>vs last wk</span>
                  </div>
                  <svg viewBox="0 0 100 28" preserveAspectRatio="none" style={{ width: 96, height: 48, display: "block", overflow: "visible", flex: "none" }}>
                    <polygon points={c.fill} fill="#f0effe" />
                    <polyline points={c.spark} fill="none" stroke="#5b54f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </div>
            ))}
            <div style={{ padding: "18px 20px", borderLeft: "1px solid #f0f0f4", marginLeft: -1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#1d1b2e" }}>Visibility by citations</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c7c7cf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.6h.01" /></svg>
              </div>
              <div style={{ fontSize: 11.5, color: "#92929d", lineHeight: 1.4, marginBottom: 14, minHeight: 32 }}>Distribution of your brand mentions across AI engines</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: aiDonutGradient, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff" }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                  {aiDonutLegend.map((lg) => (
                    <div key={lg.name} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: lg.c, flex: "none" }} />
                      <span style={{ flex: 1, color: "#5c5c68", fontWeight: 600 }}>{lg.name}</span>
                      <span style={{ fontWeight: 800, color: "#1d1b2e" }}>{lg.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "16px 20px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#1d1b2e" }}>AI source platforms</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#5c5c68", background: "#f0f0f4", borderRadius: 7, padding: "4px 10px" }}>Community &amp; video</span>
              </div>
              <div style={{ fontSize: 12, color: "#92929d", marginTop: 3 }}>Where AI engines source their answers about you — Reddit &amp; YouTube</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #f0f0f4" }}>
              {aiSourcePlatforms.map((p, pi) => (
                <div key={p.platform} style={{ padding: "16px 20px", borderLeft: pi > 0 ? "1px solid #f0f0f4" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 7, background: p.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flex: "none" }}>{p.initial}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#1d1b2e" }}>{p.platform}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: p.sentimentFg, background: p.sentimentBg, padding: "3px 9px", borderRadius: 999 }}>{p.sentiment}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#14121f", letterSpacing: "-.02em" }}>{p.mentions}</span>
                    <span style={{ fontSize: 12, color: "#86868f" }}>mentions</span>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: p.deltaColor }}>{p.delta}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#92929d", marginBottom: 12 }}>{p.note}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {p.items.map((it) => (
                      <div key={it.title} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#2c2940", lineHeight: 1.35 }}>{it.title}</div>
                          <div style={{ fontSize: 11, color: "#9a9aa6", marginTop: 1 }}>{it.sub}</div>
                        </div>
                        <span style={{ flex: "none", fontSize: 10, fontWeight: 800, color: it.tagOk ? "#0f8a52" : "#a3a3ad", background: it.tagOk ? "#e6f6ee" : "#f0f0f4", padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>{it.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#1d1b2e" }}>New mentions</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#5c5c68", background: "#f0f0f4", borderRadius: 7, padding: "4px 10px" }}>24–31 May 2026</span>
                </div>
                <div style={{ fontSize: 12, color: "#92929d", marginTop: 3 }}>Recent AI-search results mentioning Acme</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2.4fr 1.1fr", gap: 12, padding: "10px 20px", background: "#fafafc", borderTop: "1px solid #f0f0f4", borderBottom: "1px solid #f0f0f4", fontSize: 11, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#92929d" }}>
              <span>Platform</span><span>Prompt</span><span>Competitors mentioned</span>
            </div>
            {aiMentions.map((m) => (
              <div key={m.platform} style={{ display: "grid", gridTemplateColumns: "1fr 2.4fr 1.1fr", gap: 12, padding: "14px 20px", borderBottom: "1px solid #f3f3f6", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: m.pc, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flex: "none" }}>{m.pi}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1d1b2e" }}>{m.platform}</span>
                </div>
                <span style={{ fontSize: 13, color: "#3a3654", lineHeight: 1.45 }}>{m.prompt}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {m.comps.map((cp, i) => (
                    <span key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: cp.c, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flex: "none", border: "2px solid #fff", marginLeft: -6 }}>{cp.i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
