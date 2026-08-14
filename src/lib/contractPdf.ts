import { jsPDF } from 'jspdf';
import type { ContractRecord, Match } from './types';
import { formatEur } from './taxRules';

/**
 * A real, generated PDF — not a screenshot of a webpage pretending to be a
 * document. Structure follows the standard five things any sponsorship
 * contract needs to cover: what's being sponsored, how it's funded, what's
 * owed in return, exclusivity, and duration/termination. Demo-grade, not
 * legal advice — said plainly on the page itself.
 */
export function generateContractPdf(
  match: Match,
  sponsorName: string,
  dealValue: number,
  signed?: ContractRecord,
): Blob {
  const { profile } = match;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 56;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  let y = 72;

  const heading = (text: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 90);
    doc.text(text.toUpperCase(), margin, y);
    y += 16;
  };

  const body = (text: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 24);
    const lines = doc.splitTextToSize(text, width);
    doc.text(lines, margin, y);
    y += lines.length * 15 + 14;
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(10, 10, 15);
  doc.text('Sponsorship Agreement', margin, y);
  y += 30;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 130);
  doc.text(`Generated ${new Date().toLocaleDateString('en-GB')}`, margin, y);
  y += 30;

  heading('1. Parties');
  body(`Sponsor: ${sponsorName}\n${profile.name} (${profile.type === 'club' ? 'club' : 'athlete'}, ${profile.region})`);

  heading('2. Object');
  body(
    `This agreement covers a sponsorship of ${profile.name} for the current season, arranged through the Sponsorship Marketplace platform.`,
  );

  heading('3. Funding');
  body(`Amount: ${formatEur(dealValue)}, paid in cash. No payment-in-kind component.`);

  heading('4. Return Service');
  body(
    `In exchange, ${profile.name} provides:\n` + profile.activation.map((a) => `- ${a}`).join('\n'),
  );

  heading('5. Relation to Other Sponsors');
  body(
    'This agreement does not grant category exclusivity unless separately negotiated in writing between the parties.',
  );

  heading('6. Duration & Termination');
  body(
    'This agreement covers one season from the date of signature and may be terminated by either party with 30 days\' written notice.',
  );

  heading('7. Signatures');
  if (signed) {
    body(
      `Sponsor: ${signed.sponsorSignatory}\n${profile.name}: ${signed.clubSignatory}\nSigned: ${new Date(signed.signedAt).toLocaleString('en-GB')}`,
    );
  } else {
    body('Sponsor: ______________________\n' + `${profile.name}: ______________________`);
  }

  y += 10;
  doc.setDrawColor(220, 220, 215);
  doc.line(margin, y, margin + width, y);
  y += 20;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 150);
  const disclaimer = doc.splitTextToSize(
    'This is a demo document generated for the Sponsorship Marketplace platform. It is not legally binding. A production deployment would route signature through a licensed e-signature provider and legal review.',
    width,
  );
  doc.text(disclaimer, margin, y);

  return doc.output('blob');
}
