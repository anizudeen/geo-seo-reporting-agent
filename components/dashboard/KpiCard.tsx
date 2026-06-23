"use client";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  sub?: string;
}

export function KpiCard({ label, value, delta, positive, sub }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e8ef] px-5 py-4 flex flex-col gap-1">
      <span className="text-xs font-medium text-[#8b8b9e] uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-bold text-[#14121f] leading-none">{value}</span>
      <div className="flex items-center gap-2">
        {delta && (
          <span className={`text-xs font-semibold ${positive !== false ? "text-[#0f9a5a]" : "text-[#e5484d]"}`}>
            {delta}
          </span>
        )}
        {sub && <span className="text-xs text-[#8b8b9e]">{sub}</span>}
      </div>
    </div>
  );
}
