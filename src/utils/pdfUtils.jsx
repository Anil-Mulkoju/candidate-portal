import html2pdf from "html2pdf.js";
import React from "react";

export const downloadResumePDF = async (
  element,
  fileName = "Ri8Fit_Resume.pdf"
) => {
  if (!element) return;

  const html2pdf = (await import("html2pdf.js")).default;

// const Ri8FitAnonymousResume = React.forwardRef(({ data, mode }, ref) => {
//   return (
//     <div ref={ref} className="ri8fit-pdf">
      
//       {/* ===== PDF STYLES ===== */}
//       <style>{`
//         .ri8fit-pdf {
//           font-family: Inter, Arial, sans-serif;
//           font-size: 12px;
//           line-height: 1.35;
//           color: #1f2937;
//         }

//         .ri8fit-logo {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           margin-bottom: 8px;
//         }

//         .ri8fit-logo span {
//           font-size: 20px;
//           font-weight: 700;
//         }

//         .ri8fit-logo .eight {
//           color: #22c55e;
//         }

//         h1 {
//           font-size: 20px;
//           margin: 0 0 6px 0;
//         }

//         h2 {
//           font-size: 14px;
//           margin: 10px 0 4px 0;
//           padding-bottom: 2px;
//           border-bottom: 1px solid #e5e7eb;
//         }

//         p {
//           margin: 0 0 4px 0;
//         }

//         .ri8fit-section {
//           margin-bottom: 10px;
//         }

//         .ri8fit-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 6px 24px;
//         }

//         .no-break {
//           page-break-inside: avoid;
//           break-inside: avoid;
//         }
//       `}</style>

//       {/* ===== LOGO ===== */}
//       <div className="ri8fit-logo">
//         <span>Ri</span>
//         <span className="eight">8</span>
//         <span>Fit</span>
//       </div>

//       {/* ===== CONTENT ===== */}
//       <div className="ri8fit-section no-break">
//         <h2>Professional Summary</h2>
//         <p>{data?.summary}</p>
//       </div>

//     </div>
//   );
// });

  const opt = {
    margin: [12, 10, 18, 10],
    filename: fileName,
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["css", "legacy"] },
  };

  const worker = html2pdf().set(opt).from(element);

  const pdf = await worker.toPdf().get("pdf");

  const pageCount = pdf.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);

    // Page number
    pdf.setFontSize(9);
    pdf.setTextColor(120);
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pdf.internal.pageSize.getWidth() / 2,
      pdf.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );

    // Last-page watermark
    if (i === pageCount) {
      pdf.setFontSize(8);
      pdf.setTextColor(160);
      pdf.text(
        `Ri8Fit Confidential · Generated on ${new Date().toLocaleString()}`,
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 4,
        { align: "center" }
      );
    }
  }

  await worker.save();
};
