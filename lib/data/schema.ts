import { z } from "zod";

export const GscKeywordSchema = z.object({
  keyword: z.string(),
  clicks: z.number(),
  impressions: z.number(),
  ctr: z.number(),
  position: z.number(),
  prevPosition: z.number(),
  change: z.number(),
  volume: z.number(),
});

export const GscPageSchema = z.object({
  path: z.string(),
  clicks: z.number(),
  impressions: z.number(),
  ctr: z.number(),
  position: z.number(),
  stale: z.boolean(),
  note: z.string().optional(),
});

export const GscWeeklyClickSchema = z.object({
  week: z.string(),
  clicks: z.number(),
});

export const GscDataSchema = z.object({
  totalClicks: z.number(),
  totalImpressions: z.number(),
  avgCtr: z.number(),
  avgPosition: z.number(),
  clicksDelta: z.number(),
  weeklyClicks: z.array(GscWeeklyClickSchema),
  keywords: z.array(GscKeywordSchema),
  pages: z.array(GscPageSchema),
});

export const Ga4DataSchema = z.object({
  sessions: z.number(),
  sessionsDelta: z.number(),
  conversions: z.number(),
  conversionsDelta: z.number(),
  conversionRate: z.number(),
  engagementRate: z.number(),
  darkDirectPct: z.number(),
  organicConversionShare: z.number(),
  topSources: z.array(z.object({ source: z.string(), sessions: z.number() })),
});

export const SemrushKeywordSchema = z.object({
  keyword: z.string(),
  position: z.number(),
  prevPosition: z.number(),
  change: z.number(),
  volume: z.number(),
  kd: z.number(),
  intent: z.string(),
  url: z.string(),
});

export const SemrushDataSchema = z.object({
  authorityScore: z.number(),
  totalKeywords: z.number(),
  estimatedTraffic: z.number(),
  keywords: z.array(SemrushKeywordSchema),
  topCompetitor: z.string(),
  competitorKeywords: z.number(),
});

export const AiVisibilityEngineSchema = z.object({
  engine: z.string(),
  visibilityScore: z.number(),
  shareOfVoice: z.number(),
  mentionRate: z.number(),
  avgPosition: z.number(),
  change: z.number(),
});

export const AiMentionSchema = z.object({
  platform: z.string(),
  prompt: z.string(),
  mentioned: z.boolean(),
  position: z.number().nullable(),
  excerpt: z.string(),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  competitors: z.array(z.string()),
  capturedAt: z.string(),
});

export const AiCitationSchema = z.object({
  url: z.string(),
  pageTitle: z.string(),
  citationsCount: z.number(),
  avgCitationPosition: z.number(),
  changeDelta: z.number(),
});

export const AiVisibilityDataSchema = z.object({
  visibilityScore: z.number(),
  visibilityDelta: z.number(),
  shareOfVoice: z.number(),
  totalPromptsTracked: z.number(),
  mentionRate: z.number(),
  avgPosition: z.number(),
  sentiment: z.object({ positive: z.number(), neutral: z.number(), negative: z.number() }),
  perEngine: z.array(AiVisibilityEngineSchema),
  topCompetitors: z.array(z.object({ name: z.string(), shareOfVoice: z.number(), change: z.number() })),
  lowConfidence: z.boolean(),
  mentions: z.array(AiMentionSchema),
  citations: z.array(AiCitationSchema),
});

export const CmsPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  path: z.string(),
  status: z.string(),
  publishedAt: z.string(),
  modifiedAt: z.string(),
  stale: z.boolean(),
  clicks: z.number(),
});

export const CmsDataSchema = z.object({
  provider: z.enum(["wordpress", "webflow", "contentful"]),
  totalPosts: z.number(),
  stalePosts: z.number(),
  posts: z.array(CmsPostSchema),
});

export const DatasetSchema = z.object({
  brandName: z.string(),
  brandDomain: z.string(),
  industry: z.string(),
  period: z.string(),
  gsc: GscDataSchema,
  ga4: Ga4DataSchema,
  semrush: SemrushDataSchema,
  aiVisibility: AiVisibilityDataSchema,
  cms: CmsDataSchema,
});

export type GscData = z.infer<typeof GscDataSchema>;
export type Ga4Data = z.infer<typeof Ga4DataSchema>;
export type SemrushData = z.infer<typeof SemrushDataSchema>;
export type AiVisibilityData = z.infer<typeof AiVisibilityDataSchema>;
export type CmsData = z.infer<typeof CmsDataSchema>;
export type Dataset = z.infer<typeof DatasetSchema>;
