// Display data ported verbatim from the Atlas design prototype.
// Numbers match lib/data/dataset.ts (the golden dataset that drives the eval).

export type Brand = {
  name: string;
  initials: string;
  logoBg: string;
  logoFg: string;
  industry: string;
  vis: number;
  clicks: string;
  lastReport?: string;
  statusKey: "due" | "ok" | "anomaly" | "new";
  synced: string;
  recipients?: string[];
  domain?: string;
  demo?: boolean; // demo/sample brand — greyed + generation disabled
};

export type ReportRow = {
  id: number;
  brand: string;
  initials: string;
  logoBg: string;
  logoFg: string;
  period: string;
  type: string;
  generatedBy: string;
  timeTaken: string;
  recipients: string[];
  sharedOn: string;
  channel: "Email" | "Download";
  status: "Opened" | "Exported" | "Delivered" | "Scheduled";
};

export const initialBrands: Brand[] = [
  { name: "Acme Analytics", initials: "AA", logoBg: "#efeefb", logoFg: "#4a43d6", industry: "B2B SaaS", vis: 38, clicks: "48.2K", lastReport: "Not generated yet", statusKey: "due", synced: "1h ago", recipients: ["Dana Webb", "Priya Nair"] },
  { name: "NorthLoop", initials: "NL", logoBg: "#e6f6ee", logoFg: "#0f8a52", industry: "Fintech", vis: 52, clicks: "71.0K", lastReport: "May 24, 2026", statusKey: "ok", synced: "1h ago", recipients: ["Rita Mehta", "Sam Okafor"], demo: true },
  { name: "Brightwave", initials: "BW", logoBg: "#fdf2e0", logoFg: "#b5781f", industry: "eCommerce", vis: 44, clicks: "33.4K", lastReport: "May 17, 2026", statusKey: "ok", synced: "1h ago", recipients: ["Lena Cho"], demo: true },
  { name: "Cedar HR", initials: "CH", logoBg: "#fdeaea", logoFg: "#c0353a", industry: "HR tech", vis: 29, clicks: "18.9K", lastReport: "May 10, 2026", statusKey: "ok", synced: "12m ago", recipients: ["Marco Diaz", "Ana Flores"], demo: true },
];

export const initialReports: ReportRow[] = [
  { id: 1, brand: "NorthLoop", initials: "NL", logoBg: "#e6f6ee", logoFg: "#0f8a52", period: "Week of May 18–24, 2026", type: "Weekly", generatedBy: "Karan Sheth", timeTaken: "18 min", recipients: ["Rita Mehta", "Sam Okafor"], sharedOn: "May 24, 2026", channel: "Email", status: "Opened" },
  { id: 2, brand: "Brightwave", initials: "BW", logoBg: "#fdf2e0", logoFg: "#b5781f", period: "Week of May 11–17, 2026", type: "Weekly", generatedBy: "Priya Raman", timeTaken: "42 min", recipients: [], sharedOn: "May 17, 2026", channel: "Download", status: "Exported" },
  { id: 3, brand: "NorthLoop", initials: "NL", logoBg: "#e6f6ee", logoFg: "#0f8a52", period: "Week of May 4–10, 2026", type: "Weekly", generatedBy: "Karan Sheth", timeTaken: "27 min", recipients: ["Rita Mehta", "Sam Okafor"], sharedOn: "May 10, 2026", channel: "Email", status: "Delivered" },
];

export const competitor = "Quanta";
export const period = "Week of May 25–31, 2026";

export function brandStatusStyle(key: Brand["statusKey"]) {
  const map = {
    due: { fg: "#4a43d6", bg: "#efeefb" },
    ok: { fg: "#0f8a52", bg: "#e6f6ee" },
    anomaly: { fg: "#c0353a", bg: "#fdeaea" },
    new: { fg: "#92929d", bg: "#f0f0f4" },
  } as const;
  return map[key] || map.ok;
}

export function visColor(vis: number) {
  return vis >= 50 ? "#0f9a5a" : vis >= 40 ? "#b5781f" : vis > 0 ? "#d93b41" : "#c3c3cc";
}

// ---------- agent roster + run event script ----------
export const agentMeta: Record<string, { name: string; type: string; color: string }> = {
  data: { name: "Data Collector", type: "Deterministic", color: "#1f5fd0" },
  metrics: { name: "Metrics Engine", type: "Deterministic", color: "#1f5fd0" },
  detect: { name: "Anomaly & Wins", type: "Deterministic", color: "#1f5fd0" },
  insight: { name: "Insights Writer", type: "AI", color: "#6b3fd0" },
  aisearch: { name: "AI-Search Analyst", type: "AI", color: "#6b3fd0" },
  recs: { name: "Recommendations", type: "AI", color: "#6b3fd0" },
  fact: { name: "Fact-Checker", type: "Reviewer", color: "#0f9a5a" },
  tone: { name: "Tone & Clarity", type: "Reviewer", color: "#0f9a5a" },
  brand: { name: "Brand & Compliance", type: "Reviewer", color: "#0f9a5a" },
};

export type RunEvent = {
  agent: string;
  type: string;
  text?: string;
  src?: string;
  call?: string;
  args?: string;
  result?: string;
  sev?: "pass" | "warn" | "info";
  section?: string;
  question?: string;
  hint?: string;
  need?: string;
  options?: { key: string; label: string; pitch: string; isOther?: boolean }[];
};

export const runEvents: RunEvent[] = [
  { agent: "orch", type: "plan", text: "Planning run — Data Collector pulls and computes, then Insights Writer drafts. Numbers are locked before any interpretation." },
  { agent: "data", type: "tool", src: "gsc", call: "GSC.searchAnalytics.query", args: "site: acme.com · wk May 25–31", result: "48,200 clicks · 1.2M impressions · pos 14.3" },
  { agent: "data", type: "tool", src: "ga4", call: "GA4.runReport", args: "channel: organic", result: "320 sign-ups · 41% of total" },
  { agent: "data", type: "tool", src: "semrush", call: "Semrush.rankings", args: "18 tracked keywords", result: "184 in top-10" },
  { agent: "data", type: "tool", src: "geo", call: "GEO.mentions", args: "ChatGPT, Perplexity, Gemini, Claude", result: "1 citation lost vs last week" },
  { agent: "data", type: "tool", src: "wordpress", call: "WordPress.posts.list", args: "128 posts", result: "1 stale post flagged" },
  { agent: "data", type: "result", text: "Computed week-over-week deltas deterministically — clicks +12% · sign-ups +9% · AI visibility −4 · WIN #4 “product analytics software” · FLAG stale /blog/2024-saas-metrics." },
  { agent: "data", type: "done", text: "Numbers locked — handing facts to Insights Writer. No recomputation allowed." },
  {
    agent: "orch", type: "interrupt",
    question: "Before Insights Writer drafts — which growth opportunity should this report build the case for?",
    hint: "Your pick steers the narrative and the expansion pitch to the client. Numbers stay the same either way.",
    options: [
      { key: "geo", label: "AI-search visibility", pitch: "Build the case for a GEO retainer" },
      { key: "content", label: "Content refresh", pitch: "Build the case for an editorial program" },
      { key: "competitive", label: "Competitive displacement", pitch: "Build the case for an “Acme vs Quanta” campaign" },
      { key: "other", label: "Other — type your own", pitch: "", isOther: true },
    ],
  },
  { agent: "insight", type: "stream", need: "insight", text: "Acme had a strong organic week — clicks up 12% to 48,200 and sign-ups up 9%, with organic now driving 41% of all sign-ups. The headline win is breaking into the top 5 for “product analytics software.” AI-search visibility slipped 4 points to 38/100 — the clearest gap versus Quanta." },
  { agent: "insight", type: "stream", need: "insight", text: "Drafting three prioritized recommendations aligned to your chosen focus: reclaim the lost AI citation, refresh the stale 2024 metrics post, and ship an Acme-vs-Quanta comparison page." },
  { agent: "orch", type: "handoff", text: "Draft assembled. Dispatching the Fact-Checker before anything reaches you." },
  { agent: "fact", type: "msg", text: "Reconciling every figure against its source…" },
  { agent: "fact", type: "finding", sev: "pass", text: "11 of 12 figures reconciled exactly to source." },
  { agent: "fact", type: "finding", sev: "warn", section: "AI-search read", text: "AI-search −4 vs last week is from limited prompt sampling — flag for human verify." },
  { agent: "orch", type: "complete", text: "Run complete — draft and review ready for your approval." },
];

export const defaultFindings: RunEvent[] = [
  { agent: "fact", type: "finding", sev: "pass", text: "11 of 12 figures reconciled exactly to source." },
  { agent: "fact", type: "finding", sev: "warn", section: "AI-search read", text: "AI-search −4 vs last week is from limited prompt sampling — flag for human verify." },
];

export const sevMap: Record<string, { bg: string; fg: string; label: string; dot: string }> = {
  warn: { bg: "#fdf2e0", fg: "#b5781f", label: "Verify", dot: "#b5781f" },
  info: { bg: "#eef0ff", fg: "#4a43d6", label: "Suggestion", dot: "#5b54f5" },
  pass: { bg: "#e6f6ee", fg: "#0f8a52", label: "Passed", dot: "#0f9a5a" },
};

export const srcMeta: Record<string, { name: string; short: string; meta: string }> = {
  gsc: { name: "Google Search Console", short: "GSC", meta: "clicks · impressions · position" },
  ga4: { name: "Google Analytics 4", short: "GA4", meta: "sessions · conversions" },
  semrush: { name: "Semrush", short: "Semrush", meta: "keyword rankings · share of voice" },
  geo: { name: "GEO", short: "GEO", meta: "AI citations · share of voice · visibility" },
  wordpress: { name: "WordPress", short: "WP", meta: "content freshness" },
};
export const srcKeys = ["gsc", "ga4", "semrush", "geo", "wordpress"] as const;

export const toolMeta: Record<string, string> = {
  anomaly: "Anomaly detection",
  benchmark: "Competitive benchmark",
  citations: "AI-citation tracker",
  freshness: "Content freshness scan",
  attribution: "Conversion attribution",
};
export const toolKeys = ["anomaly", "benchmark", "citations", "freshness", "attribution"] as const;

export const subOrder = ["data", "insight"] as const;
export const revOrder = ["fact"] as const;

export const reviewerDesc: Record<string, string> = {
  fact: "Reconciles every figure against its source.",
  tone: "Checks tone, clarity & readability.",
  brand: "Verifies brand voice & compliance.",
};

export const gsteps = [
  { title: "Ingest data", detail: "Pulling GSC, GA4, Semrush AI, WordPress", kind: "Deterministic" },
  { title: "Compute metrics & deltas", detail: "Clicks, impressions, position, conversions", kind: "Deterministic" },
  { title: "Detect anomalies & wins", detail: "Ranking jumps, traffic shifts, stale content", kind: "Deterministic" },
  { title: "Interpret & draft narrative", detail: "Summary, AI-search read, recommendations", kind: "AI" },
  { title: "Assemble report", detail: "8 sections, source-traced, ready to review", kind: "AI" },
];

// ---------- dashboard / report display data ----------
export const overviewKpis = [
  { label: "Organic clicks", value: "48,200", delta: "▲ 12%", deltaFg: "#0f9a5a", deltaBg: "#e6f6ee", sub: "vs last wk" },
  { label: "Sign-ups", value: "320", delta: "▲ 9%", deltaFg: "#0f9a5a", deltaBg: "#e6f6ee", sub: "vs last wk" },
  { label: "AI visibility", value: "38/100", delta: "▼ 4", deltaFg: "#d93b41", deltaBg: "#fdeaea", sub: "vs last wk" },
  { label: "AI share of voice", value: "14%", delta: "Quanta 29%", deltaFg: "#b5781f", deltaBg: "#fdf2e0", sub: "trails competitor" },
];

export const metricCards = [
  { label: "Organic clicks", value: "48,200", delta: "▲ 12%", deltaFg: "#0f9a5a", deltaBg: "#e6f6ee", source: "GSC", figure: "GSC clicks = 48,200 (prior wk: 43,040)", spark: "0,24 14,22 28,23 42,18 57,15 71,13 86,8 100,5", fill: "0,24 14,22 28,23 42,18 57,15 71,13 86,8 100,5 100,30 0,30" },
  { label: "Impressions", value: "1.2M", delta: "▲ 8%", deltaFg: "#0f9a5a", deltaBg: "#e6f6ee", source: "GSC", figure: "GSC impressions = 1,204,900 (prior wk: 1,115,600)", spark: "0,22 14,21 28,19 43,18 57,15 71,14 86,11 100,9", fill: "0,22 14,21 28,19 43,18 57,15 71,14 86,11 100,9 100,30 0,30" },
  { label: "Avg. position", value: "14.3", delta: "▲ 1.2", deltaFg: "#0f9a5a", deltaBg: "#e6f6ee", source: "GSC", figure: "GSC average position = 14.3 (prior wk: 15.5)", spark: "0,20 14,21 28,18 43,17 57,15 71,14 86,12 100,10", fill: "0,20 14,21 28,18 43,17 57,15 71,14 86,12 100,10 100,30 0,30" },
  { label: "Sign-ups", value: "320", delta: "▲ 9%", deltaFg: "#0f9a5a", deltaBg: "#e6f6ee", source: "GA4", figure: "GA4 organic sign-ups = 320 (prior wk: 294)", spark: "0,23 14,20 28,21 43,17 57,16 71,12 86,11 100,7", fill: "0,23 14,20 28,21 43,17 57,16 71,12 86,11 100,7 100,30 0,30" },
];

export const keywordRows = [
  { kw: "product analytics software", pos: "4", change: "▲ 7", changeColor: "#0f9a5a", vol: "8,100" },
  { kw: "product metrics dashboard", pos: "6", change: "▲ 4", changeColor: "#0f9a5a", vol: "1,900" },
  { kw: "saas analytics platform", pos: "9", change: "▲ 3", changeColor: "#0f9a5a", vol: "3,600" },
  { kw: "event tracking tool", pos: "12", change: "▲ 1", changeColor: "#0f9a5a", vol: "2,200" },
  { kw: "customer data platform", pos: "18", change: "▼ 2", changeColor: "#d93b41", vol: "5,400" },
];

export const pageRows = [
  { path: "/product-analytics-guide", clicks: "12,400", trend: "▲", trendColor: "#0f9a5a", stale: false, note: "" },
  { path: "/blog/event-tracking", clicks: "6,800", trend: "▲", trendColor: "#0f9a5a", stale: false, note: "" },
  { path: "/pricing", clicks: "4,100", trend: "▬", trendColor: "#92929d", stale: false, note: "" },
  { path: "/customer-data-platform", clicks: "3,200", trend: "▲", trendColor: "#0f9a5a", stale: false, note: "" },
  { path: "/blog/2024-saas-metrics", clicks: "2,300", trend: "▼", trendColor: "#d93b41", stale: true, note: "updated 14mo ago" },
];

export const convCards = [
  { label: "Sign-ups", value: "320", delta: "▲ 9%" },
  { label: "Trials started", value: "540", delta: "▲ 11%" },
  { label: "Demos booked", value: "96", delta: "▲ 6%" },
  { label: "Pipeline", value: "$1.4M", delta: "▲ 14%" },
];

export const compBars = [
  { label: "SEO visibility index", acme: "62", quanta: "71", acmePct: "62%", quantaPct: "71%" },
  { label: "Keywords in top 10", acme: "184", quanta: "246", acmePct: "58%", quantaPct: "78%" },
  { label: "AI-search share of voice", acme: "14%", quanta: "29%", acmePct: "14%", quantaPct: "29%" },
];

export const engineBars = [
  { name: "ChatGPT", pct: "16%", color: "#10a37f" },
  { name: "Perplexity", pct: "21%", color: "#20b8cd" },
  { name: "Gemini", pct: "12%", color: "#4a8df6" },
  { name: "Claude", pct: "9%", color: "#d97757" },
];

export const prompts = [
  { text: "best product analytics software", status: "Cited", statusFg: "#0f9a5a", statusBg: "rgba(15,154,90,.18)", engines: "Perplexity, ChatGPT", bg: "rgba(255,255,255,.05)" },
  { text: "product analytics for B2B SaaS", status: "Cited", statusFg: "#0f9a5a", statusBg: "rgba(15,154,90,.18)", engines: "Gemini", bg: "rgba(255,255,255,.05)" },
  { text: "best product analytics tools", status: "Lost", statusFg: "#ff9ea1", statusBg: "rgba(217,59,65,.2)", engines: "was Perplexity", bg: "rgba(217,59,65,.1)" },
  { text: "how to track product usage", status: "Cited", statusFg: "#0f9a5a", statusBg: "rgba(15,154,90,.18)", engines: "Claude", bg: "rgba(255,255,255,.05)" },
];

export const charts = {
  clicksTrend: { pts: "0,40 9,39 18,37 27,38 36,33 45,31 54,32 63,27 72,24 81,20 90,16 100,11", fill: "0,40 9,39 18,37 27,38 36,33 45,31 54,32 63,27 72,24 81,20 90,16 100,11 100,48 0,48" },
  visTrend: { pts: "0,11 20,10 40,11 60,15 80,15 100,18", fill: "0,11 20,10 40,11 60,15 80,15 100,18 100,32 0,32", months: [{ m: "Wk17", v: "46" }, { m: "Wk18", v: "48" }, { m: "Wk19", v: "47" }, { m: "Wk20", v: "42" }, { m: "Wk21", v: "42" }, { m: "Wk22", v: "38" }] },
  citations: [{ m: "Wk19", citedH: "42px", lostH: "5px" }, { m: "Wk20", citedH: "51px", lostH: "0px" }, { m: "Wk21", citedH: "55px", lostH: "5px" }, { m: "Wk22", citedH: "46px", lostH: "9px" }],
};

export const aiTopCards = [
  { title: "Domain share", desc: "Your domain citations relative to other domains", value: "14.0%", delta: "▼ 2.8%", deltaFg: "#c0353a", deltaBg: "#fdeaea", spark: "0,16 18,14 36,15 54,11 72,12 90,7 100,5", fill: "0,16 18,14 36,15 54,11 72,12 90,7 100,5 100,28 0,28" },
  { title: "Brand visibility", desc: "Prompts that mention your brand", value: "38%", delta: "▼ 4 pts", deltaFg: "#c0353a", deltaBg: "#fdeaea", spark: "0,9 18,8 36,12 54,10 72,14 90,12 100,16", fill: "0,9 18,8 36,12 54,10 72,14 90,12 100,16 100,28 0,28" },
];

export const aiDonutGradient = "conic-gradient(#10a37f 0 28%, #20b8cd 28% 64%, #4a8df6 64% 85%, #d97757 85% 100%)";
export const aiDonutLegend = [
  { name: "ChatGPT", c: "#10a37f", v: "28%" },
  { name: "Perplexity", c: "#20b8cd", v: "36%" },
  { name: "Gemini", c: "#4a8df6", v: "21%" },
  { name: "Claude", c: "#d97757", v: "15%" },
];

export const aiMentions = [
  { platform: "ChatGPT", pc: "#10a37f", pi: "C", prompt: "What are the best product analytics tools for B2B SaaS?", comps: [{ i: "Q", c: "#5b54f5" }, { i: "M", c: "#0f9a5a" }, { i: "A", c: "#b5781f" }, { i: "H", c: "#d93b41" }] },
  { platform: "Claude", pc: "#d97757", pi: "C", prompt: "Compare Mixpanel vs Amplitude vs Acme for product teams.", comps: [{ i: "M", c: "#0f9a5a" }, { i: "A", c: "#b5781f" }, { i: "Q", c: "#5b54f5" }] },
  { platform: "Perplexity", pc: "#20b8cd", pi: "P", prompt: "Best product analytics software for a growing startup?", comps: [{ i: "Q", c: "#5b54f5" }, { i: "A", c: "#b5781f" }, { i: "H", c: "#d93b41" }] },
  { platform: "Gemini", pc: "#4a8df6", pi: "G", prompt: "How do I track product usage and retention?", comps: [{ i: "M", c: "#0f9a5a" }, { i: "Q", c: "#5b54f5" }] },
];

// ---------- AI source platforms (Reddit + YouTube) — where AI engines source answers ----------
export const aiSourcePlatforms = [
  {
    platform: "Reddit", initial: "R", color: "#ff4500",
    mentions: 47, delta: "▲ 8", deltaColor: "#0f9a5a",
    sentiment: "Mixed", sentimentFg: "#b5781f", sentimentBg: "#fdf2e0",
    note: "Cited by Perplexity & Google AI Overviews",
    items: [
      { title: "Best product analytics for B2B SaaS in 2026?", sub: "r/SaaS · 320 upvotes", tag: "Acme #2", tagOk: true },
      { title: "Mixpanel vs Amplitude vs Acme — who's winning?", sub: "r/analytics · 180 upvotes", tag: "Acme mentioned", tagOk: true },
      { title: "Moving off Quanta — what are the alternatives?", sub: "r/startups · 95 upvotes", tag: "Acme absent", tagOk: false },
    ],
  },
  {
    platform: "YouTube", initial: "▶", color: "#ff0000",
    mentions: 12, delta: "▲ 3", deltaColor: "#0f9a5a",
    sentiment: "Positive", sentimentFg: "#0f8a52", sentimentBg: "#e6f6ee",
    note: "Surfaced in Gemini & Google video answers",
    items: [
      { title: "Top 5 Product Analytics Tools (2026)", sub: "DataDriven · 84K views", tag: "Acme #3", tagOk: true },
      { title: "Setting up product analytics at a startup", sub: "BuildPublic · 22K views", tag: "Acme featured", tagOk: true },
      { title: "Quanta full walkthrough & review", sub: "SaaS Reviews · 51K views", tag: "Competitor only", tagOk: false },
    ],
  },
];

export const sovDonut = {
  gradient: "conic-gradient(#7d77ff 0 14%, #e0686b 14% 43%, rgba(255,255,255,.12) 43% 100%)",
  legend: [
    { name: "Acme", val: "14%", c: "#7d77ff" },
    { name: "Quanta", val: "29%", c: "#e0686b" },
    { name: "Other tools", val: "57%", c: "rgba(255,255,255,.3)" },
  ],
};

// ---------- AI editable narrative blocks (Agent 4 rewrite targets) ----------
export type AiBlockData = {
  label: string; source: string; confidence: string; figure: string; text: string;
  rewrite: string; lowConfidence?: boolean;
  regen: string[]; tone: Record<string, string>; length: Record<string, string>;
};

export const execBlock: AiBlockData = {
  label: "Executive summary", source: "Semrush AI", confidence: "High",
  figure: "Synthesized from GSC, GA4 & Semrush metrics for May 2026",
  text: 'Acme had a strong organic week. Clicks rose 12% to 48,200 and sign-ups grew 9% to 320, with organic now driving 41% of all sign-ups. The standout win was breaking into the top 5 for "product analytics software" (now #4, up from #11). AI-search visibility slipped 4 points to 38/100 and remains the clearest gap versus Quanta — making it the priority for next week.',
  rewrite: 'May was a strong week for Acme’s organic channel: clicks climbed 12% to 48,200 and organic now accounts for 41% of sign-ups. Ranking #4 for "product analytics software" (up from #11) is the headline win. The one area to watch is AI-search visibility, which dipped to 38/100 and trails Quanta — the focus for next week.',
  regen: [
    'SEO performance accelerated in May. A 12% lift in clicks (48,200) and a 9% rise in sign-ups (320) were led by a breakout ranking for "product analytics software," now #4 from #11. Organic drives 41% of sign-ups. AI-search visibility, down 4 to 38/100, is the gap to close against Quanta.',
    'Acme’s organic channel outperformed in May: 48,200 clicks (+12%), 320 sign-ups (+9%), and a top-5 ranking for "product analytics software." The clear next priority is AI-search visibility (38/100, −4), where Quanta still leads at 29% share of voice versus Acme’s 14%.',
  ],
  tone: {
    formal: 'Last week, Acme recorded a 12% increase in organic clicks (48,200) and a 9% increase in sign-ups (320). Organic search accounted for 41% of total sign-ups. A notable achievement was attaining the #4 position for "product analytics software," improving from #11. AI-search visibility declined by 4 points to 38/100 and represents the primary area for improvement relative to Quanta.',
    warm: 'Great momentum this week! Acme’s organic clicks jumped 12% to 48,200 and sign-ups are up 9% — and organic is now your biggest channel at 41% of sign-ups. The highlight: you cracked the top 5 for "product analytics software," up from #11. The one thing to watch together is AI-search visibility, where there’s real room to grow versus Quanta.',
    confident: 'May was a breakout month. Organic clicks are up 12% to 48,200, sign-ups up 9%, and Acme now owns the #4 spot for "product analytics software" — a six-place leap. Organic is decisively your top channel at 41% of sign-ups. The one frontier left to win is AI search, and the plan below takes it head-on.',
  },
  length: {
    short: 'Strong organic week: clicks +12% (48,200), sign-ups +9% (320), and a top-5 ranking for "product analytics software" (#4, was #11). AI-search visibility (38/100, −4) is the priority for next week.',
    long: 'Acme had a strong organic week across the board. Clicks rose 12% to 48,200 and impressions 8% to 1.2M, while average position improved to 14.3. Sign-ups grew 9% to 320, and organic now drives 41% of all sign-ups — Acme’s largest acquisition channel. The standout win was breaking into the top 5 for "product analytics software," climbing from #11 to #4. The one area of concern is AI-search visibility, which slipped 4 points to 38/100 and continues to trail Quanta (14% vs 29% share of voice). Closing that gap is the clear priority for next week, and the recommendations below are sequenced to address it.',
  },
};

export const aiSearchBlock: AiBlockData = {
  label: "AI-search read", source: "Semrush AI", confidence: "Low", lowConfidence: true,
  figure: "Semrush AI Visibility — sampled across 4 engines, limited prompt coverage",
  text: 'Acme’s AI-search visibility dipped to 38/100, driven mainly by losing the citation for "best product analytics tools" on Perplexity. Quanta is pulling ahead on share of voice (29% vs 14%) by appearing in more comparison-style answers. Strengthening structured, comparison-ready content should help Acme recover cited placements.',
  rewrite: 'The 4-point drop to 38/100 traces almost entirely to one lost citation — "best product analytics tools" on Perplexity. Quanta’s 29% share of voice comes from comparison-style content that AI assistants favor. Recovering Acme’s placements likely depends on structured, head-to-head content.',
  regen: ['AI engines cite Acme less than last month, largely because of a single lost placement for "best product analytics tools." Quanta’s lead (29% vs 14%) is concentrated in comparison queries. Note: prompt sampling is limited this cycle, so treat the −4 movement as directional.'],
  tone: {
    formal: 'AI-search visibility declined to 38/100, attributable primarily to the loss of a citation for "best product analytics tools" on Perplexity. Quanta maintains a higher share of voice (29% versus 14%), largely within comparison-oriented queries.',
    confident: 'The dip to 38/100 is fixable: it’s essentially one lost citation. Quanta wins comparison queries because it publishes comparison content — so will we.',
  },
  length: {
    short: 'AI-search visibility fell to 38/100, mostly from one lost Perplexity citation. Quanta leads on comparison queries (29% vs 14%).',
    long: 'Acme’s AI-search visibility declined 4 points to 38/100 this week. The movement is driven almost entirely by losing the citation for "best product analytics tools" on Perplexity, where Acme had previously appeared. Quanta continues to extend its lead in share of voice (29% versus Acme’s 14%), largely by appearing in comparison-style answers across ChatGPT, Perplexity and Gemini. Because this cycle’s prompt sampling is limited, the −4 figure should be read as directional rather than precise — worth verifying before it’s shared with the client.',
  },
};

export const recBlocks: AiBlockData[] = [
  {
    label: "Recommendation 1 · High priority", source: "Semrush AI", confidence: "High",
    figure: 'Lost citation: "best product analytics tools" (Perplexity), 12,000 monthly prompts',
    text: 'Reclaim AI-search citations for "best product analytics tools." Publish a structured, comparison-ready guide with clear criteria, a comparison table, and schema markup so AI assistants can extract and cite it. Target Perplexity and ChatGPT first.',
    rewrite: 'Win back the "best product analytics tools" citation by publishing a structured comparison guide — clear criteria, a comparison table, and schema — optimized for extraction by Perplexity and ChatGPT.',
    regen: ['Priority #1: rebuild the comparison content that earned Acme its lost Perplexity citation. Lead with a scannable criteria table and FAQ schema so AI engines can cite specific claims.'],
    tone: { formal: 'It is recommended that Acme republish structured comparison content targeting the query "best product analytics tools," incorporating a comparison table and schema markup to facilitate citation by AI search engines.', confident: 'Reclaim "best product analytics tools" now. Ship a definitive comparison guide with a criteria table and schema — built to be the answer AI assistants quote.' },
    length: { short: 'Publish a structured comparison guide for "best product analytics tools" to reclaim AI citations.', long: 'Reclaim AI-search citations for "best product analytics tools," Acme’s most valuable lost placement. Publish a comprehensive, comparison-ready guide built for AI extraction: clear evaluation criteria, a side-by-side comparison table, concise pro/con summaries, and FAQ + Product schema markup. Prioritize Perplexity and ChatGPT, which together account for the majority of relevant prompt volume, and link the asset from the existing /product-analytics-guide hub to pass authority.' },
  },
  {
    label: "Recommendation 2 · Medium priority", source: "WordPress", confidence: "High",
    figure: "WordPress: /blog/2024-saas-metrics last updated 14 months ago, traffic ▼",
    text: 'Refresh the stale "2024 SaaS metrics" post. It’s declining in traffic and dragging topical authority. Update the data to 2026, re-title, add internal links to the product-analytics hub, and re-promote.',
    rewrite: 'Update the aging "2024 SaaS metrics" post: refresh figures to 2026, re-title for the current year, and interlink it to the product-analytics hub to recover lost traffic and authority.',
    regen: ['Give the 2024 SaaS metrics post a full refresh — current data, new title, and internal links — to stop the traffic decline and shore up topical authority.'],
    tone: { formal: 'It is advised that the "2024 SaaS metrics" article be updated with current data and re-optimized, given its declining traffic and age of 14 months.', confident: 'Refresh the 2024 metrics post this week — current data, new title, fresh links. It’s an easy authority win.' },
    length: { short: 'Refresh the stale 2024 SaaS metrics post with current data and internal links.', long: 'Refresh the stale "/blog/2024-saas-metrics" post, last updated 14 months ago and now declining in both traffic and rankings. Update all figures to 2026 benchmarks, re-title to reflect the current year, expand thin sections, and add internal links to the product-analytics hub and the new comparison guide. Re-promote across email and social once live to signal freshness to crawlers.' },
  },
  {
    label: "Recommendation 3 · Medium priority", source: "Semrush AI", confidence: "High",
    figure: "Competitive gap: Quanta 29% vs Acme 14% AI share of voice on comparison queries",
    text: 'Build a head-to-head "Acme vs Quanta" comparison page to capture high-intent, bottom-of-funnel demand and feed AI assistants the structured comparison they currently pull from Quanta.',
    rewrite: 'Publish an "Acme vs Quanta" comparison page to win bottom-of-funnel intent and give AI engines a balanced, structured comparison to cite instead of Quanta’s.',
    regen: ['Create a direct "Acme vs Quanta" comparison to intercept high-intent buyers and the comparison-style answers AI assistants currently source from Quanta.'],
    tone: { formal: 'The development of a comparative "Acme versus Quanta" page is recommended to address high-intent demand and improve representation within AI-generated comparison responses.', confident: 'Go head-to-head: ship an "Acme vs Quanta" page that wins the comparison query — and the AI answer that comes with it.' },
    length: { short: 'Build an "Acme vs Quanta" comparison page for high-intent demand.', long: 'Build a dedicated "Acme vs Quanta" comparison page to capture high-intent, bottom-of-funnel demand and to give AI assistants a structured, citable comparison — the exact content type currently driving Quanta’s 29% share of voice. Include an honest feature matrix, pricing context, migration notes, and customer proof. This both converts comparison shoppers and creates the extractable answer AI engines prefer.' },
  },
];

export const recSummaries = [
  { num: 1, label: "Reclaim the lost AI-search citation", brief: 'Publish a structured, comparison-ready guide for "best product analytics tools" so Perplexity and ChatGPT cite Acme again.' },
  { num: 2, label: "Refresh the stale 2024 metrics post", brief: "Update /blog/2024-saas-metrics to 2026 data, re-title, and interlink to recover traffic and topical authority." },
  { num: 3, label: "Ship an Acme-vs-Quanta comparison page", brief: "Capture high-intent demand and feed AI assistants the structured comparison they currently pull from Quanta." },
];

export const whatNextIntro = "Acme’s organic channel is performing well — the clear gap to close is AI-search visibility versus Quanta. Here’s how we’d prioritize the next two weeks, and where Pepper can take the work off your plate.";

export const pepperServices = [
  { title: "GEO content sprint", tagline: "2-week engagement", desc: "We write and ship the comparison guide and Acme-vs-Quanta page, built for AI extraction." },
  { title: "Content refresh program", tagline: "Monthly retainer", desc: "We keep your top posts current and interlinked so they hold rankings and authority." },
  { title: "AI-visibility monitoring", tagline: "Always-on", desc: "We track citations across ChatGPT, Perplexity, Gemini and Claude and alert on losses." },
];

export const clientItems = [
  "Review the three recommendations and confirm priority order",
  "Approve the comparison-guide brief before we start drafting",
  "Share any product positioning updates vs Quanta",
  "Book the next check-in to review AI-search recovery",
];

export const traceSources = [
  { name: "Google Search Console", fresh: "Fresh · 2h ago" },
  { name: "Google Analytics 4", fresh: "Fresh · 2h ago" },
  { name: "Semrush AI", fresh: "Fresh · 6h ago" },
  { name: "WordPress", fresh: "Fresh · 1h ago" },
];

export const deckSlides = [
  { n: 1, label: "Title" },
  { n: 2, label: "AI-search visibility" },
  { n: 3, label: "SEO results" },
  { n: 4, label: "Recommendations" },
  { n: 5, label: "What's next" },
];
