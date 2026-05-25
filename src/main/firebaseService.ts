import { deleteApp, initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, Database } from 'firebase/database';

let firebaseApp: FirebaseApp | null = null;
let firebaseDb: Database | null = null;
let unsubscribeClipboardListener: (() => void) | null = null; // Unsubscribe function

export interface FirebaseConfig {
  project_info: {
    project_number: string;
    firebase_url: string;
    project_id: string;
    storage_bucket: string;
  };
  client: Array<{
    client_info: {
      mobilesdk_app_id: string;
      android_client_info: {
        package_name: string;
      };
    };
    api_key: Array<{
      current_key: string;
    }>;
  }>;
  configuration_version: string;
}

export function initializeFirebase(config: FirebaseConfig) {
  if (firebaseApp) {
    console.log('Firebase app already initialized.');
    return;
  }

  const firebaseConfig = {
    apiKey: config.client[0].api_key[0].current_key,
    authDomain: `${config.project_info.project_id}.firebaseapp.com`,
    databaseURL: config.project_info.firebase_url,
    projectId: config.project_info.project_id,
    storageBucket: config.project_info.storage_bucket,
    messagingSenderId: config.project_info.project_number,
    appId: config.client[0].client_info.mobilesdk_app_id,
  };

  firebaseApp = initializeApp(firebaseConfig);
  firebaseDb = getDatabase(firebaseApp);
  console.log('Firebase initialized successfully.');
}

export async function terminateFirebase() {
  if (unsubscribeClipboardListener) {
    unsubscribeClipboardListener();
    unsubscribeClipboardListener = null;
  }

  if (firebaseApp) {
    const appToDelete = firebaseApp;
    firebaseApp = null;
    firebaseDb = null;

    await deleteApp(appToDelete);
    console.log('Firebase terminated.');
  }
}

export async function sendClipboardToFirebase(deviceId: string, encryptedContent: string) {
  if (!firebaseDb) {
    console.error('Firebase Database not initialized.');
    return;
  }
  try {
    const clipboardRef = ref(firebaseDb, 'clipboard'); // Write to a single 'clipboard' node
    await set(clipboardRef, {
      deviceId: deviceId,
      text: encryptedContent,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error sending clipboard to Firebase:', error);
  }
}

export function listenForFirebaseChanges(
  currentDeviceId: string,
  onClipboardChange: (encryptedContent: string, senderDeviceId: string) => void
) {
  if (!firebaseDb) {
    console.error('Firebase Database not initialized for listening.');
    return;
  }
  if (unsubscribeClipboardListener) {
    unsubscribeClipboardListener(); // Remove existing listener if any
    unsubscribeClipboardListener = null;
  }

  const clipboardNodeRef = ref(firebaseDb, 'clipboard'); // Listen to the single 'clipboard' node
  unsubscribeClipboardListener = onValue(clipboardNodeRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.deviceId && data.text) {
      const { deviceId: senderDeviceId, text: encryptedContent } = data;
      if (senderDeviceId !== currentDeviceId) { // Only process changes from other devices
        onClipboardChange(encryptedContent, senderDeviceId);
      }
    }
  }, (error) => {
    console.error('Firebase listener error:', error);
  });
  console.log('Listening for Firebase changes...');
}
