import { useEffect, useRef } from 'react';
import { useWorldStore } from '../../app/worldStore';
import { useScrollStore } from './ScrollStore';
import { getZoneAtProgress, interpolateWaypoints, Waypoint } from './ScrollCamera';

export function useScrollCamera() {
  const setPhase = useWorldStore((s) => s.setPhase);
  const phase = useWorldStore((s) => s.phase);

  const setScrollProgress = useScrollStore((s) => s.setScrollProgress);
  const setCurrentZone = useScrollStore((s) => s.setCurrentZone);
  const setIsScrolling = useScrollStore((s) => s.setIsScrolling);

  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const currentZone = useScrollStore((s) => s.currentZone);
  const isScrolling = useScrollStore((s) => s.isScrolling);

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>();
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.008 : -0.008;
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + delta));
      setIsScrolling(true);

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + 0.05));
        setIsScrolling(true);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current - 0.05));
        setIsScrolling(true);
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetProgressRef.current = 0;
        setIsScrolling(true);
      } else if (e.key === 'End') {
        e.preventDefault();
        targetProgressRef.current = 1;
        setIsScrolling(true);
      }

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      (window as any).__touchStartY = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const startY = (window as any).__touchStartY;
      if (startY !== undefined) {
        const deltaY = startY - touch.clientY;
        const delta = deltaY * 0.0005;
        targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + delta));
        setIsScrolling(true);
        (window as any).__touchStartY = touch.clientY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [setIsScrolling]);

  useEffect(() => {
    const animate = () => {
      const lerpFactor = 0.08;
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * lerpFactor;

      if (Math.abs(targetProgressRef.current - currentProgressRef.current) > 0.0001) {
        setScrollProgress(currentProgressRef.current);
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [setScrollProgress]);

  useEffect(() => {
    const zone = getZoneAtProgress(scrollProgress);
    setCurrentZone(zone);

    if (scrollProgress > 0.02 && phase === 'loading') {
      setPhase('dwelling');
    }
  }, [scrollProgress, phase, setPhase, setCurrentZone]);

  return {
    scrollProgress,
    currentZone,
    isScrolling,
    setScrollProgress: (p: number) => { targetProgressRef.current = Math.max(0, Math.min(1, p)); },
  };
}

export function getCurrentWaypoint(scrollProgress: number): Waypoint | null {
  const zone = getZoneAtProgress(scrollProgress);
  if (!zone) return null;
  const zoneRange = zone.range[1] - zone.range[0];
  const localProgress = zoneRange > 0 ? (scrollProgress - zone.range[0]) / zoneRange : 0;
  return interpolateWaypoints(zone, Math.max(0, Math.min(1, localProgress)));
}