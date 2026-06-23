"use client";

import React, { forwardRef, useState } from "react";

/** Parse a CSS declaration string ("display:flex;gap:8px") into a React style object. */
export function css(s?: string): React.CSSProperties {
  const out: Record<string, string> = {};
  if (!s) return out;
  for (const decl of s.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop) continue;
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = val;
  }
  return out as React.CSSProperties;
}

type BoxProps = {
  s?: string; // base style string
  h?: string; // hover style string (merged on hover)
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "style">;

/** A div (or other tag) that takes design inline-style strings, with optional hover styles. */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  { s, h, as = "div", style, children, ...rest },
  ref
) {
  const [hover, setHover] = useState(false);
  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      style={{ ...css(s), ...(hover && h ? css(h) : {}), ...style }}
      onMouseEnter={(e: React.MouseEvent) => {
        if (h) setHover(true);
        rest.onMouseEnter?.(e as React.MouseEvent<HTMLElement>);
      }}
      onMouseLeave={(e: React.MouseEvent) => {
        if (h) setHover(false);
        rest.onMouseLeave?.(e as React.MouseEvent<HTMLElement>);
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
});

/** Pill toggle switch matching the design's sw() helper. */
export function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 34,
        height: 20,
        borderRadius: 999,
        background: on ? "#5b54f5" : "#d3d3da",
        position: "relative",
        transition: "background .15s",
        flex: "none",
        cursor: "pointer",
        border: "none",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 16 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left .15s",
          boxShadow: "0 1px 2px rgba(0,0,0,.2)",
        }}
      />
    </button>
  );
}

/** Small spinner used for in-flight agents/sources. */
export function Spinner({ size = 13, color = "#5b54f5" }: { size?: number; color?: string }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}33`,
        borderTopColor: color,
        display: "inline-block",
        animation: "absp .7s linear infinite",
        flex: "none",
      }}
    />
  );
}
