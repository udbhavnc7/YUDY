import type { PerspectiveCamera, Vector3 } from 'three';

export function projectTarget(
  host: HTMLElement, prefix: string, lens: PerspectiveCamera, point: Vector3,
  x: number, y: number, z: number, width: number, height: number,
) {
  point.set(x - width / 2, y + height / 2, z).project(lens);
  const left = (1 + point.x) * 50;
  const top = (1 - point.y) * 50;
  point.set(x + width / 2, y - height / 2, z).project(lens);
  const right = (1 + point.x) * 50;
  const bottom = (1 - point.y) * 50;
  const visible = left >= 0 && right <= 100 && top >= 0 && bottom <= 100;

  host.style.setProperty(prefix + '-left', left + '%');
  host.style.setProperty(prefix + '-top', top + '%');
  host.style.setProperty(prefix + '-width', (right - left) + '%');
  host.style.setProperty(prefix + '-height', (bottom - top) + '%');
  host.style.setProperty(prefix + '-visibility', visible ? 'visible' : 'hidden');
}
