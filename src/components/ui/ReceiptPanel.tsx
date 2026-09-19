import { useState, useEffect } from 'react';
import { useWorldStore } from '../../app/worldStore';
import { PROJECTS, Project } from '../../data/projects';

export function ReceiptPanel({ onContinue }: { onContinue: () => void }) {
  const activePanel = useWorldStore((s) => s.activePanel);
  const setActivePanel = useWorldStore((s) => s.setActivePanel);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const project: Project = PROJECTS[selectedIdx] || PROJECTS[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePanel(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActivePanel]);

  if (activePanel !== 'receipt') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-md transition-all duration-500">
      {/* Thermal Paper Receipt Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Project Case Study Receipt"
        className="relative w-full max-w-xl bg-paper text-ink shadow-2xl p-6 sm:p-8 font-mono border-t-8 border-b-8 border-dashed border-ink/25 transform transition-all animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
      >
        {/* Receipt Header */}
        <div className="text-center border-b border-dashed border-ink/30 pb-4 mb-4">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-ink/60 mb-2">
            <span>UDBHAV N CHANDRAGIRI</span>
            <span>PARIS RECORD · 2026</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            {project.name}
          </h2>
          <p className="text-xs text-cherry font-semibold mt-1">
            Building Metaphor: {project.building}
          </p>

          <div className="text-[11px] text-ink/60 mt-2 flex justify-between">
            <span>YEAR: {project.year}</span>
            <span>ROLE: {project.role.split('—')[0]}</span>
          </div>

          {/* Project Selector Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-dashed border-ink/20">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedIdx(idx)}
                className={`text-[10px] px-2.5 py-1 rounded border font-mono transition-all ${
                  idx === selectedIdx
                    ? 'bg-ink text-paper border-ink font-bold shadow'
                    : 'bg-transparent text-ink/70 border-ink/20 hover:border-ink/50'
                }`}
              >
                0{idx + 1} {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Project Meta Details */}
        <div className="space-y-3 text-xs border-b border-dashed border-ink/30 pb-4 mb-4">
          <div>
            <span className="text-[10px] uppercase text-ink/50 block font-bold">Thesis / One-Line</span>
            <p className="text-xs font-sans text-ink/90 italic mt-0.5">
              "{project.oneLine}"
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase text-ink/50 block font-bold">Author Contribution</span>
            <p className="text-xs text-ink/80 mt-0.5">{project.role}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase text-ink/50 block font-bold mb-1">Execution Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 bg-ink/5 border border-ink/20 rounded text-[10px] font-mono text-ink/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Case Study Content */}
        <div className="space-y-3 text-xs text-ink/80 border-b border-dashed border-ink/30 pb-5 mb-5 font-sans leading-relaxed">
          <div className="font-mono text-[11px] font-bold text-ink uppercase tracking-wider mb-2">
            § Technical Breakdown & Architecture
          </div>
          <div className="space-y-2 whitespace-pre-line text-xs text-ink/85">
            {project.caseStudy}
          </div>
        </div>

        {/* Receipt Actions: Forward Only per Law 1 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setActivePanel(null)}
            className="w-full sm:w-auto px-4 py-2 border border-ink/30 text-ink text-xs font-mono rounded hover:bg-ink/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
          >
            [Close Dossier Esc]
          </button>

          <button
            onClick={() => {
              setActivePanel(null);
              onContinue();
            }}
            className="w-full sm:w-auto px-5 py-2 bg-ink text-ivory hover:bg-navy text-xs font-mono font-semibold rounded transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <span>Continue on Rail</span>
            <span>→</span>
          </button>
        </div>

        {/* Sub-receipt barcode imitation */}
        <div className="mt-6 pt-3 border-t border-dashed border-ink/20 flex flex-col items-center">
          <div className="h-6 w-48 flex justify-between items-stretch opacity-60">
            {[4, 1, 3, 1, 2, 5, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 5, 2].map((w, i) => (
              <span
                key={i}
                className="bg-ink"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
          <span className="text-[9px] text-ink/40 tracking-widest mt-1">
            UDBHAV N CHANDRAGIRI · PORTFOLIO · LAW 1
          </span>
        </div>
      </div>
    </div>
  );
}
