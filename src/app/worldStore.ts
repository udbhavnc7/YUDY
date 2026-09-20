import { create } from 'zustand';

export type Phase = 'loading' | 'dwelling';

export type WorldState = {
  phase: Phase;
  hovered: string | null;
  selected: string | null;
  restStage: 0 | 1 | 2 | 3 | 4;
  reducedMotion: boolean;
  soundOn: boolean;
  setPhase: (phase: Phase) => void;
  setHovered: (hovered: string | null) => void;
  setSelected: (selected: string | null) => void;
  setRestStage: (stage: 0 | 1 | 2 | 3 | 4) => void;
  toggleReducedMotion: () => void;
  toggleSound: () => void;
  setSoundOn: (on: boolean) => void;
};

export const useWorldStore = create<WorldState>((set) => ({
  phase: 'loading',
  hovered: null,
  selected: null,
  restStage: 0,
  reducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  soundOn: false,
  setPhase: (phase) => set({ phase }),
  setHovered: (hovered) => set({ hovered }),
  setSelected: (selected) => set({ selected }),
  setRestStage: (restStage) => set({ restStage }),
  toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
  setSoundOn: (soundOn) => set({ soundOn }),
}));