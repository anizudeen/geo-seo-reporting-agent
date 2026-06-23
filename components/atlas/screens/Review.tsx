"use client";

import { useAtlas } from "../store";
import { Box } from "../ui";
import { AiBlock } from "../AiBlock";
import { SourceTag } from "../SourceTag";
import {
  metricCards, recSummaries, execBlock, aiSearchBlock, recBlocks,
  keywordRows, pageRows, convCards, compBars, competitor,
  pepperServices, clientItems, whatNextIntro,
} from "@/lib/atlas/data";

const svcAccent = [
  { bg: "#f5f3fe", fg: "#5b54f5" },
  { bg: "#eef6f0", fg: "#0f8a52" },
  { bg: "#fdf6ea", fg: "#b5781f" },
];

function ReviewMode() {
  const a = useAtlas();
  const spec = a.reportSpec;
  const execText = spec ? spec.execSummary.text : execBlock.text;
  const recs = spec ? spec.recommendations : recSummaries;
  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "#5b54f5", marginBottom: 5 }}>Weekly report · Draft{a.usedLiveAI ? " · Gemini-generated" : ""}</div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", color: "#1d1b2e" }}>{a.selectedBrand}</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 2px rgba(20,18,31,.04)", marginBottom: 18 }}>
        {metricCards.map((m) => (
          <div key={m.label} style={{ padding: "15px 16px", borderLeft: "1px solid #f0f0f4", marginLeft: -1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#86868f", marginBottom: 7 }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", color: "#14121f", lineHeight: 1 }}>{m.value}</div>
            <span style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 800, color: m.deltaFg, background: m.deltaBg, padding: "2px 8px", borderRadius: 999 }}>{m.delta}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#faf9fc", border: "1px solid #e8e8ef", borderRadius: 14, padding: "16px 18px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#1d1b2e" }}>Executive summary</span>
        </div>
        <div style={{ position: "relative", maxHeight: 76, overflow: "hidden" }}>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: "#3a3654" }}>{execText}</div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 30, background: "linear-gradient(transparent,#faf9fc)" }} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#1d1b2e", borderRadius: 14, padding: "16px 20px", marginBottom: 18 }}>
        <div style={{ flex: "none", textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1 }}>38<span style={{ fontSize: 14, color: "#9a95c4" }}>/100</span></div>
          <div style={{ fontSize: 10, color: "#9a95c4", marginTop: 3 }}>AI visibility</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>▼ 4 vs last week · Acme 14% share of voice</div>
          <div style={{ fontSize: 12.5, color: "#9a95c4", marginTop: 3 }}>Quanta leads at 29% — largest gap vs competitor</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#ff9ea1", background: "rgba(217,59,65,.18)", padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap", flex: "none" }}>Needs attention</span>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, padding: "16px 18px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#1d1b2e" }}>Recommendations</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#86868f" }}>3 prioritized · AI-drafted</span>
        </div>
        {recs.map((r) => (
          <div key={r.num} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #f0f0f4", alignItems: "flex-start" }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#5b54f5", color: "#fff", fontWeight: 800, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", marginTop: 1 }}>{r.num}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1d1b2e", marginBottom: 3 }}>{r.label}</div>
              <div style={{ fontSize: 13, color: "#6f6f7b", lineHeight: 1.5 }}>{r.brief}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
        <Box as="button" s="display:inline-flex;align-items:center;justify-content:center;gap:9px;background:#fff;color:#5b5775;border:1.5px solid #e2def0;border-radius:13px;padding:15px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#f5f5f8" onClick={a.goEditMode}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
          Edit interpretation
        </Box>
        <Box as="button" s="display:inline-flex;align-items:center;justify-content:center;gap:9px;background:#5b54f5;color:#fff;border:none;border-radius:13px;padding:15px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 8px 22px rgba(91,84,245,.3)" h="background:#4a43d6" onClick={a.approve}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></svg>
          Create deck
        </Box>
      </div>
    </>
  );
}

function SectionLabel({ n, title, badge }: { n: string; title: string; badge?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: "#92929d" }}>{n}</span>
      <span style={{ fontSize: 15, fontWeight: 800, color: "#1d1b2e" }}>{title}</span>
      {badge && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: ".03em", textTransform: "uppercase", color: "#4a43d6", background: "#efeefb", padding: "3px 10px", borderRadius: 999 }}>Aligned to · {badge}</span>}
    </div>
  );
}

function EditMode() {
  const a = useAtlas();
  const ss = a.showSources, sc = a.showConfidence;
  const focusLabel = a.focusChoice?.label || "AI-search visibility";
  const spec = a.reportSpec;
  // When the live Gemini run produced a spec, use its real text; keep the static
  // tone/length variants so the inline editor still demonstrates Agent 4.
  const execLive = spec ? { ...execBlock, text: spec.execSummary.text } : execBlock;
  const aiLive = spec
    ? { ...aiSearchBlock, text: `AI-search visibility is ${spec.aiVisibility.score}/100 (${spec.aiVisibility.delta >= 0 ? "+" : ""}${spec.aiVisibility.delta} vs last week). ${spec.aiVisibility.citationOpportunity || ""}`.trim() }
    : aiSearchBlock;
  const recLive = spec
    ? recBlocks.map((rb, i) => (spec.recommendations[i] ? { ...rb, text: spec.recommendations[i].brief } : rb))
    : recBlocks;
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(246,246,249,.96)", backdropFilter: "blur(6px)", borderBottom: "1px solid #e8e8ef", padding: "10px 34px", margin: "0 -34px 20px" }}>
        <Box as="button" s="display:inline-flex;align-items:center;gap:5px;background:none;border:none;color:#86868f;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;padding:0" h="color:#5b54f5" onClick={() => a.set({ reviewMode: "review" })}>← Back to review</Box>
      </div>

      <div id="edit-exec" style={{ marginBottom: 14 }}>
        <SectionLabel n="01" title="Executive summary" />
        <AiBlock block={execLive} showSources={ss} showConfidence={sc} />
      </div>

      <div style={{ margin: "26px 0 14px" }}>
        <SectionLabel n="02" title="SEO performance" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 2px rgba(20,18,31,.04)", marginBottom: 13 }}>
          {metricCards.map((m) => (
            <div key={m.label} style={{ padding: "16px 18px", borderLeft: "1px solid #f0f0f4", marginLeft: -1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#86868f" }}>{m.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c7c7cf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.6h.01" /></svg>
              </div>
              <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-.02em", color: "#14121f", lineHeight: 1 }}>{m.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 9 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: m.deltaFg, background: m.deltaBg, padding: "2px 8px", borderRadius: 999 }}>{m.delta}</span>
                <span style={{ fontSize: 11, color: "#9a9aa6" }}>vs last wk</span>
              </div>
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: 30, marginTop: 12, display: "block", overflow: "visible" }}>
                <polygon points={m.fill} fill="#f0effe" /><polyline points={m.spark} fill="none" stroke="#5b54f5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <div style={{ marginTop: 12, paddingTop: 11, borderTop: "1px solid #f0f0f4" }}>
                <SourceTag source={m.source} confidence="High" figure={m.figure} showSources={ss} showConfidence={sc} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(100deg,#eef6f0,#fff)", border: "1px solid #cdead9", borderRadius: 14, padding: "15px 19px" }}>
          <span style={{ width: 40, height: 40, borderRadius: 11, background: "#0f9a5a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 5H4v1.5A3 3 0 0 0 7 9.5M17 5h3v1.5a3 3 0 0 1-3 3" /></svg>
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "#0f8a52", marginBottom: 3 }}>Win of the week</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1d3a2a" }}>Broke into the top 5 for <strong>&quot;product analytics software&quot;</strong> — now #4, up from #11</div>
          </div>
          <SourceTag source="Semrush AI" confidence="High" figure="Semrush position for 'product analytics software' = 4 (was 11)" showSources={ss} showConfidence={sc} />
        </div>
      </div>

      <div style={{ margin: "28px 0 0" }}>
        <Box as="button" s="width:100%;display:flex;align-items:center;gap:11px;background:#fff;border:1px solid #e8e8ef;border-radius:12px;padding:14px 18px;cursor:pointer;font-family:inherit;text-align:left" h="background:#fafafc" onClick={a.toggleData}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: "#f0f0f4", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c5c68" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </span>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 800, color: "#1d1b2e" }}>Supporting data</div><div style={{ fontSize: 12, color: "#6f6f7b", marginTop: 1 }}>Keyword rankings, top pages, conversions &amp; competitive — all computed from source</div></div>
          <span style={{ fontSize: 13, color: "#92929d", transform: a.dataOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
        </Box>
      </div>

      {a.dataOpen && (
        <>
          <div style={{ margin: "26px 0 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}><span style={{ fontSize: 15, fontWeight: 800, color: "#1d1b2e" }}>Keyword rankings &amp; movement</span></div>
            <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1.2fr 1fr", gap: 10, padding: "11px 18px", background: "#fafafc", borderBottom: "1px solid #e8e8ef", fontSize: 11, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#92929d" }}><span>Keyword</span><span>Position</span><span>Change</span><span>Volume</span></div>
              {keywordRows.map((k) => (
                <div key={k.kw} style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1.2fr 1fr", gap: 10, padding: "13px 18px", borderBottom: "1px solid #f0f0f4", alignItems: "center", fontSize: 13.5 }}>
                  <span style={{ fontWeight: 600, color: "#2c2940" }}>{k.kw}</span><span style={{ fontWeight: 800, color: "#14121f" }}>#{k.pos}</span><span style={{ fontWeight: 800, color: k.changeColor }}>{k.change}</span><span style={{ color: "#5f5f6b" }}>{k.vol}</span>
                </div>
              ))}
              <div style={{ padding: "11px 18px", background: "#fafafc" }}><SourceTag source="Semrush AI" confidence="High" figure="Semrush Position Tracking — 18 tracked keywords, wk May 25–31" showSources={ss} showConfidence={sc} /></div>
            </div>
          </div>

          <div style={{ margin: "26px 0 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}><span style={{ fontSize: 15, fontWeight: 800, color: "#1d1b2e" }}>Conversions &amp; outcomes</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 13, marginBottom: 13 }}>
              {convCards.map((cv) => (
                <div key={cv.label} style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, padding: "15px 16px" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#86868f", marginBottom: 8 }}>{cv.label}</div>
                  <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-.02em", color: "#14121f", lineHeight: 1 }}>{cv.value}</div>
                  <span style={{ display: "inline-block", marginTop: 9, fontSize: 11.5, fontWeight: 800, color: "#0f9a5a", background: "#e6f6ee", padding: "2px 8px", borderRadius: 999 }}>{cv.delta}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, padding: "15px 19px" }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#5b54f5", flex: "none" }}>41%</span>
              <div style={{ flex: 1, fontSize: 14, color: "#3a3654", fontWeight: 600 }}>of all sign-ups this week were driven by <strong>organic search</strong> — Acme&apos;s largest acquisition channel.</div>
              <SourceTag source="GA4" confidence="High" figure="GA4 attribution — organic sign-ups 320 of 781 total = 41%" showSources={ss} showConfidence={sc} />
            </div>
          </div>

          <div style={{ margin: "26px 0 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}><span style={{ fontSize: 15, fontWeight: 800, color: "#1d1b2e" }}>Competitive benchmark · vs {competitor}</span></div>
            <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, padding: "18px 20px" }}>
              {compBars.map((cb) => (
                <div key={cb.label} style={{ padding: "11px 0", borderBottom: "1px solid #f0f0f4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700, color: "#46464f", marginBottom: 8 }}><span>{cb.label}</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <span style={{ width: 60, fontSize: 12, fontWeight: 700, color: "#5b54f5", flex: "none" }}>Acme</span>
                    <span style={{ flex: 1, height: 11, borderRadius: 6, background: "#f0eefb", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: cb.acmePct, background: "#5b54f5", borderRadius: 6 }} /></span>
                    <span style={{ width: 54, textAlign: "right", fontSize: 12.5, fontWeight: 800, color: "#14121f", flex: "none" }}>{cb.acme}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 60, fontSize: 12, fontWeight: 700, color: "#86868f", flex: "none" }}>{competitor}</span>
                    <span style={{ flex: 1, height: 11, borderRadius: 6, background: "#f1f0f5", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: cb.quantaPct, background: "#a8a4b8", borderRadius: 6 }} /></span>
                    <span style={{ width: 54, textAlign: "right", fontSize: 12.5, fontWeight: 800, color: "#5f5f6b", flex: "none" }}>{cb.quanta}</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 13 }}><SourceTag source="Semrush AI" confidence="High" figure="Semrush competitive benchmark — Acme vs Quanta, wk May 25–31" showSources={ss} showConfidence={sc} /></div>
            </div>
          </div>
        </>
      )}

      <div id="edit-ai" style={{ margin: "30px 0 14px" }}>
        <SectionLabel n="03" title="AI-search visibility" />
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#1d1b2e", borderRadius: 13, padding: "14px 18px", marginBottom: 13 }}>
          <div style={{ flex: "none", textAlign: "center" }}><div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1 }}>38<span style={{ fontSize: 13, color: "#9a95c4" }}>/100</span></div><div style={{ fontSize: 10, color: "#9a95c4", marginTop: 2 }}>AI visibility</div></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: "#cfccf0" }}>▼ 4 vs last week · Acme 14% SoV · Quanta 29% ▲</div><div style={{ fontSize: 12, color: "#9a95c4", marginTop: 2 }}>Low-confidence signal — limited prompt sampling this cycle</div></div>
          <SourceTag source="Semrush AI" confidence="Medium" figure="Semrush AI Visibility Index = 38 / 100 (prior wk: 42)" showSources={ss} showConfidence={sc} />
        </div>
        <AiBlock block={aiLive} showSources={ss} showConfidence={sc} />
      </div>

      <div id="edit-recs" style={{ margin: "30px 0 14px" }}>
        <SectionLabel n="04" title="Recommendations" badge={focusLabel} />
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {recLive.map((rec) => <AiBlock key={rec.label} block={rec} showSources={ss} showConfidence={sc} />)}
        </div>
      </div>

      <div style={{ margin: "32px 0 16px" }}>
        <SectionLabel n="05" title="What's next & how we can help" />
        <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f4" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#3a3654", lineHeight: 1.6 }}>{whatNextIntro}</div>
          </div>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f4" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "#92929d", marginBottom: 14 }}>Pepper handles it — our services</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 13, marginBottom: 16 }}>
              {pepperServices.map((svc, i) => (
                <div key={svc.title} style={{ background: svcAccent[i].bg, borderRadius: 13, padding: "16px 17px" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#1d1b2e", marginBottom: 3 }}>{svc.title}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: svcAccent[i].fg, marginBottom: 9 }}>{svc.tagline}</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "#5c5c68" }}>{svc.desc}</div>
                </div>
              ))}
            </div>
            <Box as="button" s="display:inline-flex;align-items:center;gap:8px;background:#5b54f5;color:#fff;border:none;border-radius:10px;padding:11px 18px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#4a43d6">
              Book a scope conversation with Pepper
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Box>
          </div>
          <div style={{ padding: "18px 24px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "#92929d", marginBottom: 12 }}>Your team handles it — self-service checklist</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {clientItems.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, lineHeight: 1.45, color: "#5c5c68" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9aa6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ReviewScreen() {
  const a = useAtlas();
  const edit = a.reviewMode === "edit";
  return (
    <>
      <section style={{ padding: "26px 34px 120px", maxWidth: 1000, margin: "0 auto", animation: "fadeUp .35s ease both" }}>
        {a.interim && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fdeaea", border: "1px solid #f4cccd", color: "#b22a30", borderRadius: 11, padding: "11px 16px", marginBottom: 16, fontSize: 13, fontWeight: 700 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#d93b41", flex: "none", display: "inline-block" }} />
            Interim report — triggered by anomaly · organic traffic −18% week-over-week
          </div>
        )}
        {edit ? <EditMode /> : <ReviewMode />}
      </section>

      {edit && (
        <div style={{ position: "sticky", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,.94)", backdropFilter: "blur(8px)", borderTop: "1px solid #e6e6ec", padding: "14px 34px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 -6px 22px rgba(20,18,31,.06)" }}>
          <span style={{ fontSize: 13, color: "#6f6f7b", fontWeight: 600 }}>Editing {a.selectedBrand}&apos;s report</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <Box as="button" s="display:inline-flex;align-items:center;gap:8px;background:#fff;color:#5b5775;border:1px solid #e2def0;border-radius:11px;padding:12px 20px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#f5f5f8" onClick={() => a.set({ reviewMode: "review" })}>← Back to review</Box>
            <Box as="button" s="display:inline-flex;align-items:center;gap:9px;background:#5b54f5;color:#fff;border:none;border-radius:11px;padding:12px 22px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 6px 18px rgba(91,84,245,.32)" h="background:#4a43d6" onClick={a.approve}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></svg>Create deck
            </Box>
          </div>
        </div>
      )}
    </>
  );
}
