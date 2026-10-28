import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { firebaseAuth } from "@/lib/firebase/client";
import { actionCodeSettings } from "@/lib/firebase/config";

/** Shown until the signed-in visitor verifies their email address. */
export function VerifyEmailBanner() {
  const { user } = useCurrentUserState();
  const [sending, setSending] = useState(false);
  if (!user || user.emailVerified) return null;

  async function resend() {
    const current = firebaseAuth().currentUser;
    if (!current) return;
    setSending(true);
    try {
      await sendEmailVerification(current, actionCodeSettings("/auth/callback"));
      toast.success("Verification email sent.");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      toast.error(
        code === "auth/too-many-requests"
          ? "Too many emails. Try again in a few minutes."
          : "Could not send the verification email.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-sm">
        <p className="text-muted">
          Verify <span className="text-fg">{user.primaryEmail}</span> to secure your account.
        </p>
        <Button size="sm" variant="secondary" onClick={() => void resend()} disabled={sending}>
          {sending ? "Sending…" : "Resend email"}
        </Button>
      </div>
    </div>
  );
}
