/**
 * Auth helpers shared by client components.
 *
 * Kept as `@/lib/auth/client` so existing imports keep working. The session
 * store and sign-out live in `./session`; Firebase client access lives in
 * `@/lib/firebase/client`.
 */
export { authEnabled, refreshAuthUser, signOut, signOutLocal, type AppUser } from "./session";
