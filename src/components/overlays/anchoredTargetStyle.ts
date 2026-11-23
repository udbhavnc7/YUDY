import type { CSSProperties } from 'react';

export function anchoredTargetStyle(kind: 'poster' | 'book' | 'hobby', index: number) {
  const target = '--' + kind + '-' + index;
  return {
    '--frame-left': 'var(' + target + '-left)',
    '--frame-top': 'var(' + target + '-top)',
    '--frame-width': 'var(' + target + '-width)',
    '--frame-height': 'var(' + target + '-height)',
    '--frame-visibility': 'var(' + target + '-visibility, hidden)',
  } as CSSProperties;
}
