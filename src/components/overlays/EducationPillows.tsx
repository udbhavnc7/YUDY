import { useEffect, useRef, useState } from 'react';
import { EDUCATION } from '../../data/education';

export function EducationPillows() {
  const [hovered, setHovered] = useState<string>();
  const [pinned, setPinned] = useState<string>();
  const selected = hovered ?? pinned;
  const education = EDUCATION.find(item => item.id === selected);

  const closeTimer = useRef<number>(undefined);
  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const closeHover = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setHovered(undefined), 180);
  };

  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        window.clearTimeout(closeTimer.current);
        setHovered(undefined);
        setPinned(undefined);
      }
    };
    window.addEventListener('keydown', dismiss);
    return () => {
      window.removeEventListener('keydown', dismiss);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  return <section className="education-pillows" aria-label="Education">
    {EDUCATION.map(item => (
      <button key={item.id} type="button" className={'pillow-button pillow-' + item.id}
        aria-expanded={selected === item.id} aria-controls="education-note"
        onPointerEnter={event => {
          if (event.pointerType !== 'mouse') return;
          cancelClose();
          setHovered(item.id);
        }}
        onPointerLeave={event => { if (event.pointerType === 'mouse') closeHover(); }}
        onClick={() => {
          cancelClose();
          setHovered(undefined);
          setPinned(current => current === item.id ? undefined : item.id);
        }}
      >
        <span className="pillow-tag"><i aria-hidden="true" />{item.label}</span>
      </button>
    ))}
    <div id="education-note" className={'education-note' + (selected ? ' note-' + selected : '')}
      hidden={!education} aria-live="polite" onPointerEnter={cancelClose} onPointerLeave={closeHover}
    >
      {education && <div key={education.id} className="education-note-paper">
        <p className="education-period">{education.period}</p>
        <h2>{education.institution}</h2>
        <p className="education-details">{education.details}</p>
      </div>}
    </div>
  </section>;
}
