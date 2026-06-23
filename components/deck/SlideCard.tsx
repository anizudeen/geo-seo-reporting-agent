"use client";

import type { ReportSpec } from "@/lib/agent/reportSpec";
import { dataset } from "@/lib/data/dataset";

function formatPct(n: number) { return `${Math.round(n * 100)}%`; }

interface SlideCardProps {
  slideNum: number;
  spec: ReportSpec;
}

export function SlideCard({ slideNum, spec }: SlideCardProps) {
  const ai = dataset.aiVisibility;

  if (slideNum === 0) {
    // Cover
    return (
      <div className="w-full aspect-video bg-[#1d1b2e] rounded-xl overflow-hidden relative flex flex-col justify-center px-12">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5b54f5]" />
        <p className="text-white/40 text-sm mb-2">Weekly Performance Report · {spec.period}</p>
        <h1 className="text-white text-3xl font-bold">{spec.clientName}</h1>
        <p className="text-white/30 text-xs mt-8">Prepared by Pepper · Atlas Reporting Agent</p>
      </div>
    );
  }

  if (slideNum === 1) {
    // AI visibility
    return (
      <div className="w-full aspect-video bg-[#1d1b2e] rounded-xl overflow-hidden relative px-12 py-8">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5b54f5]" />
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">01</p>
        <h2 className="text-white text-xl font-bold mb-6">Your visibility in AI search</h2>
        <div className="flex items-end gap-3 mb-1">
          <span className="text-[#5b54f5] text-6xl font-bold">{ai.visibilityScore}</span>
          <span className="text-white/40 text-lg mb-2">/ 100</span>
          <span className="text-[#f87171] text-sm font-semibold mb-2">▼ {Math.abs(ai.visibilityDelta)}</span>
        </div>
        <p className="text-white/50 text-xs mb-5">
          SoV: {formatPct(ai.shareOfVoice)} · Quanta: {formatPct(ai.topCompetitors[0].shareOfVoice)} · {ai.totalPromptsTracked} prompts tracked
        </p>
        <p className="text-white/70 text-xs leading-relaxed max-w-lg">{spec.aiVisibility?.citationOpportunity}</p>

        <div className="absolute right-12 top-8 bottom-8 w-48">
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Per engine</p>
          {ai.perEngine.map((e) => (
            <div key={e.engine} className="flex items-center justify-between mb-1.5">
              <span className="text-white/50 text-[11px]">{e.engine}</span>
              <div className="flex gap-1.5 items-center">
                <span className="text-white text-[11px] font-semibold">{e.visibilityScore}</span>
                <span className={`text-[10px] ${e.change < 0 ? "text-[#f87171]" : "text-[#4ade80]"}`}>
                  {e.change < 0 ? `▼${Math.abs(e.change)}` : `▲${e.change}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slideNum === 2) {
    // SEO results
    const kpis = spec.seo.metrics.slice(0, 3);
    return (
      <div className="w-full aspect-video bg-white rounded-xl overflow-hidden relative px-12 py-8 border border-[#e8e8ef]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5b54f5]" />
        <p className="text-[#8b8b9e] text-xs uppercase tracking-widest mb-1">02</p>
        <h2 className="text-[#14121f] text-xl font-bold mb-6">Results this week</h2>
        <div className="grid grid-cols-3 gap-6 mb-5">
          {kpis.map((m) => (
            <div key={m.label}>
              <p className="text-2xl font-bold text-[#14121f]">{m.value}</p>
              <p className="text-xs text-[#8b8b9e] mt-0.5">{m.label}</p>
              <p className={`text-xs font-semibold mt-0.5 ${m.delta.startsWith("+") || m.delta.startsWith("▲") ? "text-[#0f9a5a]" : "text-[#e5484d]"}`}>{m.delta}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-[#14121f] font-semibold mb-1">{spec.execSummary.winOfWeek}</p>
        <p className="text-xs text-[#5a5a72]">{spec.seo.conversionNote}</p>
      </div>
    );
  }

  if (slideNum === 3) {
    // Recommendations
    return (
      <div className="w-full aspect-video bg-white rounded-xl overflow-hidden relative px-12 py-8 border border-[#e8e8ef]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5b54f5]" />
        <p className="text-[#8b8b9e] text-xs uppercase tracking-widest mb-1">03</p>
        <h2 className="text-[#14121f] text-xl font-bold mb-6">Your next steps for next week</h2>
        <div className="space-y-5">
          {spec.recommendations.map((r) => (
            <div key={r.num} className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-[#5b54f5]/10 flex items-center justify-center text-sm font-bold text-[#5b54f5] shrink-0">{r.num}</span>
              <div>
                <p className="text-sm font-bold text-[#14121f]">{r.label}</p>
                <p className="text-xs text-[#5a5a72] mt-0.5">{r.brief}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slideNum === 4) {
    // What's next
    return (
      <div className="w-full aspect-video bg-white rounded-xl overflow-hidden relative px-12 py-8 border border-[#e8e8ef]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5b54f5]" />
        <p className="text-[#8b8b9e] text-xs uppercase tracking-widest mb-1">04</p>
        <h2 className="text-[#14121f] text-xl font-bold mb-6">What's next &amp; how we can help</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold text-[#5b54f5] uppercase tracking-wider mb-3">Pepper handles it</p>
            <ul className="space-y-2">
              {spec.whatNext.pepperHandles.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-[#14121f]">
                  <span className="text-[#0f9a5a] shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-[#8b8b9e] uppercase tracking-wider mb-3">Your team handles it</p>
            <ul className="space-y-2">
              {spec.whatNext.selfService.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-[#5a5a72]">
                  <span className="shrink-0">☐</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-[#f6f6f9] rounded-xl border border-[#e8e8ef] flex items-center justify-center">
      <p className="text-[#8b8b9e] text-sm">Slide {slideNum + 1}</p>
    </div>
  );
}
