import type { Dataset } from "./schema";

// Golden dataset — Acme Analytics demo scenario
// Fixed values (not using the RNG directly) so numbers are always identical
// and match what's shown in the design: 38/100 AI visibility, 48,200 clicks, etc.

export const dataset: Dataset = {
  brandName: "Acme Analytics",
  brandDomain: "acmeanalytics.com",
  industry: "Product Analytics",
  period: "May 25–31, 2026",

  gsc: {
    totalClicks: 48200,
    totalImpressions: 612000,
    avgCtr: 0.079,
    avgPosition: 8.4,
    clicksDelta: 12,
    weeklyClicks: [
      { week: "Mar 1", clicks: 31200 },
      { week: "Mar 8", clicks: 33800 },
      { week: "Mar 15", clicks: 32400 },
      { week: "Mar 22", clicks: 35100 },
      { week: "Mar 29", clicks: 34600 },
      { week: "Apr 5", clicks: 36200 },
      { week: "Apr 12", clicks: 37800 },
      { week: "Apr 19", clicks: 39100 },
      { week: "Apr 26", clicks: 41200 },
      { week: "May 10", clicks: 43800 },
      { week: "May 17", clicks: 45600 },
      { week: "May 31", clicks: 48200 },
    ],
    keywords: [
      { keyword: "product analytics software", clicks: 4200, impressions: 28000, ctr: 0.15, position: 4, prevPosition: 11, change: -7, volume: 22000 },
      { keyword: "user behavior analytics", clicks: 3100, impressions: 24000, ctr: 0.13, position: 6, prevPosition: 8, change: -2, volume: 18000 },
      { keyword: "event tracking tool", clicks: 2800, impressions: 19000, ctr: 0.15, position: 5, prevPosition: 5, change: 0, volume: 14000 },
      { keyword: "best product analytics tools", clicks: 1200, impressions: 18000, ctr: 0.067, position: 14, prevPosition: 12, change: 2, volume: 9500 },
      { keyword: "funnel analysis software", clicks: 2400, impressions: 17000, ctr: 0.14, position: 7, prevPosition: 9, change: -2, volume: 12000 },
      { keyword: "retention analytics platform", clicks: 1900, impressions: 14000, ctr: 0.136, position: 8, prevPosition: 11, change: -3, volume: 8200 },
      { keyword: "mobile analytics sdk", clicks: 1600, impressions: 13000, ctr: 0.123, position: 9, prevPosition: 7, change: 2, volume: 7600 },
      { keyword: "cohort analysis tool", clicks: 1400, impressions: 12000, ctr: 0.117, position: 11, prevPosition: 14, change: -3, volume: 6800 },
    ],
    pages: [
      { path: "/product-analytics-guide", clicks: 8200, impressions: 54000, ctr: 0.152, position: 3.2, stale: false },
      { path: "/features/funnel-analysis", clicks: 6100, impressions: 42000, ctr: 0.145, position: 4.8, stale: false },
      { path: "/blog/2024-saas-metrics", clicks: 3200, impressions: 38000, ctr: 0.084, position: 7.1, stale: true, note: "Last updated Dec 2024 — 180+ days" },
      { path: "/vs-mixpanel", clicks: 4800, impressions: 31000, ctr: 0.155, position: 5.6, stale: false },
      { path: "/blog/event-tracking-best-practices", clicks: 2900, impressions: 28000, ctr: 0.104, position: 8.2, stale: true, note: "Last updated Oct 2024 — 240+ days" },
      { path: "/pricing", clicks: 5400, impressions: 22000, ctr: 0.245, position: 2.1, stale: false },
    ],
  },

  ga4: {
    sessions: 124000,
    sessionsDelta: 8,
    conversions: 320,
    conversionsDelta: 9,
    conversionRate: 0.0026,
    engagementRate: 0.64,
    darkDirectPct: 0.31,
    organicConversionShare: 0.41,
    topSources: [
      { source: "google / organic", sessions: 68400 },
      { source: "(direct) / (none)", sessions: 32100 },
      { source: "google / cpc", sessions: 9800 },
      { source: "linkedin.com / referral", sessions: 6200 },
      { source: "perplexity.ai / referral", sessions: 4100 },
    ],
  },

  semrush: {
    authorityScore: 52,
    totalKeywords: 4820,
    estimatedTraffic: 48200,
    keywords: [
      { keyword: "product analytics software", position: 4, prevPosition: 11, change: -7, volume: 22000, kd: 68, intent: "commercial", url: "/product-analytics-guide" },
      { keyword: "user behavior analytics", position: 6, prevPosition: 8, change: -2, volume: 18000, kd: 61, intent: "commercial", url: "/features" },
      { keyword: "best product analytics tools", position: 14, prevPosition: 12, change: 2, volume: 9500, kd: 72, intent: "commercial", url: "/product-analytics-guide" },
      { keyword: "mobile analytics sdk", position: 9, prevPosition: 7, change: 2, volume: 7600, kd: 54, intent: "informational", url: "/sdk" },
      { keyword: "cohort analysis tool", position: 11, prevPosition: 14, change: -3, volume: 6800, kd: 58, intent: "commercial", url: "/features/cohorts" },
      { keyword: "funnel analysis software", position: 7, prevPosition: 9, change: -2, volume: 12000, kd: 65, intent: "commercial", url: "/features/funnel-analysis" },
    ],
    topCompetitor: "Quanta",
    competitorKeywords: 6240,
  },

  aiVisibility: {
    visibilityScore: 38,
    visibilityDelta: -4,
    shareOfVoice: 0.14,
    totalPromptsTracked: 180,
    mentionRate: 0.42,
    avgPosition: 2.8,
    sentiment: { positive: 0.61, neutral: 0.33, negative: 0.06 },
    perEngine: [
      { engine: "ChatGPT", visibilityScore: 41, shareOfVoice: 0.16, mentionRate: 0.48, avgPosition: 2.4, change: -2 },
      { engine: "Perplexity", visibilityScore: 36, shareOfVoice: 0.13, mentionRate: 0.39, avgPosition: 3.1, change: -6 },
      { engine: "Google AIO", visibilityScore: 42, shareOfVoice: 0.15, mentionRate: 0.44, avgPosition: 2.6, change: -1 },
      { engine: "Copilot", visibilityScore: 29, shareOfVoice: 0.09, mentionRate: 0.31, avgPosition: 3.8, change: -8 },
      { engine: "Claude", visibilityScore: 44, shareOfVoice: 0.17, mentionRate: 0.46, avgPosition: 2.2, change: 3 },
    ],
    topCompetitors: [
      { name: "Quanta", shareOfVoice: 0.29, change: 4 },
      { name: "Mixpanel", shareOfVoice: 0.22, change: -1 },
      { name: "Amplitude", shareOfVoice: 0.18, change: 2 },
    ],
    lowConfidence: false,
    mentions: [
      {
        platform: "Perplexity",
        prompt: "best product analytics tools for SaaS startups",
        mentioned: false,
        position: null,
        excerpt: "For SaaS startups, Quanta and Mixpanel are most frequently recommended. Amplitude offers strong retention analytics...",
        sentiment: "neutral",
        competitors: ["Quanta", "Mixpanel", "Amplitude"],
        capturedAt: "2026-05-30T14:22:00Z",
      },
      {
        platform: "ChatGPT",
        prompt: "what product analytics software should I use for a B2B SaaS company",
        mentioned: true,
        position: 2,
        excerpt: "Acme Analytics is well-regarded for its funnel analysis and event tracking, particularly for mid-market B2B SaaS...",
        sentiment: "positive",
        competitors: ["Quanta", "Mixpanel"],
        capturedAt: "2026-05-29T09:11:00Z",
      },
      {
        platform: "Google AIO",
        prompt: "product analytics platform comparison",
        mentioned: true,
        position: 3,
        excerpt: "...Acme Analytics offers competitive pricing and strong cohort analysis. Quanta leads on AI-powered insights...",
        sentiment: "neutral",
        competitors: ["Quanta", "Amplitude", "Heap"],
        capturedAt: "2026-05-31T16:45:00Z",
      },
    ],
    citations: [
      { url: "https://acmeanalytics.com/product-analytics-guide", pageTitle: "The Complete Guide to Product Analytics", citationsCount: 28, avgCitationPosition: 1.4, changeDelta: 3 },
      { url: "https://acmeanalytics.com/features/funnel-analysis", pageTitle: "Funnel Analysis — Acme Analytics", citationsCount: 14, avgCitationPosition: 2.1, changeDelta: -2 },
      { url: "https://acmeanalytics.com/blog/event-tracking-best-practices", pageTitle: "Event Tracking Best Practices 2024", citationsCount: 9, avgCitationPosition: 2.8, changeDelta: -5 },
    ],
  },

  cms: {
    provider: "wordpress",
    totalPosts: 148,
    stalePosts: 2,
    posts: [
      { id: 1, title: "The Complete Guide to Product Analytics", path: "/product-analytics-guide", status: "publish", publishedAt: "2025-03-12T00:00:00Z", modifiedAt: "2026-05-15T00:00:00Z", stale: false, clicks: 8200 },
      { id: 2, title: "2024 SaaS Metrics Benchmarks", path: "/blog/2024-saas-metrics", status: "publish", publishedAt: "2024-12-01T00:00:00Z", modifiedAt: "2024-12-01T00:00:00Z", stale: true, clicks: 3200 },
      { id: 3, title: "Event Tracking Best Practices", path: "/blog/event-tracking-best-practices", status: "publish", publishedAt: "2024-10-14T00:00:00Z", modifiedAt: "2024-10-14T00:00:00Z", stale: true, clicks: 2900 },
      { id: 4, title: "Funnel Analysis Explained", path: "/features/funnel-analysis", status: "publish", publishedAt: "2025-01-20T00:00:00Z", modifiedAt: "2026-04-02T00:00:00Z", stale: false, clicks: 6100 },
    ],
  },
};
