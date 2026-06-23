"use client";

interface AnomalyBannerProps {
  brandName: string;
  desc: string;
  onGenerate?: () => void;
}

export function AnomalyBanner({ brandName, desc, onGenerate }: AnomalyBannerProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-[#fff8f0] border border-[#f76808]/30 rounded-xl">
      <span className="shrink-0 w-5 h-5 rounded-full bg-[#f76808]/15 flex items-center justify-center">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 2v3M5 7.5v.5" stroke="#f76808" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <p className="text-sm text-[#5a5a72] flex-1">
        <span className="font-semibold text-[#14121f]">Anomaly detected</span> · {brandName}: {desc}. Consider an interim report.
      </p>
      {onGenerate && (
        <button
          onClick={onGenerate}
          className="text-xs font-semibold text-[#f76808] whitespace-nowrap hover:underline"
        >
          Generate interim →
        </button>
      )}
    </div>
  );
}
