import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { BookCover } from "@/components/book-cover";
import { SaveOfflineButton } from "@/components/pwa";
import { ShareMenu } from "@/components/share-menu";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getBook } from "@/lib/stoic/api-catalog";
import { useReadingProgress } from "@/lib/stoic/use-reading-progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/books/$slug")({
  loader: ({ params }) => getBook({ data: { slug: params.slug } }),
  pendingComponent: BookPending,
  component: BookDetail,
});

function BookPending() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 text-muted">Loading book…</main>
    </>
  );
}

function BookDetail() {
  const book = Route.useLoaderData();
  const progress = useReadingProgress();
  if (!book) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16">Book not found.</main>
        <SiteFooter />
      </>
    );
  }
  const first = book.chapters[0];
  const readN = book.chapters.filter((c) => progress.isRead(c.slug)).length;
  const here = book.chapters.find((c) => !progress.isRead(c.slug)) ?? first;
  const allRead = readN === book.chapters.length && book.chapters.length > 0;
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 md:grid-cols-[240px_1fr]">
        <div className="mx-auto w-48 md:w-full">
          <BookCover title={book.title} author={book.author} motif={book.motif} tone={book.tone} />
        </div>
        <div>
          <h1 className="font-display text-4xl font-semibold">{book.title}</h1>
          <p className="mt-1 text-muted">by {book.author}</p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{book.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {here && (
              <Button asChild>
                <Link to="/read/$slug" params={{ slug: here.slug }}>
                  {readN === 0
                    ? "Start Reading"
                    : allRead
                      ? "Read again"
                      : `Continue · ${here.title}`}
                </Link>
              </Button>
            )}
            <ShareMenu text={`${book.title} by ${book.author}`} path={`/books/${book.slug}`} />
            <SaveOfflineButton
              label={book.title}
              hrefs={[`/books/${book.slug}`, ...book.chapters.map((c) => `/read/${c.slug}`)]}
            />
          </div>
          <h2 className="mt-10 font-display text-2xl">Table Of Content</h2>
          <p className="mt-1 text-sm text-muted">
            {readN} of {book.chapters.length} chapters read
          </p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-accent transition-[width]"
              style={{
                width: `${book.chapters.length ? (readN / book.chapters.length) * 100 : 0}%`,
              }}
            />
          </div>
          <ol className="mt-4 divide-y divide-border border-y border-border">
            {book.chapters.map((c) => {
              const done = progress.isRead(c.slug);
              const isHere = here?.slug === c.slug && !allRead && readN > 0;
              return (
                <li key={c.slug} className="flex items-center justify-between gap-3 py-3">
                  <Link
                    to="/read/$slug"
                    params={{ slug: c.slug }}
                    className={cn("flex items-center gap-2 hover:underline", done && "text-muted")}
                  >
                    {done ? (
                      <Check className="h-4 w-4 shrink-0" />
                    ) : (
                      <span className="inline-block w-4 shrink-0" />
                    )}
                    {c.title}
                  </Link>
                  {done ? (
                    <span className="text-xs uppercase tracking-wider text-subtle">Read</span>
                  ) : isHere ? (
                    <span className="text-xs uppercase tracking-wider text-fg">Here</span>
                  ) : null}
                </li>
              );
            })}
          </ol>
          {book.sourceUrl && (
            <p className="mt-6 text-sm text-muted">
              Source:{" "}
              <a
                href={book.sourceUrl}
                className="underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Wikisource
              </a>
            </p>
          )}
          <Button asChild variant="ghost" className="mt-6 px-0">
            <Link to="/books">Back to all books</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
