import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, getPublicProfile } from "@/lib/stoic/api-user";

export const Route = createFileRoute("/$username")({ component: ProfileLayout });

function ProfileLayout() {
  const { username } = useParams({ from: "/$username" });
  const { user, isPending } = useCurrentUserState();
  const me = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getMyProfile(),
    enabled: !isPending && !!user,
  });
  const pub = useQuery({
    queryKey: ["pub-profile", username],
    queryFn: () => getPublicProfile({ data: { username } }),
  });
  const isOwner = me.data?.username === username;
  const display = pub.data?.displayName || me.data?.displayName || username;

  if (!pub.data && !isOwner && pub.isFetched && !me.isLoading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16">This reader was not found.</main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl font-semibold">{display}</h1>
        <p className="text-sm text-muted">@{username}</p>
        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </>
  );
}
