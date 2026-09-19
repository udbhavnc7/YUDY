import { create } from 'zustand';
import { MomentId } from '../data/moments';

export type Phase = 'loading' | 'travelling' | 'dwelling' | 'diving' | 'inside' | 'surfacing';

export type WorldState = {
  phase: Phase;
  railNode: string;
  activeMoment: MomentId | null;
  hovered: string | null;
  restStage: 0 | 1 | 2 | 3 | 4;
  reducedMotion: boolean;
  soundOn: boolean;
  letterUnlocked: boolean;
  activePanel: 'receipt' | null;
  setPhase: (phase: Phase) => void;
  setRailNode: (node: string) => void;
  setActiveMoment: (moment: MomentId | null) => void;
  setHovered: (hovered: string | null) => void;
  setRestStage: (stage: 0 | 1 | 2 | 3 | 4) => void;
  setActivePanel: (panel: 'receipt' | null) => void;
  toggleReducedMotion: () => void;
  toggleSound: () => void;
  setSoundOn: (on: boolean) => void;
  setLetterUnlocked: (unlocked: boolean) => void;
};

export const useWorldStore = create<WorldState>((set) => ({
  phase: 'loading',
  railNode: 'terrace',
  activeMoment: 'terrace',
  hovered: null,
  restStage: 0,
  reducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  soundOn: false,
  letterUnlocked: false,
  activePanel: null,
  setPhase: (phase) => set({ phase }),
  setRailNode: (railNode) => set({ railNode }),
  setActiveMoment: (activeMoment) => set({ activeMoment }),
  setHovered: (hovered) => set({ hovered }),
  setRestStage: (restStage) => set({ restStage }),
  setActivePanel: (activePanel) => set({ activePanel }),
  toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
  setSoundOn: (soundOn) => set({ soundOn }),
  setLetterUnlocked: (letterUnlocked) => set({ letterUnlocked }),
}));
