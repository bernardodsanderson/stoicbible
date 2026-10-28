import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { LogoMark } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firebaseAuth } from "@/lib/firebase/client";
import { actionCodeSettings, firebaseConfigured } from "@/lib/firebase/config";

export const Route = createFileRoute("/forgot_password")({ component: Forgot });

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!firebaseConfigured) {
      setError("Firebase is not configured for this build.");
      return;
    }
    setPending(true);
    try {
      await sendPasswordResetEmail(
        firebaseAuth(),
        email.trim(),
        actionCodeSettings("/reset-password"),
      );
      setSent(true);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/invalid-email") {
        setError("Enter a valid email address.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many reset emails. Wait a few minutes, then try again.");
      } else {
        console.error("[auth] password reset request failed:", err);
        setError("Could not send the reset email. Try again.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <LogoMark className="mb-10" />
      <h1 className="font-display text-3xl font-semibold">Reset your password</h1>
      <p className="mt-2 text-sm text-muted">
        Enter the email on your account and we&apos;ll send a link to choose a new password.
      </p>
      {sent ? (
        <div className="mt-6 space-y-4 text-sm text-muted">
          <p>
            If an account exists for <span className="text-fg">{email.trim()}</span>, a reset link
            is on its way. The link opens a page where you choose a new password.
          </p>
          <p>Check your spam folder if it doesn&apos;t arrive within a few minutes.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Your email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-sm text-muted">
        Remember your password?{" "}
        <Link to="/login" className="text-fg underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
