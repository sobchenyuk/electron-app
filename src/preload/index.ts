import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// import { FirebaseConfig } from '../main/firebaseService' // Removed this import

// Custom APIs for renderer
const api = {
  getDeviceId: () => ipcRenderer.invoke('get-device-id'),
  setEncryptionKey: (secretKey: string) => ipcRenderer.invoke('set-encryption-key', secretKey),
  encryptData: (data: { text: string, secretKey: string }) => ipcRenderer.invoke('encrypt-data', data),
  decryptData: (data: { encryptedText: string, secretKey: string }) => ipcRenderer.invoke('decrypt-data', data),
  // Removed FirebaseConfig type annotation as it's not needed at runtime in preload
  setFirebaseConfig: (config: any | null) => ipcRenderer.invoke('set-firebase-config', config),
  startEngine: () => ipcRenderer.invoke('start-engine'),
  stopEngine: () => ipcRenderer.invoke('stop-engine'),
  onEngineStateChanged: (callback: (isRunning: boolean) => void) => {
    const listener = (_: Electron.IpcRendererEvent, isRunning: boolean) => callback(isRunning);
    ipcRenderer.on('engine-state-changed', listener);
    return () => ipcRenderer.removeListener('engine-state-changed', listener);
  },
  onClipboardUpdatedFromRemote: (callback: (content: string) => void) => {
    const listener = (_: Electron.IpcRendererEvent, content: string) => callback(content);
    ipcRenderer.on('clipboard-updated-from-remote', listener);
    return () => ipcRenderer.removeListener('clipboard-updated-from-remote', listener);
  },
  onRemoteClipboardDecryptFailed: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('remote-clipboard-decrypt-failed', listener);
    return () => ipcRenderer.removeListener('remote-clipboard-decrypt-failed', listener);
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.electronAPI = api
}
