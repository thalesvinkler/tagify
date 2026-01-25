import sharp from 'sharp';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface LabelPayload {
  name: string;
  country: string;
  bloodType: string;
}

export async function generatePng(payload: LabelPayload) {
  const width = 800;
  const height = 400;

  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" rx="32" fill="#0f172a" />
    <rect x="24" y="24" width="752" height="352" rx="24" fill="#111827" stroke="#34d399" stroke-width="3" />
    <text x="60" y="120" font-size="36" fill="#f8fafc" font-family="Arial">${payload.name}</text>
    <text x="60" y="180" font-size="24" fill="#cbd5f5" font-family="Arial">${payload.country}</text>
    <text x="60" y="250" font-size="32" fill="#34d399" font-family="Arial">Tipo sanguíneo: ${payload.bloodType}</text>
    <text x="60" y="320" font-size="18" fill="#94a3b8" font-family="Arial">Gerado automaticamente</text>
  </svg>
  `;

  return sharp(Buffer.from(svg))
    .png()
    .toBuffer();
}

export async function generatePdf(payload: LabelPayload, pngBuffer: Buffer) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const image = await pdfDoc.embedPng(pngBuffer);

  page.drawText('Etiquetas geradas automaticamente', {
    x: 50,
    y: 790,
    size: 16,
    font,
    color: rgb(0.2, 0.8, 0.6)
  });

  const { width, height } = image.scale(0.6);
  let y = 700;

  for (let i = 0; i < 6; i += 1) {
    page.drawImage(image, {
      x: 50,
      y: y - height,
      width,
      height
    });
    y -= height + 20;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export function validatePayload(payload: Partial<LabelPayload>): payload is LabelPayload {
  return Boolean(payload.name && payload.country && payload.bloodType);
}
