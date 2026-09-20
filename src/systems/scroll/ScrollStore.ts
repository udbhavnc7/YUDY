import { create } from 'zustand';
import { Zone } from './ScrollCamera';

export type ScrollState = {
  scrollProgress: number;
  currentZone: Zone | null;
  isScrolling: boolean;
  setScrollProgress: (progress: number) => void;
  setCurrentZone: (zone: Zone | null) => void;
  setIsScrolling: (scrolling: boolean) => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  scrollProgress: 0,
  currentZone: null,
  isScrolling: false,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setCurrentZone: (currentZone) => set({ currentZone }),
  setIsScrolling: (isScrolling) => set({ isScrolling }),
}));