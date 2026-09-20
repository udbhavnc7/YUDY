import { useEffect, useState } from 'react';
import { useWorldStore } from './worldStore';
import { useRestSystem } from '../systems/rest/useRestSystem';
import { useScrollCamera } from '../systems/scroll/useScrollCamera';
import { WorldCanvas } from '../components/world/WorldCanvas';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { OverlayUI } from '../components/ui/OverlayUI';
import { PROFILE } from '../data/profile';

export function App() {
  const setPhase = useWorldStore((s) => s.setPhase);
  const [showWorld, setShowWorld] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useRestSystem();
  useScrollCamera();

  const handleBegin = () => {
    setTransitioning(true);
    setTimeout(() => {
      setShowWorld(true);
      setPhase('dwelling');
    }, 600);
  };

  useEffect(() => {
    if (showWorld) {
      const t = setTimeout(() => setTransitioning(false), 800);
      return () => clearTimeout(t);
    }
  }, [showWorld]);

  return (
    <main className="relative w-full h-full bg-[#0E1726] overflow-hidden select-none">
      {/* Loading screen */}
      {!showWorld && <LoadingScreen onBegin={handleBegin} />}

      {/* Scene transition overlay */}
      <div
        className={`fixed inset-0 z-45 bg-[#0E1726] transition-opacity duration-1000 ease-in-out pointer-events-none
          ${transitioning && !showWorld ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 45 }}
      />

      {/* 3D world */}
      <div className={`transition-opacity duration-1000 ease-out ${showWorld ? 'opacity-100' : 'opacity-0'}`}>
        <WorldCanvas />
      </div>

      {/* Atmospheric overlays */}
      {showWorld && (
        <>
          <div className="vignette-overlay" aria-hidden="true" />
          <div className="paper-grain" aria-hidden="true" />
        </>
      )}

      {/* UI overlay */}
      {showWorld && <OverlayUI />}

      {/* Accessible /work section */}
      <section
        id="work"
        tabIndex={-1}
        className="sr-only focus-within:not-sr-only fixed inset-8 bg-[#F3EAD8] text-[#0E1726] p-8 z-40 overflow-y-auto shadow-2xl rounded"
      >
        <div className="flex justify-between items-start border-b border-[#0E1726]/20 pb-4 mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold">{PROFILE.name}</h2>
            <p className="font-sans text-xs text-[#0E1726]/60">{PROFILE.title} &middot; {PROFILE.location}</p>
            <p className="font-sans text-xs text-[#0E1726]/50 mt-1">{PROFILE.email}</p>
          </div>
          <a href="#" className="font-mono text-xs px-3 py-1 bg-[#0E1726] text-[#F3EAD8] rounded hover:bg-[#16233A] transition-colors">
            Close
          </a>
        </div>

        {/* Profile */}
        <div className="mb-6">
          <p className="font-sans text-sm text-[#0E1726]/70 leading-relaxed">{PROFILE.profile}</p>
        </div>

        {/* Education */}
        <div className="mb-6 border-b border-[#0E1726]/10 pb-4">
          <h3 className="font-mono text-xs text-[#C9424B] font-semibold uppercase tracking-wider mb-2">Education</h3>
          <p className="font-display text-sm font-bold">{PROFILE.education.school}</p>
          <p className="font-sans text-xs text-[#0E1726]/60">{PROFILE.education.degree} &middot; {PROFILE.education.year}</p>
          <p className="font-mono text-xs text-[#E3B25C]">{PROFILE.education.gpa}</p>
        </div>

        {/* Achievements */}
        <div className="mb-6 border-b border-[#0E1726]/10 pb-4">
          <h3 className="font-mono text-xs text-[#C9424B] font-semibold uppercase tracking-wider mb-2">Achievements</h3>
          <ul className="space-y-1">
            {PROFILE.achievements.map((a) => (
              <li key={a} className="font-sans text-xs text-[#0E1726]/70 flex items-start gap-2">
                <span className="text-[#E3B25C] mt-0.5">&bull;</span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Skills */}
        <div className="mb-6 border-b border-[#0E1726]/10 pb-4">
          <h3 className="font-mono text-xs text-[#C9424B] font-semibold uppercase tracking-wider mb-2">Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {PROFILE.techStack.map((s) => (
              <span key={s} className="border border-[#0E1726]/20 px-2 py-0.5 rounded text-xs font-mono text-[#0E1726]/60">{s}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}