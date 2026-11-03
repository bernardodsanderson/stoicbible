import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LogoMark } from "@/components/site-header";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/auth/callback")({ component: AuthCallback });

/**
 * Landing page for Firebase email-action links.
 *
 * Firebase's hosted handler completes a password reset itself, so links that
 * arrive here normally carry no code and the visitor is simply sent on to the
 * app. A link that does carry `mode=resetPassword&oobCode=…` (a custom
 * `handleCodeInApp` link, or one issued before the reset page existed) is
 * forwarded to the app's own form.
 */
function AuthCallback() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");
    if (mode === "resetPassword" && oobCode) {
      window.location.replace(
        `/reset-password?mode=resetPassword&oobCode=${encodeURIComponent(oobCode)}`,
      );
      return;
    }
    if (isPending) return;
    void navigate({ to: user ? "/home" : "/login", replace: true });
  }, [isPending, navigate, user]);

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <LogoMark className="mb-10" />
        <h1 className="font-display text-3xl font-semibold">One moment…</h1>
        <p className="mt-4 text-sm text-muted">Taking you back to the app.</p>
      </div>
    </main>
  );
}
