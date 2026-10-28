import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShareCardButton } from "@/components/share-card";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getJournal, getMyProfile } from "@/lib/stoic/api-user";
import { relativeTime } from "@/lib/utils";

export const Route = createFileRoute("/$username/journals/$slug")({ component: JournalDetail });

function JournalDetail() {
  const { username, slug } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const me = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getMyProfile(),
    enabled: !isPending && !!user,
  });
  const journal = useQuery({
    queryKey: ["journal", username, slug],
    queryFn: () => getJournal({ data: { username, slug } }),
  });
  const j = journal.data;
  const isOwner = me.data?.username === username;

  return (
    <div>
      {!j && journal.isFetched && <p>Journal not found.</p>}
      {j && (
        <>
          <p className="text-sm text-muted">
            <Link to="/$username" params={{ username }} className="hover:text-fg">
              @{username}
            </Link>{" "}
            · {relativeTime(j.updatedAt)}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold">{j.title || "Untitled"}</h2>
          {j.quoteText && (
            <blockquote className="mt-6 border-l-2 border-accent pl-4 italic text-muted">
              “{j.quoteText}”
              {j.quoteAuthor ? (
                <span className="mt-2 block text-sm not-italic">— {j.quoteAuthor}</span>
              ) : null}
            </blockquote>
          )}
          <div className="mt-8 whitespace-pre-wrap text-lg leading-relaxed">{j.body}</div>
          {isOwner && (
            <div className="mt-10 flex flex-wrap gap-2">
              <Button asChild variant="secondary">
                <Link to="/write/$slug" params={{ slug: j.slug }}>
                  Edit
                </Link>
              </Button>
              <ShareCardButton
                payload={{
                  title: j.title,
                  quote: j.quoteText,
                  quoteAuthor: j.quoteAuthor,
                  thought: j.body,
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
