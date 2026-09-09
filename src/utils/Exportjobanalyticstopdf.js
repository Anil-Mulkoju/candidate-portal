
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ─── Page geometry ────────────────────────────────────────────────────────────
const PAGE_W  = 210;   // A4 portrait mm
const PAGE_H  = 297;
const MARGIN  = 10;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BRAND_BLUE  = "#174FDF";
const BRAND_CYAN  = "#0097A7";

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────


function drawHeader(doc, { jobTitle, generatedAt }) {
  // Blue band
  doc.setFillColor(23, 79, 223);   // BRAND_BLUE
  doc.rect(0, 0, PAGE_W, 32, "F");

  // Accent stripe
  doc.setFillColor(0, 151, 167);   // BRAND_CYAN
  doc.rect(0, 32, PAGE_W, 2, "F");

  // Report title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text("Job Analytics Report", MARGIN, 13);

  // Job name (truncated if very long)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(210, 220, 255);
  const subtitle = jobTitle ? `${jobTitle}  ·  Generated ${generatedAt}` : `Generated ${generatedAt}`;
  doc.text(subtitle, MARGIN, 22);

  return 40; // body starts at 40 mm
}

/**
 * Draws page-number footer.
 */
function drawFooter(doc, pageNum, totalPages, jobTitle) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text(
    `Page ${pageNum} of ${totalPages}`,
    PAGE_W - MARGIN - 18,
    PAGE_H - 6,
  );
  doc.text(
    jobTitle ? `${jobTitle} — Analytics` : "Job Analytics",
    MARGIN,
    PAGE_H - 6,
  );
}

/**
 * Captures a DOM element to a PNG data URL + mm dimensions.
 */
async function captureEl(el) {
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    throw new Error(`Element "${el.id || el.className}" has zero size — skipped`);
  }

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  if (!canvas.width || !canvas.height) {
    throw new Error(`html2canvas produced empty canvas for "${el.id}"`);
  }

  const imgData  = canvas.toDataURL("image/png");
  const heightMm = (canvas.height * CONTENT_W) / canvas.width;
  return { imgData, widthMm: CONTENT_W, heightMm };
}

function placeImage(doc, { imgData, widthMm, heightMm }, cursorY, pages) {
  const remaining = PAGE_H - MARGIN - cursorY;
  if (heightMm > remaining && cursorY > MARGIN + 5) {
    doc.addPage();
    pages.count += 1;
    cursorY = MARGIN;
  }
  doc.addImage(imgData, "PNG", MARGIN, cursorY, widthMm, heightMm);
  return cursorY + heightMm + 6;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exports the Job Analytics tab to a PDF.
 *
 * @param {Object}   opts
 * @param {string}   opts.jobTitle        - displayed in header + footer
 * @param {string}   [opts.fileName]      - defaults to dated slug
 */
export async function exportJobAnalyticsToPdf({ jobTitle = "", fileName } = {}) {
  // Section selectors — match the id="" attributes on each section Box
  const SELECTORS = [
    "#job-analytics-stage-breakdown",
    "#job-analytics-funnel-chart",
    "#job-analytics-status-chart",
    "#job-analytics-interview-chart",
    "#job-analytics-offer-chart",
    "#job-analytics-experience-donut",
  ];

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const generatedAt = new Date().toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  let cursorY = drawHeader(doc, { jobTitle, generatedAt });
  const pages = { count: 1 };

  for (const selector of SELECTORS) {
    const el = document.querySelector(selector);
    if (!el) continue;
    try {
      const section = await captureEl(el);
      cursorY = placeImage(doc, section, cursorY, pages);
    } catch (err) {
      console.warn(`PDF export: skipping "${selector}" —`, err.message);
    }
  }

  // Stamp footers now that total pages is known
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages, jobTitle);
  }

  const name =
    fileName ||
    `job-analytics-${jobTitle.toLowerCase().replace(/\s+/g, "-") || "report"}-${
      new Date().toISOString().slice(0, 10)
    }.pdf`;

  doc.save(name);
}