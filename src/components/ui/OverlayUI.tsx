import { useState, useEffect } from 'react';
import { useWorldStore } from '../../app/worldStore';
import { ambientAudio } from '../../systems/audio/ambientAudio';
import { PROJECTS } from '../../data/projects';

export function OverlayUI() {
  const soundOn = useWorldStore((s) => s.soundOn);
  const toggleSound = useWorldStore((s) => s.toggleSound);
  const reducedMotion = useWorldStore((s) => s.reducedMotion);
  const toggleReducedMotion = useWorldStore((s) => s.toggleReducedMotion);
  const hovered = useWorldStore((s) => s.hovered);
  const setHovered = useWorldStore((s) => s.setHovered);

  const railNode = useWorldStore((s) => s.railNode);
  const setPhase = useWorldStore((s) => s.setPhase);
  const setActivePanel = useWorldStore((s) => s.setActivePanel);
  const setActiveProjectIndex = useWorldStore((s) => s.setActiveProjectIndex);

  // Live Paris Time (Law 8)
  const [parisTime, setParisTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setParisTime(formatter.format(now));
      } catch {
        setParisTime('19:45');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const next = !soundOn;
    toggleSound();
    ambientAudio.setMuted(!next);
  };

  const openProject = (idx: number) => {
    setActiveProjectIndex(idx);
    setActivePanel('receipt');
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-6">
      {/* Top Editorial Navigation Bar (Stitch Atelier HUD) */}
      <header className="flex items-center justify-between pointer-events-auto bg-[#0E1726]/85 backdrop-blur-xl border border-[#E3B25C]/20 px-4 sm:px-6 py-2.5 rounded-full shadow-2xl transition-all">
        {/* Brand & Paris Live Status */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg tracking-widest text-[#FBF6EC] font-bold leading-tight">
              YUDY
            </span>
            <span className="font-mono text-[8px] tracking-widest text-[#E3B25C]/80 uppercase">
              Atelier d'Ingénierie
            </span>
          </div>

          <span className="h-4 w-px bg-ivory/15" />

          {/* Telemetry Status Indicator */}
          <div className="flex items-center space-x-2 font-mono text-[10px] sm:text-[11px] text-ivory/70 tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E3B25C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E3B25C]"></span>
            </span>
            <span className="font-semibold text-ivory">PARIS {parisTime || '19:45:00'}</span>
            <span className="opacity-30">·</span>
            <span className="text-ivory/60 hidden md:inline">14°C DUSK FOG</span>
            <span className="opacity-30 hidden md:inline">·</span>
            <span className="text-[#E3B25C] font-medium hidden sm:inline">
              {railNode === 'terrace' ? '01 TERRACE DUSK' : '02 WORKSHOP STUDIO'}
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Master Portfolio Dossier Modal Trigger */}
          <button
            onClick={() => setActivePanel('receipt')}
            className="font-mono text-[11px] tracking-wider text-[#E3B25C] hover:text-[#FBF6EC] px-3.5 py-1.5 bg-[#E3B25C]/15 hover:bg-[#E3B25C]/25 border border-[#E3B25C]/40 rounded-full transition-all flex items-center space-x-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#E3B25C]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E3B25C] animate-ping" />
            <span className="font-semibold">PORTFOLIO DOSSIER ({PROJECTS.length})</span>
          </button>

          {railNode === 'workshop' && (
            <button
              onClick={() => setPhase('surfacing')}
              className="font-mono text-[11px] tracking-wider text-ivory hover:text-[#E3B25C] transition-colors flex items-center space-x-1.5 border border-ivory/30 px-3 py-1.5 rounded-full bg-ivory/10 hover:bg-ivory/20 focus:outline-none focus:ring-1 focus:ring-[#E3B25C]"
            >
              <span>Continue rail</span>
              <span>→</span>
            </button>
          )}

          <a
            href="#work"
            className="font-mono text-[11px] tracking-wider text-ivory/70 hover:text-[#E3B25C] transition-colors px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#E3B25C] hidden sm:inline border border-ivory/15 rounded-full"
          >
            INDEX
          </a>

          {/* Audio Waveform Equalizer Button */}
          <button
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Mute rain audio' : 'Unmute rain audio'}
            className="font-mono text-[11px] text-ivory/80 hover:text-ivory px-3 py-1.5 border border-ivory/20 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-[#E3B25C] flex items-center space-x-2 bg-ink/50"
          >
            {soundOn ? (
              <div className="flex items-center space-x-0.5 h-3">
                <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" />
                <span className="w-0.5 h-3 bg-emerald-400 animate-bounce" />
                <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse" />
              </div>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            )}
            <span className="text-[10px] tracking-wider">{soundOn ? 'AUDIO' : 'MUTED'}</span>
          </button>
        </div>
      </header>

      {/* Center Dynamic Interaction Hover Card */}
      <div className="flex justify-center items-center">
        {hovered && (
          <div className="bg-[#0E1726]/90 backdrop-blur-xl border border-[#E3B25C]/60 px-6 py-3.5 rounded-2xl text-xs font-sans text-ivory animate-fade-in pointer-events-none shadow-2xl flex flex-col items-center max-w-lg text-center">
            <div className="flex items-center space-x-2 font-mono text-[10px] tracking-widest uppercase text-[#E3B25C] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E3B25C] animate-ping" />
              <span>
                {hovered === 'laptop' && 'FEATURED DIVE · WORKSHOP PORTAL'}
                {hovered === 'item-kawach' && 'PROJECT 01 · TACTICAL BLE SAFETY MESH'}
                {hovered === 'item-vortex' && 'PROJECT 02 · ALGORAND SMART CONTRACT ESCROW'}
                {hovered === 'item-nayana' && 'PROJECT 03 · CLINICAL EYE-GAZE AI'}
                {hovered === 'item-sanchay' && 'PROJECT 04 · LOCAL-FIRST ANDROID FINANCE'}
                {hovered === 'item-medaether' && 'PROJECT 05 · ICU COORDINATION INTELLIGENCE'}
                {hovered === 'item-lume' && 'PROJECT 06 · INFRASTRUCTURE RISK FORECASTING'}
                {hovered === 'item-tattva' && 'PROJECT 07 · EXAM SYLLABUS INTELLIGENCE'}
                {hovered === 'item-prism' && 'PROJECT 08 · MULTIMODAL HEALTH SCREENING AI'}
                {hovered === 'dossier' && 'SELECTED WORKS DOSSIER'}
                {hovered === 'coffee' && 'PARISIAN EVENING DUSK'}
                {hovered === 'project-kawach' && 'HERO PROTOTYPE · BEST STARTUP AWARD'}
              </span>
            </div>
            <div className="font-display text-sm sm:text-base text-[#FBF6EC] font-bold tracking-wide">
              {hovered === 'laptop' && 'KAWACH — Offline Personal Safety & BLE Mesh'}
              {hovered === 'item-kawach' && 'KAWACH — Emergency Mesh Network & Google Gemini AI Triage'}
              {hovered === 'item-vortex' && 'VORTEX — Algorand ARC4 Escrow Engine & Docker Sandbox'}
              {hovered === 'item-nayana' && 'NAYANA — Eye-Gaze Communication AI for ALS Patients'}
              {hovered === 'item-sanchay' && 'Sanchay — Local-First Android Personal Finance (Kotlin / Room)'}
              {hovered === 'item-medaether' && 'MedÆther — Critical ICU Bed & Blood Coordination Mesh'}
              {hovered === 'item-lume' && 'LUME — Land Acquisition Delay Risk Forecasting Engine'}
              {hovered === 'item-tattva' && 'TATTVA — Automated Exam Syllabus & Question Intelligence'}
              {hovered === 'item-prism' && 'PRISM — Contactless Health Screening AI (Smartphone Camera/Mic)'}
              {hovered === 'dossier' && 'Udbhav N Chandragiri — Master Portfolio Archive'}
              {hovered === 'coffee' && 'Single Origin Espresso · Parisian Zinc View'}
              {hovered === 'project-kawach' && 'KAWACH Hardware Node — Tactical BLE Repeater'}
            </div>
            <div className="font-mono text-[10px] text-[#E3B25C]/80 mt-1">
              Click object or select from dock below to inspect full case study →
            </div>
          </div>
        )}
      </div>

      {/* Bottom Projects Shelf & Footer Controls (Stitch Bottom Dock) */}
      <div className="flex flex-col space-y-2.5 pointer-events-auto">
        {/* Quick Project Switcher Bar */}
        <nav
          aria-label="Portfolio Projects"
          className="flex items-center justify-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1.5 px-3 bg-[#0E1726]/85 backdrop-blur-xl border border-[#E3B25C]/20 rounded-full max-w-5xl mx-auto shadow-2xl"
        >
          <span className="font-mono text-[9px] tracking-wider text-[#E3B25C]/70 uppercase pl-2 pr-1 hidden lg:inline font-bold">
            WORKS:
          </span>
          {PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => openProject(idx)}
              onPointerEnter={() => {
                if (proj.id === 'kawach') setHovered('laptop');
                else setHovered(`item-${proj.id}`);
              }}
              onPointerLeave={() => setHovered(null)}
              className="font-mono text-[10px] sm:text-[11px] tracking-wider px-2.5 sm:px-3 py-1 rounded-full text-ivory/80 hover:text-[#E3B25C] hover:bg-[#E3B25C]/15 transition-all flex items-center space-x-1.5 focus:outline-none focus:ring-1 focus:ring-[#E3B25C]"
            >
              <span className="text-[9px] text-[#E3B25C] font-bold">0{idx + 1}</span>
              <span className="font-semibold whitespace-nowrap">{proj.id.toUpperCase()}</span>
            </button>
          ))}
        </nav>

        {/* Legal & Accessibility Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-ivory/50 px-3">
          <div>
            <span>Crafted by </span>
            <span className="text-ivory font-medium">Udbhav N Chandragiri</span>
            <span className="mx-2 opacity-30">·</span>
            <a
              href="https://github.com/udbhavnc7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E3B25C] hover:underline transition-colors font-mono font-medium"
            >
              github.com/udbhavnc7
            </a>
            <span className="mx-2 opacity-30">·</span>
            <span className="italic text-ivory/40">Law 6: No telemetry, no third-party scripts</span>
          </div>

          <div className="flex items-center space-x-3 mt-1 sm:mt-0">
            <button
              onClick={toggleReducedMotion}
              className="font-mono text-[10px] text-ivory/60 hover:text-ivory transition-colors px-2 py-0.5 border border-ivory/15 rounded"
            >
              {reducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
            </button>
            <span className="opacity-30">·</span>
            <span className="font-mono text-[10px] text-[#E3B25C]/80">
              [K] Pose Recorder
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
