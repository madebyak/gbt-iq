import { getApps, cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Check if Firebase Admin has been initialized
const apps = getApps();

// Initialize Firebase Admin SDK with credentials
const adminApp = apps.length > 0 
  ? apps[0] 
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });

// Get Firestore instance
const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
