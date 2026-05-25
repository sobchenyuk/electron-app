/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    getDeviceId: () => Promise<string>;
    setEncryptionKey: (secretKey: string) => Promise<void>;
    encryptData: (data: { text: string; secretKey: string }) => Promise<string>;
    decryptData: (data: { encryptedText: string; secretKey: string }) => Promise<string | null>;
    setFirebaseConfig: (config: unknown | null) => Promise<void>;
    startEngine: () => Promise<void>;
    stopEngine: () => Promise<void>;
    onEngineStateChanged: (callback: (isRunning: boolean) => void) => () => void;
    onClipboardUpdatedFromRemote: (callback: (content: string) => void) => () => void;
    onRemoteClipboardDecryptFailed: (callback: () => void) => () => void;
  };
}
