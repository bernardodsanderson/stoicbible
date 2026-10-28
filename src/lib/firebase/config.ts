/**
 * Firebase project configuration (public).
 *
 * The web app config is not a secret: access is controlled by Firebase
 * Authentication and Firestore rules. It is still supplied through the
 * environment so contributors do not accidentally write into the maintainer's
 * project. Copy `.env.example` to `.env` and fill in a Firebase web app.
 */
const env = (
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {}
) as Record<string, string | undefined>;

export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

/** Resolve the six required Firebase web-app values from an env bag. */
export function resolveFirebaseConfig(
  source: Record<string, string | undefined>,
): FirebaseWebConfig {
  return {
    apiKey: source.VITE_FIREBASE_API_KEY?.trim() ?? "",
    authDomain: source.VITE_FIREBASE_AUTH_DOMAIN?.trim() ?? "",
    projectId: source.VITE_FIREBASE_PROJECT_ID?.trim() ?? "",
    storageBucket: source.VITE_FIREBASE_STORAGE_BUCKET?.trim() ?? "",
    messagingSenderId: source.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? "",
    appId: source.VITE_FIREBASE_APP_ID?.trim() ?? "",
  };
}

export function isFirebaseConfigured(config: FirebaseWebConfig): boolean {
  return Object.values(config).every(Boolean);
}

export const firebaseConfig = resolveFirebaseConfig(env);
export const firebaseConfigured = isFirebaseConfigured(firebaseConfig);

/** Absolute app origin, used for Firebase email action links. */
export function appOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  const configured = (env.VITE_PUBLIC_SITE_URL ?? "").trim().replace(/\/+$/, "");
  return configured || "http://localhost:8080";
}

/** Firebase email action settings for this origin. */
export function actionCodeSettings(path: string): {
  url: string;
  handleCodeInApp: boolean;
} {
  // Web action links go through Firebase's handler, which redirects back
  // to the continue URL with `mode` and `oobCode` query parameters.
  return { url: `${appOrigin()}${path}`, handleCodeInApp: false };
}
