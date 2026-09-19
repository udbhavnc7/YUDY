import { useEffect, useRef, useState } from 'react';
import { useWorldStore } from '../../app/worldStore';
import { ambientAudio } from '../../systems/audio/ambientAudio';

export function LoadingScreen({ onBegin }: { onBegin: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [fading, setFading] = useState(false);

  // Simulated asset loading progression
  useEffect(() => {
    let current = 0;
    const interval = window.setInterval(() => {
      current += 0.025 + Math.random() * 0.04;
      if (current >= 1) {
        current = 1;
        setProgress(1);
        setReady(true);
        window.clearInterval(interval);
      } else {
        setProgress(current);
      }
    }, 40);

    return () => window.clearInterval(interval);
  }, []);

  // 2D Canvas Dosa rendering on Tawa
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

      // Dark cast iron tawa
      const tawaRadius = Math.min(w, h) * 0.38;
      const tawaGrad = ctx.createRadialGradient(cx, cy, tawaRadius * 0.2, cx, cy, tawaRadius);
      tawaGrad.addColorStop(0, '#1a1f2c');
      tawaGrad.addColorStop(0.85, '#10141f');
      tawaGrad.addColorStop(1, '#080a10');

      ctx.beginPath();
      ctx.arc(cx, cy, tawaRadius, 0, Math.PI * 2);
      ctx.fillStyle = tawaGrad;
      ctx.fill();

      // Subtle metallic tawa rim
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#2c354a';
      ctx.stroke();

      // Batter spiral (Archimedean spiral)
      const maxRotations = 4.8;
      const currentRotations = maxRotations * progress;
      const totalSteps = Math.floor(currentRotations * 50);

      if (totalSteps > 0) {
        ctx.beginPath();
        for (let i = 0; i <= totalSteps; i++) {
          const theta = (i / 50) * Math.PI * 2;
          const r = (theta / (maxRotations * Math.PI * 2)) * (tawaRadius * 0.72);
          const x = cx + Math.cos(theta + angleOffset) * r;
          const y = cy + Math.sin(theta + angleOffset) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Color shifts from pale cream to golden crisp
        const spiralGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, tawaRadius * 0.7);
        spiralGrad.addColorStop(0, progress > 0.8 ? '#E3B25C' : '#F3EAD8');
        spiralGrad.addColorStop(1, progress > 0.6 ? '#D49B45' : '#EAE0CB');

        ctx.strokeStyle = spiralGrad;
        ctx.lineWidth = 14 * Math.min(1, progress * 1.5);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Gentle steam / batter sizzle shimmer
      angleOffset += 0.003;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [progress]);

  const handleBegin = async () => {
    // Unlocks audio context on user gesture
    await ambientAudio.resume();
    useWorldStore.getState().setSoundOn(true);
    ambientAudio.setMuted(false);

    setFading(true);
    window.setTimeout(() => {
      onBegin();
    }, 900);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink transition-opacity duration-1000 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Tawa Canvas */}
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-72 h-72 sm:w-88 sm:h-88 max-w-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
        />

        {/* Title and Begin Action */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <h1 className="font-display text-2xl sm:text-3xl tracking-widest text-ivory/90 font-light">
            YUDY
          </h1>
          <p className="font-sans text-xs tracking-widest uppercase text-ivory/50">
            an unfinished world
          </p>

          <div className="h-14 flex items-center justify-center">
            {ready ? (
              <button
                onClick={handleBegin}
                autoFocus
                className="px-6 py-2.5 rounded-full border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold font-sans text-xs tracking-widest uppercase transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                Tap to begin
              </button>
            ) : (
              <span className="font-mono text-xs text-ivory/40">
                spiraling batter · {Math.round(progress * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
