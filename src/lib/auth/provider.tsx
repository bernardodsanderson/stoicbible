import { useEffect, type ReactNode } from "react";
import { startAuth } from "./session";

/**
 * App-wide client provider mounted once near the root (in `src/routes/__root.tsx`).
 *
 * Hydrates the Firebase session before any guarded screen relies on it and
 * subscribes to auth changes. Kept as the single mount point for client-side
 * provider work (the theme/query providers live alongside it).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    startAuth();
  }, []);
  return <>{children}</>;
}
