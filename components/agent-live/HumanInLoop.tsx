"use client";

import type { ProgressEvent } from "@/lib/agent/graph";

interface HumanInLoopProps {
  event: ProgressEvent;
  onChoose: (label: string) => void;
}

export function HumanInLoop({ event, onChoose }: HumanInLoopProps) {
  return (
    <div className="rounded-xl border border-[#5b54f5]/40 bg-[#5b54f5]/5 px-5 py-4 my-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 rounded-full bg-[#5b54f5] flex items-center justify-center shrink-0">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 2v3M5 7.5v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-xs font-semibold text-[#5b54f5]">Human in the loop · {event.agent}</span>
      </div>
      <p className="text-sm font-semibold text-[#14121f] mb-1">{event.question}</p>
      {event.hint && <p className="text-xs text-[#5a5a72] mb-3">{event.hint}</p>}
      <div className="flex gap-2 flex-wrap">
        {event.options?.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onChoose(opt.label)}
            className="flex flex-col items-start px-4 py-2.5 rounded-lg border border-[#e8e8ef] bg-white hover:border-[#5b54f5] hover:shadow-sm transition-all text-left"
          >
            <span className="text-xs font-semibold text-[#14121f]">{opt.label}</span>
            <span className="text-[10px] text-[#8b8b9e] mt-0.5">{opt.pitch}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
