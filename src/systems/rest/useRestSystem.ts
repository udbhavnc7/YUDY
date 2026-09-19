import { useEffect, useRef } from 'react';
import { useWorldStore } from '../../app/worldStore';

export function useRestSystem() {
  const phase = useWorldStore((s) => s.phase);
  const restStage = useWorldStore((s) => s.restStage);
  const setRestStage = useWorldStore((s) => s.setRestStage);

  const lastActivityRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Rest is suspended during loading, dives, or inside panels
    const isSuspended = phase === 'loading' || phase === 'diving' || phase === 'inside';

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (restStage !== 0) {
        setRestStage(0);
      }
    };

    window.addEventListener('pointermove', handleActivity, { passive: true });
    window.addEventListener('pointerdown', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });
    window.addEventListener('wheel', handleActivity, { passive: true });

    if (isSuspended) {
      return () => {
        window.removeEventListener('pointermove', handleActivity);
        window.removeEventListener('pointerdown', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('touchstart', handleActivity);
        window.removeEventListener('wheel', handleActivity);
      };
    }

    const checkInterval = window.setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= 16000) {
        if (restStage !== 2) setRestStage(2);
      } else if (elapsed >= 8000) {
        if (restStage !== 1) setRestStage(1);
      } else {
        if (restStage !== 0) setRestStage(0);
      }
    }, 500);

    timerRef.current = checkInterval;

    return () => {
      window.clearInterval(checkInterval);
      window.removeEventListener('pointermove', handleActivity);
      window.removeEventListener('pointerdown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('wheel', handleActivity);
    };
  }, [phase, restStage, setRestStage]);
}
