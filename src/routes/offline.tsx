import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/offline")({ component: OfflinePage });

function OfflinePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Offline</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">The library is still here</h1>
        <p className="mt-4 text-muted">
          You’re not connected. Books and chapters you have already opened, or saved from a book
          page, can still be read.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/books">Open library</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/">Home</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
