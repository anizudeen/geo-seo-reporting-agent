import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas — Pepper",
  description: "AI-powered client reporting for organic and AI search visibility",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ minHeight: "100%" }}>{children}</body>
    </html>
  );
}
