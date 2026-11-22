import { ACHIEVEMENTS, ACHIEVEMENT_STYLES } from '../../data/achievements';
import { anchoredTargetStyle } from './anchoredTargetStyle';
import { useAnchoredNote } from './useAnchoredNote';

const ids = ACHIEVEMENTS.map(achievement => achievement.id);

export function AchievementPosters({ onHighlight }: { onHighlight: (id: string | undefined) => void }) {
  const { open, buttons, close, dismiss, setPreview, activate } = useAnchoredNote(ids, onHighlight);
  const item = open === undefined ? undefined : ACHIEVEMENTS[open];

  return <section className="achievement-posters" aria-label="Achievement posters"
    onKeyDown={event => { if (event.key === 'Escape') dismiss(); }}>
    {ACHIEVEMENTS.map((achievement, index) => (
      <button key={achievement.id} type="button" className="poster-hit" style={anchoredTargetStyle('poster', index)}
        ref={button => { buttons.current[index] = button; }}
        aria-label={achievement.event + ', ' + achievement.title}
        aria-expanded={open === index} aria-controls={open === index ? "achievement-note" : undefined}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setPreview(index); }}
        onPointerLeave={() => setPreview(undefined)}
        onFocus={() => setPreview(index)}
        onBlur={() => setPreview(undefined)}
        onClick={event => activate(event, index)}
      />
    ))}
    {item && open !== undefined && (
      <article className={'achievement-note ' + (open % 4 < 2 ? 'note-right' : 'note-left')}
        id="achievement-note" data-row={Math.floor(open / 4)} style={anchoredTargetStyle('poster', open)} aria-labelledby="achievement-note-heading">
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
