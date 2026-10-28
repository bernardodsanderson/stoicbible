import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookCover } from "@/components/book-cover";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { listBooks } from "@/lib/stoic/api-catalog";
import type { Motif } from "@/lib/stoic/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const books = useQuery({ queryKey: ["books"], queryFn: () => listBooks() });
  const featured = books.data?.slice(0, 8) ?? [];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 md:pt-20">
          <p className="text-xs uppercase tracking-[0.22em] text-subtle">
            Level-up with Ancient Wisdom for Modern Life
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Embrace Stoic Wisdom & build unbreakable discipline.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            If self-help books, online coaches, and podcasts aren't helping, it may be because they
            lack the key ingredient: a philosophy of life. Stoic Bible is reading and writing — the
            two exercises the old teachers actually practised.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/login">Start Learning</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/books">Browse the library</Link>
            </Button>
          </div>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-3">
            <Feature
              title="Access Books"
              body="Twenty-five curated public-domain works — Marcus, Seneca, Epictetus, and a few modern kin — in one quiet library."
            />
            <Feature
              title="Read Interactively"
              body="Highlight, bookmark, and journal on a verse. Select any line and a menu appears: Highlight, Thoughts, Quote."
            />
            <Feature
              title="Journal & Reflect"
              body="Write your own meditations, private by default. Public journals are a choice, never the default."
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold md:text-4xl">
                Access timeless curated works
              </h2>
              <p className="mt-2 text-muted">Start with Meditations. Stay for the Letters.</p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/books">and lots more</Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featured.map((b) => (
              <Link key={b.slug} to="/books/$slug" params={{ slug: b.slug }} className="group">
                <BookCover
                  title={b.title}
                  author={b.author}
                  motif={b.motif as Motif}
                  tone={b.tone}
                  className="transition-transform duration-200 group-hover:-translate-y-1"
                />
                <p className="mt-3 font-display text-lg leading-tight">{b.title}</p>
                <p className="text-sm text-muted">{b.author}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-accent text-accent-fg">
          <div className="mx-auto max-w-6xl px-4 py-16 md:flex md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold md:text-4xl">
                Join readers building a daily practice
              </h2>
              <p className="mt-3 text-accent-fg/80">
                “How long are you going to wait before you demand the best for yourself?” —
                Epictetus
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="mt-6 md:mt-0">
              <Link to="/login">Get started free</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
