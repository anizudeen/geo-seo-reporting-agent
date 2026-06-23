# Atlas Report Copilot
**Product Requirements Document — an agentic system that auto-generates client organic + AI-search visibility reports**

_Pepper AI Builder · PRD v1.0 (MVP Complete) · 24 June 2026 · Owner: Product (Atlas)_

| Field | Detail |
|---|---|
| **Status** | MVP Complete — ready for Vercel deployment |
| **Problem** | Every CS team member spends 4+ hrs/week manually building client reports |
| **Solution in one line** | Four agents pull the data, find what changed and why, draft a client-ready report, review it, and let the CS manager refine any section by instruction before sending |
| **Primary metric** | CS reporting time: ~4 hrs/week → < 30 min review per report (≥ 80% time saved) |
| **Repository** | https://github.com/anizudeen/GEO-SEO-reporting-agent |
| **Scope of this PRD** | The agent system, data contracts, workflow, requirements, and eval hooks. Auth, billing, and dashboard chrome are assumed to exist (out of scope). |

---

## 1. Overview & Goals

**The job today.** A Pepper CS manager (CM) logs into a handful of tools (Google Search Console, GA4, Semrush, the Semrush AI Toolkit, and the client's CMS), exports data, stitches it into a spreadsheet and a deck, writes a narrative, and emails it to the client on a recurring cadence. Repeated across every client, this is 4+ hours per CM per week of skilled time spent on assembly rather than strategy.

**The product.** Atlas Report Copilot replaces the manual assembly with a small crew of four AI agents. On demand the agents fetch the data, normalise it, compute period-over-period change, explain _what moved and why_, turn gaps into scoped recommendations, compose a client-ready report, and review it. The CM reads the draft, refines any section by instruction (tone, length, or a freeform edit), approves, and sends — turning hours of assembly into minutes of judgement.

### Goals

- Cut CS report-building time by **≥ 80%** (the 4-hour problem) without lowering report quality.
- Report organic search and AI-search visibility together but in **clearly separated sections**, with competitor context.
- Move from "dashboards only" to **"insights to action"** — every report ends in scoped, executable recommendations.
- Keep a **human in the loop**: the CM always reviews and can rewrite any section before a client sees anything.
- Be **measurable from day one** — instrument time saved, accuracy, and report quality so the eval/experiment can prove the 4 hours are real.

### Non-goals (this release)

- Auth, billing, and dashboard chrome — assumed to exist.
- Fully autonomous send (no human review) — explicitly out; review is a feature, not a limitation.
- Publishing/editing content directly in the client's CMS — this release reports and recommends; execution stays with the CS/content team.

---

## 2. Users & Personas

| Persona | Role in the product | What they need |
|---|---|---|
| **CS Manager (CM)** — primary | Triggers / reviews / refines / sends reports; owns the client relationship | A trustworthy first draft in minutes, easy section-level edits, confidence the numbers are right |
| **Client (recipient)** | Receives the report by email | A clear, accurate, jargon-light story of what changed and what to do next |

### Primary user stories

1. As a CM, when my client's weekly report is due, I want a complete, accurate draft generated automatically so I only review and personalise it.
2. As a CM, I want each metric to come with a one-line "what changed & why" so I'm not reverse-engineering the story.
3. As a CM, I want a prioritised list of recommended next actions tied to real pages/prompts so the report drives the next retainer of work.
4. As a CM, I want to rewrite any section by instruction (make it concise, change the tone, expand it) and approve before anything reaches the client.

---

## 3. The Agent System

### 3.1 Architecture at a glance

Four specialised agents run along a short pipeline. The first three run in sequence to produce a reviewed draft; the fourth is invoked interactively by the CM during review to rewrite any section. One mandatory human gate protects the client relationship.

| # | Agent | Responsibility | Model |
|---|---|---|---|
| **1** | **Data Collector** | Pull + normalise organic and AI/GEO data into typed fact objects | Deterministic (tools only) |
| **2** | **Analyst & Report Builder** | Diff vs prior period, find "what changed & why", generate scoped recommendations, compose report | Gemini 2.5-flash-lite (primary) + DeepSeek V4 Flash (fallback) |
| **3** | **Fact-Checker & Reviewer** | QA the report — reconcile every number to source facts, check grounding/completeness/tone, flag issues | Gemini 2.5-flash-lite (primary) + DeepSeek V4 Flash (fallback) |
| **4** | **Editor** | On CM instruction, rewrite a chosen section — change tone, change length (concise / longer), or apply a freeform edit | Gemini 2.5-flash-lite (primary) + DeepSeek V4 Flash (fallback) |

**Pipeline:** Trigger → **Collector** → **Analyst & Report Builder** → **Reviewer** → **CM review gate** (CM reads, invokes the **Editor** on any section as needed, approves) → deliver by email.

### 3.2 Agent specifications

#### Agent 1 · Data Collector
- **Purpose:** Gather and normalise everything the report needs, from every source, into clean typed facts.
- **Trigger:** Start of a report run (CM clicks "Generate").
- **Endpoints used:**
  - _Organic:_ GSC `searchanalytics.query`, GA4 `properties.runReport`, Semrush `domain_organic`, `domain_organic_pages`, `Position Tracking`
  - _AI / GEO:_ Semrush AI `ai_visibility_overview`, `ai_prompt_mentions`, `ai_citation_tracking` (SOV, mentions, citations per ChatGPT, Perplexity, Google AIO, Copilot, Claude)
  - _Content inventory:_ WordPress / Webflow / Contentful (read-only, for stale page detection)
- **Output contract:** `OrganicFacts {}` + `AIVisibilityFacts {}` (kept separate) + `ContentInventory {}` + `dq_flags[]`
- **Guardrails:** Use multi-run/window frequency for AI metrics (single answers are volatile); surface the GSC "AI Overviews blended into Web" caveat; never invent a number an endpoint didn't return; mark any failed source "unavailable"
- **HITL:** None (data layer).

#### Agent 2 · Analyst & Report Builder
- **Purpose:** Turn facts into insights and a finished, client-ready report.
- **Inputs:** `OrganicFacts` + `AIVisibilityFacts` + `ContentInventory` + prior-period snapshot + brand voice + template
- **Core logic:**
  1. **Diff & explain** — compute period-over-period deltas, detect material moves, attach one-line evidence-backed "why"
  2. **Recommend** — convert each gap into a scoped action tied to a real URL or tracked prompt, with effort/impact and in-/out-of-scope flag
  3. **Compose** — assemble the report: Exec Summary + separate **AI Search Visibility** and **Organic Search** sections + Competitor Benchmark + Recommendations, in the client's brand voice
- **Output contract:** `ReportDraft (deck + email)` + `InsightSet[]` + `ActionPlan[]`
- **Guardrails:** Every figure and claim cites the fact row behind it; label hypotheses vs facts; keep AI and organic in separate sections, never blended; no recommendation without a linked insight and a real page/prompt
- **Temperature:** 0 (structured output)
- **HITL:** None (produces the draft for review).

#### Agent 3 · Fact-Checker & Reviewer
- **Purpose:** Quality-assure the draft before a human ever sees it, so the CM's review is fast and trustworthy.
- **Inputs:** `ReportDraft` + the fact objects it was built from
- **Checks:** Numeric reconciliation (every figure traces to a fact row); grounding/hallucination check; completeness (all sections present); AI/organic kept separate; tone/brand-voice adherence; data-quality caveats present
- **Output contract:** `ReviewResult { verdict(pass | needs-fix), flagged_spans[] }`
- **Guardrails:** Review only — never rewrites; anything unreconciled is flagged; unreconciled numbers block the draft
- **HITL:** Hands the reviewed draft + flags to the CM review gate.

#### Agent 4 · Editor
- **Purpose:** Let the CM refine the report conversationally during review.
- **Trigger:** CM selects a section and gives an instruction at the review gate
- **Inputs:** Target section + CM instruction (tone / length / freeform) + underlying facts
- **Output contract:** `RewrittenSection` (drop-in replacement)
- **Guardrails:** Rewrite only the selected section; keep every figure grounded in the same facts; never introduce a new number or claim; preserve factual meaning while changing only tone/length/phrasing
- **HITL:** Fully CM-driven; each rewrite is accepted or rejected.

---

## 4. End-to-End Workflow

1. **Trigger.** Report is due and the CM clicks "Generate." The run loads the Report Config + last snapshot.
2. **Collect.** The **Collector** pulls organic + AI data and returns typed fact objects.
3. **Analyse & build.** The **Analyst & Report Builder** diffs vs the prior period, produces insights and scoped recommendations, composes the editable draft (deck + email).
4. **Review.** The **Reviewer** reconciles every figure to source facts and flags anything ungrounded, incomplete, or off-tone.
5. **CM review gate (human).** The CM reads the reviewed draft and flags, edits any number/sentence, and for any section can instruct the **Editor** to change tone, length, or apply a freeform rewrite — then approves.
6. **Deliver.** On approval, the report is emailed to the client; the run is logged and the snapshot saved.
7. **Learn.** Edits, Editor instructions, approvals, and timing are captured to drive the eval.

---

## 5. Functional Requirements & Acceptance Criteria

| ID | Requirement | Acceptance criteria |
|---|---|---|
| **FR-1** | Configure a client report | CM can set domain, competitors, priority keywords, tracked AI prompt set, brand voice, recipients, template, expected cadence; config persists. |
| **FR-2** | Generate on demand | A run can be triggered manually; status is visible; a run completes or fails with a clear reason. |
| **FR-3** | Collect organic + AI data | The Collector returns populated fact objects for a configured client; missing endpoints degrade gracefully and are flagged. |
| **FR-4** | Period-over-period insights | Each headline metric shows current, prior, delta, and a one-line evidence-backed "why." |
| **FR-5** | Separate AI & organic | Report has distinct "AI Search Visibility" and "Organic Search" sections; no single blended AI+organic score anywhere. |
| **FR-6** | Competitor benchmarking | AI SOV and organic position are shown vs named competitors from config. |
| **FR-7** | Scoped recommendations | ≥ 3 recommendations per report, each linked to an insight + a real page/prompt, with effort/impact and in-/out-of-scope flag. |
| **FR-8** | Automated review | The Reviewer reconciles every figure to source facts and flags any ungrounded number/claim before the CM sees the draft. |
| **FR-9** | Refine by instruction | CM can select any section and instruct the Editor to change tone, length (concise/longer), or apply a freeform edit; the rewrite stays grounded. |
| **FR-10** | Deliver & log | After CM approval, the report is emailed to the client and a snapshot + audit entry is written. |

---

## 6. Non-Functional Requirements

- **Accuracy & grounding:** every figure must trace to a source endpoint; the Reviewer blocks unreconciled numbers; zero fabricated metrics is a release gate; the Editor may never introduce a number not in the facts.
- **AI-data volatility:** AI SOV/mentions use multi-run/window frequency, never a single answer; reports show the prompt-set denominator and a volatility note.
- **Attribution honesty:** AI-referred traffic is broken out as its own channel; the report carries the GA4 "~70% of AI referrals land as Direct" and GSC "AI Overviews blended into Web" caveats.
- **Latency & cost:** a full run completes within target window (e.g., < 60 sec on Vercel) so a report is review-ready on demand; cost per report is tracked.
- **Security & privacy:** per-client data isolation; **read-only** access to all client sources; every CM edit/approval audited.
- **Reliability & observability:** partial-source failure degrades to a flagged section rather than a failed run; all agent steps are traced.

---

## 7. Report Output Spec

**Structure:**
1. Executive summary — the 3–5 things that changed and the recommended next moves
2. AI Search Visibility section — frequency-based SOV per engine, mentions/citations, sentiment, competitor SOV
3. Organic Search section — clicks/impressions/CTR/position on priority keywords, top pages, conversions (with AI-referred traffic broken out)
4. Competitor benchmark — AI + organic vs named rivals
5. Recommendations / next sprint — ranked, scoped opportunities (gap → opportunity → action)
6. Appendix — methodology, data-quality & attribution caveats

**Deliberately de-emphasised:** single-answer position as a headline, raw prompt/keyword counts, impressions without CTR, Domain Authority, any blended "AI + organic" score.

---

## 8. Success Metrics & Eval Hooks

These instrument the build so the eval/experiment can prove the 4 hours are saved.

| Metric | Definition | Target |
|---|---|---|
| **Time-to-report (primary)** | Wall-clock CM time per report (baseline manual vs copilot review) | ≤ 30 min review; ≥ 80% reduction vs ~4 hr baseline |
| **Hours saved / CM / week** | Reports/week × time saved per report | ≥ 3 hrs/CM/week |
| **Draft acceptance rate** | % of reports sent with ≤ N edits | ≥ 70% |
| **Numeric accuracy** | % of report figures that reconcile to source APIs | 100% (hard gate) |
| **Recommendation acceptance** | % of recommendations the CM keeps | ≥ 60% |
| **Client engagement** | Report opens / replies; churn proxy over time | ≥ baseline (no regression) |
| **Adoption** | % of client reports generated via the copilot | ≥ 80% within 1 quarter |

### Experiment design hooks

- **Dataset:** a frozen set of N clients × periods with known-good source data and a human-built "gold" report for each.
- **Method:** (a) timed A/B — same CMs build reports manually vs review copilot drafts, measure wall-clock time; (b) blind quality rubric (accuracy, clarity, actionability) scored on copilot vs manual; (c) automated numeric-reconciliation tests on every figure.
- **Success gate:** ≥ 80% time reduction with quality rubric ≥ manual and numeric accuracy = 100%.
- **Telemetry in the build:** edit-distance between draft and sent version; Editor instructions used per report; per-section flag rate; per-recommendation accept/decline — all logged.

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Hallucinated insights/numbers erode CM trust | Reviewer numeric-reconciliation gate; every claim cites evidence; unreconciled items flagged, never shipped |
| AI-visibility data is volatile | Multi-run frequency, show denominator + volatility note, suppress sub-threshold noise |
| Over-automation weakens the client relationship | Mandatory CM review gate; copilot drafts, the CM refines and decides; no autonomous send |
| Attribution error (AI traffic mis-counted) | Break out AI-referred channel; carry GA4-Direct and GSC-blending caveats in-report |
| Source/API gaps or outages | Graceful degradation to flagged sections; optional second AI source for cross-validation (future) |
| Cost/latency at scale | Per-run token & time caps; cache prior-period data; use lower-cost models for collection, stronger model only for Analyst |

---

## 10. Phasing

- **MVP (Complete)** ✅: the four agents — Collector → Analyst & Report Builder → Reviewer → CM review with the Editor — producing a deck + email; metrics instrumented; end-to-end tested with DeepSeek fallback working. Deployed on localhost; ready for Vercel.
- **v1 (Differentiation):** per-engine weighting by client buyer usage, prompt/topic tracking by journey stage, visibility-volatility view, conservative ROI math, gap→opportunity→quote upsell linkage.
- **v2 (Scale & Reach):** scheduled/auto-cadence runs, opt-in auto-send for "trusted" clients after N clean cycles, multi-language reports.

---

## 11. Data Layer & Shared State

- **Report Config Store:** per-client setup incl. the tracked AI prompt set (the SOV denominator) and brand voice/template.
- **Period Snapshot Store:** each period's normalised facts + report to enable period-over-period diffing.
- **Recommendation Ledger:** recommendation lifecycle (proposed → accepted → declined).
- **Approval & Audit Log:** every CM edit, Editor rewrite, and approval for trust + eval feedback.
- **Optional 2nd AI source (future):** a second AI-visibility source to cross-validate Semrush AI and dampen single-source volatility.

---

## 12. Deployment & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React, CSS-in-JS |
| **Agent Orchestration** | LangGraph.js (StateGraph, 3-node DAG) |
| **LLM** | Gemini 2.5-flash-lite (primary) + DeepSeek V4 Flash (fallback on 429/quota) |
| **Structured Output** | Zod validation + pptxgenjs for export |
| **Streaming** | Server-Sent Events (SSE) via ReadableStream |
| **Deploy** | Vercel (Node.js runtime for agent endpoints) |

### Vercel Environment Variables (8 required)

```
GOOGLE_API_KEY=<your-key>
DEEPSEEK_API_KEY=<your-key>
DEEPSEEK_MODEL=deepseek-v4-flash
LLM_PROVIDER=google
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=<your-key>
LANGSMITH_PROJECT=Pepper atlas
LANGCHAIN_CALLBACKS_BACKGROUND=false
```

---

## 13. Appendix A · Agent System Prompts

_Starting points (trim to your framework). All agents: "Never output a number not present in your input data. Cite the data row behind every claim. Flag uncertainty."_

**Agent 1 · Data Collector**
> Pull and normalise the client's organic data (GSC, GA4, Semrush) and AI/GEO data (Semrush AI) into `OrganicFacts` and `AIVisibilityFacts` (kept separate), plus `ContentInventory`. Curate to priority keywords and tracked prompt set. Use multi-run frequency for AI metrics. Mark missing data "unavailable"; never invent.

**Agent 2 · Analyst & Report Builder**
> Compare this period's facts to the prior snapshot. Surface only material moves; for each, give the metric, delta, and the single most-likely cause grounded in evidence. Turn each gap into one specific, executable recommendation tied to a real URL or prompt, with effort/impact and in-/out-of-scope flag. Compose the report keeping AI and organic in separate sections; never blend them; never output a number not in the facts.

**Agent 3 · Fact-Checker & Reviewer**
> Check the draft against the facts: reconcile every figure, flag any claim not grounded in facts, confirm all sections present, AI and organic separate, tone matches brand voice. Output a verdict (pass / needs-fix) and flagged spans. Review only, do not rewrite.

**Agent 4 · Editor**
> Rewrite only the section the CM selected, applying their instruction (change tone, make concise, expand, or freeform). Keep all figures grounded in the same facts; do not introduce new numbers; preserve factual meaning, change only tone/length/phrasing. Return as a drop-in replacement.

---

## Appendix B · Integration & Architecture Reference (Production Path)

*For v1.1+ — single source of truth for real APIs, MCP servers, the AI-search swap, and LangGraph compatibility. Scoped to the Data Available sheet's sources. Researched June 2026, verified against official docs.*

### B.1 TL;DR
1. **6 of the 7 sheet sources are integratable today** — 5 free/free-tier (GSC, GA4, WordPress, Webflow, Contentful), 1 paid (Semrush SEO). Each has an official MCP server except GSC (community only).
2. **The one gap is the AI-search/GEO data** the sheet routes through **Semrush AI** — it's **UI-only (no public API, no MCP)**. The integratable swap-in is **Otterly** or **Peec** (both have official API + MCP, covering the same three endpoints).
3. **LangGraph is fully MCP-compatible** via the official `langchain-mcp-adapters`, with native **human-in-the-loop** (approve/edit/reject) = the CS approval gate. Architecture validated end-to-end.

### B.2 Verified table — the sheet's sources

| Sheet source | Real API? | Free / Paid | MCP server? | Integratable? |
|---|---|---|---|---|
| **GSC** | ✅ yes | **Free** | ⚠️ community ([mcp-gsc](https://github.com/AminForou/mcp-gsc)) | ✅ yes (free) |
| **GA4** | ✅ yes | **Free** | ✅ official ([Google](https://github.com/googleanalytics/google-analytics-mcp)) | ✅ yes (free) |
| **Semrush** (SEO) | ✅ yes | **Paid** (~$500+/mo) | ✅ official ([Semrush](https://developer.semrush.com/api/introduction/semrush-mcp/)) | ✅ yes (paid) |
| **Semrush AI** (GEO/AI-search) | ❌ **none — UI only** | Paid (~$99/user) | ❌ none | ❌ **→ swap to Otterly/Peec** |
| **WordPress** | ✅ yes | **Free** | ✅ official ([WP adapter](https://github.com/WordPress/mcp-adapter)) | ✅ yes (free) |
| **Webflow** | ✅ yes | **Free tier** | ✅ official ([Webflow](https://developers.webflow.com/mcp/reference/overview)) | ✅ yes (free tier) |
| **Contentful** | ✅ yes | **Free tier** | ✅ official ([Contentful](https://github.com/contentful/contentful-mcp-server)) | ✅ yes (free tier) |

### B.3 The swap: Semrush AI → Otterly / Peec

Semrush's AI Visibility Toolkit has **no public API and no MCP** (verified against official docs). For real AI-search data, swap to **Otterly** or **Peec** — both have official API + MCP covering the three endpoints:

| Semrush AI endpoint | What it provides | Otterly | Peec |
|---|---|---|---|
| `ai_visibility_overview` | visibility score, SOV, sentiment, per-engine, competitors | ✅ Brand reports (visibility, SoV, per-engine) | ✅ Visibility + sentiment + SoV (8 engines) |
| `ai_prompt_mentions` | per-prompt mentions, excerpts, citations, competitors | ✅ Prompts + AI responses + mentions | ✅ Prompts + chats + mentions |
| `ai_citation_tracking` | per-URL citations, top prompts, trend | ✅ Citations + per-engine tracking | ✅ Cited-source inspection |

**Recommendation:** Peec (broader engine coverage + SoV analytics); Otterly (1:1 MCP mapping + recommendations). Field shapes differ from Semrush, so the **data-layer adapter normalizes** the chosen vendor into the internal shape — a one-file change.

### B.4 LangGraph ↔ MCP — confirmed compatible

**Verdict: first-class.** MCP tools convert to native LangChain tools via the official **`langchain-mcp-adapters`** (v0.2.2+, Python ≥3.10).

```python
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import ToolNode

client = MultiServerMCPClient({
    "semrush": {"url": "https://mcp.semrush.com/v1/mcp", "transport": "streamable_http"},
    "ga4":     {"url": "http://localhost:8000/mcp",      "transport": "http"},
})

tools = await client.get_tools()      # MCP tools -> LangChain tools
```

**Human-in-the-loop (the CM approval gate):** native via `interrupt()` or `HumanInTheLoopMiddleware` with decision types **approve / edit / reject**. Requires a **checkpointer** (InMemorySaver for prototype, Postgres in prod).

**Architecture:** LangGraph StateGraph mixing deterministic nodes (diff, rank, compose) + MCP tool nodes (data) + LLM node (narrative) + `interrupt()` gate (CM review).

### B.5 Recommended phasing

- **MVP (v1.0 — complete)** ✅: mock data layer (per brief); live Gemini + DeepSeek fallback; ready for Vercel.
- **v1.1 (production integration):** wire real MCP servers (GA4, GSC, Semrush, WordPress, Webflow, Contentful); swap Semrush AI → Peec; data-layer adapter normalizes vendors.
- **v2+ (scale & reach):** multi-language, scheduled runs, optional auto-send for trusted clients.

### B.6 References

**APIs/MCP:** [GA4](https://github.com/googleanalytics/google-analytics-mcp) · [GSC](https://github.com/AminForou/mcp-gsc) · [Semrush](https://developer.semrush.com/api/introduction/semrush-mcp/) · [WordPress](https://github.com/WordPress/mcp-adapter) · [Webflow](https://developers.webflow.com/mcp/reference/overview) · [Contentful](https://github.com/contentful/contentful-mcp-server) · [Otterly](https://docs.otterly.ai/mcp-server) · [Peec](https://docs.peec.ai/mcp/introduction)

**LangGraph + MCP:** [integration guide](https://docs.langchain.com/oss/python/langchain/mcp) · [langchain-mcp-adapters](https://pypi.org/project/langchain-mcp-adapters/) · [human-in-the-loop](https://docs.langchain.com/oss/python/langchain/human-in-the-loop)

---

**Document Version:** 1.0 (MVP Complete)  
**Repository:** https://github.com/anizudeen/GEO-SEO-reporting-agent  
**Status:** Ready for Vercel Deployment
