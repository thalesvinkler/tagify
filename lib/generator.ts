import { readFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { PDFDocument, PDFPage, StandardFonts, rgb } from 'pdf-lib';

export interface LabelPayload {
  name: string;
  country: string;
  bloodType: string;
}

const countryFlagCodes: Record<string, string> = {
  'Antigua e Barbuda': 'ag',
  Argentina: 'ar',
  Bahamas: 'bs',
  Barbados: 'bb',
  Belize: 'bz',
  Bolivia: 'bo',
  Brasil: 'br',
  Canada: 'ca',
  Chile: 'cl',
  Colombia: 'co',
  'Costa Rica': 'cr',
  Cuba: 'cu',
  Dominica: 'dm',
  Equador: 'ec',
  'El Salvador': 'sv',
  'Estados Unidos': 'us',
  Granada: 'gd',
  Guatemala: 'gt',
  Guiana: 'gy',
  Haiti: 'ht',
  Honduras: 'hn',
  Jamaica: 'jm',
  Mexico: 'mx',
  Nicaragua: 'ni',
  Panama: 'pa',
  Paraguai: 'py',
  Peru: 'pe',
  'Republica Dominicana': 'do',
  'Sao Cristovao e Nevis': 'kn',
  'Santa Lucia': 'lc',
  'Sao Vicente e Granadinas': 'vc',
  Suriname: 'sr',
  'Trinidad e Tobago': 'tt',
  Uruguai: 'uy',
  Venezuela: 've'
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function splitName(name: string, chunkSize = 10) {
  const normalized = name.trim().toUpperCase();
  if (!normalized) return ['NOME'];

  const chunks: string[] = [];
  for (let i = 0; i < normalized.length; i += chunkSize) {
    chunks.push(normalized.slice(i, i + chunkSize));
  }
  return chunks.slice(0, 2);
}

async function resolveFontFilePath() {
  const semibold = join(process.cwd(), 'public', 'fonts', 'Oxanium-SemiBold.ttf');

  try {
    await readFile(semibold);
    return { semibold };
  } catch {
    console.warn(
      'Oxanium font not found for generatePng. Add Oxanium-SemiBold.ttf to public/fonts.'
    );
    return { semibold: '' };
  }
}

async function getFlagDataUri(country: string) {
  const code = countryFlagCodes[country] ?? 'br';
  const remoteUrl = `https://flagcdn.com/w320/${code}.png`;

  try {
    const response = await fetch(remoteUrl);
    if (response.ok) {
      const bytes = Buffer.from(await response.arrayBuffer());
      return `data:image/png;base64,${bytes.toString('base64')}`;
    }
  } catch {
    // Fall through to local fallback.
  }

  const fallbackPath = join(process.cwd(), 'public', 'flags', 'br.svg');
  const svgBytes = await readFile(fallbackPath);
  const pngBytes = await sharp(svgBytes).resize(320, 220, { fit: 'cover' }).png().toBuffer();
  return `data:image/png;base64,${pngBytes.toString('base64')}`;
}

export async function generatePng(payload: LabelPayload) {
  const width = 800;
  const height = 210;
  const basePath = join(process.cwd(), 'public', 'customize_label.png');
  const baseBuffer = await sharp(basePath).resize(width, height).png().toBuffer();

  const flagDataUri = await getFlagDataUri(payload.country);
  const fontFiles = await resolveFontFilePath();
  const nameLines = splitName(payload.name, 10);
  const isLongName = nameLines.length > 1;
  const isLongBlood = payload.bloodType.length > 2;

  const flagX = Math.round(width * 0.165);
  const flagY = Math.round(height * 0.185);
  const flagW = Math.round(width * 0.201);
  const flagH = Math.round(height * 0.57);

  const nameX = Math.round(width * 0.26);
  const nameW = Math.round(width * 0.35);
  const nameTop = Math.round(height * (isLongName ? 0.33 : 0.38));
  const nameFont = Math.round(height * (isLongName ? 0.15 : 0.2));
  const nameLineHeight = 30;

  const bloodW = Math.round(width * 0.16);
  const bloodX = Math.round(width - (bloodW * (isLongBlood ? 1.65 : 1.55)));
  const bloodTop = Math.round(height * 0.25);
  const bloodFont = Math.round(height * (isLongBlood ? 0.07 : 0.1));

  const safeBlood = escapeXml((payload.bloodType || 'A+').toUpperCase());
  const nameText = escapeXml(nameLines.join('\n'));

  const overlaySvg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="flagMask">
        <rect
          x="${flagX}"
          y="${flagY}"
          width="${flagW}"
          height="${flagH}"
          rx="10"
          ry="10"
          fill="#fff"
        />
      </mask>
    </defs>
    <image
      href="${flagDataUri}"
      x="${flagX}"
      y="${flagY}"
      width="${flagW}"
      height="${flagH}"
      preserveAspectRatio="xMidYMid slice"
      transform="skewX(-29.5)"
      mask="url(#flagMask)"
    />
  </svg>
  `;

  const composites: sharp.OverlayOptions[] = [{ input: Buffer.from(overlaySvg), top: 0, left: 0 }];

  const nameOverlayWidth = nameW + 120;
  const nameOverlayHeight = isLongName ? nameLineHeight * 2 + 20 : nameLineHeight + 20;
  const nameOverlay = await sharp({
    create: {
      width: nameOverlayWidth,
      height: nameOverlayHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      {
        input: {
          text: {
            text: `<span foreground="#ffffff">${nameText}</span>`,
            rgba: true,
            align: 'center',
            width: nameW,
            height: nameOverlayHeight,
            font: `Oxanium SemiBold ${nameFont}`,
            fontfile: fontFiles.semibold || undefined
          }
        },
        left: 60,
        top: 0
      }
    ])
    .affine(
      [
        [1, -0.3],
        [0, 1]
      ],
      { background: { r: 0, g: 0, b: 0, alpha: 0 } }
    )
    .png()
    .toBuffer();

  const bloodOverlayWidth = bloodW + 70;
  const bloodOverlayHeight = bloodFont + 20;
  const bloodOverlay = await sharp({
    create: {
      width: bloodOverlayWidth,
      height: bloodOverlayHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      {
        input: {
          text: {
            text: `<span foreground="#ffffff">${safeBlood}</span>`,
            rgba: true,
            align: 'center',
            width: bloodW,
            height: bloodOverlayHeight,
            font: `Oxanium SemiBold ${bloodFont}`,
            fontfile: fontFiles.semibold || undefined
          }
        },
        left: 35,
        top: 0
      }
    ])
    .affine(
      [
        [1, -0.3],
        [0, 1]
      ],
      { background: { r: 0, g: 0, b: 0, alpha: 0 } }
    )
    .png()
    .toBuffer();

  composites.push({ input: nameOverlay, left: nameX, top: nameTop });
  composites.push({ input: bloodOverlay, left: bloodX, top: bloodTop });

  return sharp(baseBuffer).composite(composites).png().toBuffer();
}

export async function generatePdf(payload: LabelPayload, pngBuffer: Buffer) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const image = await pdfDoc.embedPng(new Uint8Array(pngBuffer));
  const imageAspectRatio = image.height / image.width;
  const pageSize: [number, number] = [595.28, 841.89];
  const pageWidth = pageSize[0];
  const pageHeight = pageSize[1];
  const marginX = 28;
  const gutterX = 12;
  const gutterY = 12;
  const sectionGap = 18;

  const drawLayoutInArea = (
    page: PDFPage,
    config: { columns: number; rows: number; label: string; topY: number; bottomY: number }
  ) => {
    page.drawText(config.label, {
      x: marginX,
      y: config.topY,
      size: 11,
      font,
      color: rgb(0.2, 0.8, 0.6)
    });

    const areaTop = config.topY - 14;
    const areaHeight = areaTop - config.bottomY;
    const maxCellWidth =
      (pageWidth - marginX * 2 - gutterX * (config.columns - 1)) / config.columns;
    const maxCellHeight = (areaHeight - gutterY * (config.rows - 1)) / config.rows;
    const labelWidth = Math.min(maxCellWidth, maxCellHeight / imageAspectRatio);
    const labelHeight = labelWidth * imageAspectRatio;
    const gridWidth = config.columns * labelWidth + (config.columns - 1) * gutterX;
    const gridHeight = config.rows * labelHeight + (config.rows - 1) * gutterY;
    const startX = (pageWidth - gridWidth) / 2;
    const startTop = areaTop - Math.max(0, (areaHeight - gridHeight) / 2);

    for (let row = 0; row < config.rows; row += 1) {
      for (let col = 0; col < config.columns; col += 1) {
        const x = startX + col * (labelWidth + gutterX);
        const yTop = startTop - row * (labelHeight + gutterY);
        const y = yTop - labelHeight;
        page.drawImage(image, {
          x,
          y,
          width: labelWidth,
          height: labelHeight
        });
      }
    }
  };

  const page1 = pdfDoc.addPage(pageSize);
  page1.drawText(`Nome: ${payload.name} | Pais: ${payload.country} | Tipo: ${payload.bloodType}`, {
    x: marginX,
    y: pageHeight - 24,
    size: 9,
    color: rgb(0.58, 0.64, 0.74)
  });

  const usableTop = pageHeight - 44;
  const usableBottom = 28;
  const totalUsableHeight = usableTop - usableBottom - sectionGap;
  const section1Height = totalUsableHeight * 0.4;
  const section2Height = totalUsableHeight * 0.6;

  const section1Top = usableTop;
  const section1Bottom = section1Top - section1Height;
  const section2Top = section1Bottom - sectionGap;
  const section2Bottom = section2Top - section2Height;

  drawLayoutInArea(page1, {
    columns: 3,
    rows: 4,
    label: 'Etiquetas pequenas (3x4)',
    topY: section1Top,
    bottomY: section1Bottom
  });
  drawLayoutInArea(page1, {
    columns: 2,
    rows: 4,
    label: 'Etiquetas medias (2x4)',
    topY: section2Top,
    bottomY: section2Bottom
  });

  const page2 = pdfDoc.addPage(pageSize);
  page2.drawText(`Nome: ${payload.name} | Pais: ${payload.country} | Tipo: ${payload.bloodType}`, {
    x: marginX,
    y: pageHeight - 24,
    size: 9,
    color: rgb(0.58, 0.64, 0.74)
  });
  drawLayoutInArea(page2, {
    columns: 1,
    rows: 4,
    label: 'Etiquetas grandes (1x4)',
    topY: pageHeight - 44,
    bottomY: 28
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export function validatePayload(payload: Partial<LabelPayload>): payload is LabelPayload {
  return Boolean(payload.name && payload.country && payload.bloodType);
}
