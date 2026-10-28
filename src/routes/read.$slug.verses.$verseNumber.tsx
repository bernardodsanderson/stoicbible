import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ShareCardButton } from "@/components/share-card";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getVersePage } from "@/lib/stoic/api-catalog";

export const Route = createFileRoute("/read/$slug/verses/$verseNumber")({
  component: VersePage,
});

function VersePage() {
  const { slug, verseNumber } = Route.useParams();
  const n = Number(verseNumber);
  const navigate = useNavigate();
  const q = useQuery({
    queryKey: ["verse", slug, n],
    queryFn: () => getVersePage({ data: { slug, verseNumber: n } }),
  });
  const chapter = q.data?.chapter;
  const verse = q.data?.verse;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!chapter) return;
      if (e.key === "ArrowLeft" && n > 1) {
        void navigate({
          to: "/read/$slug/verses/$verseNumber",
          params: { slug, verseNumber: String(n - 1) },
        });
      }
      if (e.key === "ArrowRight" && chapter.verses.some((v) => v.number === n + 1)) {
        void navigate({
          to: "/read/$slug/verses/$verseNumber",
          params: { slug, verseNumber: String(n + 1) },
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chapter, n, navigate, slug]);

  return (
    <>
      <SiteHeader dense />
      <main className="mx-auto max-w-2xl px-5 py-10">
        {chapter && (
          <p className="text-sm text-muted">
            <Link to="/read/$slug" params={{ slug }} className="hover:text-fg">
              {chapter.book.title} : {chapter.chapter.title}
            </Link>
          </p>
        )}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            disabled={n <= 1}
            onClick={() =>
              void navigate({
                to: "/read/$slug/verses/$verseNumber",
                params: { slug, verseNumber: String(n - 1) },
              })
            }
          >
            <ChevronLeft />
          </Button>
          <h1 className="font-display text-2xl">Verse {n}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              void navigate({
                to: "/read/$slug/verses/$verseNumber",
                params: { slug, verseNumber: String(n + 1) },
              })
            }
          >
            <ChevronRight />
          </Button>
        </div>
        {verse ? (
          <>
            <p className="mt-8 font-serif text-xl leading-relaxed">{verse.text}</p>
            <div className="mt-8">
              <ShareCardButton
                payload={{
                  quote: verse.text,
                  quoteAuthor: chapter?.book.author,
                }}
              />
            </div>
          </>
        ) : (
          <p className="mt-8 text-muted">This verse does not exist.</p>
        )}
      </main>
    </>
  );
}
