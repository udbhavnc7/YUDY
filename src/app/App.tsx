import { Component, lazy, Suspense, type ReactNode, useCallback, useEffect, useState } from 'react';
import { AchievementPosters } from '../components/overlays/AchievementPosters';
import { EducationPillows } from '../components/overlays/EducationPillows';
import { ProjectShelfNotes } from '../components/overlays/ProjectShelfNotes';
import { HobbyNotes } from '../components/overlays/HobbyNotes';
import { ClosingSignature } from '../components/overlays/ClosingSignature';
import type { ProjectType } from '../data/projects';
import type { ClosingState } from '../systems/camera/CameraRig';
import { PROFILE } from '../data/profile';

const MainRoom = lazy(() => import('../scenes/MainRoom/MainRoom').then(module => ({ default: module.MainRoom })));

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
  const [shelf, setShelf] = useState<ProjectType>();
  const [bookHighlight, setBookHighlight] = useState<string>();
  const [openBook, setOpenBook] = useState<string>();
  const [showcase, setShowcase] = useState(false);
  const [hobbyHighlight, setHobbyHighlight] = useState<string>();
  const [closing, setClosing] = useState<ClosingState>();
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);
  const [failed, setFailed] = useState(false);
  const onShelfChange = useCallback((next: ProjectType | undefined) => {
    setShelf(next);
    setBookHighlight(undefined);
    setOpenBook(undefined);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);
  const onToggle = useCallback(() => setOn(current => !current), []);
  useEffect(() => {
    if (ready) setOn(true);
  }, [ready]);

  return <main className={!isolated && !failed ? 'room-tour' : undefined}>
    <div className={'exhibit' + (on || failed ? ' illuminated' : '')}>
      <SceneBoundary onFailure={onFailure}><Suspense fallback={null}>
        <MainRoom proof={proof} isolated={isolated} onIntroChange={setIntro} onEducationChange={setEducation}
          onGalleryChange={setGallery} highlight={gallery ? highlight : undefined}
          onShelfChange={onShelfChange} bookHighlight={bookHighlight} openBook={openBook}
          onShowcaseChange={setShowcase} hobbyHighlight={showcase ? hobbyHighlight : undefined}
          onClosingChange={setClosing}
          on={on} onReady={onReady} onToggle={onToggle} />
      </Suspense></SceneBoundary>
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
        {!isolated && <div className="intro-ways">
          {ready && !failed && <p className="scroll-instruction">Scroll to explore the room</p>}
          <a className="work-link" href="/work/">Read the portfolio</a>
        </div>}
      </section>}
      {education && ready && !failed && <EducationPillows />}
      {gallery && ready && !failed && <AchievementPosters onHighlight={setHighlight} />}
      {shelf && ready && !failed && <ProjectShelfNotes key={shelf} shelf={shelf} onHighlight={setBookHighlight} onRead={setOpenBook} />}
      {showcase && ready && !failed && <HobbyNotes onHighlight={setHobbyHighlight} />}
      {closing === 'ready' && ready && !failed && <ClosingSignature />}
      {closing === 'loading' && ready && !failed && <p className="room-status" role="status">Loading the room…</p>}
      {proof && failed && <p role="alert" className="label">The lighting proof couldn’t load.</p>}
    </div>
  </main>;
}
