import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { JournalCard } from "@/components/journal-card";
import { ProfileTabs } from "@/components/profile-tabs";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, listMyJournals } from "@/lib/stoic/api-user";

export const Route = createFileRoute("/$username/")({ component: ProfileJournals });

function ProfileJournals() {
  const { username } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const me = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getMyProfile(),
    enabled: !isPending && !!user,
  });
  const isOwner = me.data?.username === username;
  const journals = useQuery({
    queryKey: ["journals", user?.id],
    queryFn: () => listMyJournals(),
    enabled: isOwner,
  });

  return (
    <>
      <ProfileTabs username={username} active="journals" />
      <div className="mt-6 space-y-4">
        {!isOwner && !isPending && <p className="text-sm text-muted">Journals are private.</p>}
        {isOwner && journals.data?.length === 0 && (
          <div>
            <p className="text-sm text-muted">No journals yet. Write one — they stay yours.</p>
            <Button asChild className="mt-4" size="sm">
              <Link to="/write/new-journal">New journal</Link>
            </Button>
          </div>
        )}
        {isOwner &&
          journals.data?.map((j) => (
            <JournalCard
              key={j.id}
              journal={j}
              username={username}
              canEdit
              onDeleted={() => void journals.refetch()}
            />
          ))}
      </div>
    </>
  );
}
