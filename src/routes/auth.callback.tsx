import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { applyActionCode } from "firebase/auth";
import { LogoMark } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { refreshAuthUser } from "@/lib/auth/client";
import { firebaseAuth } from "@/lib/firebase/client";
import { firebaseConfigured } from "@/lib/firebase/config";

export const Route = createFileRoute("/auth/callback")({ component: AuthCallback });

/**
 * Firebase email-action landing page (email verification, and reset links that
 * arrive here). The link carries `mode` and `oobCode` query parameters.
 */
function AuthCallback() {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!firebaseConfigured) {
      setFailed(true);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");

    if (mode === "resetPassword") {
      const search = oobCode ? `?mode=resetPassword&oobCode=${encodeURIComponent(oobCode)}` : "";
      window.location.replace(`/reset-password${search}`);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        if (mode === "verifyEmail" && oobCode) {
          await applyActionCode(firebaseAuth(), oobCode);
        }
        await refreshAuthUser();
        if (cancelled) return;
        if (firebaseAuth().currentUser) {
          await navigate({ to: "/home", replace: true });
        } else {
          await navigate({ to: "/login", replace: true });
        }
      } catch (err) {
        console.error("[auth] action code failed:", err);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <LogoMark className="mb-10" />
        <h1 className="font-display text-3xl font-semibold">
          {failed ? "That link didn't work" : "Confirming your email…"}
        </h1>
        {failed ? (
          <div className="mt-4 space-y-4 text-sm text-muted">
            <p>
              The link may have expired or already been used. Sign in, then request a new
              verification email from the app.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/login">Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">One moment while we finish signing you in.</p>
        )}
      </div>
    </main>
  );
}
