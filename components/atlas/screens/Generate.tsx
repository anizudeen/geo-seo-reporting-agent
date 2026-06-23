"use client";

import { useAtlas } from "../store";
import type { FeedItem } from "../store";
import { Box, Switch } from "../ui";
import {
  agentMeta, srcMeta, srcKeys, subOrder, revOrder, reviewerDesc, sevMap,
} from "@/lib/atlas/data";

const modeMap: Record<string, { l: string; c: string; b: string }> = {
  plan: { l: "updates", c: "#1f5fd0", b: "#eaf1fe" }, handoff: { l: "updates", c: "#1f5fd0", b: "#eaf1fe" }, done: { l: "updates", c: "#1f5fd0", b: "#eaf1fe" }, complete: { l: "updates", c: "#1f5fd0", b: "#eaf1fe" },
  tool: { l: "tool", c: "#0f8a52", b: "#e6f6ee" },
  msg: { l: "custom", c: "#6b3fd0", b: "#f0eafe" }, result: { l: "custom", c: "#6b3fd0", b: "#f0eafe" }, resume: { l: "updates", c: "#1f5fd0", b: "#eaf1fe" },
  stream: { l: "messages", c: "#4a43d6", b: "#efeefb" },
  finding: { l: "custom", c: "#6b3fd0", b: "#f0eafe" },
  interrupt: { l: "interrupt", c: "#b5781f", b: "#fdf2e0" },
};

function Check() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0f9a5a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>;
}
function Spin() {
  return <span style={{ width: 11, height: 11, border: "2px solid #d8cdf7", borderTopColor: "#5b54f5", borderRadius: "50%", display: "inline-block", animation: "absp .7s linear infinite" }} />;
}

function RosterRow({ id, activeAgent, seen, runDone }: { id: string; activeAgent: string | null; seen: Set<string>; runDone: boolean }) {
  const m = agentMeta[id];
  const st = activeAgent === id ? "active" : (seen.has(id) || runDone) ? "done" : "idle";
  const dotBg = st === "active" ? m.color : st === "done" ? "#0f9a5a" : "#d3d3da";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0" }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: dotBg, flex: "none", animation: st === "active" ? "pulse 1s ease infinite" : undefined }} />
      <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 700, color: st === "idle" ? "#a3a3ad" : "#1d1b2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
      {st === "done" && <Check />}
      {st === "active" && <Spin />}
    </div>
  );
}

function FeedRow({ f }: { f: FeedItem }) {
  const a = useAtlas();
  const m = agentMeta[f.agent] || { name: f.agent, color: "#5b54f5", type: "AI" };
  const mode = modeMap[f.type] || modeMap.msg;
  const sev = f.sev ? sevMap[f.sev] : null;
  const isMsg = ["msg", "result", "done", "plan", "handoff", "complete", "resume"].includes(f.type);
  const msgColor = (f.type === "handoff" || f.type === "plan") ? "#5b54f5" : (f.type === "complete" || f.type === "done" || f.type === "result" || f.type === "resume") ? "#0f8a52" : "#5c5c68";
  const msgIcon = (f.type === "handoff" || f.type === "plan") ? "⇄" : (f.type === "complete" || f.type === "done" || f.type === "result" || f.type === "resume") ? "✓" : "›";

  return (
    <div style={{ display: "flex", gap: 11, padding: "9px 0", borderBottom: "1px solid #f6f6f9", animation: "fadeUp .25s ease both" }}>
      <span style={{ flex: "none", width: 62, fontFamily: "'SF Mono',ui-monospace,monospace", fontSize: 9, fontWeight: 800, letterSpacing: ".02em", textTransform: "uppercase", color: mode.c, background: mode.b, borderRadius: 5, padding: "3px 0", textAlign: "center", height: "fit-content", marginTop: 2 }}>{mode.l}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {f.type === "tool" && (
          <div style={{ fontFamily: "'SF Mono',ui-monospace,monospace", fontSize: 12, lineHeight: 1.5 }}>
            <div><span style={{ color: "#a3a3ad" }}>{m.name}</span> <span style={{ color: "#1f5fd0", fontWeight: 600 }}>→ {f.call}</span><span style={{ color: "#b6b6c0" }}>( {f.args} )</span></div>
            <div style={{ color: "#0f8a52", marginTop: 2 }}>✓ {f.result}</div>
          </div>
        )}
        {isMsg && (
          <div style={{ display: "flex", gap: 8, fontSize: 13, color: msgColor, lineHeight: 1.5 }}>
            <span style={{ flex: "none", fontWeight: 800 }}>{msgIcon}</span>
            <span><span style={{ color: "#a3a3ad", fontWeight: 700 }}>{m.name}</span> {f.text}</span>
          </div>
        )}
        {f.type === "stream" && (
          <div style={{ background: "#faf9ff", border: "1px solid #ece9f7", borderLeft: "3px solid #7d52e8", borderRadius: 9, padding: "10px 13px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".03em", textTransform: "uppercase", color: "#6b3fd0", marginBottom: 4 }}>{m.name}</div>
            <div style={{ fontSize: 13, color: "#2c2940", lineHeight: 1.55 }}>{f.text}<span style={{ color: "#7d52e8", fontWeight: 700, animation: "blink 1s step-end infinite" }}>▌</span></div>
          </div>
        )}
        {f.type === "finding" && sev && (
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <span style={{ flex: "none", fontSize: 10, fontWeight: 800, letterSpacing: ".03em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: sev.bg, color: sev.fg }}>{sev.label}</span>
            <span style={{ fontSize: 13, color: "#3a3654", lineHeight: 1.5 }}><span style={{ color: "#0f8a52", fontWeight: 700 }}>{m.name}</span> · {f.text}</span>
          </div>
        )}
        {f.type === "interrupt" && (
          <div style={{ background: "#fdfaf2", border: "1px solid #f0dcb8", borderRadius: 11, padding: "13px 15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b5781f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" /></svg>
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#a06814" }}>Human in the loop · {m.name} needs a decision</span>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#2c2940", lineHeight: 1.5, marginBottom: 4 }}>{f.question}</div>
            <div style={{ fontSize: 12, color: "#86868f", lineHeight: 1.45, marginBottom: 12 }}>{f.hint}</div>
            {a.awaitingInput && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(f.options || []).map((o) => (
                    <Box as="button" key={o.key} s="display:flex;align-items:center;gap:11px;text-align:left;background:#fff;border:1px solid #e8e8ef;border-radius:10px;padding:11px 13px;cursor:pointer;font-family:inherit;width:100%" h="border-color:#5b54f5;background:#faf9ff" onClick={() => a.chooseFocus(o)}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5b54f5", flex: "none" }} />
                      <span style={{ flex: 1 }}>
                        <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1d1b2e" }}>{o.label}</span>
                        {o.pitch && <span style={{ display: "block", fontSize: 11.5, color: "#86868f", marginTop: 1 }}>{o.pitch}</span>}
                      </span>
                      <span style={{ fontSize: 14, color: "#bdbdc7" }}>→</span>
                    </Box>
                  ))}
                </div>
                {a.awaitingCustom && (
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <input value={a.customFocusText} onChange={(e) => a.setCustomFocusText(e.target.value)} placeholder="Describe your focus in a sentence…" style={{ flex: 1, fontFamily: "inherit", fontSize: 13, color: "#1d1b2e", background: "#fff", border: "1px solid #d8d2f3", borderRadius: 9, padding: "10px 12px", outline: "none", boxSizing: "border-box" }} />
                    <Box as="button" s="background:#5b54f5;color:#fff;border:none;border-radius:9px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#4a43d6" onClick={a.submitCustomFocus}>Go →</Box>
                  </div>
                )}
              </>
            )}
            {a.focusChoice && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#e6f6ee", borderRadius: 9, padding: "8px 12px", fontSize: 12.5, fontWeight: 700, color: "#0f8a52" }}>
                <Check />You chose: {a.focusChoice.label}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Setup() {
  const a = useAtlas();
  const disabled = srcKeys.filter((k) => !a.sources[k]);
  const srcNameMap: Record<string, string> = { gsc: "Search Console", ga4: "Analytics", semrush: "Semrush rankings", geo: "GEO mentions", wordpress: "WordPress freshness" };
  const warning = disabled.map((k) => srcNameMap[k] || k).join(", ") + " disabled — some report sections will use cached or unavailable data.";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: "-.02em", color: "#1d1b2e" }}>Set up the run</h1>
          <p style={{ margin: "5px 0 0", fontSize: 13.5, color: "#6f6f7b" }}>{a.selectedBrand} · Week of May 25–31, 2026</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Box as="button" s="background:#fff;color:#5b5775;border:1px solid #e2def0;border-radius:9px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#f5f5f8" onClick={a.goDashboard}>← Dashboard</Box>
          <Box as="button" s="display:inline-flex;align-items:center;gap:8px;background:#5b54f5;color:#fff;border:none;border-radius:10px;padding:11px 20px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 5px 16px rgba(91,84,245,.3)" h="background:#4a43d6" onClick={a.startRun}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>Run agents
          </Box>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12.5, fontWeight: 800, color: "#1d1b2e" }}>Data sources</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {srcKeys.map((k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px 10px 0", borderBottom: "1px solid #f0f0f4" }}>
                <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: "#2c2940" }}>{srcMeta[k].name}</div>
                <Switch on={a.sources[k]} onClick={() => a.toggleSource(k)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 12.5, fontWeight: 800, color: "#1d1b2e" }}>Analysis agents</span></div>
        {subOrder.map((k) => {
          const m = agentMeta[k];
          const isAI = m.type === "AI";
          return (
            <div key={k} style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1d1b2e" }}>{m.name}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".03em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 999, background: isAI ? "#f0eafe" : "#eaf1fe", color: isAI ? "#6b3fd0" : "#1f5fd0" }}>{m.type}</span>
                </div>
                {isAI && (
                  <Box as="button" s="display:inline-flex;align-items:center;gap:5px;background:#f5f5f8;border:1px solid #e8e8ef;border-radius:8px;padding:5px 10px;font-size:11.5px;font-weight:700;color:#46464f;cursor:pointer;font-family:inherit" h="background:#eeeef3" onClick={() => a.cycleModel(k)}>{a.agentModel[k]} <span style={{ fontSize: 8, opacity: .6 }}>▾</span></Box>
                )}
              </div>
              {isAI && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#a3a3ad", textTransform: "uppercase", letterSpacing: ".04em", flex: "none" }}>Guidance</span>
                  <input value={a.agentInstr[k] || ""} onChange={(e) => a.setInstr(k, e.target.value)} style={{ flex: 1, fontFamily: "inherit", fontSize: 12.5, color: "#3a3654", background: "#faf9ff", border: "1px solid #ece9f7", borderRadius: 8, padding: "7px 11px", outline: "none" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}><span style={{ fontSize: 12.5, fontWeight: 800, color: "#1d1b2e" }}>Review agents</span></div>
        {revOrder.map((k) => {
          const m = agentMeta[k];
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 0", borderBottom: "1px solid #f0f0f4" }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: "#e6f6ee", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f9a5a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#2c2940" }}>{m.name}</div><div style={{ fontSize: 11, color: "#92929d" }}>{reviewerDesc[k]}</div></div>
              <Box as="button" s="display:inline-flex;align-items:center;gap:5px;background:#f5f5f8;border:1px solid #e8e8ef;border-radius:8px;padding:5px 10px;font-size:11.5px;font-weight:700;color:#46464f;cursor:pointer;font-family:inherit" h="background:#eeeef3" onClick={() => a.cycleModel(k)}>{a.agentModel[k] || "Atlas-Pro"} <span style={{ fontSize: 8, opacity: .6 }}>▾</span></Box>
            </div>
          );
        })}
      </div>

      {disabled.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#fdf2e0", border: "1px solid #f0dcb8", color: "#a06814", borderRadius: 10, padding: "11px 15px", marginTop: 16, fontSize: 13, fontWeight: 600 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b5781f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg>{warning}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 18 }}>
        <Box as="button" s="display:inline-flex;align-items:center;gap:8px;background:#5b54f5;color:#fff;border:none;border-radius:11px;padding:13px 24px;font-size:14.5px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 6px 18px rgba(91,84,245,.3)" h="background:#4a43d6" onClick={a.startRun}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>Run agents
        </Box>
      </div>
    </div>
  );
}

function RunConsole() {
  const a = useAtlas();
  const seen = new Set(a.feed.map((f) => f.agent));
  const rosterAgents = ["orch", ...subOrder.filter((k) => a.agentsOn[k] !== false)];
  const rosterReviewers = revOrder.filter((k) => a.reviewersOn[k] !== false);
  const activeName = a.activeAgent ? agentMeta[a.activeAgent]?.name : a.runDone ? "Complete" : "";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 16 }}>
        <span style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#6b63f7,#4a43d6)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/atlas-mark-white.svg" alt="" width={21} height={21} style={{ display: "block" }} />
        </span>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, letterSpacing: "-.02em", color: "#1d1b2e" }}>Atlas agents · {a.selectedBrand}</h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#6f6f7b", display: "flex", alignItems: "center", gap: 10 }}>
            {a.running && <><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5b54f5", animation: "pulse 1s ease infinite", display: "inline-block" }} />{activeName} · working…</>}
            {a.runDone && <><span style={{ color: "#0f8a52", fontWeight: 700 }}>✓ Run complete</span> — draft &amp; review ready</>}
          </p>
        </div>
        <Box as="button" s="background:#fff;color:#5b5775;border:1px solid #e2def0;border-radius:9px;padding:9px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#f5f5f8" onClick={a.skipGen}>Skip to review</Box>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 16, alignItems: "start" }}>
        <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, padding: 15 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "#a3a3ad", marginBottom: 10 }}>Agents</div>
          {rosterAgents.map((id) => <RosterRow key={id} id={id} activeAgent={a.activeAgent} seen={seen} runDone={a.runDone} />)}
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "#a3a3ad", margin: "13px 0 10px" }}>Reviewers</div>
          {rosterReviewers.map((id) => <RosterRow key={id} id={id} activeAgent={a.activeAgent} seen={seen} runDone={a.runDone} />)}
        </div>
        <div ref={a.feedRef} style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 14, padding: "8px 16px", height: 560, overflowY: "auto" }}>
          {a.feed.map((f) => <FeedRow key={f.id} f={f} />)}
        </div>
      </div>

      {a.runDone && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <Box as="button" s="display:inline-flex;align-items:center;gap:8px;background:#5b54f5;color:#fff;border:none;border-radius:11px;padding:12px 22px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 6px 18px rgba(91,84,245,.3)" h="background:#4a43d6" onClick={a.skipGen}>Continue to review <span style={{ fontSize: 15 }}>→</span></Box>
        </div>
      )}
    </div>
  );
}

export function GenerateScreen() {
  const a = useAtlas();
  return (
    <section style={{ padding: "28px 34px 60px", maxWidth: 1160, margin: "0 auto", animation: "fadeUp .35s ease both" }}>
      {a.interim && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fdeaea", border: "1px solid #f4cccd", color: "#b22a30", borderRadius: 11, padding: "11px 16px", marginBottom: 18, fontSize: 13, fontWeight: 700 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#d93b41", flex: "none", display: "inline-block" }} />
          Interim report — triggered by anomaly · organic traffic −18% week-over-week
        </div>
      )}
      {!a.runStarted ? <Setup /> : <RunConsole />}
    </section>
  );
}
