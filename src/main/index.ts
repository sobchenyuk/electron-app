import { app, shell, BrowserWindow, ipcMain, clipboard } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import crypto from 'node:crypto'
import { initializeFirebase, terminateFirebase, sendClipboardToFirebase, listenForFirebaseChanges, FirebaseConfig } from './firebaseService'

// --- Engine State ---
let engineInterval: NodeJS.Timeout | null = null;
let firebaseConfig: FirebaseConfig | null = null; // Will store the Firebase config object
let encryptionSecretKey: string | null = null; // Will store the encryption password
let currentDeviceId: string | null = null; // Will store the unique device ID
let lastClipboardContent = ''; // Last content read from local clipboard

// --- Encryption and Decryption ---
const ALGORITHM = 'aes-256-gcm';
const SALT = 'your-hardcoded-salt'; // Should be a constant, securely stored salt
const SCRYPT_OPTIONS = {
  N: 16384, // Cost factor
  r: 8,     // Block size
  p: 1      // Parallelization factor
};
const AUTH_TAG_LENGTH = 16;
const IV_LENGTH = 16;

function getKey(secretKey: string): Buffer {
  return crypto.scryptSync(secretKey, SALT, 32, SCRYPT_OPTIONS);
}

function encrypt(text: string, secretKey: string): string {
  const key = getKey(secretKey);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Assemble payload in [ IV | Ciphertext | Tag ] format
  const combined = Buffer.concat([iv, encrypted, authTag]);
  return combined.toString('base64');
}

function decrypt(encryptedText: string, secretKey: string): string | null {
  try {
    const combined = Buffer.from(encryptedText, 'base64');

    if (combined.length < IV_LENGTH + AUTH_TAG_LENGTH) {
        throw new Error('Invalid encrypted text format');
    }

    // Parse payload in [ IV | Ciphertext | Tag ] format
    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH, combined.length - AUTH_TAG_LENGTH);
    const authTag = combined.slice(combined.length - AUTH_TAG_LENGTH);

    const key = getKey(secretKey);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption failed, skipping update. Error:', error);
    return null;
  }
}
// --- End of Encryption and Decryption ---

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Open devTools
  // mainWindow.webContents.openDevTools()

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC handlers
  ipcMain.handle('get-device-id', () => {
    if (!currentDeviceId) {
      currentDeviceId = crypto.randomBytes(16).toString('hex');
    }
    return currentDeviceId;
  });

  ipcMain.handle('set-encryption-key', (_, secretKey: string) => {
    encryptionSecretKey = secretKey;
  });

  ipcMain.handle('encrypt-data', (_, { text, secretKey }) => {
    return encrypt(text, secretKey);
  });

  ipcMain.handle('decrypt-data', (_, { encryptedText, secretKey }) => {
    return decrypt(encryptedText, secretKey);
  });

  ipcMain.handle('set-firebase-config', async (_, config: FirebaseConfig | null) => {
    if (config) {
      firebaseConfig = config;
      initializeFirebase(config);
    } else {
      firebaseConfig = null;
      await terminateFirebase();
    }
  });

  ipcMain.handle('start-engine', async () => {
    if (engineInterval) return; // Already running

    if (!firebaseConfig) {
      throw new Error('Firebase configuration is not set.');
    }
    if (!encryptionSecretKey) {
      throw new Error('Encryption key is not set.');
    }
    if (!currentDeviceId) {
      throw new Error('Device ID is not set.');
    }

    initializeFirebase(firebaseConfig);

	    // Start listening for Firebase changes
	    listenForFirebaseChanges(currentDeviceId, async (encryptedContent) => {
	      if (encryptionSecretKey) {
	        const decrypted = decrypt(encryptedContent, encryptionSecretKey);
	        if (decrypted === null) {
	          BrowserWindow.getAllWindows()[0].webContents.send('remote-clipboard-decrypt-failed');
	          return;
	        }
	        if (decrypted !== clipboard.readText()) {
	          clipboard.writeText(decrypted);
	          BrowserWindow.getAllWindows()[0].webContents.send('clipboard-updated-from-remote', decrypted);
	        }
	      }
	    });

    lastClipboardContent = clipboard.readText();
    engineInterval = setInterval(async () => {
      const text = clipboard.readText();
      if (text !== lastClipboardContent) {
        lastClipboardContent = text;
        if (encryptionSecretKey && currentDeviceId) {
          const encrypted = encrypt(text, encryptionSecretKey);
          await sendClipboardToFirebase(currentDeviceId, encrypted);
        }
      }
    }, 1000); // Check clipboard every 1 second

    BrowserWindow.getAllWindows()[0].webContents.send('engine-state-changed', true);
  });

  ipcMain.handle('stop-engine', async () => {
    await stopEngine();
    console.log('Engine stopped.');
  });

  async function stopEngine() {
    if (engineInterval) {
      clearInterval(engineInterval);
      engineInterval = null;
    }
    await terminateFirebase(); // Ensure Firebase listener is stopped
    BrowserWindow.getAllWindows()[0].webContents.send('engine-state-changed', false);
  }

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
