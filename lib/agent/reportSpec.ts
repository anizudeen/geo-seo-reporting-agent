import { z } from "zod";

export const ReportSpecSchema = z.object({
  clientName: z.string(),
  period: z.string(),
  execSummary: z.object({
    text: z.string(),
    winOfWeek: z.string(),
    watch: z.string(),
  }),
  seo: z.object({
    metrics: z.array(z.object({ label: z.string(), value: z.string(), delta: z.string() })),
    keywordMovers: z.array(z.object({ kw: z.string(), pos: z.number(), change: z.number(), vol: z.number() })),
    topPages: z.array(z.object({ path: z.string(), clicks: z.number(), stale: z.boolean(), note: z.string().optional() })),
    competitorBenchmark: z.array(z.object({ label: z.string(), acme: z.string(), competitor: z.string() })),
    conversionNote: z.string(),
    attributionNote: z.string(),
  }),
  aiVisibility: z.object({
    score: z.number(),
    delta: z.number(),
    sov: z.array(z.object({ brand: z.string(), pct: z.number() })),
    engineBreakdown: z.array(z.object({ name: z.string(), score: z.number(), change: z.number() })),
    mentions: z.array(z.object({ platform: z.string(), prompt: z.string(), competitors: z.array(z.string()) })),
    citationOpportunity: z.string(),
    lowConfidence: z.boolean(),
  }),
  recommendations: z.array(z.object({ num: z.number(), label: z.string(), brief: z.string() })),
  whatNext: z.object({
    pepperHandles: z.array(z.string()),
    selfService: z.array(z.string()),
    services: z.array(z.object({ title: z.string(), tagline: z.string(), desc: z.string() })),
  }),
  slides: z.array(z.object({ slideNum: z.number(), label: z.string() })),
});

export type ReportSpec = z.infer<typeof ReportSpecSchema>;
