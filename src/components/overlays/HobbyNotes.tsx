import { SHOWCASE_ITEMS } from '../room/showcaseLayout';
import { anchoredTargetStyle } from './anchoredTargetStyle';
import { useAnchoredNote } from './useAnchoredNote';

const ids = SHOWCASE_ITEMS.map(({ hobby }) => hobby.id);

export function HobbyNotes({ onHighlight }: { onHighlight: (id: string | undefined) => void }) {
  const { open, buttons, close, dismiss, setPreview, activate } = useAnchoredNote(ids, onHighlight);
  const hobby = open === undefined ? undefined : SHOWCASE_ITEMS[open]?.hobby;
  return <section className="hobby-notes" aria-label="Hobbies showcase"
    onKeyDown={event => { if (event.key === 'Escape') dismiss(); }}>
    {SHOWCASE_ITEMS.map(({ hobby: item }, index) => (
      <button key={item.id} type="button" className="poster-hit hobby-hit" style={anchoredTargetStyle('hobby', index)}
        ref={button => { buttons.current[index] = button; }}
        aria-label={item.title} aria-expanded={open === index} aria-controls={open === index ? 'hobby-note' : undefined}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setPreview(index); }}
        onPointerLeave={() => setPreview(undefined)}
        onFocus={() => setPreview(index)} onBlur={() => setPreview(undefined)}
        onClick={event => activate(event, index)}>
        <span aria-hidden="true">{item.title}</span>
      </button>
    ))}
    {hobby && open !== undefined && (
      <article className="hobby-note" id="hobby-note" data-side={open % 2 ? 'left' : 'right'} data-row={open < 2 ? 'top' : 'bottom'}
        style={anchoredTargetStyle('hobby', open)} aria-labelledby="hobby-note-title">
        <div className="hobby-paper" key={hobby.id}>
          <header><h2 id="hobby-note-title">{hobby.title}</h2><button ref={close} type="button" onClick={dismiss}>Close</button></header>
          <p>{hobby.description}</p>
        </div>
      </article>
    )}
  </section>;
}
