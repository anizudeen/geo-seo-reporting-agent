import type { ReportSpec } from "@/lib/agent/reportSpec";

// Deterministic golden ReportSpec matching the Acme demo numbers.
// Drives the real pptxgenjs export (lib/deck/buildDeck.ts) with no LLM call.
export const goldenReportSpec: ReportSpec = {
  clientName: "Acme Analytics",
  period: "Week of May 25–31, 2026",
  execSummary: {
    text:
      'Acme had a strong organic week. Clicks rose 12% to 48,200 and sign-ups grew 9% to 320, with organic now driving 41% of all sign-ups. The standout win was breaking into the top 5 for "product analytics software" (now #4, up from #11). AI-search visibility slipped 4 points to 38/100 and remains the clearest gap versus Quanta — making it the priority for next week.',
    winOfWeek: '#4 for "product analytics software", up from #11',
    watch: 'Lost the "best product analytics tools" citation on Perplexity',
  },
  seo: {
    metrics: [
      { label: "Organic clicks", value: "48,200", delta: "▲ 12%" },
      { label: "Impressions", value: "1.2M", delta: "▲ 8%" },
      { label: "Avg. position", value: "14.3", delta: "▲ 1.2" },
      { label: "Sign-ups", value: "320", delta: "▲ 9%" },
    ],
    keywordMovers: [
      { kw: "product analytics software", pos: 4, change: 7, vol: 8100 },
      { kw: "product metrics dashboard", pos: 6, change: 4, vol: 1900 },
      { kw: "saas analytics platform", pos: 9, change: 3, vol: 3600 },
      { kw: "event tracking tool", pos: 12, change: 1, vol: 2200 },
      { kw: "customer data platform", pos: 18, change: -2, vol: 5400 },
    ],
    topPages: [
      { path: "/product-analytics-guide", clicks: 12400, stale: false },
      { path: "/blog/event-tracking", clicks: 6800, stale: false },
      { path: "/pricing", clicks: 4100, stale: false },
      { path: "/customer-data-platform", clicks: 3200, stale: false },
      { path: "/blog/2024-saas-metrics", clicks: 2300, stale: true, note: "updated 14mo ago" },
    ],
    competitorBenchmark: [
      { label: "SEO visibility index", acme: "62", competitor: "71" },
      { label: "Keywords in top 10", acme: "184", competitor: "246" },
      { label: "AI-search share of voice", acme: "14%", competitor: "29%" },
    ],
    conversionNote: "Organic search drove 41% of all sign-ups this week — Acme's largest acquisition channel.",
    attributionNote: "~30% of GA4 'direct' traffic is likely dark AI-assistant referral — attribution understates AI-search impact.",
  },
  aiVisibility: {
    score: 38,
    delta: -4,
    sov: [
      { brand: "Acme", pct: 14 },
      { brand: "Quanta", pct: 29 },
    ],
    engineBreakdown: [
      { name: "ChatGPT", score: 16, change: -2 },
      { name: "Perplexity", score: 21, change: -6 },
      { name: "Gemini", score: 12, change: -1 },
      { name: "Claude", score: 9, change: 3 },
    ],
    mentions: [
      { platform: "ChatGPT", prompt: "What are the best product analytics tools for B2B SaaS?", competitors: ["Quanta", "Mixpanel", "Amplitude"] },
      { platform: "Claude", prompt: "Compare Mixpanel vs Amplitude vs Acme for product teams.", competitors: ["Mixpanel", "Amplitude", "Quanta"] },
      { platform: "Perplexity", prompt: "Best product analytics software for a growing startup?", competitors: ["Quanta", "Amplitude"] },
    ],
    citationOpportunity: 'Reclaim the lost "best product analytics tools" citation on Perplexity with a structured comparison guide.',
    lowConfidence: false,
  },
  recommendations: [
    { num: 1, label: "Reclaim the lost AI-search citation", brief: 'Publish a structured, comparison-ready guide for "best product analytics tools" so Perplexity and ChatGPT cite Acme again.' },
    { num: 2, label: "Refresh the stale 2024 metrics post", brief: "Update /blog/2024-saas-metrics to 2026 data, re-title, and interlink to recover traffic and topical authority." },
    { num: 3, label: "Ship an Acme-vs-Quanta comparison page", brief: "Capture high-intent demand and feed AI assistants the structured comparison they currently pull from Quanta." },
  ],
  whatNext: {
    pepperHandles: ["Publish the AI-visibility comparison guide", "Refresh & re-promote the stale metrics post", "Build the Acme vs Quanta comparison page"],
    selfService: ["Assign a writer to the comparison guide brief", "Update the 2024 metrics post in your CMS", "Publish the Acme vs Quanta page"],
    services: [
      { title: "GEO content sprint", tagline: "2-week engagement", desc: "We write and ship the comparison guide and Acme-vs-Quanta page, built for AI extraction." },
      { title: "Content refresh program", tagline: "Monthly retainer", desc: "We keep your top posts current and interlinked so they hold rankings and authority." },
      { title: "AI-visibility monitoring", tagline: "Always-on", desc: "We track citations across ChatGPT, Perplexity, Gemini and Claude and alert on losses." },
    ],
  },
  slides: [
    { slideNum: 1, label: "Title" },
    { slideNum: 2, label: "AI-search visibility" },
    { slideNum: 3, label: "Organic results" },
    { slideNum: 4, label: "Recommendations" },
    { slideNum: 5, label: "What's next" },
  ],
};
