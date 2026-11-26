import { Component, lazy, Suspense, type ReactNode, useCallback, useEffect, useState } from 'react';
import { PROFILE } from '../data/profile';

const MainRoom = lazy(() => import('../scenes/MainRoom/MainRoom').then(module => ({ default: module.MainRoom })));

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function App() {
  const proof = new URLSearchParams(window.location.search).get('proof') === 'grey';
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);
  const onToggle = useCallback(() => setOn(current => !current), []);
  useEffect(() => { if (ready) setOn(true); }, [ready]);

  return <div className={'exhibit' + (on || failed ? ' illuminated' : '')}>
    <SceneBoundary onFailure={onFailure}><Suspense fallback={null}>
      <MainRoom proof={proof} on={on} onReady={onReady} onToggle={onToggle} />
    </Suspense></SceneBoundary>
    <div className="vignette" aria-hidden="true" />
    {!proof && <section className="label" aria-label="Portfolio introduction">
      <p className="imprint"><span>YUDY</span><i aria-hidden="true" />Portfolio</p>
      <h1 aria-label={PROFILE.name}>{PROFILE.name.split(' ')[0]} <em>{PROFILE.name.split(' ').slice(1).join(' ')}</em></h1>
      <p className="intro-identity">{PROFILE.title}</p>
      {failed ? <p className="notice">The 3D lamp couldn’t load. <button onClick={() => window.location.reload()}>Retry</button></p> :
        <button className="power" type="button" disabled={!ready} role="switch" aria-checked={on}
          aria-label="Lamp power" onClick={onToggle}>
          <span className="switch-track" aria-hidden="true"><span /></span>
          {ready ? 'Lamp ' + (on ? 'on' : 'off') : 'Preparing light…'}
        </button>}
      <div className="intro-ways"><a className="work-link" href="/work/">Read the portfolio</a></div>
    </section>}
    {proof && failed && <p role="alert" className="label">The lighting proof couldn’t load.</p>}
  </div>;
}
