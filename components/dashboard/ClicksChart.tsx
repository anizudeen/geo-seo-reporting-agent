"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { dataset } from "@/lib/data/dataset";

export function ClicksChart() {
  const data = dataset.gsc.weeklyClicks.map((w) => ({ week: w.week, clicks: w.clicks }));

  return (
    <div className="bg-white rounded-2xl border border-[#e8e8ef] px-5 py-4">
      <p className="text-xs font-semibold text-[#8b8b9e] uppercase tracking-wider mb-4">
        Organic clicks · last 12 weeks
      </p>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b54f5" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#5b54f5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#8b8b9e" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#8b8b9e" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 10, fontSize: 12 }}
            formatter={(v) => [(Number(v) || 0).toLocaleString(), "Clicks"]}
          />
          <Area type="monotone" dataKey="clicks" stroke="#5b54f5" strokeWidth={2} fill="url(#clicksGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
