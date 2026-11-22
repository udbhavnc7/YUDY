import { CanvasTexture, SRGBColorSpace } from 'three';

export function bookStamp(title: string, author: string, cloth: string, faceOut: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = faceOut ? 384 : 192;
  canvas.height = 576;
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;
  ctx.fillStyle = cloth;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#f5dbbc22';
  ctx.lineWidth = 0.75;
  for (let x = 1; x < width; x += 3) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 1; y < height; y += 4) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
  ctx.strokeStyle = '#e2c48b';
  ctx.fillStyle = '#f1dfb2';
  ctx.lineWidth = 2;
  ctx.strokeRect(13, 17, width - 26, height - 34);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (faceOut) {
    ctx.font = '27px Georgia, serif';
    ctx.fillText(author, width / 2, 72, width - 72);
    ctx.font = '600 54px Georgia, serif';
    ctx.fillText(title, width / 2, 177, width - 68);
    ctx.translate(width / 2, 342);
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, 109, 25 + i * 3, i * Math.PI / 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    for (const y of [66, 510]) {
      ctx.beginPath(); ctx.moveTo(31, y); ctx.lineTo(width - 31, y); ctx.stroke();
    }
    ctx.translate(width / 2, height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.font = '600 60px Georgia, serif';
    ctx.fillText(title, 0, 0, height - 180);
  }

  const stamp = new CanvasTexture(canvas);
  stamp.colorSpace = SRGBColorSpace;
  stamp.anisotropy = 4;
  return stamp;
}
