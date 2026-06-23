"use client";

import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from "react";
import {
  initialBrands, initialReports, defaultFindings, subOrder, revOrder,
  type Brand, type ReportRow, type RunEvent,
} from "@/lib/atlas/data";
import type { ReportSpec } from "@/lib/agent/reportSpec";
import { goldenReportSpec } from "@/lib/atlas/goldenSpec";

/** Backend ProgressEvent → run-feed item. Collector, analyst and reviewer steps all
 *  stream live into the feed; the human_in_loop pause is handled by the caller. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBackendEvent(e: any): RunEvent | null {
  const a: string = e.agent || "";
  const agentId = /Collector/i.test(a) ? "data" : /Analyst|Insight/i.test(a) ? "insight" : /Reviewer|Fact/i.test(a) ? "fact" : "data";
  if (e.type === "human_in_loop") return { agent: "fact", type: "finding", sev: "warn", text: e.hint || e.question || "Flagged for human verification." };
  if (e.callLine) return { agent: agentId, type: "msg", text: String(e.callLine).replace(/^collector → /, "") };
  if (e.severity === "warn") return { agent: agentId, type: "finding", sev: "warn", text: e.message };
  if (e.severity === "info") return { agent: agentId, type: "finding", sev: "pass", text: e.message };
  if (e.message) return { agent: agentId, type: "msg", text: e.message };
  return null;
}

/** POST an SSE endpoint and invoke onEvent for every `data:` event as it streams.
 *  Resolves when the server closes the stream. Throws on a non-OK response. */
async function streamSSE(
  url: string,
  payload: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvent: (e: any) => void
): Promise<void> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok || !res.body) throw new Error(`${url} failed ${res.status}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split("\n\n");
    buf = parts.pop() || "";
    for (const p of parts) {
      const line = p.trim();
      if (!line.startsWith("data:")) continue;
      onEvent(JSON.parse(line.slice(5).trim()));
    }
  }
}

type Screen = "brands" | "dashboard" | "generate" | "review" | "deliver" | "client" | "reports";

export interface FeedItem extends RunEvent {
  id: number;
}

export interface AtlasState {
  screen: Screen;
  interim: boolean;
  playing: boolean;
  sidebarOpen: boolean;
  dataOpen: boolean;
  shareOpen: boolean;
  currentSlide: number;
  emailDraft: string;
  extraEmails: string[];
  clientMessage: string;
  dashTab: "overview" | "seo" | "aivis";
  selectedBrand: string;
  showAddBrand: boolean;
  newBrandName: string;
  newBrandIndustry: string;
  newBrandDomain: string;
  brands: Brand[];
  reports: ReportRow[];
  downloadedId: number | null;
  reviewMode: "review" | "edit";
  showSources: boolean;
  showConfidence: boolean;
  deckTitle: string;
  delivered: boolean;
  deliveredChannel: string;
  deliverStep: "deck" | "email";
  sources: Record<string, boolean>;
  tools: Record<string, boolean>;
  agentsOn: Record<string, boolean>;
  reviewersOn: Record<string, boolean>;
  agentModel: Record<string, string>;
  agentInstr: Record<string, string>;
  runStarted: boolean;
  running: boolean;
  runDone: boolean;
  awaitingInput: boolean;
  focusChoice: { key: string; label: string; pitch: string } | null;
  awaitingCustom: boolean;
  customFocusText: string;
  feed: FeedItem[];
  activeAgent: string | null;
  srcDone: Record<string, boolean>;
  reviewerFindings: RunEvent[];
  reportSpec: ReportSpec | null;
  usedLiveAI: boolean;
  runStartedAt: number | null; // epoch ms when generation started (for real time-taken)
}

const initialState: AtlasState = {
  screen: "brands", interim: false, playing: false, sidebarOpen: true, dataOpen: false, shareOpen: false, currentSlide: 0,
  emailDraft: "", extraEmails: [], clientMessage: "Hi team — here's this week's performance summary from Pepper. Happy to walk through it on our next call.",
  dashTab: "overview", selectedBrand: "Acme Analytics", showAddBrand: false, newBrandName: "", newBrandIndustry: "", newBrandDomain: "",
  brands: initialBrands, reports: initialReports, downloadedId: null,
  reviewMode: "review", showSources: true, showConfidence: false, deckTitle: "", delivered: false, deliveredChannel: "Email", deliverStep: "deck",
  sources: { gsc: true, ga4: true, semrush: false, geo: true, wordpress: true },
  tools: { anomaly: true, benchmark: true, citations: true, freshness: true, attribution: true },
  agentsOn: { data: true, metrics: true, detect: true, insight: true, aisearch: true, recs: true },
  reviewersOn: { fact: true, tone: true, brand: true },
  agentModel: { data: "Atlas-Fast", metrics: "Atlas-Fast", detect: "Atlas-Fast", insight: "Atlas-Pro", aisearch: "Atlas-Pro", recs: "Atlas-Pro" },
  agentInstr: { insight: "Lead with the biggest win. Keep it exec-ready and concise.", aisearch: "Be candid about gaps vs the competitor. Flag any uncertainty.", recs: "Prioritize by impact. Make each action specific and assignable." },
  runStarted: false, running: false, runDone: false, awaitingInput: false, focusChoice: null, awaitingCustom: false, customFocusText: "",
  feed: [], activeAgent: null, srcDone: {}, reviewerFindings: [],
  reportSpec: null, usedLiveAI: false, runStartedAt: null,
};

type Patch = Partial<AtlasState> | ((s: AtlasState) => Partial<AtlasState>);
function reducer(state: AtlasState, patch: Patch): AtlasState {
  return { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
}

interface AtlasActions {
  set: (p: Patch) => void;
  updateReportSpec: (mutate: (s: ReportSpec) => void) => void;
  toggleSidebar: () => void;
  goBrands: () => void;
  goReports: () => void;
  goDashboard: () => void;
  openBrand: (name: string, interim?: boolean) => void;
  setTab: (t: AtlasState["dashTab"]) => void;
  startReport: () => void;
  openAddBrand: () => void;
  closeAddBrand: () => void;
  addBrand: () => void;
  goGenerate: (interim?: boolean) => void;
  skipGen: () => void;
  goReview: () => void;
  approve: () => void;
  backToReview: () => void;
  goEmailStep: () => void;
  backToDeck: () => void;
  sendReport: () => void;
  exportOnly: () => void;
  toggleShare: () => void;
  prevSlide: () => void;
  nextSlide: () => void;
  toggleData: () => void;
  goEditMode: () => void;
  jumpSection: (id: string) => void;
  setDeckTitle: (v: string) => void;
  setEmailDraft: (v: string) => void;
  addEmail: () => void;
  removeEmail: (e: string) => void;
  setClientMessage: (v: string) => void;
  viewReport: (name: string) => void;
  downloadReport: (id: number) => void;
  goClient: () => void;
  toggleSource: (k: string) => void;
  toggleTool: (k: string) => void;
  toggleAgent: (k: string) => void;
  toggleReviewer: (k: string) => void;
  cycleModel: (k: string) => void;
  setInstr: (k: string, v: string) => void;
  startRun: () => void;
  chooseFocus: (opt: { key: string; label: string; pitch: string; isOther?: boolean }) => void;
  setCustomFocusText: (v: string) => void;
  submitCustomFocus: () => void;
  feedRef: React.RefObject<HTMLDivElement | null>;
}

const Ctx = createContext<(AtlasState & AtlasActions) | null>(null);

export function useAtlas() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAtlas must be used within AtlasProvider");
  return v;
}

export function AtlasProvider({ children }: { children: React.ReactNode }) {
  const [S, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(S);
  stateRef.current = S;
  const feedRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const typeT = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The paused-graph handle from the backend interrupt, used to resume the run.
  const interruptCtx = useRef<{ threadId: string; seenCount: number } | null>(null);

  const set = useCallback((p: Patch) => dispatch(p), []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    if (typeT.current) { clearTimeout(typeT.current); typeT.current = null; }
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const scrollFeed = useCallback(() => {
    later(() => { const el = feedRef.current; if (el) el.scrollTop = el.scrollHeight; }, 0);
  }, [later]);

  const appendFeed = useCallback((item: RunEvent) => {
    set((s) => ({ feed: [...s.feed, { ...item, id: s.feed.length }] }));
    scrollFeed();
  }, [set, scrollFeed]);

  const typeStream = useCallback((full: string, done: () => void) => {
    const step = Math.max(2, Math.round(full.length / 46));
    let i = 0;
    const tick = () => {
      if (!stateRef.current.running) return;
      i = Math.min(full.length, i + step);
      const slice = full.slice(0, i);
      set((s) => { const f = s.feed.slice(); if (f.length) f[f.length - 1] = { ...f[f.length - 1], text: slice }; return { feed: f }; });
      scrollFeed();
      if (i < full.length) { typeT.current = setTimeout(tick, 36); } else { done(); }
    };
    tick();
  }, [set, scrollFeed]);

  const finishRun = useCallback(() => {
    set({ running: false, runDone: true, activeAgent: null });
  }, [set]);

  // Start the REAL agent pipeline immediately: the Data Collector runs and locks the
  // numbers first, then the graph pauses at the backend interrupt() and the
  // human-in-the-loop decision card is rendered from the streamed payload.
  const startRun = useCallback(async () => {
    clearTimers();
    interruptCtx.current = null;
    const s = stateRef.current;
    const baseGuidance = s.agentInstr.insight || "";
    set({ runStarted: true, running: true, runDone: false, awaitingInput: false, focusChoice: null, awaitingCustom: false, customFocusText: "", feed: [], reviewerFindings: [], srcDone: {}, activeAgent: "data", reportSpec: null, usedLiveAI: false, runStartedAt: Date.now() });
    try {
      await streamSSE(
        "/api/report",
        { clientName: s.selectedBrand, period: "May 25–31, 2026", guidance: baseGuidance },
        (e) => {
          if (e.type === "human_in_loop") {
            interruptCtx.current = { threadId: e.threadId, seenCount: e.seenCount || 0 };
            set({ awaitingInput: true, activeAgent: "insight" });
            appendFeed({ agent: "insight", type: "interrupt", question: e.question, hint: e.hint, options: e.options });
            return;
          }
          if (e.type === "error") throw new Error(e.message || "agent error");
          if (e.type === "done") return;
          const item = mapBackendEvent(e);
          if (!item) return;
          set({ activeAgent: item.agent });
          appendFeed(item);
        }
      );
    } catch (err) {
      appendFeed({ agent: "fact", type: "finding", sev: "warn", text: "Agent run could not complete — " + (err instanceof Error ? err.message : String(err)) + ". Check the Gemini API key / quota and run again." });
      set({ running: false, activeAgent: null });
    }
  }, [clearTimers, set, appendFeed]);

  // After the focus is chosen, RESUME the paused graph (/api/report/resume) and stream
  // the Insights Writer + Fact-Checker work into the feed live. No scripted fallback —
  // on failure we surface the real error.
  const resumeReport = useCallback(async (choice: { key: string; label: string; pitch: string } | string, label: string) => {
    const ctx = interruptCtx.current;
    if (!ctx) return;
    const chosen = typeof choice === "string" ? { key: "other", label, pitch: "" } : choice;
    set({ awaitingInput: false, focusChoice: chosen, awaitingCustom: false, customFocusText: "", activeAgent: "insight" });
    scrollFeed();
    try {
      let spec: ReportSpec | null = null;
      await streamSSE(
        "/api/report/resume",
        { threadId: ctx.threadId, choice, seenCount: ctx.seenCount },
        (e) => {
          if (e.type === "done") { spec = e.reportSpec ?? null; return; }
          if (e.type === "error") throw new Error(e.message || "agent error");
          const item = mapBackendEvent(e);
          if (!item) return;
          if (item.type === "finding") set((st) => ({ reviewerFindings: [...st.reviewerFindings, item] }));
          set({ activeAgent: item.agent });
          appendFeed(item);
        }
      );
      if (!spec) throw new Error("no report returned");
      set({ reportSpec: spec, usedLiveAI: true, activeAgent: "insight" });
      // Stream the real executive summary as the drafted narrative.
      appendFeed({ agent: "insight", type: "stream", text: "" });
      typeStream((spec as ReportSpec).execSummary.text, () => finishRun());
    } catch (err) {
      appendFeed({ agent: "fact", type: "finding", sev: "warn", text: "Agent run could not complete — " + (err instanceof Error ? err.message : String(err)) + ". Check the Gemini API key / quota and run again." });
      set({ running: false, activeAgent: null });
    }
  }, [set, appendFeed, scrollFeed, typeStream, finishRun]);

  const chooseFocus = useCallback((opt: { key: string; label: string; pitch: string; isOther?: boolean }) => {
    if (!stateRef.current.awaitingInput) return;
    if (opt.key === "other") { set({ awaitingCustom: true }); return; }
    resumeReport({ key: opt.key, label: opt.label, pitch: opt.pitch }, opt.label);
  }, [set, resumeReport]);

  const submitCustomFocus = useCallback(() => {
    const v = (stateRef.current.customFocusText || "").trim();
    if (!v) return;
    resumeReport(v, v);
  }, [resumeReport]);

  // ---------- navigation ----------
  const openBrand = useCallback((name: string, interim?: boolean) => {
    clearTimers();
    set({ screen: "dashboard", selectedBrand: name, dashTab: "overview", interim: !!interim, runStarted: false, running: false, runDone: false, awaitingInput: false, focusChoice: null, feed: [], reviewerFindings: [], srcDone: {} });
  }, [clearTimers, set]);

  const goGenerate = useCallback((interim?: boolean) => {
    clearTimers();
    set({ screen: "generate", interim: !!interim, delivered: false, runStarted: false, running: false, runDone: false, awaitingInput: false, focusChoice: null, feed: [], reviewerFindings: [], srcDone: {}, activeAgent: null });
  }, [clearTimers, set]);

  const goReview = useCallback(() => {
    clearTimers();
    set({ running: false });
    set((s) => ({ screen: "review", reviewerFindings: s.reviewerFindings.length ? s.reviewerFindings : defaultFindings }));
  }, [clearTimers, set]);

  const finalizeDelivery = useCallback((channel: "Email" | "Download") => {
    const s = stateRef.current;
    const b = s.brands.find((x) => x.name === s.selectedBrand) || s.brands[0];
    // Real generation date (today), not the hard-coded scenario date.
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    // Real elapsed time: from run start (generation) → this Share/Export/Email click.
    const elapsedMs = s.runStartedAt ? Date.now() - s.runStartedAt : 0;
    const mins = Math.floor(elapsedMs / 60000);
    const secs = Math.floor((elapsedMs % 60000) / 1000);
    const timeTaken = elapsedMs <= 0 ? "—" : mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    const entry: ReportRow = {
      id: Date.now(), brand: b.name, initials: b.initials, logoBg: b.logoBg, logoFg: b.logoFg,
      period: s.interim ? "Interim · Wk May 25–31" : "Week of May 25–31", type: s.interim ? "Interim" : "Weekly",
      recipients: channel === "Email" ? [...(b.recipients || ["Client stakeholders"]), ...s.extraEmails] : [], sharedOn: today,
      generatedBy: "Karan Sheth", channel, status: channel === "Email" ? "Delivered" : "Exported",
      timeTaken,
    };
    set((st) => ({ delivered: true, deliveredChannel: channel, reports: [entry, ...st.reports], brands: st.brands.map((br) => (br.name === b.name ? { ...br, lastReport: today } : br)) }));
  }, [set]);

  const actions: AtlasActions = {
    set, feedRef,
    // Edit the report spec in place (initialize from golden if a live spec isn't present),
    // so manual edits flow into both the deck preview and the exported .pptx.
    updateReportSpec: (mutate) => set((s) => {
      const base: ReportSpec = structuredClone(s.reportSpec ?? goldenReportSpec);
      mutate(base);
      return { reportSpec: base };
    }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    goBrands: () => { clearTimers(); set({ screen: "brands", playing: false, delivered: false, interim: false, runStarted: false, running: false }); },
    goReports: () => { clearTimers(); set({ screen: "reports", playing: false }); },
    goDashboard: () => { clearTimers(); set({ screen: "dashboard", dashTab: "overview", playing: false, delivered: false, runStarted: false, running: false }); },
    openBrand,
    setTab: (t) => set({ dashTab: t }),
    startReport: () => goGenerate(stateRef.current.interim),
    openAddBrand: () => set({ showAddBrand: true, newBrandName: "", newBrandIndustry: "", newBrandDomain: "" }),
    closeAddBrand: () => set({ showAddBrand: false }),
    addBrand: () => {
      const n = (stateRef.current.newBrandName || "").trim();
      if (!n) return;
      const inits = n.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
      const b: Brand = { name: n, initials: inits, logoBg: "#eef0ff", logoFg: "#4a43d6", industry: (stateRef.current.newBrandIndustry || "New brand").trim() || "New brand", domain: (stateRef.current.newBrandDomain || "").trim(), vis: 0, clicks: "—", statusKey: "new", synced: "just added" };
      set((s) => ({ brands: [...s.brands, b], showAddBrand: false }));
    },
    goGenerate,
    skipGen: () => { clearTimers(); set({ running: false }); goReview(); },
    goReview,
    approve: () => set({ screen: "deliver", delivered: false, deliverStep: "deck" }),
    backToReview: () => { clearTimers(); set({ screen: "review", reviewMode: "review" }); },
    goEmailStep: () => set({ deliverStep: "email" }),
    backToDeck: () => set({ deliverStep: "deck" }),
    sendReport: () => finalizeDelivery("Email"),
    exportOnly: () => finalizeDelivery("Download"),
    toggleShare: () => set((s) => ({ shareOpen: !s.shareOpen })),
    prevSlide: () => set((s) => ({ currentSlide: Math.max(0, s.currentSlide - 1) })),
    nextSlide: () => set((s) => ({ currentSlide: Math.min(4, s.currentSlide + 1) })),
    toggleData: () => set((s) => ({ dataOpen: !s.dataOpen })),
    goEditMode: () => set({ reviewMode: "edit" }),
    jumpSection: (id) => {
      const el = document.getElementById("edit-" + id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    setDeckTitle: (v) => set({ deckTitle: v }),
    setEmailDraft: (v) => set({ emailDraft: v }),
    addEmail: () => { const e = (stateRef.current.emailDraft || "").trim(); if (!e || e.indexOf("@") < 1) return; set((s) => ({ extraEmails: [...s.extraEmails, e], emailDraft: "" })); },
    removeEmail: (e) => set((s) => ({ extraEmails: s.extraEmails.filter((x) => x !== e) })),
    setClientMessage: (v) => set({ clientMessage: v }),
    viewReport: (name) => set({ selectedBrand: name, screen: "client", playing: false }),
    downloadReport: (id) => { set({ downloadedId: id }); later(() => { if (stateRef.current.downloadedId === id) set({ downloadedId: null }); }, 2200); },
    goClient: () => set({ screen: "client", playing: false }),
    toggleSource: (k) => set((s) => ({ sources: { ...s.sources, [k]: !s.sources[k] } })),
    toggleTool: (k) => set((s) => ({ tools: { ...s.tools, [k]: !s.tools[k] } })),
    toggleAgent: (k) => set((s) => ({ agentsOn: { ...s.agentsOn, [k]: !s.agentsOn[k] } })),
    toggleReviewer: (k) => set((s) => ({ reviewersOn: { ...s.reviewersOn, [k]: !s.reviewersOn[k] } })),
    cycleModel: (k) => set((s) => ({ agentModel: { ...s.agentModel, [k]: s.agentModel[k] === "Atlas-Pro" ? "Atlas-Fast" : "Atlas-Pro" } })),
    setInstr: (k, v) => set((s) => ({ agentInstr: { ...s.agentInstr, [k]: v } })),
    startRun, chooseFocus, setCustomFocusText: (v) => set({ customFocusText: v }), submitCustomFocus,
  };

  return <Ctx.Provider value={{ ...S, ...actions }}>{children}</Ctx.Provider>;
}
