# Integration & Architecture Reference (consolidated)
*Single source of truth for: real APIs, MCP servers, the AI-search swap, and LangGraph compatibility. Scoped to the Data Available sheet's sources. Researched June 2026, verified against official docs. The prototype uses mock data (per brief) — this proves the real path for the PRD.*

---

## 1. TL;DR
1. **6 of the 7 sheet sources are integratable today** — 5 free/free-tier (GSC, GA4, WordPress, Webflow, Contentful), 1 paid (Semrush SEO). Each has an official MCP server except GSC (community only).
2. **The one gap is the AI-search/GEO data** the sheet routes through **Semrush AI** — it's **UI-only (no public API, no MCP)**. The integratable swap-in is **Otterly** or **Peec** (both have official API + MCP, covering the same three endpoints).
3. **LangGraph is fully MCP-compatible** via the official `langchain-mcp-adapters`, with native **human-in-the-loop** (approve/edit/reject) = your CS approval gate. Architecture validated end-to-end.

---

## 2. Verified table — the sheet's sources

| Sheet source | Real API? | Free / Paid | MCP server? | Integratable? |
|---|---|---|---|---|
| **GSC** | ✅ yes | **Free** | ⚠️ community ([mcp-gsc](https://github.com/AminForou/mcp-gsc)) | ✅ yes (free) |
| **GA4** | ✅ yes | **Free** | ✅ official ([Google](https://github.com/googleanalytics/google-analytics-mcp)) | ✅ yes (free) |
| **Semrush** (SEO) | ✅ yes | **Paid** (~$500+/mo + API units) | ✅ official ([Semrush](https://developer.semrush.com/api/introduction/semrush-mcp/)) | ✅ yes (paid) |
| **Semrush AI** (sheet's GEO/AI-search) | ❌ **none — UI only** | Paid product (~$99/user) | ❌ none | ❌ **not via API/MCP → swap (see §3)** |
| **WordPress** | ✅ yes | **Free** | ✅ official ([WP adapter](https://github.com/WordPress/mcp-adapter)) | ✅ yes (free) |
| **Webflow** | ✅ yes | **Free tier** | ✅ official ([Webflow](https://developers.webflow.com/mcp/reference/overview)) | ✅ yes (free tier) |
| **Contentful** | ✅ yes | **Free tier** | ✅ official ([Contentful](https://github.com/contentful/contentful-mcp-server)) | ✅ yes (free tier) |

---

## 3. The one gap + the swap: Semrush AI → Otterly / Peec

Semrush's AI Visibility Toolkit has **no public API and no MCP** (verified against Semrush docs — it's not in their official MCP scope). For real AI-search data, swap to **Otterly** or **Peec** — both have an official API + MCP and cover all three of the sheet's Semrush AI endpoints:

| Semrush AI endpoint (sheet) | What it provides | Otterly | Peec |
|---|---|---|---|
| `ai_visibility_overview` | visibility score, share of voice, sentiment, per-engine, top competitors | Brand reports — visibility, SoV, per-engine | Visibility + sentiment + SoV across 8 engines |
| `ai_prompt_mentions` | per-prompt: mentioned?, excerpt, position, citations, competitors | Prompts + AI responses (mentions + competitors) | Prompts + chats (per-prompt responses + mentions) |
| `ai_citation_tracking` | per-URL citations by engine, top prompts, trend | Citations (cited sources, per-engine) + recommendations | Cited-source inspection (pages cited, by engine) |

**Pick:** Peec leads on engine breadth (8 engines) + SoV analytics; Otterly has a 1:1 API↔MCP mapping + built-in recommendations. Either is a clean drop-in. Field shapes differ from Semrush, so the **data-layer adapter normalizes** the chosen vendor into the internal shape — a one-adapter change.

*(Profound also covers this but is excluded per preference / Enterprise-gated API. ZipTie has no API by design.)*

---

## 4. LangGraph ↔ MCP — confirmed compatible

**Verdict: yes, first-class.** MCP tools convert to native LangChain tools any LangGraph node/`ToolNode`/agent can call. Mechanism: the official **`langchain-mcp-adapters`** (Python; `@langchain/mcp-adapters` for JS), current **v0.2.2 (Mar 2026), Python ≥3.10**.

```python
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import ToolNode

client = MultiServerMCPClient({
    "semrush": {"url": "https://mcp.semrush.com/v1/mcp", "transport": "streamable_http"},
    "ga4":     {"url": "http://localhost:8000/mcp",      "transport": "http"},
})

tools = await client.get_tools()      # MCP tools -> LangChain tools -> ToolNode(tools)
```

**Human-in-the-loop (your CS approval gate):** native — `interrupt()` in a custom node, or `HumanInTheLoopMiddleware` with decision types **approve / edit / reject / respond**. Requires a **checkpointer** (InMemorySaver for the prototype, Postgres in prod); resume with `Command(resume=...)` on the same `thread_id`.

**Fit:** ideal — a graph of typed-state nodes mixing:
- **Deterministic** compute nodes (diff, rank, compose)
- **MCP tool** nodes (data collection)
- **LLM** node (narrative/recs)
- **`interrupt()`** approval gate (CM review)

**Gotchas:** separate `pip install`; async-first; `MultiServerMCPClient` is stateless by default (use `client.session(...)` for persistent context); MCP servers run out-of-process (bridge runtime state via interceptors).

---

## 5. Recommended approach

### Prototype (this assignment — v1.0)
Keep the **mock data layer** (per brief) — mock all 7 sheet sources in their documented shapes, seeded RNG for determinism.
- **Optional flex:** wire one real MCP (official GA4 or Semrush) into the graph to *show* live integration without breaking the mock pipeline.
- **Current state:** live Gemini + DeepSeek fallback tested; mock data golden; ready for Vercel.

### Production (v1.1+)
Each source = a tool node from its **MCP server**:
- **GA4:** official MCP (Google)
- **GSC:** community MCP or direct API call
- **Semrush (SEO):** official MCP (Semrush)
- **WordPress / Webflow / Contentful:** official MCPs (WP, Webflow, Contentful)
- **AI-search:** Otterly or Peec MCP (replaces Semrush AI, the UI-only product)

### The architecture (round-2 gold)
```
LangGraph StateGraph:
  ├── deterministic Collector node (MCP tool calls: GA4, GSC, Semrush, Peec, CMS)
  ├── LLM Analyst node (Gemini/Claude, structured output to ReportSpec)
  ├── LLM Reviewer node (reconciliation check)
  ├── interrupt() gate (CM approval + Editor rewrite)
  └── checkpointer (persist state across resume)
```

That *is* "buy the measurement, build the meaning" — real data in, structured insights out, human judgment preserved.

---

## 6. References

**APIs/MCP:**
- [GA4 MCP](https://github.com/googleanalytics/google-analytics-mcp)
- [GSC community MCP](https://github.com/AminForou/mcp-gsc)
- [Semrush MCP](https://developer.semrush.com/api/introduction/semrush-mcp/)
- [WordPress MCP](https://github.com/WordPress/mcp-adapter)
- [Webflow MCP](https://developers.webflow.com/mcp/reference/overview)
- [Contentful MCP](https://github.com/contentful/contentful-mcp-server)
- [Otterly MCP](https://docs.otterly.ai/mcp-server)
- [Peec MCP](https://docs.peec.ai/mcp/introduction)
- [Semrush AI Toolkit (UI-only, no API)](https://www.semrush.com/kb/1493-ai-visibility-toolkit)

**LangGraph + MCP:**
- [MCP integration guide](https://docs.langchain.com/oss/python/langchain/mcp)
- [langchain-mcp-adapters (PyPI)](https://pypi.org/project/langchain-mcp-adapters/)
- [Human-in-the-loop](https://docs.langchain.com/oss/python/langchain/human-in-the-loop)
- [Persistence/checkpointers](https://docs.langchain.com/oss/python/langgraph/persistence)

---

**Document Status:** Research complete, verified against official docs  
**Last Updated:** June 24, 2026  
**For:** Atlas Report Copilot v1.0 (MVP) → v1.1+ (production integration)
