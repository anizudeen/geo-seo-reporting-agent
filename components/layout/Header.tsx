"use client";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href: string }[];
}

export function Header({ title, subtitle, actions, breadcrumb }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 h-14 border-b border-[#e8e8ef] bg-white shrink-0">
      <div>
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-xs text-[#8b8b9e] mb-0.5">
            {breadcrumb.map((b, i) => (
              <span key={b.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[#d0d0dc]">/</span>}
                <a href={b.href} className="hover:text-[#5b54f5] transition-colors">{b.label}</a>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <h1 className="text-sm font-semibold text-[#14121f]">{title}</h1>
          {subtitle && <span className="text-xs text-[#8b8b9e]">{subtitle}</span>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
