import pptxgen from "pptxgenjs";
import type { ReportSpec } from "../agent/reportSpec";
import { theme } from "./theme";
import { dataset } from "../data/dataset";

const { colors: c, fonts: f, slide: s } = theme;

function addTitleSlide(pptx: pptxgen, spec: ReportSpec) {
  const slide = pptx.addSlide({ masterName: "COVER" });
  slide.addText(spec.clientName, { x: 0.6, y: 2.2, w: 12, h: 0.8, fontSize: 36, bold: true, color: c.white, fontFace: f.heading });
  slide.addText(`Weekly Performance Report · ${spec.period}`, { x: 0.6, y: 3.2, w: 12, h: 0.4, fontSize: 16, color: "c0c0e0", fontFace: f.body });
  slide.addText(spec.execSummary.text.split(".")[0] + ".", { x: 0.6, y: 4.0, w: 12, h: 0.5, fontSize: 14, color: "a0a0c8", fontFace: f.body });
  slide.addText("Prepared by Pepper · Atlas Reporting Agent", { x: 0.6, y: 6.8, w: 8, h: 0.3, fontSize: 10, color: "6060a0", fontFace: f.body });
}

function addAiVisibilitySlide(pptx: pptxgen, spec: ReportSpec) {
  const slide = pptx.addSlide({ masterName: "DARK" });
  slide.addText("01", { x: 0.6, y: 0.3, w: 1, h: 0.3, fontSize: 11, color: "6060a0", fontFace: f.body });
  slide.addText("Your visibility in AI search", { x: 0.6, y: 0.6, w: 12, h: 0.5, fontSize: 22, bold: true, color: c.white, fontFace: f.heading });

  const { score, delta, sov, engineBreakdown } = spec.aiVisibility;
  const deltaStr = delta < 0 ? `▼ ${Math.abs(delta)} vs last week` : `▲ ${delta} vs last week`;

  slide.addText(String(score), { x: 0.6, y: 1.4, w: 2.5, h: 1.2, fontSize: 72, bold: true, color: c.brand, fontFace: f.heading });
  slide.addText("/ 100  AI visibility index", { x: 2.6, y: 1.8, w: 4, h: 0.5, fontSize: 16, color: "a0a0c8", fontFace: f.body });
  slide.addText(deltaStr, { x: 0.6, y: 2.7, w: 5, h: 0.3, fontSize: 13, color: delta < 0 ? "f87171" : c.positive, fontFace: f.body });

  slide.addText("When buyers ask ChatGPT, Perplexity and Gemini for analytics tools,", { x: 0.6, y: 3.2, w: 12, h: 0.35, fontSize: 13, color: "d0d0f0", fontFace: f.body });
  const yourSov = sov.find((s) => s.brand === spec.clientName || s.brand === "Acme");
  slide.addText(
    `${spec.clientName} appears ${yourSov ? Math.round(yourSov.pct * 100) : 14}% of the time. Closing this gap is the focus of next week.`,
    { x: 0.6, y: 3.6, w: 12, h: 0.35, fontSize: 13, color: "d0d0f0", fontFace: f.body }
  );

  // SOV bar chart
  const chartData = sov.map((s) => ({ name: s.brand, labels: ["Share of voice"], values: [Math.round(s.pct * 100)] }));
  if (chartData.length > 0) {
    slide.addChart("bar", chartData, {
      x: 7, y: 1.2, w: 5.8, h: 3.2,
      chartColors: [c.brand, "4a4a6a", "6a6a8a"],
      showLegend: true, legendPos: "b",
      valAxisTitle: "Share of Voice (%)", showValAxisTitle: false,
      dataLabelFormatCode: "0%",
      barDir: "bar",
    });
  }

  // Engine breakdown
  if (engineBreakdown.length > 0) {
    slide.addText("Per engine:", { x: 0.6, y: 4.4, w: 6, h: 0.3, fontSize: 11, color: "8080b0", fontFace: f.body });
    engineBreakdown.slice(0, 4).forEach((e, i) => {
      const chg = e.change >= 0 ? `▲${e.change}` : `▼${Math.abs(e.change)}`;
      slide.addText(`${e.name}  ${e.score}/100  ${chg}`, {
        x: 0.6, y: 4.7 + i * 0.32, w: 6, h: 0.28, fontSize: 11,
        color: e.change < 0 ? "f87171" : "a0f0c0", fontFace: f.body,
      });
    });
  }
}

function addSeoSlide(pptx: pptxgen, spec: ReportSpec) {
  const slide = pptx.addSlide({ masterName: "LIGHT" });
  slide.addText("02", { x: 0.6, y: 0.3, w: 1, h: 0.3, fontSize: 11, color: c.muted, fontFace: f.body });
  slide.addText("Results this week", { x: 0.6, y: 0.6, w: 12, h: 0.5, fontSize: 22, bold: true, color: c.text, fontFace: f.heading });

  const kpis = spec.seo.metrics.slice(0, 3);
  kpis.forEach((m, i) => {
    const x = 0.6 + i * 4.2;
    slide.addText(m.value, { x, y: 1.3, w: 3.8, h: 0.7, fontSize: 32, bold: true, color: c.text, fontFace: f.heading });
    slide.addText(m.label, { x, y: 2.0, w: 3.8, h: 0.3, fontSize: 12, color: c.muted, fontFace: f.body });
    const isPositive = m.delta.startsWith("+") || m.delta.startsWith("▲");
    slide.addText(m.delta, { x, y: 2.35, w: 3.8, h: 0.3, fontSize: 12, color: isPositive ? c.positive : c.negative, fontFace: f.body });
  });

  slide.addText(spec.execSummary.winOfWeek, { x: 0.6, y: 3.0, w: 12, h: 0.5, fontSize: 14, bold: true, color: c.text, fontFace: f.body });
  slide.addText(spec.seo.conversionNote, { x: 0.6, y: 3.6, w: 12, h: 0.4, fontSize: 12, color: c.textSecondary, fontFace: f.body });

  // Weekly clicks chart
  const weeklyData = dataset.gsc.weeklyClicks;
  slide.addChart("line", [{ name: "Organic clicks", labels: weeklyData.map((_, i) => `W${i + 1}`), values: weeklyData.map((w) => w.clicks) }], {
    x: 0.6, y: 4.2, w: 12, h: 2.8,
    chartColors: [c.brand],
    showLegend: false,
    lineDataSymbol: "none",
    lineSmooth: true,
    catAxisLabelColor: c.muted,
    valAxisLabelColor: c.muted,
  });
}

function addRecommendationsSlide(pptx: pptxgen, spec: ReportSpec) {
  const slide = pptx.addSlide({ masterName: "LIGHT" });
  slide.addText("03", { x: 0.6, y: 0.3, w: 1, h: 0.3, fontSize: 11, color: c.muted, fontFace: f.body });
  slide.addText("Your next steps for next week", { x: 0.6, y: 0.6, w: 12, h: 0.5, fontSize: 22, bold: true, color: c.text, fontFace: f.heading });

  spec.recommendations.forEach((r, i) => {
    slide.addText(`${r.num}`, { x: 0.6, y: 1.5 + i * 1.5, w: 0.5, h: 0.5, fontSize: 20, bold: true, color: c.brand, fontFace: f.heading });
    slide.addText(r.label, { x: 1.2, y: 1.5 + i * 1.5, w: 11, h: 0.4, fontSize: 15, bold: true, color: c.text, fontFace: f.heading });
    slide.addText(r.brief, { x: 1.2, y: 1.95 + i * 1.5, w: 11, h: 0.4, fontSize: 12, color: c.textSecondary, fontFace: f.body });
  });
}

function addWhatNextSlide(pptx: pptxgen, spec: ReportSpec) {
  const slide = pptx.addSlide({ masterName: "LIGHT" });
  slide.addText("04", { x: 0.6, y: 0.3, w: 1, h: 0.3, fontSize: 11, color: c.muted, fontFace: f.body });
  slide.addText("What's next & how we can help", { x: 0.6, y: 0.6, w: 12, h: 0.5, fontSize: 22, bold: true, color: c.text, fontFace: f.heading });

  // Pepper handles it column
  slide.addText("Pepper handles it", { x: 0.6, y: 1.4, w: 5.8, h: 0.35, fontSize: 14, bold: true, color: c.brand, fontFace: f.heading });
  spec.whatNext.pepperHandles.forEach((item, i) => {
    slide.addText(`✓  ${item}`, { x: 0.6, y: 1.9 + i * 0.55, w: 5.8, h: 0.45, fontSize: 12, color: c.text, fontFace: f.body });
  });
  slide.addText("Let's talk scope →", { x: 0.6, y: 4.2, w: 3, h: 0.4, fontSize: 12, bold: true, color: c.brand, fontFace: f.body });

  // Self-service column
  slide.addText("Your team handles it", { x: 7.0, y: 1.4, w: 5.8, h: 0.35, fontSize: 14, bold: true, color: c.textSecondary, fontFace: f.heading });
  spec.whatNext.selfService.forEach((item, i) => {
    slide.addText(`☐  ${item}`, { x: 7.0, y: 1.9 + i * 0.55, w: 5.8, h: 0.45, fontSize: 12, color: c.textSecondary, fontFace: f.body });
  });
}

export async function buildDeck(spec: ReportSpec): Promise<Uint8Array> {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Pepper Atlas Reporting Agent";
  pptx.company = "Pepper Content";

  // Slide masters
  pptx.defineSlideMaster({
    title: "COVER",
    background: { color: c.aiDark },
    objects: [
      { rect: { x: 0, y: 0, w: 0.06, h: s.h, fill: { color: c.brand } } },
    ],
  });
  pptx.defineSlideMaster({
    title: "DARK",
    background: { color: c.aiDark },
    objects: [
      { rect: { x: 0, y: 0, w: 0.06, h: s.h, fill: { color: c.brand } } },
    ],
  });
  pptx.defineSlideMaster({
    title: "LIGHT",
    background: { color: c.white },
    objects: [
      { rect: { x: 0, y: 0, w: 0.06, h: s.h, fill: { color: c.brand } } },
    ],
  });

  addTitleSlide(pptx, spec);
  addAiVisibilitySlide(pptx, spec);
  addSeoSlide(pptx, spec);
  addRecommendationsSlide(pptx, spec);
  addWhatNextSlide(pptx, spec);

  const buf = await pptx.write({ outputType: "uint8array" });
  return buf as Uint8Array;
}
