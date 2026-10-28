/* eslint-disable react-refresh/only-export-components -- this module intentionally exports hooks/helpers with its component */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PAGES_CACHE = "stoic-pages-v1";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<() => void>();

function notifyPrompt() {
  for (const fn of promptListeners) fn();
}

export function PwaRoot() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      notifyPrompt();
    };
    const onInstalled = () => {
      deferredPrompt = null;
      notifyPrompt();
      toast.success("Stoic Bible is on your home screen.");
    };
    const syncOnline = () => setOffline(!navigator.onLine);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("online", syncOnline);
    window.addEventListener("offline", syncOnline);
    syncOnline();
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("online", syncOnline);
      window.removeEventListener("offline", syncOnline);
    };
  }, []);

  if (!offline) return null;
  return (
    <div className="border-b border-border bg-surface px-4 py-2 text-center text-sm text-muted">
      You’re offline. Chapters you’ve opened or saved still read here.
    </div>
  );
}

export function useInstallPrompt() {
  const [available, setAvailable] = useState(Boolean(deferredPrompt));
  useEffect(() => {
    const fn = () => setAvailable(Boolean(deferredPrompt));
    promptListeners.add(fn);
    fn();
    return () => {
      promptListeners.delete(fn);
    };
  }, []);
  async function install() {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notifyPrompt();
    return choice.outcome === "accepted";
  }
  return { available, install };
}

export function SaveOfflineButton({ hrefs, label }: { hrefs: string[]; label: string }) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  async function save() {
    if (!("caches" in window)) {
      toast.error("This browser cannot save books offline.");
      return;
    }
    setState("saving");
    try {
      const cache = await caches.open(PAGES_CACHE);
      await cache.addAll(hrefs);
      toast.success(`${label} is saved for offline reading.`);
      setState("saved");
    } catch {
      toast.error("Could not save every chapter. Open them once while online.");
      setState("idle");
    }
  }
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => void save()}
      disabled={state === "saving"}
    >
      {state === "saved" ? "Saved offline" : state === "saving" ? "Saving…" : "Save offline"}
    </Button>
  );
}
