import { PROFILE } from '../../data/profile';

export function ClosingSignature() {
  return <section className="closing-signature" aria-labelledby="closing-name">
    <div className="closing-identity">
      <h2 id="closing-name">{PROFILE.name}</h2>
      <p>{PROFILE.education.degree}</p>
    </div>
    <div className="closing-contact">
      <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href={'mailto:' + PROFILE.email}>Email</a>
    </div>
  </section>;
}
