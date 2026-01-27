import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

export async function exportPrescriptionPadPDF(svgElement, filename = 'prescription-pad.pdf') {
  if (!svgElement) return false;

  // Create PDF at 5.5" × 4.25" (half letter, landscape orientation of the pad)
  // 1 inch = 72 points in PDF
  const width = 5.5 * 72; // 396 points
  const height = 4.25 * 72; // 306 points
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [width, height],
  });
  
  // Convert SVG to PDF
  // svg2pdf.js renders the SVG directly into the PDF
  await pdf.svg(svgElement, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });
  
  // Save the PDF
  pdf.save(filename);
  
  return true;
}
