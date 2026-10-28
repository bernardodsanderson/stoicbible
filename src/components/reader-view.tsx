import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Check, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { ShareCardDialog, type ShareCardPayload } from "@/components/share-card";
import { isDarkTheme, useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  chapterBookmarks,
  chapterHighlights,
  createHighlight,
  getMyProfile,
  markChapterRead,
  saveJournal,
  saveUserQuote,
  toggleBookmark,
  updateMyProfile,
} from "@/lib/stoic/api-user";
import { listLibraryNav } from "@/lib/stoic/api-catalog";
import { useReadingProgress } from "@/lib/stoic/use-reading-progress";
import type { ChapterRead, HighlightColor, Profile } from "@/lib/stoic/types";
import { HIGHLIGHT_COLORS } from "@/lib/stoic/types";
import { cn } from "@/lib/utils";

const SIZE_MAP = { sm: "1.05rem", md: "1.2rem", lg: "1.4rem", xl: "1.65rem" } as const;

type VerseMark = {
  id: string;
  verseId: number;
  text: string;
  color: HighlightColor;
  note: string | null;
};

function paintVerse(text: string, marks: VerseMark[]): ReactNode {
  const hits: { start: number; end: number; color: HighlightColor }[] = [];
  for (const m of marks) {
    const needle = m.text.trim();
    if (!needle) continue;
    const i = text.indexOf(needle);
    if (i >= 0) hits.push({ start: i, end: i + needle.length, color: m.color });
  }
  if (hits.length === 0) return text;
  hits.sort((a, b) => a.start - b.start || b.end - a.end);
  const parts: ReactNode[] = [];
  let cursor = 0;
  let k = 0;
  for (const h of hits) {
    if (h.start < cursor) continue;
    if (h.start > cursor) parts.push(text.slice(cursor, h.start));
    parts.push(
      <mark
        key={`${h.start}-${k++}`}
        className="rounded-[2px] px-[0.12em] text-inherit"
        style={{ background: `color-mix(in oklab, var(--color-hl-${h.color}) 78%, transparent)` }}
      >
        {text.slice(h.start, h.end)}
      </mark>,
    );
    cursor = h.end;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export function ReaderView({ data }: { data: ChapterRead }) {
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const profileQ = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getMyProfile(),
    enabled: !isPending && !!user,
  });
  const hlQ = useQuery({
    queryKey: ["ch-hl", data.chapter.id, user?.id],
    queryFn: () => chapterHighlights({ data: { chapterId: data.chapter.id } }),
    enabled: !!user,
  });
  const bmQ = useQuery({
    queryKey: ["ch-bm", data.chapter.id, user?.id],
    queryFn: () => chapterBookmarks({ data: { chapterId: data.chapter.id } }),
    enabled: !!user,
  });
  const navQ = useQuery({ queryKey: ["library-nav"], queryFn: () => listLibraryNav() });
  const profile = profileQ.data;
  const [drawer, setDrawer] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menu, setMenu] = useState<{ text: string; verseId: number } | null>(null);
  const [thoughtOpen, setThoughtOpen] = useState<string | null>(null);
  const [share, setShare] = useState<ShareCardPayload | null>(null);
  const [localMarks, setLocalMarks] = useState<VerseMark[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const versesRef = useRef(data.verses);
  versesRef.current = data.verses;

  const font = profile?.readerFont ?? "serif";
  const size = profile?.readerSize ?? "md";
  const showNums = profile?.showVerseNumbers ?? true;
  const hlColor = (profile?.highlightColor ?? "yellow") as HighlightColor;
  const bookmarkedIds = new Set(bmQ.data?.map((b) => b.verseId) ?? []);

  const progress = useReadingProgress();
  const readHere = progress.isRead(data.chapter.slug);

  const allMarks = useMemo(() => {
    const saved = hlQ.data ?? [];
    const extra = localMarks.filter(
      (m) => !saved.some((s) => s.verseId === m.verseId && s.text === m.text),
    );
    return [...saved, ...extra];
  }, [hlQ.data, localMarks]);

  useEffect(() => {
    let showT = 0;
    let hideT = 0;
    const readSel = (): { text: string; verseId: number } | null => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
      const text = sel.toString().replace(/\s+/g, " ").trim();
      if (text.length < 2) return null;
      const root = bodyRef.current;
      if (!root) return null;
      if (!root.contains(sel.anchorNode) && !root.contains(sel.focusNode)) return null;
      const node =
        sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode?.parentElement;
      const verseEl = node?.closest("[data-verse-id]") as HTMLElement | null;
      const verseId = verseEl ? Number(verseEl.dataset.verseId) : versesRef.current[0]?.id;
      if (!verseId) return null;
      return { text, verseId };
    };
    const sync = () => {
      window.clearTimeout(showT);
      window.clearTimeout(hideT);
      const next = readSel();
      if (next) {
        showT = window.setTimeout(() => setMenu(next), 160);
      } else {
        hideT = window.setTimeout(() => setMenu(null), 320);
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("[data-sel-menu]")) return;
      if (bodyRef.current?.contains(t)) return;
      setMenu(null);
    };
    document.addEventListener("selectionchange", sync);
    document.addEventListener("pointerup", sync);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("selectionchange", sync);
      document.removeEventListener("pointerup", sync);
      document.removeEventListener("pointerdown", onDown);
      window.clearTimeout(showT);
      window.clearTimeout(hideT);
    };
  }, []);

  const readMut = useMutation({
    mutationFn: async () => {
      progress.mark({ id: data.chapter.id, slug: data.chapter.slug, bookSlug: data.book.slug });
      if (user) await markChapterRead({ data: { chapterId: data.chapter.id } });
    },
    onSuccess: () => {
      toast.success(readHere ? "Read again" : "Marked as read");
      void qc.invalidateQueries({ queryKey: ["chapter-reads"] });
    },
    onError: () => {
      toast.success("Marked as read on this device.");
    },
  });

  async function highlightSelection() {
    if (!menu) return;
    const optimistic: VerseMark = {
      id: `local-${Date.now()}`,
      verseId: menu.verseId,
      text: menu.text,
      color: hlColor,
      note: null,
    };
    setLocalMarks((s) => [...s, optimistic]);
    setMenu(null);
    window.getSelection()?.removeAllRanges();
    if (!user) {
      toast.message("Highlight kept on this page.", {
        action: { label: "Sign in to save", onClick: () => void navigate({ to: "/login" }) },
      });
      return;
    }
    try {
      const res = await createHighlight({
        data: {
          verseId: optimistic.verseId,
          chapterId: data.chapter.id,
          bookId: data.book.id,
          text: optimistic.text,
          color: hlColor,
        },
      });
      setLocalMarks((s) => s.map((m) => (m.id === optimistic.id ? { ...m, id: res.id } : m)));
      void qc.invalidateQueries({ queryKey: ["ch-hl", data.chapter.id] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save highlight");
    }
  }

  async function quoteSelection() {
    if (!menu) return;
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    try {
      await saveUserQuote({
        data: {
          text: menu.text,
          author: data.book.author,
          bookId: data.book.id,
          verseId: menu.verseId,
        },
      });
      toast.success("Quote saved", {
        action: { label: "View", onClick: () => void navigate({ to: "/quotes" }) },
      });
      void qc.invalidateQueries({ queryKey: ["my-quotes"] });
      setMenu(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save quote");
    }
  }

  async function thoughtSelection() {
    if (!menu) return;
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    setThoughtOpen(menu.text);
    setMenu(null);
  }

  async function shareSelection() {
    if (!menu) return;
    setShare({
      quote: menu.text,
      quoteAuthor: data.book.author,
      title: data.book.title,
    });
    setMenu(null);
  }

  async function bookmarkFirst() {
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    const verse = data.verses[0];
    if (!verse) return;
    try {
      const res = await toggleBookmark({
        data: { verseId: verse.id, chapterId: data.chapter.id, bookId: data.book.id },
      });
      toast.success(res.bookmarked ? "Bookmarked" : "Bookmark removed");
      void qc.invalidateQueries({ queryKey: ["ch-bm", data.chapter.id] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not bookmark");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader dense />
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">Now Reading</p>
          <button
            type="button"
            className="font-display text-lg hover:opacity-80"
            onClick={() => setDrawer(true)}
          >
            {data.book.title} : {data.chapter.number}
          </button>
          {readHere && <p className="text-xs text-muted">Read</p>}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            aria-label="Text settings"
          >
            <Settings2 />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void bookmarkFirst()}
            aria-label="Bookmark"
          >
            <Bookmark
              className={bookmarkedIds.has(data.verses[0]?.id ?? -1) ? "fill-current" : ""}
            />
          </Button>
        </div>
      </div>

      <article
        ref={bodyRef}
        className={cn(
          "relative mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-4 select-text",
          font === "sans" && "font-sans",
        )}
        style={{
          fontFamily: font === "serif" ? "var(--font-serif)" : "var(--font-sans)",
          fontSize: SIZE_MAP[size],
          WebkitUserSelect: "text",
          WebkitTouchCallout: "none",
        }}
      >
        <h1 className="mb-8 font-display text-3xl font-semibold">{data.chapter.title}</h1>
        <div>
          {data.verses.map((v) => {
            const marks = allMarks.filter((h) => h.verseId === v.id);
            return (
              <p key={v.id} data-verse-id={v.id} className="mb-5 select-text leading-[1.7]">
                {showNums && (
                  <Link
                    to="/read/$slug/verses/$verseNumber"
                    params={{ slug: data.chapter.slug, verseNumber: String(v.number) }}
                    className="mr-2 align-super text-[0.65em] text-subtle no-underline hover:text-fg"
                  >
                    {v.number}
                  </Link>
                )}
                {paintVerse(v.text, marks)}
              </p>
            );
          })}
        </div>
      </article>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          {data.prevSlug ? (
            <Button variant="ghost" asChild>
              <Link to="/read/$slug" params={{ slug: data.prevSlug }} aria-label="Previous chapter">
                <ChevronLeft />
              </Link>
            </Button>
          ) : (
            <span className="w-11" />
          )}
          <Button
            variant={readHere ? "secondary" : "default"}
            onClick={() => readMut.mutate()}
            disabled={readMut.isPending}
          >
            <Check /> {readHere ? "Read" : "Mark as read"}
          </Button>
          {data.nextSlug ? (
            <Button variant="ghost" asChild>
              <Link to="/read/$slug" params={{ slug: data.nextSlug }} aria-label="Next chapter">
                <ChevronRight />
              </Link>
            </Button>
          ) : (
            <span className="w-11" />
          )}
        </div>
      </div>

      {menu && (
        <div
          data-sel-menu
          className="fixed inset-x-0 z-40 border-t border-border bg-elevated shadow-soft sm:inset-x-auto sm:left-1/2 sm:w-auto sm:-translate-x-1/2 sm:rounded-full sm:border"
          style={{ bottom: "calc(3.75rem + env(safe-area-inset-bottom, 0px))" }}
          onPointerDown={(e) => e.preventDefault()}
        >
          <div className="mx-auto flex max-w-2xl items-stretch justify-around sm:gap-0 sm:px-1 sm:py-1">
            {(
              [
                ["Highlight", highlightSelection],
                ["Thoughts", thoughtSelection],
                ["Quote", quoteSelection],
                ["Share", shareSelection],
              ] as const
            ).map(([label, fn]) => (
              <button
                key={label}
                type="button"
                className="min-h-11 flex-1 px-3 py-2.5 text-sm touch-manipulation hover:text-accent sm:flex-none sm:px-4"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void fn();
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="right" className="w-full max-w-md">
          <SheetHeader>
            <SheetTitle>Select a book</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-5rem)] px-6 pb-8">
            <ul className="space-y-6">
              {navQ.data?.map((b) => (
                <li key={b.slug}>
                  <p className="font-display text-lg">{b.title}</p>
                  <p className="text-xs text-subtle">{b.author}</p>
                  <ul className="mt-2 space-y-1">
                    {b.chapters.map((c) => {
                      const done = progress.isRead(c.slug);
                      const here = c.slug === data.chapter.slug;
                      return (
                        <li key={c.slug}>
                          <Link
                            to="/read/$slug"
                            params={{ slug: c.slug }}
                            className={cn(
                              "flex items-center gap-2 text-sm hover:text-fg",
                              here ? "text-fg" : "text-muted",
                            )}
                            onClick={() => setDrawer(false)}
                          >
                            {done ? (
                              <Check className="h-3.5 w-3.5 shrink-0" />
                            ) : (
                              <span className="inline-block w-3.5 shrink-0" />
                            )}
                            {c.number}. {c.title}
                            {here && (
                              <span className="text-[0.65rem] uppercase tracking-wider text-subtle">
                                Here
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="bottom" className="p-6">
          <SheetHeader>
            <SheetTitle>Reader settings</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-between px-6 pb-4">
            <p className="text-sm">Dark mode</p>
            <DarkModeSwitch />
          </div>
          {user && profile ? (
            <SettingsForm profile={profile} />
          ) : (
            <p className="px-6 pb-6 text-sm text-muted">
              Sign in to save font and size across devices.
            </p>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={!!thoughtOpen} onOpenChange={(o) => !o && setThoughtOpen(null)}>
        <SheetContent side="bottom" className="p-6">
          <SheetHeader>
            <SheetTitle>Write a thought</SheetTitle>
          </SheetHeader>
          {thoughtOpen && (
            <ThoughtForm
              quote={thoughtOpen}
              author={data.book.author}
              verseId={
                data.verses.find((v) => v.text.includes(thoughtOpen))?.id ?? data.verses[0]?.id
              }
              onDone={() => setThoughtOpen(null)}
            />
          )}
        </SheetContent>
      </Sheet>
      <ShareCardDialog
        open={!!share}
        onOpenChange={(o) => {
          if (!o) setShare(null);
        }}
        payload={share ?? {}}
      />
    </div>
  );
}

function DarkModeSwitch() {
  const { theme, toggleDark } = useTheme();
  return <Switch checked={isDarkTheme(theme)} onCheckedChange={() => toggleDark()} />;
}

function SettingsForm({ profile }: { profile: Profile }) {
  const qc = useQueryClient();
  async function patch(partial: Parameters<typeof updateMyProfile>[0]["data"]) {
    await updateMyProfile({ data: partial });
    void qc.invalidateQueries({ queryKey: ["profile"] });
  }
  return (
    <div className="space-y-5 px-6 pb-8">
      <div>
        <p className="text-sm text-muted">Font</p>
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            variant={profile.readerFont === "serif" ? "default" : "secondary"}
            onClick={() => void patch({ readerFont: "serif" })}
          >
            Serif
          </Button>
          <Button
            size="sm"
            variant={profile.readerFont === "sans" ? "default" : "secondary"}
            onClick={() => void patch({ readerFont: "sans" })}
          >
            Sans
          </Button>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted">Size</p>
        <div className="mt-2 flex gap-2">
          {(["sm", "md", "lg", "xl"] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={profile.readerSize === s ? "default" : "secondary"}
              onClick={() => void patch({ readerSize: s })}
            >
              {s.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm">Verse numbers</p>
        <Switch
          checked={profile.showVerseNumbers}
          onCheckedChange={(v) => void patch({ showVerseNumbers: v })}
        />
      </div>
      <div>
        <p className="text-sm text-muted">Default highlight</p>
        <div className="mt-2 flex gap-2">
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              onClick={() => void patch({ highlightColor: c })}
              className={cn(
                "h-7 w-7 rounded-full border border-border",
                profile.highlightColor === c && "ring-2 ring-ring",
              )}
              style={{ background: `var(--color-hl-${c})` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ThoughtForm({
  quote,
  author,
  verseId,
  onDone,
}: {
  quote: string;
  author: string;
  verseId?: number;
  onDone: () => void;
}) {
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <form
      className="space-y-4 px-6 pb-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        try {
          await saveJournal({
            data: {
              title: null,
              body,
              quoteText: quote,
              quoteAuthor: author,
              verseId: verseId ?? null,
            },
          });
          toast.success("Journal saved");
          onDone();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Could not save journal");
        } finally {
          setPending(false);
        }
      }}
    >
      <blockquote className="border-l-2 border-accent pl-3 text-sm italic text-muted">
        “{quote}”
      </blockquote>
      <textarea
        className="min-h-32 w-full rounded-lg border border-border bg-elevated p-3"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write as Marcus did — to yourself."
        required
      />
      <Button type="submit" disabled={pending}>
        Save journal
      </Button>
    </form>
  );
}
