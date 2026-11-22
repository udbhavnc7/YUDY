import { SOLO_PROJECTS } from '../../data/projects';
import { anchoredTargetStyle } from './anchoredTargetStyle';
import { useAnchoredNote } from './useAnchoredNote';

const ids = SOLO_PROJECTS.map(project => project.id);

export function SoloShelfNotes({ onHighlight }: { onHighlight: (id: string | undefined) => void }) {
  const { open, buttons, close, dismiss, setPreview, activate } = useAnchoredNote(ids, onHighlight);
  const project = open === undefined ? undefined : SOLO_PROJECTS[open];

  return <section className="solo-shelf-notes" aria-label="Solo project books"
    onKeyDown={event => { if (event.key === 'Escape') dismiss(); }}>
    {SOLO_PROJECTS.map((entry, index) => (
      <button key={entry.id} type="button" className="poster-hit book-hit" style={anchoredTargetStyle('book', index)}
        ref={button => { buttons.current[index] = button; }}
        aria-label={entry.title}
        aria-expanded={open === index} aria-controls={open === index ? 'project-note' : undefined}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setPreview(index); }}
        onPointerLeave={() => setPreview(undefined)}
        onFocus={() => setPreview(index)}
        onBlur={() => setPreview(undefined)}
        onClick={event => activate(event, index)}
      />
    ))}
    {project && open !== undefined && (
      <article className="achievement-note book-note" id="project-note" style={anchoredTargetStyle('book', open)}
        aria-labelledby="project-note-heading">
        <div className="achievement-paper book-paper" key={project.id}>
          <div className="achievement-note-top">
            <p>{project.author}</p>
            <button ref={close} type="button" onClick={dismiss}>Close</button>
          </div>
          <h2 id="project-note-heading">{project.title}</h2>
          <p>{project.description}</p>
          <p className="book-stack">{project.technologies.join(' · ')}</p>
          <div className="book-links">
            <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">Project site</a>}
          </div>
        </div>
      </article>
    )}
  </section>;
}
