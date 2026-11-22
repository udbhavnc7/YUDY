import { CanvasTexture, SRGBColorSpace } from 'three';
import { ACHIEVEMENT_STYLES, type Achievement } from '../../data/achievements';

function wrapText(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines = [''];
  for (const word of text.split(' ')) {
    const line = lines[lines.length - 1];
    const candidate = line ? line + ' ' + word : word;
    if (line && ctx.measureText(candidate).width > width) lines.push(word);
    else lines[lines.length - 1] = candidate;
  }
  return lines;
}

// Original linework and printed type, composed directly from the achievement data.
export function posterPrint(item: Achievement, index: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 460;
  const ctx = canvas.getContext('2d')!;
  const { ink, paper } = ACHIEVEMENT_STYLES[item.status];
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let seed = index + 1;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  ctx.fillStyle = '#44281017';
  for (let i = 0; i < 8600; i++) ctx.fillRect(random() * 512, random() * 460, 1, 1);

  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(18, 18, 476, 424);
  ctx.save();
  ctx.beginPath();
  ctx.rect(24, 24, 464, 229);
  ctx.clip();
  ctx.translate(256, 139);
  ctx.lineWidth = 1.7;
  ctx.globalAlpha = 0.69;
  for (let line = 0; line < 16; line++) {
    ctx.beginPath();
    for (let point = 0; point <= 180; point++) {
      const t = point / 180;
      const angle = t * Math.PI * 2;
      if (item.status === 'winner') {
        const r = (23 + line * 7.8) * (1 + 0.21 * Math.cos(angle * (3 + index) + line * 0.20));
        ctx.lineTo(Math.cos(angle) * r * 1.35, Math.sin(angle) * r * 0.68);
      } else {
        const phase = item.status === 'top' ? line * 0.36 : line * 0.055;
        const amplitude = 21 + (index % 4) * 6;
        const wave = amplitude * Math.sin(angle * (1 + (index % 3) * 0.5) + phase);
        const cross = item.status === 'participated' ? (line - 7.5) * (t * 20 - 10) : (line - 7.5) * 11;
        ctx.lineTo((t - 0.5) * 370, wave + cross);
      }
    }
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = ink;
  ctx.fillRect(34, 254, 444, 2);
  ctx.font = 'bold 21px Arial, sans-serif';
  const eventLines = wrapText(ctx, item.event.toUpperCase(), 380);
  eventLines.forEach((line, lineIndex) => ctx.fillText(line, 36, 289 + lineIndex * 24));
  ctx.font = '55px Georgia, serif';
  const titleWidth = ctx.measureText(item.title).width;
  if (titleWidth > 436) ctx.font = (55 * 436 / titleWidth) + 'px Georgia, serif';
  ctx.fillText(item.title, 35, 391);
  if (item.year) {
    ctx.font = '18px Arial, sans-serif';
    ctx.fillText(String(item.year), 36, 424);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
