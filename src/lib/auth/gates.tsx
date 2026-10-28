import { useState, type ReactNode } from "react";
import { Link, Navigate } from "@tanstack/react-router";
import { authEnabled, signOut } from "./session";
import { resolveSignInGateState } from "./sign-in-gate";
import { useCurrentUser, useCurrentUserState } from "./use-current-user";

/**
 * Auth state components — plain wrappers around `useCurrentUserState()`.
 *
 * While the session is still resolving, gates that care about signed-out state
 * render nothing so there is no signed-out flash on a hard reload.
 */

/** Where `RedirectToSignIn` sends signed-out visitors. */
export const SIGN_IN_PATH = "/login";

/** Render children only when a user is present. */
export function SignedIn({ children }: { children: ReactNode }) {
  const { user } = useCurrentUserState();
  return user ? <>{children}</> : null;
}

/**
 * Render children only once we KNOW the visitor is signed out (`isPending` has
 * cleared and there is no user). Hidden while the session is still loading.
 */
export function SignedOut({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || user) return null;
  return <>{children}</>;
}

/**
 * Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
 * `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
 * session loading, which feels like a second "Loading…" on /login.
 *
 * Guard routes by waiting out `isPending` first (see `use-current-user`), then
 * render this.
 */
export function RedirectToSignIn({ to = SIGN_IN_PATH }: { to?: string }) {
  return <Navigate to={to} />;
}

export function SignInGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const state = resolveSignInGateState({ isPending, hasUser: user !== null });
  if (state === "pending") return null;
  if (state === "signed_in") return <>{children}</>;
  return <>{fallback ?? <SignInButtons />}</>;
}

/** The one sign-in entry point now that email/password is the only method. */
export function SignInButtons({ label = "Sign in" }: { label?: string }) {
  return (
    <Link
      to={SIGN_IN_PATH}
      className="inline-flex w-full max-w-sm items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
    >
      {label}
    </Link>
  );
}

/**
 * Signed-in identity chip + sign-out. Sign-out is only shown when auth is
 * enabled (an unconfigured Firebase build has nothing to sign out of).
 */
export function UserButton() {
  const user = useCurrentUser();
  // Sign-out can take a moment, so the control shows it is working and cannot
  // be fired twice.
  const [signingOut, setSigningOut] = useState(false);
  if (!user) return null;
  const label = user.displayName ?? user.primaryEmail ?? "Account";
  return (
    <div className="flex items-center gap-2">
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt=""
          title={label}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <span className="max-w-[10rem] truncate text-sm font-medium">{label}</span>
      )}
      {authEnabled && (
        <button
          type="button"
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            // Success navigates away; on failure re-enable so it can be retried.
            void signOut().catch(() => setSigningOut(false));
          }}
          className="cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline"
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      )}
    </div>
  );
}
