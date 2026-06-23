"use client";

import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { dataset } from "@/lib/data/dataset";

interface AiVisibilityCardProps {
  brandId: string;
}

export function AiVisibilityCard({ brandId }: AiVisibilityCardProps) {
  const ai = dataset.aiVisibility;
  const competitors = [
    { name: "Acme", value: Math.round(ai.shareOfVoice * 100) },
    { name: "Quanta", value: Math.round(ai.topCompetitors[0].shareOfVoice * 100) },
    { name: "Mixpanel", value: Math.round(ai.topCompetitors[1].shareOfVoice * 100) },
    { name: "Others", value: 100 - Math.round(ai.shareOfVoice * 100) - Math.round(ai.topCompetitors[0].shareOfVoice * 100) - Math.round(ai.topCompetitors[1].shareOfVoice * 100) },
  ];
  const COLORS = ["#5b54f5", "#4a4a6a", "#6a6a8a", "#2a2a3a"];

  return (
    <div className="bg-[#1d1b2e] rounded-2xl px-5 py-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">AI search visibility</p>
        <Link href={`/brands/${brandId}?tab=ai`} className="text-[10px] text-[#a8a4ff] hover:underline">
          View detail →
        </Link>
      </div>

      <div className="flex items-end gap-2 mb-1">
        <span className="text-4xl font-bold text-[#5b54f5]">{ai.visibilityScore}</span>
        <span className="text-sm text-white/40 mb-1">/ 100</span>
        <span className={`text-xs mb-1.5 font-semibold ${ai.visibilityDelta < 0 ? "text-[#f87171]" : "text-[#4ade80]"}`}>
          {ai.visibilityDelta < 0 ? `▼ ${Math.abs(ai.visibilityDelta)}` : `▲ ${ai.visibilityDelta}`}
        </span>
      </div>
      <p className="text-xs text-white/40 mb-4">vs last week</p>

      <div className="flex items-center gap-4">
        <ResponsiveContainer width={80} height={80}>
          <PieChart>
            <Pie data={competitors} dataKey="value" cx="50%" cy="50%" outerRadius={38} innerRadius={22}>
              {competitors.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#1d1b2e", border: "1px solid #ffffff20", fontSize: 11, color: "#fff", borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5">
          {competitors.map((c, i) => (
            <div key={c.name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
              <span className="text-xs text-white/60">{c.name}</span>
              <span className="text-xs font-semibold text-white/90 ml-auto">{c.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
