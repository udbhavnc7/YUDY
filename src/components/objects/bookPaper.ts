import { CanvasTexture, SRGBColorSpace } from 'three';

export function bookPaper(bindingOnLeft: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createLinearGradient(bindingOnLeft ? 0 : 256, 0, bindingOnLeft ? 256 : 0, 0);
  gradient.addColorStop(0, '#b8a17c');
  gradient.addColorStop(0.045, '#ddc9a4');
  gradient.addColorStop(0.14, '#eee0c2');
  gradient.addColorStop(0.5, '#f3e8ce');
  gradient.addColorStop(0.92, '#f2e5c9');
  gradient.addColorStop(1, '#dcc8a7');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let seed = 42;
  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  ctx.fillStyle = '#634a3017';
  for (let grain = 0; grain < 7500; grain++) {
    ctx.fillRect(random() * canvas.width, random() * canvas.height, 1, 1);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
