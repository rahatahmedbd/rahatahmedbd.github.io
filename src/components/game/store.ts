import { create } from 'zustand';

interface GameState {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showHqModal: boolean;
  setShowHqModal: (show: boolean) => void;
  interactionText: string | null;
  setInteractionText: (text: string | null) => void;
  lastCheckpoint: [number, number, number] | null;
  setCheckpoint: (pos: [number, number, number]) => void;
  settings: {
    sensitivity: number;
    volume: number;
    graphics: 'low' | 'medium' | 'high';
  };
  updateSettings: (newSettings: Partial<GameState['settings']>) => void;
  playerPosition: [number, number, number];
  setPlayerPosition: (pos: [number, number, number]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  showSettings: false,
  setShowSettings: (show) => set({ showSettings: show }),
  showHqModal: false,
  setShowHqModal: (show) => set({ showHqModal: show }),
  interactionText: null,
  setInteractionText: (text) => set({ interactionText: text }),
  lastCheckpoint: null,
  setCheckpoint: (pos) => set({ lastCheckpoint: pos }),
  settings: {
    sensitivity: 1,
    volume: 50,
    graphics: 'high'
  },
  updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  playerPosition: [0, 0, 0],
  setPlayerPosition: (pos) => set({ playerPosition: pos })
}));
