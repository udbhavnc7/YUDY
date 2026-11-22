import { useEffect, useRef, useState, type MouseEvent } from 'react';

export function useAnchoredNote(ids: readonly string[], onHighlight: (id: string | undefined) => void) {
  const [open, setOpen] = useState<number>();
  const [preview, setPreview] = useState<number>();
  const active = preview ?? open;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const close = useRef<HTMLButtonElement>(null);
  const highlighted = active === undefined ? undefined : ids[active];

  useEffect(() => {
    onHighlight(highlighted);
    return () => onHighlight(undefined);
  }, [highlighted, onHighlight]);

  function dismiss() {
    if (open === undefined) return;
    setOpen(undefined);
    buttons.current[open]?.focus({ preventScroll: true });
  }

  function activate(event: MouseEvent<HTMLButtonElement>, index: number) {
    if (open === index) dismiss();
    else {
      setOpen(index);
      if (event.detail === 0) requestAnimationFrame(() => close.current?.focus({ preventScroll: true }));
    }
  }

  return { open, buttons, close, dismiss, setPreview, activate };
}
