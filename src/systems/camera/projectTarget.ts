import type { PerspectiveCamera, Vector3 } from 'three';

export function projectTarget(
  host: HTMLElement, prefix: string, lens: PerspectiveCamera, point: Vector3,
  x: number, y: number, z: number, width: number, height: number, yaw = 0,
) {
  const halfX = width * Math.cos(yaw) / 2;
  const halfZ = -width * Math.sin(yaw) / 2;
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
  for (const direction of [-1, 1]) {
    for (const rise of [-height / 2, height / 2]) {
      point.set(x + direction * halfX, y + rise, z + direction * halfZ).project(lens);
      left = Math.min(left, (1 + point.x) * 50);
      right = Math.max(right, (1 + point.x) * 50);
      top = Math.min(top, (1 - point.y) * 50);
      bottom = Math.max(bottom, (1 - point.y) * 50);
    }
  }
  const visible = left >= 0 && right <= 100 && top >= 0 && bottom <= 100;

  host.style.setProperty(prefix + '-left', left + '%');
  host.style.setProperty(prefix + '-top', top + '%');
  host.style.setProperty(prefix + '-width', (right - left) + '%');
  host.style.setProperty(prefix + '-height', (bottom - top) + '%');
  host.style.setProperty(prefix + '-visibility', visible ? 'visible' : 'hidden');
}
