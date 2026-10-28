import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProfileTabs } from "@/components/profile-tabs";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, listMyBookmarks } from "@/lib/stoic/api-user";
import { relativeTime } from "@/lib/utils";

export const Route = createFileRoute("/$username/bookmarks")({ component: BookmarksPage });

function BookmarksPage() {
  const { username } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const me = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getMyProfile(),
    enabled: !isPending && !!user,
  });
  const isOwner = me.data?.username === username;
  const list = useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: () => listMyBookmarks(),
    enabled: isOwner,
  });

  return (
    <>
      <ProfileTabs username={username} active="bookmarks" />
      <div className="mt-6 space-y-4">
        {!isOwner && <p className="text-sm text-muted">Bookmarks are private.</p>}
        {isOwner && list.data?.length === 0 && (
          <p className="text-sm text-muted">No bookmarks yet.</p>
        )}
        {list.data?.map((b) => (
          <Link
            key={b.id}
            to="/read/$slug/verses/$verseNumber"
            params={{ slug: b.chapterSlug, verseNumber: String(b.verseNumber) }}
            className="block rounded-xl border border-border bg-elevated p-5"
          >
            <p className="text-xs text-subtle">
              {b.bookTitle} : {b.chapterNumber}, verse {b.verseNumber} · {relativeTime(b.createdAt)}
            </p>
            <p className="mt-2 text-sm leading-relaxed">{b.verseText}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
