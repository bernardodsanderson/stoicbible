import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookCover } from "@/components/book-cover";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listBooks } from "@/lib/stoic/api-catalog";
import { useReadingProgress } from "@/lib/stoic/use-reading-progress";

export const Route = createFileRoute("/books/")({ component: BooksPage });

function BooksPage() {
  const books = useQuery({ queryKey: ["books"], queryFn: () => listBooks() });
  const progress = useReadingProgress();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Library</p>
        <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
          The most important Stoic books in one place
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          All Books — public-domain works, curated for daily practice.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {books.isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full" />
            ))}
          {books.data?.map((b) => {
            const readN = [...progress.bySlug.values()].filter((r) => r.bookSlug === b.slug).length;
            return (
              <Link key={b.slug} to="/books/$slug" params={{ slug: b.slug }} className="group">
                <BookCover title={b.title} author={b.author} motif={b.motif} tone={b.tone} />
                <h2 className="mt-3 font-display text-lg leading-tight group-hover:opacity-80">
                  {b.title}
                </h2>
                <p className="text-sm text-muted">{b.author}</p>
                {readN > 0 && (
                  <p className="mt-1 text-xs text-subtle">
                    {readN >= b.chapterCount ? "Read" : `${readN} of ${b.chapterCount} read`}
                  </p>
                )}
                <Button variant="ghost" size="sm" className="mt-2 px-0">
                  View Details
                </Button>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
