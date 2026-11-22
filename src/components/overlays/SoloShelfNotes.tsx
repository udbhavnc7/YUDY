import { useLayoutEffect } from 'react';
import { SOLO_PROJECTS } from '../../data/projects';
import { anchoredTargetStyle } from './anchoredTargetStyle';
import { useAnchoredNote } from './useAnchoredNote';

const ids = SOLO_PROJECTS.map(project => project.id);

export function SoloShelfNotes({ onHighlight, onRead }: {
  onHighlight: (id: string | undefined) => void;
  onRead: (id: string | undefined) => void;
}) {
  const { open, buttons, close, dismiss, setPreview, activate } = useAnchoredNote(ids, onHighlight);
  const project = open === undefined ? undefined : SOLO_PROJECTS[open];

  useLayoutEffect(() => {
    onRead(project?.id);
    return () => onRead(undefined);
  }, [project, onRead]);

  return <section className="solo-shelf-notes" data-reading={!!project} aria-label="Solo project books" 
    onKeyDown={event => { if (event.key === 'Escape') dismiss(); }}>
    {SOLO_PROJECTS.map((entry, index) => (
      <button key={entry.id} type="button" className="poster-hit book-hit" style={anchoredTargetStyle('book', index)}
        ref={button => { buttons.current[index] = button; }}
        aria-label={entry.title} tabIndex={project ? -1 : 0}
        aria-expanded={open === index} aria-controls={open === index ? 'project-note' : undefined}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setPreview(index); }}
        onPointerLeave={() => setPreview(undefined)}
        onFocus={() => setPreview(index)}
        onBlur={() => setPreview(undefined)}
        onClick={event => activate(event, index)}
      />
    ))}
    {project && (
      <article className="project-spread" id="project-note" aria-labelledby="project-note-heading">
        <div className="project-title-page">
          <button ref={close} type="button" onClick={dismiss}>Close book</button>
          <div className="project-byline">
            <p>{project.author}</p>
            <h2 id="project-note-heading">{project.title}</h2>
          </div>
        </div>
        <div className="project-details-page">
          <p className="project-description">{project.description}</p>
          <p className="book-stack">{project.technologies.join(' \u00b7 ')}</p>
          <div className="book-links">
            <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">Live deployment</a>}
          </div>
          {!project.live && <p className="deployment-status">Public deployment unavailable</p>}
        </div>
      </article>
    )}
  </section>;
}
