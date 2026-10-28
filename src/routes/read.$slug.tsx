import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ReaderView } from "@/components/reader-view";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getChapter } from "@/lib/stoic/api-catalog";

export const Route = createFileRoute("/read/$slug")({ component: ReadPage });

function ReadPage() {
  const { slug } = Route.useParams();
  const pub = useQuery({
    queryKey: ["chapter", slug],
    queryFn: () => getChapter({ data: { slug } }),
  });
  if (pub.isLoading) {
    return (
      <>
        <SiteHeader dense />
        <main className="mx-auto max-w-2xl px-5 py-16 text-muted">Loading chapter…</main>
      </>
    );
  }
  if (pub.isError || !pub.data) {
    return (
      <>
        <SiteHeader dense />
        <main className="mx-auto max-w-2xl px-5 py-16">
          <p>Could not load this chapter.</p>
          <Button className="mt-4" onClick={() => void pub.refetch()}>
            Retry
          </Button>
        </main>
      </>
    );
  }
  return <ReaderView data={pub.data} />;
}
