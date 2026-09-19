import { useWorldStore } from './worldStore';
import { useRestSystem } from '../systems/rest/useRestSystem';
import { WorldCanvas } from '../components/world/WorldCanvas';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { OverlayUI } from '../components/ui/OverlayUI';
import { PROJECTS } from '../data/projects';

export function App() {
  const phase = useWorldStore((s) => s.phase);
  const setPhase = useWorldStore((s) => s.setPhase);

  // Activate the Rest system
  useRestSystem();

  return (
    <main className="relative w-full h-full bg-ink overflow-hidden select-none">
      {/* 2D Canvas Dosa Loader */}
      {phase === 'loading' && (
        <LoadingScreen onBegin={() => setPhase('dwelling')} />
      )}

      {/* 3D World Canvas */}
      <WorldCanvas />

      {/* Atmospheric Overlays */}
      <div className="vignette-overlay" aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />

      {/* Head-Up Controls and Information */}
      <OverlayUI />

      {/* Accessible Plain HTML Work Modal / Anchor for Skip to Work */}
      <section
        id="work"
        tabIndex={-1}
        className="sr-only focus-within:not-sr-only fixed inset-8 bg-paper text-ink p-8 z-40 overflow-y-auto border border-ink/20 shadow-2xl rounded"
      >
        <div className="flex justify-between items-start border-b border-ink/20 pb-4 mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold">Selected Works · Index</h2>
            <p className="font-sans text-xs text-ink/70">Udbhav N Chandragiri — Systems & Creative Technology</p>
          </div>
          <a
            href="#"
            className="font-mono text-xs px-3 py-1 bg-ink text-ivory rounded hover:bg-slate"
          >
            Close [Esc]
          </a>
        </div>

        <div className="space-y-6">
          {PROJECTS.map((proj) => (
            <article key={proj.id} className="border-b border-ink/10 pb-4">
              <span className="font-mono text-xs text-cherry font-semibold">{proj.year}</span>
              <h3 className="font-display text-xl font-bold">{proj.name}</h3>
              <p className="font-sans text-sm my-2 text-ink/80">{proj.oneLine}</p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-ink/60">
                {proj.stack.map((s) => (
                  <span key={s} className="border border-ink/20 px-2 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
