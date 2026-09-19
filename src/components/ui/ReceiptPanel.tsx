import { useEffect } from 'react';
import { useWorldStore } from '../../app/worldStore';
import { PROJECTS, Project } from '../../data/projects';

export function ReceiptPanel({ onContinue }: { onContinue: () => void }) {
  const activePanel = useWorldStore((s) => s.activePanel);
  const setActivePanel = useWorldStore((s) => s.setActivePanel);
  const activeProjectIndex = useWorldStore((s) => s.activeProjectIndex);
  const setActiveProjectIndex = useWorldStore((s) => s.setActiveProjectIndex);

  const project: Project = PROJECTS[activeProjectIndex] || PROJECTS[0];

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
      {/* Thermal Paper Receipt Card (Stitch Atelier Design) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Project Case Study Receipt"
        className="relative w-full max-w-2xl bg-[#F3EAD8] text-[#0E1726] shadow-2xl p-6 sm:p-9 font-mono border-t-8 border-b-8 border-dashed border-[#0E1726]/30 transform transition-all animate-in fade-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto rounded-sm"
      >
        {/* Architectural Watermark Stamp */}
        <div className="absolute top-12 right-6 border-2 border-[#C9424B]/60 bg-[#C9424B]/5 text-[#C9424B] px-3 py-1 rounded text-[9px] uppercase tracking-widest font-mono font-bold rotate-3 pointer-events-none select-none shadow-sm">
          {project.award ? '★ PRIZE RECOGNITION' : 'VERIFIED ARTIFACT · LAW 01'}
        </div>

        {/* Receipt Header */}
        <div className="border-b-2 border-dashed border-[#0E1726]/30 pb-4 mb-4">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#0E1726]/60 mb-2">
            <span>UDBHAV N CHANDRAGIRI</span>
            <span>ATELIER RECORD · 2026</span>
          </div>

          <div className="font-mono text-[11px] text-[#E3B25C] font-bold tracking-widest uppercase mb-1">
            DOSSIER ARTIFACT 0{activeProjectIndex + 1} / 0{PROJECTS.length}
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0E1726]">
            {project.name}
          </h2>

          {project.award && (
            <div className="inline-block bg-[#E3B25C]/20 border border-[#E3B25C]/50 px-3 py-1 rounded text-xs text-[#0E1726] font-bold mt-2">
              🏆 {project.award}
            </div>
          )}

          <p className="text-xs text-[#C9424B] font-semibold mt-2">
            Spatial Metaphor: {project.building}
          </p>

          <div className="text-[11px] text-[#0E1726]/70 mt-2 flex justify-between border-t border-dashed border-[#0E1726]/15 pt-2">
            <span>CHRONOLOGY: {project.year}</span>
            <span>DISCIPLINE: {project.role.split('—')[0]}</span>
          </div>

          {/* Project Switcher Tabs */}
          <div className="flex flex-wrap gap-1.5 mt-3.5 pt-2 border-t border-dashed border-[#0E1726]/20">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveProjectIndex(idx)}
                className={`text-[10px] px-2.5 py-1 rounded border font-mono transition-all ${
                  idx === activeProjectIndex
                    ? 'bg-[#0E1726] text-[#F3EAD8] border-[#0E1726] font-bold shadow'
                    : 'bg-transparent text-[#0E1726]/70 border-[#0E1726]/20 hover:border-[#0E1726]/60 hover:bg-[#0E1726]/5'
                }`}
              >
                0{idx + 1} {p.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry Metrics Table */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="border-b-2 border-dashed border-[#0E1726]/30 pb-3 mb-4">
            <div className="text-[9px] uppercase tracking-widest text-[#0E1726]/50 font-bold mb-2">
              § RUNTIME BENCHMARKS & TELEMETRY
            </div>
            <div className="grid grid-cols-3 gap-2">
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-[#0E1726]/5 p-2 rounded border border-[#0E1726]/10 text-center">
                  <div className="text-[9px] text-[#0E1726]/60 font-medium uppercase">{m.label}</div>
                  <div className="text-xs sm:text-sm font-bold text-[#0E1726] mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Meta Details */}
        <div className="space-y-3 text-xs border-b-2 border-dashed border-[#0E1726]/30 pb-4 mb-4">
          <div>
            <span className="text-[10px] uppercase text-[#0E1726]/50 block font-bold">Thesis / Core Intent</span>
            <p className="text-xs sm:text-[13px] font-sans text-[#0E1726] italic mt-0.5 leading-relaxed">
              "{project.oneLine}"
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase text-[#0E1726]/50 block font-bold">Author Architecture & Scope</span>
            <p className="text-xs text-[#0E1726]/85 mt-0.5">{project.role}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase text-[#0E1726]/50 block font-bold mb-1">Execution Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 bg-[#0E1726]/5 border border-[#0E1726]/20 rounded text-[10px] font-mono text-[#0E1726] font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* External Project Links */}
          {project.links && project.links.length > 0 && (
            <div>
              <span className="text-[10px] uppercase text-[#0E1726]/50 block font-bold mb-1">Repository & Deployments</span>
              <div className="flex flex-wrap gap-2">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-[#0E1726] text-[#F3EAD8] hover:bg-[#16233A] rounded text-xs font-mono font-medium transition-colors"
                  >
                    <span>{link.label}</span>
                    <span>↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Case Study Content */}
        <div className="space-y-3 text-xs text-[#0E1726]/85 border-b-2 border-dashed border-[#0E1726]/30 pb-5 mb-5 font-sans leading-relaxed">
          <div className="font-mono text-[11px] font-bold text-[#0E1726] uppercase tracking-wider mb-2">
            § Technical Breakdown & System Architecture
          </div>
          <div className="space-y-2 whitespace-pre-line text-xs text-[#0E1726]/90">
            {project.caseStudy}
          </div>
        </div>

        {/* Receipt Actions: Forward Only per Law 1 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setActivePanel(null)}
            className="w-full sm:w-auto px-4 py-2 border border-[#0E1726]/30 text-[#0E1726] text-xs font-mono rounded hover:bg-[#0E1726]/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E3B25C]"
          >
            [Close Dossier Esc]
          </button>

          <button
            onClick={() => {
              setActivePanel(null);
              onContinue();
            }}
            className="w-full sm:w-auto px-5 py-2 bg-[#0E1726] text-[#F3EAD8] hover:bg-[#16233A] text-xs font-mono font-semibold rounded transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#E3B25C]"
          >
            <span>Continue on Rail</span>
            <span>→</span>
          </button>
        </div>

        {/* Sub-receipt barcode imitation */}
        <div className="mt-6 pt-3 border-t border-dashed border-[#0E1726]/20 flex flex-col items-center">
          <div className="h-6 w-48 flex justify-between items-stretch opacity-60">
            {[4, 1, 3, 1, 2, 5, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 5, 2].map((w, i) => (
              <span
                key={i}
                className="bg-[#0E1726]"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
          <span className="text-[9px] text-[#0E1726]/40 tracking-widest mt-1">
            UDBHAV N CHANDRAGIRI · PORTFOLIO · LAW 01
          </span>
        </div>
      </div>
    </div>
  );
}
