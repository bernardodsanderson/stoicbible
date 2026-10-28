import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/components/pwa";

export const Route = createFileRoute("/app")({ component: AppPage });

function AppPage() {
  const { available, install } = useInstallPrompt();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Install</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Read it like an app</h1>
        <p className="mt-4 text-muted">
          Add Stoic Bible to your home screen. After you open a book once — or tap Save offline on
          its page — those chapters stay readable without a connection.
        </p>
        {available ? (
          <Button className="mt-8" onClick={() => void install()}>
            Install Stoic Bible
          </Button>
        ) : (
          <ol className="mt-8 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted">
            <li>
              <span className="text-fg">iPhone:</span> tap Share, then Add to Home Screen.
            </li>
            <li>
              <span className="text-fg">Android / Chrome:</span> open the browser menu and choose
              Install app or Add to Home screen.
            </li>
            <li>
              <span className="text-fg">Desktop:</span> use the install icon in the address bar.
            </li>
          </ol>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
