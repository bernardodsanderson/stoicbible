import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProfileTabs } from "@/components/profile-tabs";
import { VerifyEmailBanner } from "@/components/verify-email-banner";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { signOutLocal } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { deleteMyAccount, getMyProfile, updateMyProfile } from "@/lib/stoic/api-user";
import { HIGHLIGHT_COLORS, type ThemeId } from "@/lib/stoic/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$username/settings")({ component: SettingsPage });

const THEMES: { id: ThemeId; label: string }[] = [
  { id: "default", label: "Day" },
  { id: "dark", label: "Night" },
  { id: "dark2", label: "Forest night" },
  { id: "dim", label: "Dim" },
];

function SettingsPage() {
  const { username } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const me = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getMyProfile(),
    enabled: !isPending && !!user,
  });
  const [displayName, setDisplayName] = useState("");
  const [uname, setUname] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!me.data) return;
    setDisplayName(me.data.displayName ?? "");
    setUname(me.data.username);
    setTimezone(me.data.timezone);
  }, [me.data]);

  // Hooks must run unconditionally — keep this above the auth/redirect guards.
  const save = useMutation({
    mutationFn: () =>
      updateMyProfile({
        data: { displayName, username: uname, timezone },
      }),
    onSuccess: (p) => {
      toast.success("Settings saved");
      if (p.username !== username)
        void navigate({ to: "/$username/settings", params: { username: p.username } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!isPending && !user) return <RedirectToSignIn />;
  if (me.data && me.data.username !== username) {
    return <Navigate to="/$username/settings" params={{ username: me.data.username }} />;
  }

  const profile = me.data;
  if (isPending || !profile) {
    return <p className="text-muted">Loading settings…</p>;
  }

  return (
    <div className="pb-16">
      <ProfileTabs username={username} active="settings" />
      <VerifyEmailBanner />

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">Profile</h2>
        <div className="space-y-1.5">
          <Label htmlFor="display">Name</Label>
          <Input
            id="display"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={uname}
            onChange={(e) => setUname(e.target.value.toLowerCase())}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tz">Timezone (for streaks)</Label>
          <Input id="tz" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          Save profile
        </Button>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl">Theme</h2>
        <p className="text-sm text-muted">
          Use the moon in the header to switch quickly, or pick a palette here.
        </p>
        <ThemePicker />
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl">Default highlight color</h2>
        <div className="flex gap-2">
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              className={cn(
                "h-8 w-8 rounded-full border border-border",
                profile.highlightColor === c && "ring-2 ring-ring",
              )}
              style={{ background: `var(--color-hl-${c})` }}
              onClick={() =>
                void updateMyProfile({ data: { highlightColor: c } }).then(() => me.refetch())
              }
            />
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl">Reminders</h2>
        <ReminderRow
          title="Morning"
          body="Start your day with Stoicism."
          time="08:00 am"
          checked={profile.reminderMorning}
          onChange={(v) =>
            void updateMyProfile({ data: { reminderMorning: v } }).then(() => me.refetch())
          }
        />
        <ReminderRow
          title="Afternoon"
          body="Pause, reflect and write what you feel and think."
          time="01:00 pm"
          checked={profile.reminderAfternoon}
          onChange={(v) =>
            void updateMyProfile({ data: { reminderAfternoon: v } }).then(() => me.refetch())
          }
        />
        <ReminderRow
          title="Evening"
          body="Reflect on your day and write about it."
          time="08:00 pm"
          checked={profile.reminderEvening}
          onChange={(v) =>
            void updateMyProfile({ data: { reminderEvening: v } }).then(() => me.refetch())
          }
        />
        <ReminderRow
          title="Daily Quote"
          body="Get daily quotes to stay connected with tenets of ancient Stoics."
          time="02:00 pm"
          checked={profile.reminderQuote}
          onChange={(v) =>
            void updateMyProfile({ data: { reminderQuote: v } }).then(() => me.refetch())
          }
        />
        <p className="text-xs text-subtle">
          Web reminders are saved here. Push notifications require the mobile app.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl">Feedback</h2>
        <Button asChild variant="secondary">
          <Link to="/feedback">Give Feedback</Link>
        </Button>
      </section>

      <section className="mt-12 space-y-3 rounded-xl border border-border p-5">
        <h2 className="font-display text-2xl">Delete Account</h2>
        <p className="text-sm text-muted">
          Permanently removes your profile, journals, bookmarks, and highlights. Type your account
          email and password to confirm.
        </p>
        <Input
          placeholder="Account email"
          type="email"
          autoComplete="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          variant="danger"
          onClick={async () => {
            if (!confirm("This cannot be undone. Delete your account?")) return;
            try {
              await deleteMyAccount({ data: { email: confirmEmail, password: confirmPassword } });
              toast.success("Account deleted");
              // The auth user is already gone — don't ask the server to sign
              // out (it would 403 with a deleted identity).
              await signOutLocal("/");
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Could not delete");
            }
          }}
        >
          Delete My Account
        </Button>
      </section>
    </div>
  );
}

function ThemePicker() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-wrap gap-2">
      {THEMES.map((t) => (
        <Button
          key={t.id}
          variant={theme === t.id ? "default" : "secondary"}
          size="sm"
          onClick={() => setTheme(t.id)}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}

function ReminderRow({
  title,
  body,
  time,
  checked,
  onChange,
}: {
  title: string;
  body: string;
  time: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3">
      <div>
        <p className="text-sm font-medium">
          {title} <span className="text-subtle">· {time}</span>
        </p>
        <p className="text-xs text-muted">{body}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
