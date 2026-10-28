import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProfileTabs } from "@/components/profile-tabs";
import { ShareCardButton } from "@/components/share-card";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { deleteHighlight, getMyProfile, listMyHighlights } from "@/lib/stoic/api-user";
import { relativeTime } from "@/lib/utils";

export const Route = createFileRoute("/$username/highlights")({ component: HighlightsPage });

function HighlightsPage() {
  const { username } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const me = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getMyProfile(),
    enabled: !isPending && !!user,
  });
  const isOwner = me.data?.username === username;
  const list = useQuery({
    queryKey: ["highlights", user?.id],
    queryFn: () => listMyHighlights(),
    enabled: isOwner,
  });

  return (
    <>
      <ProfileTabs username={username} active="highlights" />
      <div className="mt-6 space-y-4">
        {!isOwner && <p className="text-sm text-muted">Highlights are private.</p>}
        {isOwner && list.data?.length === 0 && (
          <p className="text-sm text-muted">No highlights yet. Select text while reading.</p>
        )}
        {list.data?.map((h) => (
          <article key={h.id} className="rounded-xl border border-border bg-elevated p-5">
            <p className="text-xs text-subtle">
              {h.bookTitle} : {h.chapterNumber}, verse {h.verseNumber} · {relativeTime(h.createdAt)}
            </p>
            <p
              className="mt-3 rounded-md px-2 py-1 text-sm leading-relaxed"
              style={{
                background: `color-mix(in oklab, var(--color-hl-${h.color}) 55%, transparent)`,
              }}
            >
              {h.text}
            </p>
            {h.note && <p className="mt-2 text-sm text-muted">{h.note}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link
                  to="/read/$slug/verses/$verseNumber"
                  params={{ slug: h.chapterSlug, verseNumber: String(h.verseNumber) }}
                >
                  Verse
                </Link>
              </Button>
              <ShareCardButton
                payload={{ quote: h.text, quoteAuthor: h.bookTitle }}
                variant="ghost"
              />
              {isOwner && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await deleteHighlight({ data: { id: h.id } });
                    toast.success("Highlight deleted successfully!");
                    void qc.invalidateQueries({ queryKey: ["highlights"] });
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
