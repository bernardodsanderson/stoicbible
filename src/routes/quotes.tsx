import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShareCardButton } from "@/components/share-card";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { listQuotes } from "@/lib/stoic/api-catalog";
import { deleteMyQuote, listMyQuotes } from "@/lib/stoic/api-user";
import { useAppAccount } from "@/lib/stoic/use-app-account";

export const Route = createFileRoute("/quotes")({ component: QuotesPage });

type QuoteRow = {
  key: string;
  id: string | null;
  text: string;
  author: string;
  attribution: string | null;
  note: string | null;
  saved: boolean;
};

function fold(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function editDistance(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const prev = new Array<number>(b.length + 1);
  const cur = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length];
}

/** Higher is better. 0 means no match. */
function fuzzyScore(haystack: string, needle: string) {
  const h = fold(haystack);
  const n = fold(needle).trim();
  if (!n) return 1;
  const at = h.indexOf(n);
  if (at >= 0) return 1000 - Math.min(at, 400);

  const words = n.split(/\s+/).filter(Boolean);
  const hayWords = h.split(/[^a-z0-9]+/).filter((w) => w.length > 1);
  const wordsHit = words.every((word) => {
    const slack = word.length >= 6 ? 2 : 1;
    return hayWords.some((hw) => hw.includes(word) || editDistance(word, hw) <= slack);
  });
  if (wordsHit) return 700;

  const compact = n.replace(/\s+/g, "");
  if (compact.length < 3) return 0;
  let i = 0;
  let gaps = 0;
  let prev = -2;
  for (const ch of compact) {
    const found = h.indexOf(ch, i);
    if (found < 0) return 0;
    if (prev >= 0) gaps += found - prev - 1;
    prev = found;
    i = found + 1;
  }
  const allowance = Math.max(1, Math.floor(compact.length / 3));
  if (gaps > allowance) return 0;
  return Math.max(1, 240 - gaps);
}

function matchScore(row: QuoteRow, needle: string) {
  if (!needle.trim()) return 1;
  return Math.max(
    fuzzyScore(row.text, needle),
    fuzzyScore(row.author, needle),
    row.attribution ? fuzzyScore(row.attribution, needle) : 0,
    row.note ? fuzzyScore(row.note, needle) : 0,
  );
}

function QuotesPage() {
  const { user } = useAppAccount();
  const qc = useQueryClient();
  const library = useQuery({ queryKey: ["quotes"], queryFn: () => listQuotes() });
  const mine = useQuery({
    queryKey: ["my-quotes", user?.id],
    queryFn: () => listMyQuotes(),
    enabled: !!user,
  });
  const [q, setQ] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const saved: QuoteRow[] = useMemo(
    () =>
      (mine.data ?? []).map((row) => ({
        key: `saved-${row.id}`,
        id: row.id,
        text: row.text,
        author: row.author || "Unknown",
        attribution: null,
        note: row.thought,
        saved: true,
      })),
    [mine.data],
  );
  const curated: QuoteRow[] = useMemo(
    () =>
      (library.data ?? []).map((row) => ({
        key: `lib-${row.id}`,
        id: null,
        text: row.text,
        author: row.author,
        attribution: row.attribution,
        note: null,
        saved: false,
      })),
    [library.data],
  );

  const savedHits = useMemo(
    () =>
      saved
        .map((row) => ({ row, score: matchScore(row, q) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score),
    [saved, q],
  );
  const curatedHits = useMemo(
    () =>
      curated
        .map((row) => ({ row, score: matchScore(row, q) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score),
    [curated, q],
  );
  const searching = q.trim().length > 0;
  const empty = !library.isLoading && savedHits.length === 0 && curatedHits.length === 0;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl font-semibold">Quotes</h1>
        <p className="mt-2 text-muted">
          Lines you save from a book show up here, with the library beside them.
        </p>
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search quotes — a word or a rough phrase"
            aria-label="Search quotes"
            className="pl-10"
          />
        </div>

        {savedHits.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl">Saved from your reading</h2>
            <div className="mt-4 space-y-4">
              {savedHits.map(({ row }) => (
                <QuoteCard
                  key={row.key}
                  row={row}
                  liked={!!liked[row.key]}
                  onLike={() => setLiked((s) => ({ ...s, [row.key]: !s[row.key] }))}
                  onDelete={
                    row.id == null
                      ? undefined
                      : async () => {
                          await deleteMyQuote({ data: { id: row.id! } });
                          toast.success("Quote removed");
                          void qc.invalidateQueries({ queryKey: ["my-quotes"] });
                        }
                  }
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          {(savedHits.length > 0 || searching) && (
            <h2 className="font-display text-2xl">Library</h2>
          )}
          <div className={savedHits.length > 0 || searching ? "mt-4 space-y-4" : "space-y-4"}>
            {library.isLoading && <p className="text-muted">Loading quotes…</p>}
            {curatedHits.map(({ row }) => (
              <QuoteCard
                key={row.key}
                row={row}
                liked={!!liked[row.key]}
                onLike={() => setLiked((s) => ({ ...s, [row.key]: !s[row.key] }))}
              />
            ))}
          </div>
        </section>

        {empty && (
          <p className="mt-8 text-muted">
            {searching ? "No quotes match that." : "No quotes yet."}
          </p>
        )}
        {!user && !searching && (
          <p className="mt-6 text-sm text-muted">
            Sign in, then select a passage and tap Quote to keep it here.
          </p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function QuoteCard({
  row,
  liked,
  onLike,
  onDelete,
}: {
  row: QuoteRow;
  liked: boolean;
  onLike: () => void;
  onDelete?: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <article className="rounded-xl border border-border bg-elevated p-5">
      {row.saved && <p className="mb-2 text-xs uppercase tracking-[0.16em] text-subtle">Saved</p>}
      <blockquote className="font-display text-2xl leading-snug">“{row.text}”</blockquote>
      {row.note && <p className="mt-3 text-sm leading-relaxed text-muted">{row.note}</p>}
      <p className="mt-3 text-sm text-muted">
        — {row.author}
        {row.attribution ? `, ${row.attribution}` : ""}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          className="rounded-full p-2 text-muted hover:text-fg"
          aria-label="Like"
          onClick={onLike}
        >
          <Heart className={liked ? "fill-current" : ""} />
        </button>
        <ShareCardButton payload={{ quote: row.text, quoteAuthor: row.author }} variant="ghost" />
        {onDelete &&
          (confirming ? (
            <span className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-full px-3 py-2 text-sm text-fg hover:bg-surface disabled:opacity-50"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  void onDelete()
                    .catch(() => toast.error("Could not remove that quote"))
                    .finally(() => setBusy(false));
                }}
              >
                Remove
              </button>
              <button
                type="button"
                className="rounded-full px-3 py-2 text-sm text-muted hover:text-fg"
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="rounded-full p-2 text-muted hover:text-fg"
              aria-label="Delete quote"
              onClick={() => setConfirming(true)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ))}
      </div>
    </article>
  );
}
