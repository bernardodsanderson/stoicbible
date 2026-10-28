import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  confirmPasswordReset,
  signInWithEmailAndPassword,
  verifyPasswordResetCode,
} from "firebase/auth";
import { LogoMark } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firebaseAuth } from "@/lib/firebase/client";
import { firebaseConfigured } from "@/lib/firebase/config";

export const Route = createFileRoute("/reset-password")({ component: ResetPassword });

type Status = "checking" | "ready" | "expired" | "unconfigured";

/**
 * Firebase sends the reset link here (via its action handler) with
 * `mode=resetPassword&oobCode=…`. The code is verified before showing the form.
 */
function ResetPassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>(firebaseConfigured ? "checking" : "unconfigured");
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!firebaseConfigured) return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("oobCode");
    const mode = params.get("mode");
    if (!code || (mode && mode !== "resetPassword")) {
      setStatus("expired");
      return;
    }
    let cancelled = false;
    verifyPasswordResetCode(firebaseAuth(), code)
      .then((accountEmail) => {
        if (cancelled) return;
        setOobCode(code);
        setEmail(accountEmail);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("expired");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!oobCode) return;
    if (password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The passwords don't match.");
      return;
    }
    setPending(true);
    try {
      await confirmPasswordReset(firebaseAuth(), oobCode, password);
      if (email) {
        try {
          await signInWithEmailAndPassword(firebaseAuth(), email, password);
          toast.success("Password updated. You're signed in.");
          await navigate({ to: "/home" });
          return;
        } catch {
          /* fall through to the sign-in page */
        }
      }
      toast.success("Password updated. Sign in with your new password.");
      await navigate({ to: "/login" });
    } catch (err) {
      const code = (err as { code?: string })?.code;
      setError(
        code === "auth/expired-action-code" || code === "auth/invalid-action-code"
          ? "This reset link has expired. Request a new one."
          : code === "auth/weak-password"
            ? "Choose a stronger password (at least 8 characters)."
            : "Could not update the password. Try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <LogoMark className="mb-10" />
      <h1 className="font-display text-3xl font-semibold">Choose a new password</h1>

      {status === "unconfigured" && (
        <p className="mt-4 text-sm text-muted">Firebase is not configured for this build.</p>
      )}

      {status === "checking" && (
        <p className="mt-4 text-sm text-muted">Checking your reset link…</p>
      )}

      {status === "expired" && (
        <div className="mt-4 space-y-4 text-sm text-muted">
          <p>This reset link is invalid or has expired. Request a new one from the sign-in page.</p>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/forgot_password">Send a new link</Link>
          </Button>
        </div>
      )}

      {status === "ready" && (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <p className="text-sm text-muted">
            Setting a new password for <span className="text-fg">{email}</span>.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : "Update password"}
          </Button>
        </form>
      )}
    </main>
  );
}
