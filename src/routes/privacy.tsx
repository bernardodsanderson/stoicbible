import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 leading-relaxed">
        <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-6 text-muted">
          We collect the account information you provide (name, email), the journals, highlights,
          bookmarks, and quotes you create, and basic reading progress so streaks and "mark as read"
          work. Private journals are visible only to you.
        </p>
        <h2 className="mt-8 font-display text-2xl">Sign-in</h2>
        <p className="mt-3 text-muted">
          You sign in with an email address and password. Authentication and the database are
          provided by Firebase. We do not sell your data. Deleting your account permanently removes
          your profile and associated journals, bookmarks, highlights, and reading history.
        </p>
        <h2 className="mt-8 font-display text-2xl">Sharing</h2>
        <p className="mt-3 text-muted">
          Share cards are images created on your device. We do not publish journals to other
          readers.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
