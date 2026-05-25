import { create } from 'zustand';

interface EngineState {
  isEngineRunning: boolean;
  setEngineRunning: (isRunning: boolean) => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  isEngineRunning: false,
  setEngineRunning: (isRunning) => set({ isEngineRunning: isRunning }),
}));
