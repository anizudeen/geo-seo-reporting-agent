"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV = [
  { href: "/brands", label: "Brands" },
  { href: "/reports", label: "Reports" },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-white border-r border-[#e8e8ef] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-[#e8e8ef]">
        <div className="flex items-center gap-2">
          <Image src="/atlas-mark.svg" alt="Atlas" width={22} height={22} />
          <span className="text-sm font-bold tracking-tight text-[#14121f]">Atlas</span>
        </div>
        <div className="ml-auto flex items-center">
          <Image src="/pepper-logo.svg" alt="Pepper" width={52} height={16} />
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="text-[10px] uppercase tracking-widest text-[#8b8b9e] px-2 mb-2 font-semibold">Workspace</p>
        {NAV.map((n) => {
          const active = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                active
                  ? "bg-[#5b54f5]/8 text-[#5b54f5] font-medium"
                  : "text-[#5a5a72] hover:bg-[#f6f6f9] hover:text-[#14121f]"
              }`}
            >
              {n.label === "Brands" && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
                  <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
                  <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
                  <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
                </svg>
              )}
              {n.label === "Reports" && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              )}
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[#e8e8ef]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#5b54f5]/10 flex items-center justify-center text-xs font-bold text-[#5b54f5]">
            KS
          </div>
          <div>
            <p className="text-xs font-semibold text-[#14121f]">Karan Sheth</p>
            <p className="text-[10px] text-[#8b8b9e]">CS Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
