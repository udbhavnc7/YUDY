import { useLayoutEffect } from 'react';
import type { ProjectType } from '../../data/projects';
import { PROJECT_SHELVES } from '../room/projectShelves';
import { anchoredTargetStyle } from './anchoredTargetStyle';
import { useAnchoredNote } from './useAnchoredNote';

const shelfIds = { solo: PROJECT_SHELVES.solo.map(book => book.project.id), group: PROJECT_SHELVES.group.map(book => book.project.id) };

export function ProjectShelfNotes({ shelf, onHighlight, onRead }: {
  shelf: ProjectType;
  onHighlight: (id: string | undefined) => void;
  onRead: (id: string | undefined) => void;
}) {
  const { open, buttons, close, dismiss, setPreview, activate } = useAnchoredNote(shelfIds[shelf], onHighlight);
  const books = PROJECT_SHELVES[shelf];
  const project = open === undefined ? undefined : books[open]?.project;

  useLayoutEffect(() => {
    onRead(project?.id);
    return () => onRead(undefined);
  }, [project, onRead]);

  return <section className="project-shelf-notes" data-reading={!!project} aria-label={shelf === 'group' ? 'VAPORLOGIC project books' : 'Solo project books'}
    onKeyDown={event => { if (event.key === 'Escape') dismiss(); }}>
    {books.map(({ project: entry }, index) => (
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
      <article className="project-spread" data-edition={shelf} id="project-note" aria-labelledby="project-note-heading">
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
            {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">Live site</a>}
          </div>
          {!project.live && <p className="deployment-status">Public deployment unavailable</p>}
        </div>
      </article>
    )}
  </section>;
}
