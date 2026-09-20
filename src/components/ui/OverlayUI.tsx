import { useState, useEffect, useCallback } from 'react';
import { useWorldStore } from '../../app/worldStore';
import { ambientAudio } from '../../systems/audio/ambientAudio';
import { useScrollStore } from '../../systems/scroll/ScrollStore';
import { PROFILE } from '../../data/profile';

export function OverlayUI() {
  const soundOn = useWorldStore((s) => s.soundOn);
  const toggleSound = useWorldStore((s) => s.toggleSound);
  const toggleReducedMotion = useWorldStore((s) => s.toggleReducedMotion);
  const hovered = useWorldStore((s) => s.hovered);
  const phase = useWorldStore((s) => s.phase);
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const currentZone = useScrollStore((s) => s.currentZone);

  const [parisTime, setParisTime] = useState('');
  const [headerVisible, setHeaderVisible] = useState(false);
  const [dockVisible, setDockVisible] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit',
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

  useEffect(() => {
    if (phase !== 'loading') {
      const t1 = setTimeout(() => setHeaderVisible(true), 400);
      const t2 = setTimeout(() => setDockVisible(true), 700);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [phase]);

  const handleSoundToggle = useCallback(() => {
    const next = !soundOn;
    toggleSound();
    ambientAudio.setMuted(!next);
  }, [soundOn, toggleSound]);

  if (phase === 'loading') return null;

  const zoneLabel = currentZone?.id || 'room';

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between">
      {/* Top Bar */}
      <header
        className={`pointer-events-auto mx-3 sm:mx-5 mt-3 sm:mt-4 flex items-center justify-between
          bg-[#0E1726]/70 backdrop-blur-2xl border border-[#FBF6EC]/8
          px-4 sm:px-5 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          transition-all duration-700 ease-out
          ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        {/* Left: Identity */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm sm:text-base tracking-[0.15em] text-[#FBF6EC] font-semibold">
              {PROFILE.name}
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.12em] text-[#E3B25C]/60 uppercase mt-0.5">
              {PROFILE.title}
            </span>
          </div>
          <span className="w-px h-5 bg-[#FBF6EC]/10 hidden sm:block" />
          <span className="font-mono text-[9px] tracking-wider text-[#FBF6EC]/30 hidden md:block">
            {PROFILE.location}
          </span>
        </div>

        {/* Center: Clock + Zone indicator */}
        <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] text-[#FBF6EC]/40 tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E3B25C]/50" />
            <span className="tabular-nums">{parisTime || '19:45'}</span>
          </span>
          <span className="text-[#FBF6EC]/10">|</span>
          <span className="text-[#E3B25C]/70 text-[9px] uppercase tracking-wider">
            {zoneLabel.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press w-8 h-8 flex items-center justify-center rounded-xl
              border border-[#FBF6EC]/10 hover:border-[#FBF6EC]/20
              bg-[#FBF6EC]/5 hover:bg-[#FBF6EC]/10
              text-[#FBF6EC]/50 hover:text-[#FBF6EC]/80
              transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#E3B25C]/50"
            aria-label="GitHub profile"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>

          <button
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Mute audio' : 'Unmute audio'}
            className="btn-press w-8 h-8 flex items-center justify-center rounded-xl
              border border-[#FBF6EC]/10 hover:border-[#FBF6EC]/20
              bg-[#FBF6EC]/5 hover:bg-[#FBF6EC]/10
              transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#E3B25C]/50"
          >
            {soundOn ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#E3B25C]">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#FBF6EC]/40">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleReducedMotion}
            className="btn-press w-8 h-8 flex items-center justify-center rounded-xl
              border border-[#FBF6EC]/10 hover:border-[#FBF6EC]/20
              bg-[#FBF6EC]/5 hover:bg-[#FBF6EC]/10
              transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#E3B25C]/50"
            aria-label="Toggle reduced motion"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#FBF6EC]/60">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9.09A6 6 0 0 1 14.91 14.91M9.09 14.91A6 6 0 0 0 14.91 9.09" />
            </svg>
          </button>
        </div>
      </header>

      {/* Center: Hover Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        {hovered && (
          <div key={hovered} className="hover-float pointer-events-none max-w-md w-full">
            <div className="bg-[#0E1726]/80 backdrop-blur-2xl border border-[#E3B25C]/30
              px-6 py-4 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E3B25C]" />
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#E3B25C]/70">
                  {getHoverLabel(hovered)}
                </span>
              </div>
              <p className="font-display text-sm sm:text-base text-[#FBF6EC] font-semibold leading-snug">
                {getHoverTitle(hovered)}
              </p>
              <p className="font-mono text-[10px] text-[#FBF6EC]/30 mt-2">
                Click to open
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Zone Progress Indicator */}
      <div
        className={`pointer-events-auto mx-3 sm:mx-5 mb-3 sm:mb-4
          transition-all duration-700 ease-out delay-200
          ${dockVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {['lamp-intro', 'chair-identity', 'sofa-education', 'posters-achievements', 'solo-books', 'group-books', 'plants-showcase', 'final-reveal'].map((zoneId, idx) => (
              <span
                key={zoneId}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  currentZone?.id === zoneId
                    ? 'bg-[#E3B25C] w-3 shadow-[0_0_8px_#E3B25C]'
                    : scrollProgress > (idx + 1) * 0.12
                    ? 'bg-[#FBF6EC]/40'
                    : 'bg-[#FBF6EC]/10'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-[#FBF6EC]/15 tracking-wider">
              {PROFILE.name} &middot; No analytics &middot; Nothing leaves your device
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getHoverLabel(id: string): string {
  if (id === 'lamp') return 'Intro';
  if (id === 'chair') return 'Chair';
  if (id === 'sofa') return 'Sofa';
  if (id === 'poster-wall') return 'Achievements';
  if (id === 'plant-showcase') return 'Hobbies';
  if (id.startsWith('bookshelf-')) return 'Projects';
  return 'Object';
}

function getHoverTitle(id: string): string {
  const titles: Record<string, string> = {
    lamp: 'Tall Lamp — Introduction',
    chair: 'Swivel Chair — Identity',
    sofa: 'Sofa — Education',
    'poster-wall': 'Achievements — Hacks & Wins',
    'plant-showcase': 'Plants & Hobbies',
    'bookshelf--3.2': 'Projects — Solo & Group',
    'bookshelf-3.2': 'Projects — Solo & Group',
  };
  return titles[id] || id;
}