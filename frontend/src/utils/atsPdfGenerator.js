import { jsPDF } from 'jspdf';

/**
 * Generates an ATS-compliant, single-column PDF resume
 * Designed specifically for ATS screening software (Workday, Greenhouse, Lever, Ashby, Taleo).
 */
export function generateAtsPdf(resumeText, targetRole = 'Software Engineer') {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
    orientation: 'portrait'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const checkPageBreak = (neededHeight = 20) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const lines = resumeText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      y += 8;
      continue;
    }

    // Name Header (# NAME)
    if (line.startsWith('# ')) {
      checkPageBreak(35);
      const name = line.replace('# ', '').trim();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(20, 20, 20);
      doc.text(name, margin, y);
      y += 20;
    }
    // Section Header (## SECTION)
    else if (line.startsWith('## ')) {
      checkPageBreak(30);
      y += 6;
      const sectionTitle = line.replace('## ', '').trim();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text(sectionTitle.toUpperCase(), margin, y);
      y += 4;
      
      // ATS Divider Line
      doc.setDrawColor(200, 205, 215);
      doc.setLineWidth(0.75);
      doc.line(margin, y, margin + contentWidth, y);
      y += 12;
    }
    // Sub Header (### Title | Company)
    else if (line.startsWith('### ')) {
      checkPageBreak(22);
      const title = line.replace('### ', '').trim();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text(title, margin, y);
      y += 13;
    }
    // Date / Location (*2024 - PRESENT | LOCATION*)
    else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('* **')) {
      checkPageBreak(16);
      const meta = line.replace(/\*/g, '').trim();
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(meta, margin, y);
      y += 12;
    }
    // Bullet Point (* bullet)
    else if (line.startsWith('* ') || line.startsWith('- ')) {
      checkPageBreak(20);
      let bulletText = line.replace(/^[\*\-]\s+/, '').trim();
      
      // Clean bold markers for PDF text
      bulletText = bulletText.replace(/\*\*(.*?)\*\*/g, '$1');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);

      const bulletIndent = 12;
      const textWidth = contentWidth - bulletIndent;
      const splitLines = doc.splitTextToSize(bulletText, textWidth);

      // Draw ATS round bullet point
      doc.text('•', margin + 2, y);
      doc.text(splitLines, margin + bulletIndent, y);

      y += splitLines.length * 12 + 3;
    }
    // Standard Paragraph
    else {
      checkPageBreak(18);
      let cleanText = line.replace(/\*\*(.*?)\*\*/g, '$1');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);

      const splitLines = doc.splitTextToSize(cleanText, contentWidth);
      doc.text(splitLines, margin, y);
      y += splitLines.length * 12 + 2;
    }
  }

  // Save the ATS PDF
  const filename = `ATS_Optimized_Resume_${targetRole.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
}
