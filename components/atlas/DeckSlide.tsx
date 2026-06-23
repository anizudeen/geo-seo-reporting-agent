"use client";

/* eslint-disable @next/next/no-img-element */

import type { ReportSpec } from "@/lib/agent/reportSpec";

const PepperLogo = ({ h = 17 }: { h?: number }) => <img src="/pepper-logo.svg" alt="Pepper" style={{ height: h, width: "auto", display: "block" }} />;

const shell: React.CSSProperties = { position: "relative", aspectRatio: "16/9", borderRadius: 14, padding: "42px 50px", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" };
const lightShell: React.CSSProperties = { ...shell, background: "#fff", boxShadow: "0 12px 30px rgba(20,18,31,.13)" };
const num = (dark?: boolean): React.CSSProperties => ({ position: "absolute", bottom: 20, right: 26, fontSize: 11, fontWeight: 700, color: dark ? "#6f6a92" : "#bdbdc7" });

function pct(v: number) {
  return v <= 1 ? Math.round(v * 100) : Math.round(v);
}
function firstSentences(text: string, n: number) {
  const parts = text.split(/(?<=\.)\s+/);
  return parts.slice(0, n).join(" ");
}

export function DeckSlide({ index, spec }: { index: number; spec: ReportSpec | null }) {
  if (!spec) {
    return (
      <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 14, padding: "42px 50px", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", background: "#fff", boxShadow: "0 12px 30px rgba(20,18,31,.13)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: "100%", background: "#5b54f5" }} />
        <div style={{ color: "#9a9aa6", fontSize: 14, textAlign: "center" }}>Awaiting report approval...</div>
      </div>
    );
  }
  const client = spec.clientName;
  const ai = spec.aiVisibility;
  const yourSov = ai.sov.find((s) => s.brand === client) || ai.sov.find((s) => /acme/i.test(s.brand)) || ai.sov[0];
  const sovPct = yourSov ? pct(yourSov.pct) : 14;
  const topCompetitor = ai.sov.find((s) => s.brand !== client && !/acme/i.test(s.brand));

  if (index === 0) {
    return (
      <div style={{ ...lightShell, padding: "46px 50px" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: "100%", background: "#5b54f5" }} />
        <div style={{ position: "absolute", top: 30, left: 50, right: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1d1b2e" }}>{client}</span><PepperLogo />
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "#5b54f5", marginBottom: 12 }}>Weekly performance · {spec.period}</div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: "-.025em", color: "#14121f", lineHeight: 1.12, maxWidth: "78%" }}>A strong week for organic — and a clear focus for next week.</h1>
        <span style={num()}>01</span>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div style={{ ...shell, padding: "46px 50px", background: "linear-gradient(160deg,#221f3a,#191730)", boxShadow: "0 12px 30px rgba(25,23,48,.22)", color: "#eceaf7" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: "#9a95c4", marginBottom: 20 }}>Your visibility in AI search</div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ textAlign: "center", flex: "none" }}>
            <div style={{ fontSize: 54, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{ai.score}<span style={{ fontSize: 22, color: "#9a95c4" }}>/100</span></div>
            <div style={{ fontSize: 12, color: "#9a95c4", marginTop: 5 }}>AI visibility index</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16.5, lineHeight: 1.6, color: "#cfccf0" }}>When buyers ask ChatGPT, Perplexity and Gemini for product analytics tools, {client} appears <strong style={{ color: "#fff" }}>{sovPct}%</strong> of the time{topCompetitor ? <> vs {topCompetitor.brand} at <strong style={{ color: "#fff" }}>{pct(topCompetitor.pct)}%</strong></> : null}.</div>
            {ai.citationOpportunity && <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "#9a95c4", marginTop: 12 }}>{ai.citationOpportunity}</div>}
          </div>
        </div>
        <span style={num(true)}>02</span>
      </div>
    );
  }
  if (index === 2) {
    const metrics = spec.seo.metrics.slice(0, 3);
    return (
      <div style={lightShell}>
        <div style={{ position: "absolute", top: 30, left: 50, right: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "#5b54f5" }}>Results this week</span><PepperLogo />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 24 }}>
          {metrics.map((m) => {
            const positive = m.delta.startsWith("+") || m.delta.startsWith("▲");
            return (
              <div key={m.label}>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#14121f", lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 13, color: "#6f6f7b", marginTop: 6 }}>{m.label} {m.delta && <span style={{ color: positive ? "#0f9a5a" : "#d93b41", fontWeight: 800 }}>{m.delta}</span>}</div>
              </div>
            );
          })}
        </div>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#3a3654", maxWidth: "92%" }}>{firstSentences(spec.execSummary.text, 2)}</p>
        <span style={num()}>03</span>
      </div>
    );
  }
  if (index === 3) {
    return (
      <div style={lightShell}>
        <div style={{ position: "absolute", top: 30, left: 50, right: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "#5b54f5" }}>Your next steps for next week</span><PepperLogo />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {spec.recommendations.slice(0, 3).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#5b54f5", color: "#fff", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{r.num ?? i + 1}</span>
              <span style={{ fontSize: 14.5, lineHeight: 1.4, color: "#2c2940" }}><strong>{r.label}</strong> — {r.brief}</span>
            </div>
          ))}
        </div>
        <span style={num()}>04</span>
      </div>
    );
  }
  const pepper = spec.whatNext.pepperHandles.slice(0, 3);
  const self = spec.whatNext.selfService.slice(0, 3);
  return (
    <div style={lightShell}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: "100%", background: "#5b54f5" }} />
      <div style={{ position: "absolute", top: 30, left: 50, right: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "#5b54f5" }}>What&apos;s next &amp; how we can help</span><PepperLogo h={18} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <div style={{ background: "#f5f3fe", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#4a43d6", marginBottom: 11 }}>Pepper handles it</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pepper.map((s, i) => (
              <div key={i} style={{ fontSize: 13.5, lineHeight: 1.4, color: "#3a3654", display: "flex", alignItems: "flex-start", gap: 8 }}><span style={{ color: "#5b54f5", fontWeight: 800, flex: "none" }}>✓</span>{s}</div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "inline-block", background: "#5b54f5", color: "#fff", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 800 }}>Let&apos;s talk scope →</div>
        </div>
        <div style={{ background: "#faf9fc", border: "1px solid #f0f0f4", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#5c5c68", marginBottom: 11 }}>Your team handles it</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {self.map((s, i) => (
              <div key={i} style={{ fontSize: 13.5, lineHeight: 1.4, color: "#5c5c68", display: "flex", alignItems: "flex-start", gap: 8 }}><span style={{ color: "#9a9aa6", flex: "none" }}>□</span>{s}</div>
            ))}
          </div>
        </div>
      </div>
      <span style={num()}>05</span>
    </div>
  );
}
