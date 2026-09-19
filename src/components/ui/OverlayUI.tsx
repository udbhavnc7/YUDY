import { useWorldStore } from '../../app/worldStore';
import { ambientAudio } from '../../systems/audio/ambientAudio';

export function OverlayUI() {
  const soundOn = useWorldStore((s) => s.soundOn);
  const toggleSound = useWorldStore((s) => s.toggleSound);
  const reducedMotion = useWorldStore((s) => s.reducedMotion);
  const toggleReducedMotion = useWorldStore((s) => s.toggleReducedMotion);
  const hovered = useWorldStore((s) => s.hovered);

  const railNode = useWorldStore((s) => s.railNode);
  const setPhase = useWorldStore((s) => s.setPhase);
  const setActivePanel = useWorldStore((s) => s.setActivePanel);

  const handleSoundToggle = () => {
    const next = !soundOn;
    toggleSound();
    ambientAudio.setMuted(!next);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 sm:p-8">
      {/* Top Bar */}
      <header className="flex items-center justify-between pointer-events-auto">
        <div className="flex flex-col">
          <span className="font-display text-sm sm:text-base tracking-widest text-ivory/80 font-semibold">
            YUDY
          </span>
          <span className="font-sans text-[10px] tracking-wider text-ivory/40 uppercase">
            {railNode === 'terrace' ? 'Paris Dusk · Live Rail' : 'The Workshop · Cantilevered Studio'}
          </span>
        </div>

        {/* Global Controls: Portfolio, Skip to work, Sound, and Forward on Rail */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActivePanel('receipt')}
            className="font-mono text-xs tracking-wider text-gold hover:text-ivory px-3 py-1 bg-gold/10 hover:bg-gold/20 border border-gold/40 rounded-full transition-all flex items-center space-x-1.5 focus:outline-none focus:ring-1 focus:ring-gold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            <span>Portfolio & Projects (6)</span>
          </button>

          {railNode === 'workshop' && (
            <button
              onClick={() => setPhase('surfacing')}
              className="font-mono text-xs tracking-wider text-gold hover:text-ivory transition-colors flex items-center space-x-1 border border-gold/30 px-3 py-1 rounded-full bg-gold/10 hover:bg-gold/20 focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <span>Continue on rail</span>
              <span>→</span>
            </button>
          )}

          <a
            href="#work"
            className="font-mono text-xs tracking-wider text-ivory/60 hover:text-gold transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-1 focus:ring-gold hidden sm:inline"
          >
            Index
          </a>

          <button
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Mute rain audio' : 'Unmute rain audio'}
            className="font-mono text-xs text-ivory/60 hover:text-ivory px-2 py-1 border border-ivory/20 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-gold"
          >
            {soundOn ? '[sound: on]' : '[sound: off]'}
          </button>
        </div>
      </header>

      {/* Hover Object Label / Interaction Feedback */}
      <div className="flex justify-center items-center h-12">
        {hovered && (
          <div className="bg-ink/85 backdrop-blur border border-gold/30 px-5 py-2 rounded-full text-xs font-sans tracking-widest uppercase text-gold animate-fade-in pointer-events-none shadow-lg">
            {hovered === 'laptop' && 'The Workshop · Click to dive through screen'}
            {hovered === 'dossier' && 'Udbhav N C · Selected Works Dossier (6 Projects)'}
            {hovered === 'coffee' && 'Espresso · Parisian Sunset Evening'}
            {hovered === 'map' && 'Folded Rail Map · Forward Path'}
            {hovered === 'eiffel' && 'Eiffel Tower · Paris Sunset Vista'}
            {hovered === 'project-kawach' && 'KAWACH — Disaster Emergency Mesh · Best Startup Award'}
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <footer className="flex flex-col sm:flex-row items-start sm:items-end justify-between space-y-2 sm:space-y-0 text-[11px] font-sans text-ivory/40 pointer-events-auto">
        <div>
          <span>Crafted by </span>
          <span className="text-ivory/70 font-medium">Udbhav N Chandragiri</span>
          <span className="mx-2 opacity-30">·</span>
          <span className="italic">No cookies, no telemetry, no tracking</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleReducedMotion}
            className="font-mono text-[10px] text-ivory/50 hover:text-ivory transition-colors"
          >
            {reducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
          </button>
          <span className="opacity-30">·</span>
          <span className="font-mono text-[10px] text-ivory/30">
            Press [K] to record shot
          </span>
        </div>
      </footer>
    </div>
  );
}
