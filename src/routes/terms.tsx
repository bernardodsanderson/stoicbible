import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 leading-relaxed">
        <h1 className="font-display text-4xl font-semibold">Terms of Service</h1>
        <p className="mt-6 text-muted">
          Stoic Bible is a reading and journaling companion. By creating an account you agree to use
          the service lawfully, keep your password secret, and treat the texts with care.
        </p>
        <h2 className="mt-8 font-display text-2xl">Access</h2>
        <p className="mt-3 text-muted">
          The library and writing tools are free. Sign in to keep journals, highlights, bookmarks,
          and quotes on your account. There is no paid membership in this app.
        </p>
        <h2 className="mt-8 font-display text-2xl">Your writing</h2>
        <p className="mt-3 text-muted">
          Journals are private to your account. Sharing makes an image you can send; it does not
          publish the journal on this site. You remain the author. Do not share content you do not
          have the right to share.
        </p>
        <h2 className="mt-8 font-display text-2xl">Texts</h2>
        <p className="mt-3 text-muted">
          The books are public-domain translations. We do not claim copyright over those texts.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
