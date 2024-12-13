import { create } from 'zustand';

interface PiPStore {
  isOpen: boolean;
  currentUrl: string | null;
  setIsOpen: (isOpen: boolean) => void;
  setCurrentUrl: (url: string | null) => void;
  togglePiP: (url?: string) => void;
}

export const usePiPMode = create<PiPStore>((set) => ({
  isOpen: false,
  currentUrl: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  setCurrentUrl: (url) => set({ currentUrl: url }),
  togglePiP: (url) => set((state) => {
    if (url) {
      return { isOpen: true, currentUrl: url };
    }
    return { isOpen: !state.isOpen };
  })
}));
