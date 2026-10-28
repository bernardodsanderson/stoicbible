import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firebaseAuth } from "@/lib/firebase/client";
import { actionCodeSettings, firebaseConfigured } from "@/lib/firebase/config";

type Mode = "signin" | "signup";

function friendlyAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/email-already-in-use":
      return "An account already exists for that email. Sign in instead.";
    case "auth/weak-password":
      return "Choose a stronger password (at least 8 characters).";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a minute, then try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in isn’t enabled for this Firebase project.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    default:
      return (error as Error)?.message || "Something went wrong. Try again.";
  }
}

/**
 * Email/password sign-in and sign-up (the only auth method).
 *
 * Firebase keeps the session locally, so a signed-in visitor survives reloads
 * and browser restarts. Sign-up immediately creates a session and sends a
 * verification email; the app stays usable while it is unverified.
 */
export function AuthForm({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!firebaseConfigured) {
    return (
      <div className="w-full max-w-sm space-y-3">
        <h1 className="font-display text-3xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted">
          Firebase isn’t configured for this build. Add the{" "}
          <code className="rounded bg-surface px-1 py-0.5 text-xs">VITE_FIREBASE_*</code> variables
          and rebuild.
        </p>
      </div>
    );
  }

  const isSignup = mode === "signup";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (isSignup && password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }
    if (isSignup && password !== confirm) {
      setError("The passwords don't match.");
      return;
    }
    setPending(true);
    try {
      const auth = firebaseAuth();
      if (isSignup) {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        // A failure here must not lose the newly created session.
        try {
          await sendEmailVerification(credential.user, actionCodeSettings("/auth/callback"));
        } catch (err) {
          console.warn("[auth] could not send the verification email:", err);
        }
        // Firebase signs the new account in immediately; the home page shows
        // a "verify your email" banner until the link is opened.
        await navigate({ to: "/home" });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        await navigate({ to: "/home" });
      }
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-3xl font-semibold">
        {isSignup ? "Create your account" : "Sign in"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {isSignup
          ? "Email and a password. That's it."
          : "Welcome back. Sign in with your email and password."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={isSignup ? 8 : undefined}
            required
          />
        </div>
        {isSignup && (
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "One moment…" : isSignup ? "Create account" : "Sign in"}
        </Button>
      </form>

      <div className="mt-5 space-y-2 text-sm text-muted">
        {isSignup ? (
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-fg underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        ) : (
          <>
            <p>
              New here?{" "}
              <Link to="/signup" className="text-fg underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
            <p>
              <Link to="/forgot_password" className="text-fg underline-offset-4 hover:underline">
                Forgot your password?
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
