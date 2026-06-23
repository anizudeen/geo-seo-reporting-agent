export interface Brand {
  id: string;
  name: string;
  initials: string;
  industry: string;
  domain: string;
  aiVisScore: number;
  aiVisLabel: string;
  aiVisTrend: "up" | "down" | "flat";
  lastReport: string;
  synced: string;
  hasAnomaly: boolean;
  anomalyDesc?: string;
}

export interface Report {
  id: string;
  brandId: string;
  brandName: string;
  initials: string;
  period: string;
  csInitials: string;
  csName: string;
  timeTaken: string;
  sharedOn: string | null;
  createdAt: string;
}

export const brands: Brand[] = [
  {
    id: "acme",
    name: "Acme Analytics",
    initials: "AA",
    industry: "Product Analytics",
    domain: "acmeanalytics.com",
    aiVisScore: 38,
    aiVisLabel: "38 / 100",
    aiVisTrend: "down",
    lastReport: "May 25, 2026",
    synced: "2 min ago",
    hasAnomaly: true,
    anomalyDesc: "organic traffic −18% week-over-week",
  },
  {
    id: "flowbase",
    name: "Flowbase",
    initials: "FB",
    industry: "Design Systems",
    domain: "flowbase.co",
    aiVisScore: 61,
    aiVisLabel: "61 / 100",
    aiVisTrend: "up",
    lastReport: "May 24, 2026",
    synced: "5 min ago",
    hasAnomaly: false,
  },
  {
    id: "clarityhq",
    name: "ClarityHQ",
    initials: "CH",
    industry: "CRO & Analytics",
    domain: "clarityhq.com",
    aiVisScore: 24,
    aiVisLabel: "24 / 100",
    aiVisTrend: "down",
    lastReport: "May 20, 2026",
    synced: "12 min ago",
    hasAnomaly: false,
  },
];

export const reports: Report[] = [
  {
    id: "rep-001",
    brandId: "acme",
    brandName: "Acme Analytics",
    initials: "AA",
    period: "May 25–31, 2026",
    csInitials: "KS",
    csName: "Karan Sheth",
    timeTaken: "58s",
    sharedOn: "Jun 2, 2026",
    createdAt: "Jun 2, 2026",
  },
  {
    id: "rep-002",
    brandId: "flowbase",
    brandName: "Flowbase",
    initials: "FB",
    period: "May 18–24, 2026",
    csInitials: "KS",
    csName: "Karan Sheth",
    timeTaken: "1m 12s",
    sharedOn: null,
    createdAt: "May 26, 2026",
  },
  {
    id: "rep-003",
    brandId: "acme",
    brandName: "Acme Analytics",
    initials: "AA",
    period: "May 18–24, 2026",
    csInitials: "KS",
    csName: "Karan Sheth",
    timeTaken: "54s",
    sharedOn: "May 27, 2026",
    createdAt: "May 27, 2026",
  },
];
