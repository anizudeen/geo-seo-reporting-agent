"use client";

import { AtlasProvider, useAtlas } from "./store";
import { Box, css } from "./ui";
import { BrandsScreen } from "./screens/Brands";
import { ReportsScreen } from "./screens/Reports";
import { DashboardScreen } from "./screens/Dashboard";
import { GenerateScreen } from "./screens/Generate";
import { ReviewScreen } from "./screens/Review";
import { DeliverScreen } from "./screens/Deliver";
import { ClientScreen } from "./screens/Client";

function AddBrandModal() {
  const a = useAtlas();
  if (!a.showAddBrand) return null;
  return (
    <div
      style={{ position: "absolute", inset: 0, background: "rgba(20,18,31,.42)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeUp .2s ease both" }}
      onClick={a.closeAddBrand}
    >
      <div
        style={{ background: "#fff", borderRadius: 18, width: 420, maxWidth: "90vw", padding: 26, boxShadow: "0 30px 70px rgba(20,18,31,.34)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: "#1d1b2e", marginBottom: 4 }}>Add a brand</div>
        <p style={{ margin: "0 0 18px", fontSize: 13, color: "#6f6f7b" }}>Atlas will connect its data sources and begin syncing hourly.</p>
        {([
          ["Brand name", "newBrandName", "setBrandName", "e.g. Northwind Labs"],
          ["Industry", "newBrandIndustry", "setBrandIndustry", "e.g. B2B SaaS"],
          ["Brand domain", "newBrandDomain", "setBrandDomain", "e.g. acme.com"],
        ] as const).map(([label, field, _setter, ph], idx) => (
          <div key={field}>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#5c5c68", marginBottom: 6 }}>{label}</label>
            <input
              value={a[field] as string}
              onChange={(e) => a.set({ [field]: e.target.value })}
              placeholder={ph}
              style={{ width: "100%", fontFamily: "inherit", fontSize: 14, color: "#1d1b2e", background: "#faf9fc", border: "1px solid #e2def0", borderRadius: 10, padding: "11px 13px", outline: "none", marginBottom: idx === 2 ? 22 : 14, boxSizing: "border-box" }}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Box as="button" s="background:#fff;color:#5b5775;border:1px solid #e2def0;border-radius:10px;padding:10px 18px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#f5f5f8" onClick={a.closeAddBrand}>Cancel</Box>
          <Box as="button" s="background:#5b54f5;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-size:13.5px;font-weight:800;cursor:pointer;font-family:inherit" h="background:#4a43d6" onClick={a.addBrand}>Add brand</Box>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const a = useAtlas();
  const open = a.sidebarOpen;
  const asideStyle = (open ? "width:212px;padding:20px 16px;" : "width:66px;padding:20px 10px;align-items:center;") + "flex:none;background:#fff;border-right:1px solid #e8e8ef;display:flex;flex-direction:column;transition:width .18s";
  const logoRowStyle = open ? "display:flex;align-items:center;gap:10px;padding:4px 6px 22px;width:100%" : "display:flex;flex-direction:column;align-items:center;gap:12px;padding:2px 0 20px";
  const toggleBtnStyle = (open ? "margin-left:auto;" : "") + "width:26px;height:26px;border-radius:7px;border:1px solid #e8e8ef;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#92929d;flex:none";
  const navBase = "display:flex;align-items:center;border-radius:9px;font-size:13.5px;cursor:pointer;" + (open ? "gap:11px;padding:10px 12px;" : "gap:0;padding:10px;justify-content:center;");
  const brandsActive = a.screen !== "reports";
  const navBrandsStyle = navBase + (brandsActive ? "background:#f1f1f4;color:#1d1b2e;font-weight:700" : "color:#5f5f6b;font-weight:600");
  const navReportsStyle = navBase + (a.screen === "reports" ? "background:#f1f1f4;color:#1d1b2e;font-weight:700" : "color:#5f5f6b;font-weight:600");
  const profileStyle = "margin-top:auto;display:flex;align-items:center;border-radius:10px;background:#fff;border:1px solid #e8e8ef;cursor:pointer;" + (open ? "gap:10px;padding:9px 11px;" : "justify-content:center;padding:9px");
  const detail = open ? "" : "display:none";

  return (
    <aside style={css(asideStyle)}>
      <div style={css(logoRowStyle)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/atlas-logo.svg" alt="Atlas" style={open ? { height: 22, width: "auto", display: "block" } : { display: "none" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/atlas-mark.svg" alt="Atlas" style={open ? { display: "none" } : { width: 26, height: 26, display: "block" }} />
        <Box as="button" s={toggleBtnStyle} h="background:#f5f5f8" onClick={a.toggleSidebar} title="Toggle sidebar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>
        </Box>
      </div>
      <div style={{ ...css("font-size:10.5px;font-weight:800;letter-spacing:.09em;color:#a7a7b0;text-transform:uppercase;padding:0 6px 9px"), ...css(detail) }}>Workspace</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box s={navBrandsStyle} h={brandsActive ? "" : "background:#f5f5f8"} onClick={a.goBrands} title="Brands">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
          <span style={css(detail)}>Brands</span>
        </Box>
        <Box s={navReportsStyle} h={a.screen === "reports" ? "" : "background:#f5f5f8"} onClick={a.goReports} title="Reports">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></svg>
          <span style={css(detail)}>Reports</span>
        </Box>
      </nav>
      <Box s={profileStyle} h="background:#fafafc" title="Karan Sheth · Customer Success">
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6b63f7,#4a43d6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12.5, flex: "none" }}>KS</div>
        <div style={{ minWidth: 0, flex: 1, ...css(detail) }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1d1b2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Karan Sheth</div>
          <div style={{ fontSize: 11, color: "#86868f", whiteSpace: "nowrap" }}>Customer Success</div>
        </div>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a7a7b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={css(detail)}><path d="M8 9l4-4 4 4M8 15l4 4 4-4" /></svg>
      </Box>
    </aside>
  );
}

function Screens() {
  const a = useAtlas();
  switch (a.screen) {
    case "brands": return <BrandsScreen />;
    case "reports": return <ReportsScreen />;
    case "dashboard": return <DashboardScreen />;
    case "generate": return <GenerateScreen />;
    case "review": return <ReviewScreen />;
    case "deliver": return <DeliverScreen />;
    case "client": return <ClientScreen />;
    default: return <BrandsScreen />;
  }
}

function Shell() {
  return (
    <div style={{ display: "flex", height: "100%", minHeight: "100vh", overflow: "hidden", color: "#14121f", background: "#f6f6f9", position: "relative" }}>
      <AddBrandModal />
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          <Screens />
        </div>
      </div>
    </div>
  );
}

export function AtlasApp() {
  return (
    <AtlasProvider>
      <Shell />
    </AtlasProvider>
  );
}
