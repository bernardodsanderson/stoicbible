import { useCurrentUserState, type AppUser } from "@/lib/auth/use-current-user";

/**
 * Product account for this app: Firebase Auth email/password sessions.
 *
 * Thin wrapper over `useCurrentUserState` kept because many screens import it;
 * it also guarantees a stable "not signed in" answer for an unconfigured build.
 */
export function useAppAccount(): {
  user: AppUser | null;
  isPending: boolean;
} {
  return useCurrentUserState();
}
