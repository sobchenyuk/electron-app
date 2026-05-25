import { create } from 'zustand';

interface LoadingState {
  isEngineLoading: boolean;
  setEngineLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isEngineLoading: false,
  setEngineLoading: (loading) => set({ isEngineLoading: loading }),
}));
