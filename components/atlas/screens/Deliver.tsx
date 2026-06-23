"use client";

import { useAtlas } from "../store";
import { Box } from "../ui";
import { DeckSlide } from "../DeckSlide";
import { deckSlides } from "@/lib/atlas/data";
import { exportDeck } from "@/lib/atlas/export";

function deckTitleOf(brand: string, custom: string) {
  return custom.trim() || `${brand} — Weekly report`;
}
function emailFor(name: string, brand: string) {
  const slug = brand.toLowerCase().replace(/[^a-z]/g, "");
  return `${name.split(" ")[0].toLowerCase()}@${slug || "client"}.com`;
}
function initialsOf(name: string) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function DeckStep() {
  const a = useAtlas();
  const title = deckTitleOf(a.selectedBrand, a.deckTitle);
  return (
    <div>
      <Box as="button" s="display:inline-flex;align-items:center;gap:6px;background:none;border:none;color:#86868f;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;margin-bottom:14px" h="color:#5b54f5" onClick={a.backToReview}>← Back to review</Box>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", color: "#1d1b2e" }}>Review the deck</h1>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Box as="button" s="display:inline-flex;align-items:center;gap:10px;background:#5b54f5;color:#fff;border:none;border-radius:12px;padding:12px 20px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 6px 18px rgba(91,84,245,.28)" h="background:#4a43d6" onClick={a.toggleShare}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" /></svg>
            Share
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </Box>
          {a.shareOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1px solid #e8e8ef", borderRadius: 12, padding: 6, boxShadow: "0 14px 34px rgba(20,18,31,.16)", width: 220, zIndex: 40 }}>
              <Box as="button" s="width:100%;display:flex;align-items:center;gap:11px;background:transparent;border:none;border-radius:9px;padding:11px 12px;font-size:14px;font-weight:700;color:#1d1b2e;cursor:pointer;font-family:inherit;text-align:left" h="background:#f5f5f8" onClick={() => { exportDeck(a.selectedBrand, a.reportSpec).catch(console.error); a.exportOnly(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b54f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 11l5 4 5-4M5 20h14" /></svg>Export .pptx
              </Box>
              <Box as="button" s="width:100%;display:flex;align-items:center;gap:11px;background:transparent;border:none;border-radius:9px;padding:11px 12px;font-size:14px;font-weight:700;color:#1d1b2e;cursor:pointer;font-family:inherit;text-align:left" h="background:#f5f5f8" onClick={a.goEmailStep}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b54f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>Export &amp; email
              </Box>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 16, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 15 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <input value={a.deckTitle} onChange={(e) => a.setDeckTitle(e.target.value)} placeholder={title} style={{ flex: 1, fontFamily: "inherit", fontSize: 14.5, fontWeight: 800, color: "#1d1b2e", background: "transparent", border: "none", borderBottom: "1.5px solid transparent", outline: "none", padding: "2px 0", minWidth: 0 }} />
              <span style={{ fontSize: 11, color: "#86868f", whiteSpace: "nowrap" }}>.pptx</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 4 }}>
          <div style={{ position: "relative" }}>
            <DeckSlide index={a.currentSlide} spec={a.reportSpec} />
            {a.currentSlide > 0 && (
              <Box as="button" s="position:absolute;left:-16px;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:50%;background:#fff;border:1px solid #e8e8ef;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;box-shadow:0 2px 8px rgba(20,18,31,.1)" h="background:#f5f5f8" onClick={a.prevSlide}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d1b2e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </Box>
            )}
            {a.currentSlide < 4 && (
              <Box as="button" s="position:absolute;right:-16px;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:50%;background:#fff;border:1px solid #e8e8ef;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;box-shadow:0 2px 8px rgba(20,18,31,.1)" h="background:#f5f5f8" onClick={a.nextSlide}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d1b2e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </Box>
            )}
          </div>
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "#86868f" }}>{a.currentSlide + 1} of 5</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "2px 2px 6px" }}>
            {deckSlides.map((t, i) => {
              const active = i === a.currentSlide;
              return (
                <Box key={t.n} s={`position:relative;flex:none;width:96px;height:56px;border-radius:8px;border:1.5px solid ${active ? "#5b54f5" : "#e8e8ef"};background:${active ? "#faf9ff" : "#fff"};cursor:pointer;padding:8px 9px;overflow:hidden`} h="opacity:.85" onClick={() => a.set({ currentSlide: i })}>
                  <span style={{ position: "absolute", left: 0, top: 0, width: 4, height: "100%", background: i === 1 ? "#191730" : "#5b54f5" }} />
                  <div style={{ fontSize: 10, fontWeight: 800, color: active ? "#5b54f5" : "#92929d", marginLeft: 4 }}>0{t.n}</div>
                  <div style={{ fontSize: 9, color: "#9a9aa6", marginTop: 1, marginLeft: 4, lineHeight: 1.2 }}>{t.label}</div>
                </Box>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailStep() {
  const a = useAtlas();
  const brand = a.brands.find((b) => b.name === a.selectedBrand) || a.brands[0];
  const recipients = (brand.recipients || []).map((name) => ({ name, email: emailFor(name, a.selectedBrand), initials: initialsOf(name) }));
  return (
    <div>
      <Box as="button" s="display:inline-flex;align-items:center;gap:6px;background:none;border:none;color:#86868f;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;margin-bottom:16px" h="color:#5b54f5" onClick={a.backToDeck}>← Back to deck</Box>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", color: "#1d1b2e" }}>Send to client</h1>

      <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 16, padding: "18px 20px", margin: "16px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#92929d", marginBottom: 13 }}>Send to</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {recipients.map((r) => (
            <div key={r.email} style={{ display: "flex", alignItems: "center", gap: 11, background: "#faf9fc", border: "1px solid #f0f0f4", borderRadius: 11, padding: "9px 13px" }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#eef0f3", color: "#5c5c68", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flex: "none" }}>{r.initials}</span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#2c2940" }}>{r.name}</div><div style={{ fontSize: 12, color: "#86868f" }}>{r.email}</div></div>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#86868f", background: "#f0f0f4", borderRadius: 6, padding: "3px 8px" }}>Client contact</span>
            </div>
          ))}
          {a.extraEmails.map((email) => (
            <div key={email} style={{ display: "flex", alignItems: "center", gap: 11, background: "#f5f3fe", border: "1px solid #e3ddfb", borderRadius: 11, padding: "9px 13px" }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#e3ddfb", color: "#5b54f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flex: "none" }}>{email[0]?.toUpperCase()}</span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#2c2940" }}>{email}</div></div>
              <Box as="button" s="width:24px;height:24px;border-radius:7px;border:none;background:transparent;color:#9a9aa6;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none" h="background:#ece9f7;color:#5c5c68" onClick={() => a.removeEmail(email)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </Box>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          <input value={a.emailDraft} onChange={(e) => a.setEmailDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); a.addEmail(); } }} placeholder="Add another email…" type="email" style={{ flex: 1, fontFamily: "inherit", fontSize: 13.5, color: "#1d1b2e", background: "#faf9fc", border: "1px solid #e2def0", borderRadius: 10, padding: "11px 13px", outline: "none", boxSizing: "border-box" }} />
          <Box as="button" s="background:#fff;color:#5b54f5;border:1px solid #d8d2f3;border-radius:10px;padding:11px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap" h="background:#f5f3fe" onClick={a.addEmail}>+ Add</Box>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 16, padding: "18px 20px", marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#92929d", marginBottom: 11 }}>Message to client</div>
        <textarea value={a.clientMessage} onChange={(e) => a.setClientMessage(e.target.value)} rows={3} style={{ width: "100%", fontFamily: "inherit", fontSize: 13.5, lineHeight: 1.55, color: "#2c2940", background: "#faf9fc", border: "1px solid #e2def0", borderRadius: 11, padding: "12px 14px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
        <div style={{ fontSize: 11.5, color: "#86868f", marginTop: 8 }}>The deck attaches automatically. This note appears in the email body.</div>
      </div>

      <Box as="button" s="width:100%;display:inline-flex;align-items:center;justify-content:center;gap:9px;background:#5b54f5;color:#fff;border:none;border-radius:13px;padding:16px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 8px 22px rgba(91,84,245,.3)" h="background:#4a43d6" onClick={a.sendReport}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>Send deck to client →
      </Box>
    </div>
  );
}

export function DeliverScreen() {
  const a = useAtlas();
  const title = deckTitleOf(a.selectedBrand, a.deckTitle);
  return (
    <section style={{ padding: "40px 34px 60px", maxWidth: 760, margin: "0 auto", animation: "fadeUp .35s ease both" }}>
      {!a.delivered ? (
        a.deliverStep === "deck" ? <DeckStep /> : <EmailStep />
      ) : (
        <div style={{ textAlign: "center", padding: "30px 0", animation: "fadeUp .4s ease both" }}>
          <div style={{ width: 74, height: 74, borderRadius: "50%", background: "#e6f6ee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0f9a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8.5 12.2l2.5 2.5 4.5-4.8" /></svg>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", color: "#1d1b2e" }}>Report {a.deliveredChannel === "Email" ? "sent" : "exported"}</h1>
          <p style={{ margin: "10px auto 0", fontSize: 14.5, color: "#6f6f7b" }}>{title}.pptx</p>
          {a.reports[0]?.timeTaken && a.reports[0].timeTaken !== "—" && (
            <p style={{ margin: "8px auto 0", fontSize: 13, color: "#0f8a52", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f9a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              Generated &amp; shared in {a.reports[0].timeTaken}
            </p>
          )}
          <div style={{ display: "flex", gap: 11, justifyContent: "center", marginTop: 28 }}>
            <Box as="button" s="background:#fff;color:#5b5775;border:1px solid #e2def0;border-radius:11px;padding:13px 20px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#f5f5f8" onClick={a.goBrands}>Back to brands</Box>
          </div>
        </div>
      )}
    </section>
  );
}
