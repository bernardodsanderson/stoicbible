/**
 * Client-side Firebase Auth state (browser).
 *
 * A tiny external store instead of a React context: every component that asks
 * for the current user subscribes to the same source, the first subscription
 * hydrates from the persisted Firebase session, and `onAuthStateChanged` keeps
 * it fresh across tabs and token refreshes.
 */
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { ensureAuthPersistence, firebaseAuth } from "@/lib/firebase/client";
import { firebaseConfigured } from "@/lib/firebase/config";

/** Normalized user shape used across the app. */
export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  emailVerified: boolean;
};

export type AuthState = {
  /** The user — `null` both while the session loads and when signed out. */
  user: AppUser | null;
  /** True while the session is still resolving. */
  isPending: boolean;
};

/** Auth is available when the Firebase web config is present. */
export const authEnabled = firebaseConfigured;

const INITIAL: AuthState = { user: null, isPending: true };
const SIGNED_OUT: AuthState = { user: null, isPending: false };

let state: AuthState = INITIAL;
let started = false;
const listeners = new Set<() => void>();

function emit(next: AuthState): void {
  state = next;
  for (const listener of listeners) listener();
}

/** Map a Firebase user onto the app's normalized user. */
export function mapFirebaseUser(user: User | null | undefined): AppUser | null {
  if (!user) return null;
  return {
    id: user.uid,
    displayName: user.displayName,
    primaryEmail: user.email,
    profileImageUrl: user.photoURL,
    emailVerified: user.emailVerified,
  };
}

/**
 * Start listening for auth changes. Idempotent, browser-only. Called by the
 * root provider and by the first subscriber, so no component can miss it.
 */
export function startAuth(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  if (!firebaseConfigured) {
    emit(SIGNED_OUT);
    return;
  }

  // The default is already local persistence; set it explicitly so a session
  // survives reloads and browser restarts ("I should already be logged in").
  void ensureAuthPersistence().catch((err) => {
    console.error("[auth] could not set Firebase persistence:", err);
  });

  const client = firebaseAuth();
  onAuthStateChanged(
    client,
    (user) => emit({ user: mapFirebaseUser(user), isPending: false }),
    (err) => {
      console.error("[auth] onAuthStateChanged failed:", err);
      emit(SIGNED_OUT);
    },
  );
}

export function getAuthState(): AuthState {
  return state;
}

/** Server render must be deterministic and match the client's first paint. */
export function getServerAuthState(): AuthState {
  return INITIAL;
}

/** Re-read the current Firebase user (e.g. after verifying an email link). */
export async function refreshAuthUser(): Promise<void> {
  if (!firebaseConfigured) return;
  const client = firebaseAuth();
  const user = client.currentUser;
  if (!user) {
    emit(SIGNED_OUT);
    return;
  }
  try {
    await user.reload();
  } catch (err) {
    console.error("[auth] user reload failed:", err);
  }
  emit({ user: mapFirebaseUser(client.currentUser), isPending: false });
}

export function subscribeAuth(listener: () => void): () => void {
  startAuth();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Sign out of Firebase, then leave for `redirectTo`. */
export async function signOut(redirectTo = "/"): Promise<void> {
  if (firebaseConfigured) {
    try {
      await firebaseSignOut(firebaseAuth());
    } catch (err) {
      console.error("[auth] sign-out failed:", err);
    }
  }
  emit(SIGNED_OUT);
  if (typeof window !== "undefined") window.location.href = redirectTo;
}

/**
 * Clear the local session after the auth account has already been deleted.
 * Firebase's deleteUser has already invalidated the session; this just makes
 * the app state consistent before navigating.
 */
export async function signOutLocal(redirectTo = "/"): Promise<void> {
  try {
    if (firebaseConfigured) await firebaseSignOut(firebaseAuth());
  } catch {
    /* already signed out */
  }
  emit(SIGNED_OUT);
  if (typeof window !== "undefined") window.location.href = redirectTo;
}
