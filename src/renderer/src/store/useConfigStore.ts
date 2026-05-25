import { create } from 'zustand';
import { FirebaseConfig } from '@/utils/firebaseValidator';

interface ConfigState {
  firebaseConfig: FirebaseConfig | null;
  setFirebaseConfig: (config: FirebaseConfig) => void;
  clearFirebaseConfig: () => void;
}

const getInitialConfig = (): FirebaseConfig | null => {
  const saved = localStorage.getItem("clipflow_firebase_config");
  try {
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error("Failed to parse firebase config from localStorage", e);
    return null;
  }
};

export const useConfigStore = create<ConfigState>((set) => ({
  firebaseConfig: getInitialConfig(),
  setFirebaseConfig: (config) => {
    set({ firebaseConfig: config });
    localStorage.setItem("clipflow_firebase_config", JSON.stringify(config));
  },
  clearFirebaseConfig: () => {
    set({ firebaseConfig: null });
    localStorage.removeItem("clipflow_firebase_config");
  },
}));
