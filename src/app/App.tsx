import { Component, type ReactNode, useCallback, useEffect, useState } from 'react';
import { MainRoom } from '../scenes/MainRoom/MainRoom';
import { AchievementPosters } from '../components/overlays/AchievementPosters';
import { EducationPillows } from '../components/overlays/EducationPillows';
import { SoloShelfNotes } from '../components/overlays/SoloShelfNotes';
import { PROFILE } from '../data/profile';

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function App() {
  const proofMode = new URLSearchParams(window.location.search).get('proof');
  const proof = proofMode === 'grey';
  const isolated = proof || proofMode === 'lamp';
  const [intro, setIntro] = useState(true);
  const [education, setEducation] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [highlight, setHighlight] = useState<string>();
  const [soloShelf, setSoloShelf] = useState(false);
  const [bookHighlight, setBookHighlight] = useState<string>();
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);
  const onToggle = useCallback(() => setOn(current => !current), []);
  useEffect(() => {
    if (ready) setOn(true);
  }, [ready]);

  return <main className={!isolated && !failed ? 'room-tour' : undefined}>
    <div className={'exhibit' + (on || failed ? ' illuminated' : '')}>
      <SceneBoundary onFailure={onFailure}>
        <MainRoom proof={proof} isolated={isolated} onIntroChange={setIntro} onEducationChange={setEducation}
          onGalleryChange={setGallery} highlight={gallery ? highlight : undefined}
          onSoloShelfChange={setSoloShelf} bookHighlight={soloShelf ? bookHighlight : undefined}
          on={on} onReady={onReady} onToggle={onToggle} />
      </SceneBoundary>
      <div className="vignette" aria-hidden="true" />
      {!proof && <section hidden={!intro && !failed} className="label" aria-label="Portfolio introduction">
        <p className="imprint"><span>YUDY</span><i aria-hidden="true" />Portfolio</p>
        <h1 aria-label={PROFILE.name}>{PROFILE.name.split(' ')[0]} <em>{PROFILE.name.split(' ').slice(1).join(' ')}</em></h1>
        <p className="intro-identity">{PROFILE.title}</p>
        {failed ? <p className="notice">The 3D lamp couldn’t load. <button onClick={() => window.location.reload()}>Retry</button></p> :
          <button className="power" type="button" disabled={!ready} role="switch" aria-checked={on}
            aria-label="Lamp power" onClick={onToggle}>
            <span className="switch-track" aria-hidden="true"><span /></span>
            {ready ? 'Lamp ' + (on ? 'on' : 'off') : 'Preparing light…'}
          </button>}
        {!isolated && ready && !failed && <p className="scroll-instruction">Scroll to explore the room</p>}
      </section>}
      {education && ready && !failed && <EducationPillows />}
      {gallery && ready && !failed && <AchievementPosters onHighlight={setHighlight} />}
      {soloShelf && ready && !failed && <SoloShelfNotes onHighlight={setBookHighlight} />}
      {proof && failed && <p role="alert" className="label">The lighting proof couldn’t load.</p>}
    </div>
  </main>;
}
