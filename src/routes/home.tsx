import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { JournalCard } from "@/components/journal-card";
import { SiteHeader } from "@/components/site-header";
import { VerifyEmailBanner } from "@/components/verify-email-banner";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useAppAccount } from "@/lib/stoic/use-app-account";
import { randomQuote } from "@/lib/stoic/api-catalog";
import { getHomeData } from "@/lib/stoic/api-user";
import { useReadingProgress } from "@/lib/stoic/use-reading-progress";
import type { Motif, QuoteCard } from "@/lib/stoic/types";
import { relativeTime } from "@/lib/utils";

export const Route = createFileRoute("/home")({ component: HomePage });

function HomePage() {
  const { user, isPending } = useAppAccount();
  const home = useQuery({
    queryKey: ["home", user?.id],
    queryFn: () => getHomeData(),
    enabled: !isPending && !!user,
  });
  const [quote, setQuote] = useState<QuoteCard | null>(null);
  const data = home.data;
  const shownQuote = quote ?? data?.quote ?? null;
  const progress = useReadingProgress();
  const latest = [...progress.bySlug.values()].sort((a, b) => b.at - a.at)[0];

  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) return <RedirectToSignIn />;

  return (
    <>
      <SiteHeader />
      <VerifyEmailBanner />
      <main className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-subtle">Dashboard</p>
            <h1 className="mt-1 font-display text-4xl font-semibold">
              Welcome,{" "}
              {data?.profile.displayName || user.displayName || data?.profile.username || "Reader"}
            </h1>
            {data?.profile && !data.profile.displayName && (
              <Link
                to="/$username/settings"
                params={{ username: data.profile.username }}
                className="text-sm text-muted underline-offset-4 hover:underline"
              >
                (Add your real name)
              </Link>
            )}
          </div>
          <Button asChild>
            <Link to="/write/new-journal">New Journal</Link>
          </Button>
        </div>

        {data && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Streak label="Check-in" value={data.streaks.checkinCount} />
            <Streak label="Reading" value={data.streaks.readingCount} />
            <Streak label="Journaling" value={data.streaks.journalingCount} />
          </div>
        )}

        {latest && (
          <section className="mt-8 rounded-xl border border-border bg-elevated px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-subtle">Continue reading</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-xl">Pick up where you left the page.</p>
              <Button asChild size="sm">
                <Link to="/read/$slug" params={{ slug: latest.slug }}>
                  Open chapter
                </Link>
              </Button>
            </div>
          </section>
        )}

        <section className="mt-10 rounded-xl border border-border bg-elevated p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-subtle">A thought for now</p>
            <button
              type="button"
              className="text-muted hover:text-fg"
              aria-label="Shuffle quote"
              onClick={async () => {
                const next = await randomQuote();
                setQuote(next);
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          {shownQuote && (
            <>
              <blockquote className="mt-4 font-display text-2xl leading-snug">
                “{shownQuote.text}”
              </blockquote>
              <p className="mt-3 text-sm text-muted">— {shownQuote.author}</p>
            </>
          )}
          <Link
            to="/quotes"
            className="mt-4 inline-block text-sm text-muted underline-offset-4 hover:underline"
          >
            Get more quotes
          </Link>
        </section>

        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Frequently Read Books</h2>
            <Link to="/books" className="text-sm text-muted hover:text-fg">
              View all Books
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {data?.frequent.map((b) => (
              <Link key={b.slug} to="/books/$slug" params={{ slug: b.slug }}>
                <BookCover
                  title={b.title}
                  author={b.author}
                  motif={b.motif as Motif}
                  tone={b.tone}
                />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Recent Journals</h2>
            {data?.profile && (
              <Link
                to="/$username"
                params={{ username: data.profile.username }}
                className="text-sm text-muted hover:text-fg"
              >
                View all Journals
              </Link>
            )}
          </div>
          <div className="mt-4 space-y-4">
            {data?.journals.length ? (
              data.journals.map((j) => (
                <JournalCard key={j.id} journal={j} canEdit username={data.profile.username} />
              ))
            ) : (
              <p className="text-sm text-muted">No Recent Journals</p>
            )}
          </div>
        </section>

        <section className="mt-12 mb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Recent Highlights</h2>
            {data?.profile && (
              <Link
                to="/$username/highlights"
                params={{ username: data.profile.username }}
                className="text-sm text-muted hover:text-fg"
              >
                View all Highlights
              </Link>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {data?.highlights.length ? (
              data.highlights.map((h) => (
                <Link
                  key={h.id}
                  to="/read/$slug/verses/$verseNumber"
                  params={{ slug: h.chapterSlug, verseNumber: String(h.verseNumber) }}
                  className="block rounded-xl border border-border bg-elevated p-4"
                >
                  <p className="text-xs text-subtle">
                    {h.bookTitle} : {h.chapterNumber}, verse {h.verseNumber} ·{" "}
                    {relativeTime(h.createdAt)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">“{h.text}”</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted">No Recent Highlights</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function Streak({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-elevated p-4 text-center">
      <p className="font-display text-3xl tabular-nums">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-subtle">{label}</p>
    </div>
  );
}
