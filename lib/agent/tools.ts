import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { dataset } from "../data/dataset";

export const getGscData = tool(
  async () => ({
    totalClicks: dataset.gsc.totalClicks,
    clicksDelta: dataset.gsc.clicksDelta,
    avgPosition: dataset.gsc.avgPosition,
    topKeywords: dataset.gsc.keywords.slice(0, 6).map((k) => ({
      keyword: k.keyword,
      position: k.position,
      prevPosition: k.prevPosition,
      change: k.change,
      volume: k.volume,
      clicks: k.clicks,
    })),
    topPages: dataset.gsc.pages.map((p) => ({
      path: p.path,
      clicks: p.clicks,
      stale: p.stale,
      note: p.note,
    })),
    weeklyClicks: dataset.gsc.weeklyClicks,
    note: "IMPORTANT: Google Search Console blends AI Overviews and AI Mode into the 'web' search type. AI-referred traffic cannot be cleanly separated here — AI visibility is reported separately via the AI Visibility tool.",
  }),
  {
    name: "get_gsc_data",
    description: "Fetch Google Search Console organic search performance data",
    schema: z.object({}),
  }
);

export const getGa4Data = tool(
  async () => ({
    sessions: dataset.ga4.sessions,
    sessionsDelta: dataset.ga4.sessionsDelta,
    conversions: dataset.ga4.conversions,
    conversionsDelta: dataset.ga4.conversionsDelta,
    conversionRate: dataset.ga4.conversionRate,
    engagementRate: dataset.ga4.engagementRate,
    organicConversionShare: dataset.ga4.organicConversionShare,
    topSources: dataset.ga4.topSources,
    attributionNote: `IMPORTANT: ~${Math.round(dataset.ga4.darkDirectPct * 100)}% of AI-referred traffic is misattributed to (direct)/(none) because AI engines strip referrer headers. The 'AI Assistant' GA4 channel (May 2026) only captures a fraction. Treat Direct traffic as partly AI-referred and note this caveat explicitly in the report.`,
  }),
  {
    name: "get_ga4_data",
    description: "Fetch GA4 web analytics: sessions, conversions, engagement, and traffic sources",
    schema: z.object({}),
  }
);

export const getSemrushData = tool(
  async () => ({
    authorityScore: dataset.semrush.authorityScore,
    authorityNote: "Authority Score is a composite metric — treat as supporting context, not a headline KPI.",
    totalKeywords: dataset.semrush.totalKeywords,
    keywords: dataset.semrush.keywords,
    topCompetitor: dataset.semrush.topCompetitor,
    competitorKeywords: dataset.semrush.competitorKeywords,
  }),
  {
    name: "get_semrush_data",
    description: "Fetch Semrush organic keyword rankings, position changes, and competitive data",
    schema: z.object({}),
  }
);

export const getAiVisibilityData = tool(
  async () => ({
    visibilityScore: dataset.aiVisibility.visibilityScore,
    visibilityDelta: dataset.aiVisibility.visibilityDelta,
    shareOfVoice: dataset.aiVisibility.shareOfVoice,
    totalPromptsTracked: dataset.aiVisibility.totalPromptsTracked,
    mentionRate: dataset.aiVisibility.mentionRate,
    avgPosition: dataset.aiVisibility.avgPosition,
    sentiment: dataset.aiVisibility.sentiment,
    perEngine: dataset.aiVisibility.perEngine,
    topCompetitors: dataset.aiVisibility.topCompetitors,
    lowConfidence: dataset.aiVisibility.lowConfidence,
    buyerPrompts: dataset.aiVisibility.mentions.map((m) => ({
      platform: m.platform,
      prompt: m.prompt,
      mentioned: m.mentioned,
      position: m.position,
      excerpt: m.excerpt,
      sentiment: m.sentiment,
      competitors: m.competitors,
    })),
    topCitedPages: dataset.aiVisibility.citations.map((c) => ({
      url: c.url,
      title: c.pageTitle,
      citations: c.citationsCount,
      avgPosition: c.avgCitationPosition,
      change: c.changeDelta,
    })),
    sourcePlatforms: [
      { platform: "Reddit", mentions: 47, change: 8, sentiment: "mixed", citedBy: ["Perplexity", "Google AIO"], notes: "Acme appears #2 in 'best product analytics for B2B SaaS' (r/SaaS, 320 upvotes) and in a Mixpanel/Amplitude/Acme comparison (r/analytics); absent from 'moving off Quanta — alternatives' (r/startups). Reddit is a heavily-cited AI source, so winning these threads lifts AI visibility." },
      { platform: "YouTube", mentions: 12, change: 3, sentiment: "positive", citedBy: ["Gemini", "Google AIO"], notes: "Acme ranked #3 in 'Top 5 Product Analytics Tools 2026' (84K views) and featured in a startup setup video; a Quanta walkthrough (51K views) has no Acme mention. YouTube is surfaced in Gemini/Google video answers." },
    ],
    note: "Share of Voice is frequency-based across all tracked prompts — NOT a single-answer position score, which is near-random run to run. Use mention_rate and share_of_voice as the primary metrics. AI engines also source answers from community (Reddit) and video (YouTube) — factor sourcePlatforms into the AI-visibility read and recommendations.",
  }),
  {
    name: "get_ai_visibility_data",
    description: "Fetch AI search visibility: score, share of voice per engine, buyer prompt mentions, citation tracking",
    schema: z.object({}),
  }
);

export const getCmsData = tool(
  async () => ({
    provider: dataset.cms.provider,
    totalPosts: dataset.cms.totalPosts,
    stalePosts: dataset.cms.stalePosts,
    stalePageDetails: dataset.cms.posts
      .filter((p) => p.stale)
      .map((p) => ({ title: p.title, path: p.path, modifiedAt: p.modifiedAt, clicks: p.clicks })),
    topPages: dataset.cms.posts
      .filter((p) => !p.stale)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 3)
      .map((p) => ({ title: p.title, path: p.path, clicks: p.clicks })),
    freshnessNote: "Research shows >70% of AI-cited pages were updated within the last 12 months. Stale pages lose both organic traffic and AI citation eligibility.",
  }),
  {
    name: "get_cms_data",
    description: "Fetch CMS content inventory: stale page detection and freshness signals",
    schema: z.object({}),
  }
);

export const agentTools = [getGscData, getGa4Data, getSemrushData, getAiVisibilityData, getCmsData];
