import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

/**
 * Convert SVG to black and white by replacing all colors
 */
function convertToBlackAndWhite(svgElement) {
  const clone = svgElement.cloneNode(true);
  
  // Colors to preserve as-is
  const preserveColors = ['none', 'transparent', '#fff', '#ffffff', 'white'];
  
  // Process all elements
  const processElement = (el) => {
    // Handle fill attribute
    const fill = el.getAttribute('fill');
    if (fill && !preserveColors.includes(fill.toLowerCase())) {
      // Exception: warning band text should be white on black
      if (el.closest('.warning-band') && el.tagName === 'text') {
        el.setAttribute('fill', '#ffffff');
      } else {
        el.setAttribute('fill', '#000000');
      }
    }
    
    // Handle stroke attribute
    const stroke = el.getAttribute('stroke');
    if (stroke && !preserveColors.includes(stroke.toLowerCase())) {
      el.setAttribute('stroke', '#000000');
    }
    
    // Handle inline styles
    const style = el.getAttribute('style');
    if (style) {
      let newStyle = style;
      
      // Replace fill colors (but not fill: none or fill: white)
      newStyle = newStyle.replace(
        /fill:\s*(?!none|transparent|white|#fff|#ffffff)[^;]+/gi, 
        'fill: #000000'
      );
      
      // Replace stroke colors
      newStyle = newStyle.replace(
        /stroke:\s*(?!none|transparent)[^;]+/gi, 
        'stroke: #000000'
      );
      
      el.setAttribute('style', newStyle);
    }
    
    // Handle rect fill for warning band background
    if (el.tagName === 'rect' && el.closest('.warning-band')) {
      el.setAttribute('fill', '#000000');
    }
  };
  
  clone.querySelectorAll('*').forEach(processElement);
  
  return clone;
}

/**
 * Export prescription pad SVG to PDF
 * @param {SVGElement} svgElement - The SVG element to export
 * @param {string} filename - Output filename
 * @returns {Promise<boolean>}
 */
export async function exportPrescriptionPadPDF(svgElement, filename = 'prescription-pad.pdf') {
  if (!svgElement) return false;

  // Dimensions: 5.5" x 4.25" at 72 DPI
  const width = 5.5 * 72;  // 396 points
  const height = 4.25 * 72; // 306 points
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [width, height],
  });
  
  // Convert to black and white
  const bwSvg = convertToBlackAndWhite(svgElement);
  
  // Render SVG to PDF
  await pdf.svg(bwSvg, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });
  
  pdf.save(filename);
  return true;
}

/**
 * Get SVG element reference for export
 * Usage: Pass a ref to PrescriptionPadSVG component
 */
export function getSvgElement(ref) {
  if (!ref.current) {
    console.error('SVG ref is not attached');
    return null;
  }
  return ref.current.querySelector('svg') || ref.current;
}