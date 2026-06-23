import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

export function getModel(temperature = 0): BaseChatModel {
  const provider = process.env.LLM_PROVIDER ?? "google";

  switch (provider) {
    case "openai":
      return new ChatOpenAI({ model: "gpt-4o-mini", temperature, apiKey: process.env.OPENAI_API_KEY });
    case "anthropic":
      return new ChatAnthropic({ model: "claude-haiku-4-5-20251001", temperature, apiKey: process.env.ANTHROPIC_API_KEY });
    case "google":
    default:
      return new ChatGoogleGenerativeAI({
        // gemini-2.5-flash-lite: cheapest tier + highest free-tier limits (fewest 429s) for the demo.
        // Override with GEMINI_MODEL env (e.g. gemini-2.5-flash for higher quality). NOT 2.0-flash (quota:0 on this key).
        model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite",
        temperature,
        apiKey: process.env.GOOGLE_API_KEY,
        // gemini-2.5 is a "thinking" model — disable it so structured report
        // generation stays fast (~1-2s) instead of 60s+.
        thinkingConfig: { thinkingBudget: 0 },
      });
  }
}

// DeepSeek — OpenAI-compatible API, used as automatic fallback when Gemini hits quota.
// Requires DEEPSEEK_API_KEY in env. Get a key at platform.deepseek.com.
// Override model with DEEPSEEK_MODEL env var.
export function getDeepSeekModel(temperature = 0): BaseChatModel {
  return new ChatOpenAI({
    model: process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash",
    temperature,
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: "https://api.deepseek.com" },
  });
}

// Returns true for Gemini 429 / quota exhaustion errors.
export function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("429") || /quota/i.test(msg) || /rate.?limit/i.test(msg);
}
