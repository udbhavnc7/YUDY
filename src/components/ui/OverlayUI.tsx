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
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-7">
      {/* Top Editorial Navigation Bar */}
      <header className="flex items-center justify-between pointer-events-auto bg-ink/75 backdrop-blur-md border border-ivory/10 px-5 py-2.5 rounded-full shadow-2xl">
        {/* Brand & Paris Live Status */}
        <div className="flex items-center space-x-3.5">
          <span className="font-display text-base tracking-widest text-ivory font-bold">
            YUDY
          </span>
          <span className="h-3.5 w-px bg-ivory/20" />
          <div className="flex items-center space-x-2 font-mono text-[11px] text-ivory/70 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span>PARIS {parisTime || '19:45'}</span>
            <span className="opacity-40">·</span>
            <span className="text-gold/90 font-medium">
              {railNode === 'terrace' ? 'TERRACE DUSK' : 'WORKSHOP STUDIO'}
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActivePanel('receipt')}
            className="font-mono text-xs tracking-wider text-gold hover:text-ivory px-3.5 py-1 bg-gold/15 hover:bg-gold/25 border border-gold/40 rounded-full transition-all flex items-center space-x-1.5 focus:outline-none focus:ring-1 focus:ring-gold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
            <span>Portfolio Dossier (7)</span>
          </button>

          {railNode === 'workshop' && (
            <button
              onClick={() => setPhase('surfacing')}
              className="font-mono text-xs tracking-wider text-ivory hover:text-gold transition-colors flex items-center space-x-1 border border-ivory/30 px-3 py-1 rounded-full bg-ivory/10 hover:bg-ivory/20 focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <span>Continue on rail</span>
              <span>→</span>
            </button>
          )}

          <a
            href="#work"
            className="font-mono text-xs tracking-wider text-ivory/60 hover:text-gold transition-colors px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gold hidden sm:inline"
          >
            Index
          </a>

          <button
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Mute rain audio' : 'Unmute rain audio'}
            className="font-mono text-xs text-ivory/70 hover:text-ivory px-2.5 py-1 border border-ivory/20 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-gold flex items-center space-x-1.5"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${soundOn ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span>{soundOn ? 'AUDIO ON' : 'MUTED'}</span>
          </button>
        </div>
      </header>

      {/* Center Dynamic Interaction Hover Card */}
      <div className="flex justify-center items-center">
        {hovered && (
          <div className="bg-ink/90 backdrop-blur-md border border-gold/50 px-6 py-3 rounded-2xl text-xs font-sans text-ivory animate-fade-in pointer-events-none shadow-2xl flex flex-col items-center max-w-md text-center">
            <div className="flex items-center space-x-2 font-mono text-[10px] tracking-widest uppercase text-gold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
              <span>
                {hovered === 'laptop' && 'FEATURED DIVE · WORKSHOP PORTAL'}
                {hovered === 'item-lume' && 'PROJECT 02 · INFRASTRUCTURE INTELLIGENCE'}
                {hovered === 'item-sanchay' && 'PROJECT 04 · LOCAL-FIRST ANDROID ENGINE'}
                {hovered === 'item-nayana' && 'PROJECT 03 · ACCESSIBLE GAZE TRACKING'}
                {hovered === 'item-saathi' && 'PROJECT 05 · VOICE HEALTH COMPANION'}
                {hovered === 'item-medaether' && 'PROJECT 06 · HOSPITAL EMERGENCY MESH'}
                {hovered === 'dossier' && 'SELECTED WORKS DOSSIER'}
                {hovered === 'coffee' && 'PARISIAN EVENING DUSK'}
                {hovered === 'project-kawach' && 'HERO PROTOTYPE · BEST STARTUP AWARD'}
              </span>
            </div>
            <div className="font-display text-sm text-ivory font-bold tracking-wide">
              {hovered === 'laptop' && 'KAWACH — Offline Personal Safety & BLE Mesh'}
              {hovered === 'item-lume' && 'LUME — Land Acquisition Predictive Analytics'}
              {hovered === 'item-sanchay' && 'Sanchay — Android Personal Finance (Kotlin / Room)'}
              {hovered === 'item-nayana' && 'NAYANA — Eye-Gaze Communication AI Platform'}
              {hovered === 'item-saathi' && 'SAATHI — Multilingual Healthcare Guardian'}
              {hovered === 'item-medaether' && 'MedÆther — ICU Bed & Blood Coordination'}
              {hovered === 'dossier' && 'Udbhav N Chandragiri — Master Portfolio Archive'}
              {hovered === 'coffee' && 'Single Origin Espresso · Parisian Zinc View'}
              {hovered === 'project-kawach' && 'KAWACH Hardware Node — Tactical BLE Repeater'}
            </div>
            <div className="font-mono text-[10px] text-ivory/50 mt-1">
              Click object to open full technical case study →
            </div>
          </div>
        )}
      </div>

      {/* Bottom Projects Shelf & Footer Controls */}
      <div className="flex flex-col space-y-3 pointer-events-auto">
        {/* Quick Project Switcher Bar */}
        <nav
          aria-label="Portfolio Projects"
          className="flex items-center justify-center space-x-1.5 sm:space-x-2 overflow-x-auto py-1 px-3 bg-ink/75 backdrop-blur-md border border-ivory/10 rounded-full max-w-4xl mx-auto shadow-2xl"
        >
          <span className="font-mono text-[10px] tracking-wider text-ivory/40 uppercase pl-2 pr-1 hidden md:inline">
            Projects:
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
              className="font-mono text-[11px] tracking-wider px-3 py-1 rounded-full text-ivory/70 hover:text-gold hover:bg-gold/15 transition-all flex items-center space-x-1.5 focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <span className="text-[10px] text-gold/60 font-semibold">0{idx + 1}</span>
              <span className="font-medium whitespace-nowrap">{proj.id.toUpperCase()}</span>
            </button>
          ))}
        </nav>

        {/* Legal & Accessibility Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-ivory/40 px-2">
          <div>
            <span>Crafted by </span>
            <span className="text-ivory/80 font-medium">Udbhav N Chandragiri</span>
            <span className="mx-2 opacity-30">·</span>
            <a
              href="https://github.com/udbhavnc7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/70 hover:text-gold hover:underline transition-colors font-mono"
            >
              github.com/udbhavnc7
            </a>
            <span className="mx-2 opacity-30">·</span>
            <span className="italic">No telemetry, no tracking</span>
          </div>

          <div className="flex items-center space-x-4 mt-1 sm:mt-0">
            <button
              onClick={toggleReducedMotion}
              className="font-mono text-[10px] text-ivory/50 hover:text-ivory transition-colors"
            >
              {reducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
            </button>
            <span className="opacity-30">·</span>
            <span className="font-mono text-[10px] text-ivory/40">
              Press [K] to record shot
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
