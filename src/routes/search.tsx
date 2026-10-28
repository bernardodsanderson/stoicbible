import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { searchContent } from "@/lib/stoic/api-catalog";

type Search = { q: string };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): Search => ({ q: String(s.q ?? "") }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [local, setLocal] = useState(q);
  const results = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchContent({ data: { q } }),
    enabled: q.trim().length > 0,
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl font-semibold">
          {q ? `Search results for: “${q}”` : "Search Stoic Bible"}
        </h1>
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({ to: "/search", search: { q: local } });
          }}
        >
          <Input
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Search verses, books, quotes"
            aria-label="Search"
          />
        </form>
        <ul className="mt-8 space-y-5">
          {results.data?.map((hit) => (
            <li key={`${hit.kind}-${hit.id}`}>
              <a
                href={hit.href}
                className="block rounded-lg border border-border bg-elevated p-4 hover:border-border-strong"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-subtle">
                  {hit.kind} · {hit.meta}
                </p>
                <p className="mt-1 font-display text-xl">{hit.title}</p>
                <p className="mt-2 text-sm text-muted">{hit.snippet}</p>
              </a>
            </li>
          ))}
          {q && results.isSuccess && results.data?.length === 0 && (
            <p className="text-muted">No matches. Try a shorter phrase.</p>
          )}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
