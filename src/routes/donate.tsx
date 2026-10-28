import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/donate")({ component: DonatePage });

function DonatePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-display text-4xl font-semibold">Donate</h1>
        <p className="mt-4 text-muted">
          Stoic Bible is free. If you want to help, keep reading, write a little every day, and send
          feedback when something is unclear.
        </p>
        <Button asChild className="mt-8">
          <Link to="/feedback">Send feedback</Link>
        </Button>
      </main>
      <SiteFooter />
    </>
  );
}
