"use client";

import { useRef, useState, useEffect } from "react";
import { Box } from "./ui";
import { SourceTag } from "./SourceTag";
import type { AiBlockData } from "@/lib/atlas/data";

const btn = "display:inline-flex;align-items:center;gap:5px;background:#fff;color:#5b5775;border:1px solid #e6e3f2;border-radius:8px;padding:6px 11px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .14s,border-color .14s";
const btnHover = "background:#f5f3fe;border-color:#d8d2f3";
const menuStyle: React.CSSProperties = { position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 30, display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #e6e3f2", borderRadius: 10, padding: 5, boxShadow: "0 14px 34px rgba(20,18,31,.16)", width: 150 };
const menuItem = "text-align:left;background:transparent;border:none;cursor:pointer;padding:8px 10px;font-size:12.5px;font-weight:600;color:#3a3654;border-radius:7px;font-family:inherit";

export function AiBlock({ block, showSources = true, showConfidence = false, onCommit }: { block: AiBlockData; showSources?: boolean; showConfidence?: boolean; onCommit?: (text: string) => void }) {
  const editRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(block.text);
  const [history, setHistory] = useState<string[]>([]);
  const [version, setVersion] = useState(0);
  const [toneOpen, setToneOpen] = useState(false);
  const [lengthOpen, setLengthOpen] = useState(false);
  const [suggestionReady, setSuggestionReady] = useState(false);
  const [showRewriteInput, setShowRewriteInput] = useState(false);
  const [rewriteInstruction, setRewriteInstruction] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const [edited, setEdited] = useState(false);
  const [focused, setFocused] = useState(false);
  const lastVersion = useRef(-1);

  useEffect(() => {
    if (editRef.current && lastVersion.current !== version) {
      editRef.current.innerText = text;
      lastVersion.current = version;
    }
  }, [version, text]);

  const push = (next: string) => { setHistory((h) => [...h, text]); setText(next); setVersion((v) => v + 1); setEdited(true); onCommit?.(next); };
  const applySoon = (next: string) => {
    setRegenerating(true); setToneOpen(false); setLengthOpen(false); setShowRewriteInput(false);
    setTimeout(() => { setHistory((h) => [...h, text]); setText(next); setVersion((v) => v + 1); setEdited(true); setRegenerating(false); onCommit?.(next); }, 650);
  };

  const borderColor = block.lowConfidence ? "#f1d6d7" : "#e8e8ef";

  return (
    <div style={{ position: "relative", background: "#fff", border: `1px solid ${borderColor}`, borderRadius: 16, padding: "18px 20px 16px", boxShadow: "0 1px 2px rgba(20,18,31,.04)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#14121f", letterSpacing: "-.01em" }}>{block.label}</span>
        </div>
        <SourceTag source={block.source} confidence={block.confidence} figure={block.figure} showSources={showSources} showConfidence={showConfidence} />
      </div>

      {block.lowConfidence && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#fdeaea", border: "1px solid #f4cccd", color: "#b22a30", borderRadius: 10, padding: "8px 12px", marginBottom: 11, fontSize: 12, fontWeight: 600 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b22a30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg>
          <span>Low confidence — please verify before approving. Source: {block.figure}</span>
        </div>
      )}

      <div
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { const v = (e.target as HTMLDivElement).innerText; if (v !== text) { setHistory((h) => [...h, text]); setText(v); setEdited(true); onCommit?.(v); } setFocused(false); }}
        style={{ fontSize: 14.5, lineHeight: 1.62, color: "#2c2940", outline: "none", borderRadius: 10, padding: "6px 8px", margin: "0 -8px", transition: "background .15s,box-shadow .15s", minHeight: 24, ...(focused ? { background: "#fbfbfc", boxShadow: "inset 0 0 0 1.5px #cfc8f7" } : {}) }}
      />

      {regenerating && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#6b3fd0", fontSize: 12.5, fontWeight: 700, marginTop: 10 }}>
          <span style={{ width: 13, height: 13, border: "2px solid #d8cdf7", borderTopColor: "#7d52e8", borderRadius: "50%", display: "inline-block", animation: "absp .7s linear infinite" }} />
          Atlas is rewriting…
        </div>
      )}

      {suggestionReady && (
        <div style={{ marginTop: 13, background: "#f5f3fe", border: "1px solid #e3ddfb", borderRadius: 12, padding: "13px 15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5b54f5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" /></svg>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#4a43d6", letterSpacing: ".03em", textTransform: "uppercase" }}>Atlas suggests a rewrite</span>
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "#403c58", marginBottom: 11 }}>{block.rewrite}</div>
          <div style={{ display: "flex", gap: 9 }}>
            <button type="button" onClick={() => { push(block.rewrite); setSuggestionReady(false); }} style={{ background: "#5b54f5", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Accept rewrite</button>
            <button type="button" onClick={() => setSuggestionReady(false)} style={{ background: "#fff", color: "#5f5f6b", border: "1px solid #e2def0", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Dismiss</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14, paddingTop: 13, borderTop: "1px solid #eeeef3", flexWrap: "wrap" }}>
        <Box as="button" s={btn} h={btnHover} onClick={() => editRef.current?.focus()}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg> Edit inline
        </Box>
        <Box as="button" s={btn} h={btnHover} onClick={() => { setShowRewriteInput(true); setRewriteInstruction(""); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v4h-4" /></svg> Rewrite
        </Box>

        <span style={{ position: "relative" }}>
          <Box as="button" s={btn} h={btnHover} onClick={() => { setToneOpen((o) => !o); setLengthOpen(false); }}>Tone <span style={{ fontSize: 9, opacity: .7 }}>▾</span></Box>
          {toneOpen && (
            <span style={menuStyle}>
              <Box as="button" s={menuItem} h="background:#f3f1fc" onClick={() => applySoon(block.tone.formal || text)}>More formal</Box>
              {block.tone.warm && <Box as="button" s={menuItem} h="background:#f3f1fc" onClick={() => applySoon(block.tone.warm)}>Warmer</Box>}
              <Box as="button" s={menuItem} h="background:#f3f1fc" onClick={() => applySoon(block.tone.confident || text)}>More confident</Box>
            </span>
          )}
        </span>

        <span style={{ position: "relative" }}>
          <Box as="button" s={btn} h={btnHover} onClick={() => { setLengthOpen((o) => !o); setToneOpen(false); }}>Length <span style={{ fontSize: 9, opacity: .7 }}>▾</span></Box>
          {lengthOpen && (
            <span style={menuStyle}>
              <Box as="button" s={menuItem} h="background:#f3f1fc" onClick={() => applySoon(block.length.short || text)}>More concise</Box>
              <Box as="button" s={menuItem} h="background:#f3f1fc" onClick={() => applySoon(block.length.long || text)}>More detailed</Box>
            </span>
          )}
        </span>

        {history.length > 0 && (
          <Box as="button" s="display:inline-flex;align-items:center;gap:5px;background:#fdf8ef;color:#b5781f;border:1px solid #eddcc0;border-radius:8px;padding:6px 11px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit" h={btnHover} onClick={() => { setHistory((h) => { if (!h.length) return h; const nh = h.slice(); const prev = nh.pop()!; setText(prev); setVersion((v) => v + 1); setEdited(nh.length > 0); onCommit?.(prev); return nh; }); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h11a6 6 0 0 1 0 12h-3M3 8l4-4M3 8l4 4" /></svg> Undo
          </Box>
        )}
        {edited && (
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#0f9a5a", display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0f9a5a" }} />Edited by you
          </span>
        )}
      </div>

      {showRewriteInput && (
        <div style={{ marginTop: 12, background: "#f5f3fe", border: "1px solid #e3ddfb", borderRadius: 12, padding: "13px 15px", animation: "fadeUp .18s ease both" }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: "#4a43d6", marginBottom: 8 }}>Give Atlas an instruction</div>
          <textarea
            value={rewriteInstruction}
            onChange={(e) => setRewriteInstruction(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (rewriteInstruction.trim()) { setShowRewriteInput(false); setRegenerating(true); setTimeout(() => { setRegenerating(false); setSuggestionReady(true); }, 900); } } }}
            placeholder="e.g. Make it more concise and lead with the AI-search drop…"
            rows={2}
            style={{ width: "100%", fontFamily: "inherit", fontSize: 13.5, lineHeight: 1.5, color: "#2c2940", background: "#fff", border: "1px solid #d8d2f3", borderRadius: 9, padding: "10px 12px", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 10 }}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Box as="button" s="background:#fff;color:#5b5775;border:1px solid #e2def0;border-radius:8px;padding:8px 14px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#f5f5f8" onClick={() => setShowRewriteInput(false)}>Cancel</Box>
            <Box as="button" s="background:#5b54f5;color:#fff;border:none;border-radius:8px;padding:8px 14px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit" h="background:#4a43d6" onClick={() => { if (!rewriteInstruction.trim()) return; setShowRewriteInput(false); setRegenerating(true); setTimeout(() => { setRegenerating(false); setSuggestionReady(true); }, 900); }}>Generate rewrite →</Box>
          </div>
        </div>
      )}

      {showSources && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #eeeef3", display: "inline-flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#92929d" }}>Source</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#5c5c68", background: "#f0f0f4", borderRadius: 6, padding: "2px 9px" }}>{block.source}</span>
        </div>
      )}
    </div>
  );
}
