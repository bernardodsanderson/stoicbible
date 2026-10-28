import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { listBooks } from "@/lib/stoic/api-catalog";

export const Route = createFileRoute("/read/")({ component: ReadIndex });

function ReadIndex() {
  const books = useQuery({ queryKey: ["books"], queryFn: () => listBooks() });
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl font-semibold">Now Reading</h1>
        <p className="mt-2 text-muted">Pick a book to continue.</p>
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {books.data?.map((b) => (
            <li key={b.slug} className="py-4">
              <Link
                to="/books/$slug"
                params={{ slug: b.slug }}
                className="font-display text-xl hover:opacity-80"
              >
                {b.title}
              </Link>
              <p className="text-sm text-muted">{b.author}</p>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
