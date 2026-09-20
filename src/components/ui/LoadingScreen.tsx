import { useEffect, useRef, useState } from 'react';
import { useWorldStore } from '../../app/worldStore';
import { ambientAudio } from '../../systems/audio/ambientAudio';
import { PROFILE } from '../../data/profile';

export function LoadingScreen({ onBegin }: { onBegin: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = window.setInterval(() => {
      current += 0.02 + Math.random() * 0.035;
      if (current >= 1) {
        current = 1;
        setProgress(1);
        setReady(true);
        window.clearInterval(interval);
      } else {
        setProgress(current);
      }
    }, 50);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angleOffset = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      const tawaRadius = Math.min(w, h) * 0.36;

      // Cast iron tawa
      const tawaGrad = ctx.createRadialGradient(cx, cy, tawaRadius * 0.15, cx, cy, tawaRadius);
      tawaGrad.addColorStop(0, '#1a1f2c');
      tawaGrad.addColorStop(0.8, '#10141f');
      tawaGrad.addColorStop(1, '#080a10');

      ctx.beginPath();
      ctx.arc(cx, cy, tawaRadius, 0, Math.PI * 2);
      ctx.fillStyle = tawaGrad;
      ctx.fill();

      // Tawa rim with metallic highlight
      ctx.lineWidth = 3;
      const rimGrad = ctx.createLinearGradient(cx - tawaRadius, cy - tawaRadius, cx + tawaRadius, cy + tawaRadius);
      rimGrad.addColorStop(0, '#3a4560');
      rimGrad.addColorStop(0.5, '#2c354a');
      rimGrad.addColorStop(1, '#1a2030');
      ctx.strokeStyle = rimGrad;
      ctx.stroke();

      // Batter spiral
      const maxRotations = 4.8;
      const currentRotations = maxRotations * progress;
      const totalSteps = Math.floor(currentRotations * 50);

      if (totalSteps > 0) {
        ctx.beginPath();
        for (let i = 0; i <= totalSteps; i++) {
          const theta = (i / 50) * Math.PI * 2;
          const r = (theta / (maxRotations * Math.PI * 2)) * (tawaRadius * 0.7);
          const x = cx + Math.cos(theta + angleOffset) * r;
          const y = cy + Math.sin(theta + angleOffset) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const spiralGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, tawaRadius * 0.65);
        spiralGrad.addColorStop(0, progress > 0.75 ? '#E3B25C' : '#F3EAD8');
        spiralGrad.addColorStop(1, progress > 0.5 ? '#D49B45' : '#EAE0CB');

        ctx.strokeStyle = spiralGrad;
        ctx.lineWidth = 12 * Math.min(1, progress * 1.4);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Steam wisps
      if (progress > 0.15) {
        const steamCount = Math.floor(progress * 5);
        for (let i = 0; i < steamCount; i++) {
          const phase = (angleOffset * 2 + i * 1.3) % (Math.PI * 2);
          const t = (Math.sin(phase) + 1) / 2;
          const sx = cx + Math.sin(angleOffset + i * 2.1) * tawaRadius * 0.3;
          const sy = cy - tawaRadius * 0.3 - t * 40;
          const steamAlpha = (1 - t) * 0.12 * Math.min(1, progress * 2);

          ctx.beginPath();
          ctx.arc(sx, sy, 3 + t * 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(243, 234, 216, ${steamAlpha})`;
          ctx.fill();
        }
      }

      angleOffset += 0.003;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [progress]);

  const handleBegin = async () => {
    await ambientAudio.resume();
    useWorldStore.getState().setSoundOn(true);
    ambientAudio.setMuted(false);
    setFading(true);
    window.setTimeout(() => onBegin(), 900);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E1726]
      transition-opacity duration-1000 ease-out
      ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

      <div className="relative flex flex-col items-center">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-64 h-64 sm:w-80 sm:h-80 max-w-full"
          style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
        />

        {/* Title */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <h1 className="font-display text-3xl sm:text-4xl tracking-[0.3em] text-[#FBF6EC]/90 font-light select-none">
            {PROFILE.name}
          </h1>
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#FBF6EC]/30">
            {PROFILE.title}
          </p>
          <p className="font-sans text-[10px] tracking-wider text-[#FBF6EC]/20 mt-1 max-w-xs text-center leading-relaxed">
            {PROFILE.profile}
          </p>

          <div className="h-12 flex items-center justify-center mt-2">
            {ready ? (
              <button
                onClick={handleBegin}
                autoFocus
                className="btn-press px-8 py-2.5 rounded-full
                  border border-[#E3B25C]/30 bg-[#E3B25C]/10
                  hover:bg-[#E3B25C]/20 hover:border-[#E3B25C]/50
                  text-[#E3B25C] font-sans text-xs tracking-[0.2em] uppercase
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-[#E3B25C]/50
                  glow-idle"
              >
                Tap to begin
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-32 h-0.5 bg-[#FBF6EC]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E3B25C]/60 rounded-full transition-all duration-200 ease-out"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-[#FBF6EC]/25 tabular-nums">
                  {Math.round(progress * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
