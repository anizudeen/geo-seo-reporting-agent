"use client";

import { useState } from "react";

interface AddBrandModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddBrandModal({ open, onClose }: AddBrandModalProps) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [domain, setDomain] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
        <h2 className="text-base font-bold text-[#14121f] mb-5">Add brand</h2>

        <label className="block text-xs font-medium text-[#5a5a72] mb-1">Brand name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Acme Analytics"
          className="w-full border border-[#e8e8ef] rounded-lg px-3 py-2 text-sm text-[#14121f] mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b54f5]/40"
        />

        <label className="block text-xs font-medium text-[#5a5a72] mb-1">Industry</label>
        <input
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="e.g. Product Analytics"
          className="w-full border border-[#e8e8ef] rounded-lg px-3 py-2 text-sm text-[#14121f] mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b54f5]/40"
        />

        <label className="block text-xs font-medium text-[#5a5a72] mb-1">Brand domain</label>
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g. acmeanalytics.com"
          className="w-full border border-[#e8e8ef] rounded-lg px-3 py-2 text-sm text-[#14121f] mb-6 focus:outline-none focus:ring-2 focus:ring-[#5b54f5]/40"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#5a5a72] hover:text-[#14121f] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#5b54f5] text-white text-sm font-semibold rounded-lg hover:bg-[#4240c4] transition-colors"
          >
            Add brand
          </button>
        </div>
      </div>
    </div>
  );
}
