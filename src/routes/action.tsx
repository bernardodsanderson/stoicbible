import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PATHS, currentWeekKey, repForWeek, type ActionPath } from "@/lib/stoic/action";
import { saveJournal } from "@/lib/stoic/api-user";
import { useAppAccount } from "@/lib/stoic/use-app-account";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/action")({ component: ActionPage });

const STORAGE = "stoic-action";

type Draft = {
  weekKey: string;
  repNote: string;
  mine: string;
  notMine: string;
  hardThing: string;
  hardPlan: string;
};

const empty = (): Draft => ({
  weekKey: currentWeekKey(),
  repNote: "",
  mine: "",
  notMine: "",
  hardThing: "",
  hardPlan: "",
});

function loadDraft(): Draft {
  const base = empty();
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (parsed.weekKey !== base.weekKey) {
      return {
        ...base,
        mine: parsed.mine ?? "",
        notMine: parsed.notMine ?? "",
        hardThing: parsed.hardThing ?? "",
        hardPlan: parsed.hardPlan ?? "",
      };
    }
    return { ...base, ...parsed, weekKey: base.weekKey };
  } catch {
    return base;
  }
}

function ActionPage() {
  const { user } = useAppAccount();
  const rep = repForWeek();
  const [pathId, setPathId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(empty);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const path = PATHS.find((p) => p.id === pathId) ?? null;

  useEffect(() => {
    setDraft(loadDraft());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE, JSON.stringify(draft));
  }, [draft, ready]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function keepJournal() {
    const parts = [
      draft.repNote.trim() && `This week — ${rep.title}\n${draft.repNote.trim()}`,
      (draft.mine.trim() || draft.notMine.trim()) &&
        `Mine\n${draft.mine.trim() || "—"}\n\nNot mine\n${draft.notMine.trim() || "—"}`,
      (draft.hardThing.trim() || draft.hardPlan.trim()) &&
        `What may meet me\n${draft.hardThing.trim() || "—"}\n\nHow I will meet it\n${draft.hardPlan.trim() || "—"}`,
    ].filter(Boolean);
    if (!parts.length) {
      toast.message("Write a line first.");
      return;
    }
    if (!user) {
      toast.message("Sign in to keep this in your journal.");
      return;
    }
    setSaving(true);
    try {
      await saveJournal({
        data: {
          title: `Action — ${rep.title}`,
          body: parts.join("\n\n"),
        },
      });
      toast.success("Saved to your journal.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Action</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Use what you have read</h1>
        <p className="mt-3 max-w-xl text-muted">
          The books stay the work. This page is a short practice beside them — a path, one rep for
          the week, and two ways to sort a hard hour.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Start from the problem</h2>
          <p className="mt-1 text-sm text-muted">
            Pick what is loudest. Each path is a few chapters already in the library.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PATHS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPathId(item.id === pathId ? null : item.id)}
                className={cn(
                  "rounded-xl border px-4 py-4 text-left",
                  item.id === pathId
                    ? "border-border-strong bg-elevated"
                    : "border-border bg-elevated hover:border-border-strong",
                )}
              >
                <p className="font-display text-xl">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.line}</p>
              </button>
            ))}
          </div>
          {path && <PathReads path={path} />}
        </section>

        <section className="mt-12 rounded-xl border border-border bg-elevated p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-subtle">This week</p>
          <h2 className="mt-2 font-display text-2xl">{rep.title}</h2>
          <p className="mt-3 leading-relaxed">{rep.body}</p>
          <Link
            to="/read/$slug"
            params={{ slug: rep.read.slug }}
            className="mt-4 inline-block text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
          >
            Read {rep.read.author}: {rep.read.title}
          </Link>
          <Textarea
            value={draft.repNote}
            onChange={(e) => set("repNote", e.target.value)}
            placeholder="The smallest version you will actually do"
            className="mt-4 min-h-24"
            aria-label="This week's note"
          />
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Two columns</h2>
          <p className="mt-1 text-sm text-muted">
            Put the fact in front of you. Opinion, reputation, and other people’s choices go on the
            right.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-subtle">Mine</span>
              <Textarea
                value={draft.mine}
                onChange={(e) => set("mine", e.target.value)}
                placeholder="My judgment, my next act"
                className="mt-2 min-h-36"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-subtle">Not mine</span>
              <Textarea
                value={draft.notMine}
                onChange={(e) => set("notMine", e.target.value)}
                placeholder="What I cannot command"
                className="mt-2 min-h-36"
              />
            </label>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">What may meet you</h2>
          <p className="mt-1 text-sm text-muted">
            Name one hard thing before it arrives, and how you intend to meet it.
          </p>
          <label className="mt-4 block">
            <span className="text-xs uppercase tracking-[0.16em] text-subtle">The thing</span>
            <Textarea
              value={draft.hardThing}
              onChange={(e) => set("hardThing", e.target.value)}
              placeholder="A conversation, a delay, a refusal"
              className="mt-2 min-h-24"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-xs uppercase tracking-[0.16em] text-subtle">
              How you will meet it
            </span>
            <Textarea
              value={draft.hardPlan}
              onChange={(e) => set("hardPlan", e.target.value)}
              placeholder="One sentence you can keep"
              className="mt-2 min-h-24"
            />
          </label>
        </section>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={saving}
            onClick={() => void keepJournal()}
          >
            {saving ? "Saving…" : "Save to journal"}
          </Button>
          {!user && (
            <Link to="/login" className="text-sm text-muted underline-offset-4 hover:underline">
              Sign in to keep it with your journals
            </Link>
          )}
          <p className="text-sm text-muted">Notes stay on this device until you save them.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function PathReads({ path }: { path: ActionPath }) {
  return (
    <ol className="mt-4 divide-y divide-border border-y border-border">
      {path.reads.map((read, i) => (
        <li key={read.slug} className="flex items-baseline justify-between gap-3 py-3">
          <Link to="/read/$slug" params={{ slug: read.slug }} className="hover:underline">
            <span className="mr-2 text-subtle">{i + 1}.</span>
            {read.title}
          </Link>
          <span className="shrink-0 text-xs text-subtle">{read.author}</span>
        </li>
      ))}
    </ol>
  );
}
