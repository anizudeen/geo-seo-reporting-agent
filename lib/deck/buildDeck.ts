import fs from "fs";
import path from "path";
import pptxgen from "pptxgenjs";
import type { ReportSpec } from "../agent/reportSpec";
import { theme } from "./theme";

const pepperLogoBase64 = (() => {
  const svgPath = path.join(process.cwd(), "public", "pepper-logo.svg");
  const svg = fs.readFileSync(svgPath, "utf-8");
  return "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
})();

const { colors: c, fonts: f, slide: s } = theme;

// Mirror DeckSlide.tsx: percentages may arrive as 0–1 fractions or 0–100 numbers.
function pct(v: number): number {
  return v <= 1 ? Math.round(v * 100) : Math.round(v);
}
function firstSentences(text: string, n: number): string {
  return text.split(/(?<=\.)\s+/).slice(0, n).join(" ");
}
const NUM = (n: string, dark?: boolean) => ({ x: 12.2, y: 6.9, w: 0.8, h: 0.3, fontSize: 11, bold: true, align: "right" as const, color: dark ? "6f6a92" : "bdbdc7", fontFace: f.body });

// Slide 1 — Title (light, purple bar from master)
function addTitleSlide(pptx: pptxgen, spec: ReportSpec) {
  const slide = pptx.addSlide({ masterName: "LIGHT" });
  slide.addText(spec.clientName, { x: 0.7, y: 0.5, w: 8, h: 0.4, fontSize: 15, bold: true, color: c.text, fontFace: f.heading });
  slide.addImage({ data: pepperLogoBase64, x: 12.1, y: 0.59, w: 0.70, h: 0.22 });
  slide.addText(`WEEKLY PERFORMANCE · ${spec.period.toUpperCase()}`, { x: 0.7, y: 2.7, w: 12, h: 0.4, fontSize: 13, bold: true, charSpacing: 1, color: c.brand, fontFace: f.body });
  slide.addText("A strong week for organic — and a clear focus for next week.", { x: 0.7, y: 3.2, w: 9, h: 1.4, fontSize: 32, bold: true, color: c.text, fontFace: f.heading, lineSpacingMultiple: 1.05 });
  slide.addText("01", NUM("01"));
}

// Slide 2 — AI search visibility (dark)
function addAiVisibilitySlide(pptx: pptxgen, spec: ReportSpec) {
  const slide = pptx.addSlide({ masterName: "DARK" });
  const ai = spec.aiVisibility;
  const yourSov = ai.sov.find((x) => x.brand === spec.clientName) || ai.sov.find((x) => /acme/i.test(x.brand)) || ai.sov[0];
  const sovPct = yourSov ? pct(yourSov.pct) : 14;
  const comp = ai.sov.find((x) => x.brand !== spec.clientName && !/acme/i.test(x.brand));

  slide.addText("YOUR VISIBILITY IN AI SEARCH", { x: 0.7, y: 0.7, w: 12, h: 0.4, fontSize: 13, bold: true, charSpacing: 1, color: "9a95c4", fontFace: f.body });
  slide.addText([
    { text: String(ai.score), options: { fontSize: 54, bold: true, color: c.white } },
    { text: "/100", options: { fontSize: 22, color: "9a95c4" } },
  ], { x: 0.7, y: 2.0, w: 4, h: 1, fontFace: f.heading });
  slide.addText("AI visibility index", { x: 0.7, y: 3.0, w: 4, h: 0.3, fontSize: 12, color: "9a95c4", fontFace: f.body });

  const sentence = `When buyers ask ChatGPT, Perplexity and Gemini for product analytics tools, ${spec.clientName} appears ${sovPct}% of the time${comp ? ` vs ${comp.brand} at ${pct(comp.pct)}%` : ""}.`;
  slide.addText(sentence, { x: 5.2, y: 2.0, w: 7.4, h: 1.4, fontSize: 16, color: "cfccf0", fontFace: f.body, lineSpacingMultiple: 1.3 });
  if (ai.citationOpportunity) {
    slide.addText(ai.citationOpportunity, { x: 5.2, y: 3.7, w: 7.4, h: 1.6, fontSize: 13, color: "9a95c4", fontFace: f.body, lineSpacingMultiple: 1.3 });
  }
  slide.addText("02", NUM("02", true));
}

// Slide 3 — Results this week (light)
function addResultsSlide(pptx: pptxgen, spec: ReportSpec) {
  const slide = pptx.addSlide({ masterName: "LIGHT" });
  slide.addText("RESULTS THIS WEEK", { x: 0.7, y: 0.6, w: 8, h: 0.4, fontSize: 13, bold: true, charSpacing: 1, color: c.brand, fontFace: f.body });
  slide.addImage({ data: pepperLogoBase64, x: 12.1, y: 0.69, w: 0.70, h: 0.22 });

  spec.seo.metrics.slice(0, 3).forEach((m, i) => {
    const x = 0.7 + i * 4.0;
    const positive = m.delta.startsWith("+") || m.delta.startsWith("▲");
    slide.addText(m.value, { x, y: 1.8, w: 3.8, h: 0.8, fontSize: 34, bold: true, color: c.text, fontFace: f.heading });
    slide.addText([
      { text: m.label + "  ", options: { color: c.textSecondary } },
      { text: m.delta, options: { bold: true, color: positive ? c.positive : c.negative } },
    ], { x, y: 2.7, w: 3.8, h: 0.3, fontSize: 13, fontFace: f.body });
  });

  slide.addText(firstSentences(spec.execSummary.text, 2), { x: 0.7, y: 3.7, w: 11.8, h: 2, fontSize: 15, color: "3a3654", fontFace: f.body, lineSpacingMultiple: 1.4, valign: "top" });
  slide.addText("03", NUM("03"));
}

// Slide 4 — Next steps / recommendations (light)
function addRecommendationsSlide(pptx: pptxgen, spec: ReportSpec) {
  const slide = pptx.addSlide({ masterName: "LIGHT" });
  slide.addText("YOUR NEXT STEPS FOR NEXT WEEK", { x: 0.7, y: 0.6, w: 8, h: 0.4, fontSize: 13, bold: true, charSpacing: 1, color: c.brand, fontFace: f.body });
  slide.addImage({ data: pepperLogoBase64, x: 12.1, y: 0.69, w: 0.70, h: 0.22 });

  spec.recommendations.slice(0, 3).forEach((r, i) => {
    const y = 1.7 + i * 1.55;
    slide.addText(String(r.num ?? i + 1), { x: 0.7, y, w: 0.5, h: 0.5, fontSize: 16, bold: true, align: "center", color: c.white, fill: { color: c.brand }, fontFace: f.heading });
    slide.addText([
      { text: r.label + " — ", options: { bold: true, color: c.text } },
      { text: r.brief, options: { color: "2c2940" } },
    ], { x: 1.4, y, w: 11.2, h: 1.4, fontSize: 14, fontFace: f.body, lineSpacingMultiple: 1.25, valign: "top" });
  });
  slide.addText("04", NUM("04"));
}

// Slide 5 — What's next & how we can help (light)
function addWhatNextSlide(pptx: pptxgen, spec: ReportSpec) {
  const slide = pptx.addSlide({ masterName: "LIGHT" });
  slide.addText("WHAT'S NEXT & HOW WE CAN HELP", { x: 0.7, y: 0.6, w: 8, h: 0.4, fontSize: 13, bold: true, charSpacing: 1, color: c.brand, fontFace: f.body });
  slide.addImage({ data: pepperLogoBase64, x: 12.1, y: 0.69, w: 0.70, h: 0.22 });

  slide.addShape(pptx.ShapeType.roundRect, { x: 0.7, y: 1.5, w: 5.9, h: 4.6, fill: { color: "f5f3fe" }, line: { color: "f5f3fe" }, rectRadius: 0.1 });
  slide.addText("Pepper handles it", { x: 1.0, y: 1.8, w: 5.3, h: 0.35, fontSize: 14, bold: true, color: "4a43d6", fontFace: f.heading });
  spec.whatNext.pepperHandles.slice(0, 3).forEach((item, i) => {
    slide.addText([{ text: "✓  ", options: { bold: true, color: c.brand } }, { text: item, options: { color: "3a3654" } }], { x: 1.0, y: 2.35 + i * 0.7, w: 5.3, h: 0.6, fontSize: 13, fontFace: f.body, lineSpacingMultiple: 1.2, valign: "top" });
  });
  slide.addText("Let's talk scope →", { x: 1.0, y: 5.4, w: 3, h: 0.4, fontSize: 13, bold: true, color: c.white, fill: { color: c.brand }, fontFace: f.body, align: "center" });

  slide.addShape(pptx.ShapeType.roundRect, { x: 6.8, y: 1.5, w: 5.9, h: 4.6, fill: { color: "faf9fc" }, line: { color: "f0f0f4" }, rectRadius: 0.1 });
  slide.addText("Your team handles it", { x: 7.1, y: 1.8, w: 5.3, h: 0.35, fontSize: 14, bold: true, color: c.textSecondary, fontFace: f.heading });
  spec.whatNext.selfService.slice(0, 3).forEach((item, i) => {
    slide.addText([{ text: "☐  ", options: { color: "9a9aa6" } }, { text: item, options: { color: c.textSecondary } }], { x: 7.1, y: 2.35 + i * 0.7, w: 5.3, h: 0.6, fontSize: 13, fontFace: f.body, lineSpacingMultiple: 1.2, valign: "top" });
  });
  slide.addText("05", NUM("05"));
}

export async function buildDeck(spec: ReportSpec): Promise<Uint8Array> {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Pepper Atlas Reporting Agent";
  pptx.company = "Pepper Content";

  pptx.defineSlideMaster({
    title: "DARK",
    background: { color: "191730" },
  });
  pptx.defineSlideMaster({
    title: "LIGHT",
    background: { color: c.white },
    objects: [{ rect: { x: 0, y: 0, w: 0.08, h: s.h, fill: { color: c.brand } } }],
  });

  addTitleSlide(pptx, spec);
  addAiVisibilitySlide(pptx, spec);
  addResultsSlide(pptx, spec);
  addRecommendationsSlide(pptx, spec);
  addWhatNextSlide(pptx, spec);

  const buf = await pptx.write({ outputType: "uint8array" });
  return buf as Uint8Array;
}
