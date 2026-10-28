/**
 * Firebase client singletons (browser-only).
 *
 * Firestore is accessed directly from the browser with the signed-in user's
 * ID token; `firestore.rules` is the security boundary. These helpers must
 * never run during SSR.
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function browserOnly(name: string): void {
  if (typeof window === "undefined") {
    throw new Error(`${name} is browser-only — call it from client code.`);
  }
}

function firebaseApp(): FirebaseApp {
  if (app) return app;
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function firebaseAuth(): Auth {
  browserOnly("firebaseAuth()");
  if (!auth) auth = getAuth(firebaseApp());
  return auth;
}

export function firestoreDb(): Firestore {
  browserOnly("firestoreDb()");
  if (!db) db = getFirestore(firebaseApp());
  return db;
}

/** Keep the session on this device across reloads and browser restarts. */
export async function ensureAuthPersistence(): Promise<void> {
  await setPersistence(firebaseAuth(), browserLocalPersistence);
}
