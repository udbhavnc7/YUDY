import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ACHIEVEMENTS, ACHIEVEMENT_STYLES } from '../../data/achievements';

function frameStyle(index: number) {
  const frame = '--poster-' + index;
  return {
    '--frame-left': 'var(' + frame + '-left)',
    '--frame-top': 'var(' + frame + '-top)',
    '--frame-width': 'var(' + frame + '-width)',
    '--frame-height': 'var(' + frame + '-height)',
    '--frame-visibility': 'var(' + frame + '-visibility, hidden)',
  } as CSSProperties;
}

export function AchievementPosters({ onHighlight }: { onHighlight: (id: string | undefined) => void }) {
  const [open, setOpen] = useState<number>();
  const [preview, setPreview] = useState<number>();
  const active = preview ?? open;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const close = useRef<HTMLButtonElement>(null);
  const item = open === undefined ? undefined : ACHIEVEMENTS[open];

  useEffect(() => {
    onHighlight(active === undefined ? undefined : ACHIEVEMENTS[active].id);
    return () => onHighlight(undefined);
  }, [active, onHighlight]);

  function dismiss() {
    if (open === undefined) return;
    setOpen(undefined);
    buttons.current[open]?.focus({ preventScroll: true });
  }

  return <section className="achievement-posters" aria-label="Achievement posters"
    onKeyDown={event => { if (event.key === 'Escape') dismiss(); }}>
    {ACHIEVEMENTS.map((achievement, index) => (
      <button key={achievement.id} type="button" className="poster-hit" style={frameStyle(index)}
        ref={button => { buttons.current[index] = button; }}
        aria-label={achievement.event + ', ' + achievement.title}
        aria-expanded={open === index} aria-controls={open === index ? "achievement-note" : undefined}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setPreview(index); }}
        onPointerLeave={() => setPreview(undefined)}
        onFocus={() => setPreview(index)}
        onBlur={() => setPreview(undefined)}
        onClick={event => {
          if (open === index) dismiss();
          else {
            setOpen(index);
            // Pointer users keep the frame targeted. Keyboard users can read the note next.
            if (event.detail === 0) requestAnimationFrame(() => close.current?.focus({ preventScroll: true }));
          }
        }}
      />
    ))}
    {item && open !== undefined && (
      <article className={'achievement-note ' + (open % 4 < 2 ? 'note-right' : 'note-left')}
        id="achievement-note" data-row={Math.floor(open / 4)} style={frameStyle(open)} aria-labelledby="achievement-note-heading">
        <div className="achievement-paper" data-status={item.status} key={item.id}>
          <div className="achievement-note-top">
            <p>{ACHIEVEMENT_STYLES[item.status].label}{item.year ? ' / ' + item.year : ''}</p>
            <button type="button" ref={close} onClick={dismiss}>Close</button>
          </div>
          <h2 id="achievement-note-heading">{item.title}</h2>
          <p className="achievement-event">{item.event}</p>
          {item.description && <p>{item.description}</p>}
          {item.link && <a href={item.link}>View project on GitHub</a>}
        </div>
      </article>
    )}
  </section>;
}
