import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { listMyChapterReads } from "@/lib/stoic/api-user";
import { useAppAccount } from "@/lib/stoic/use-app-account";

const STORAGE = "stoic-reads";
const EVENT = "stoic-reads";

export type LocalRead = {
  id: number;
  slug: string;
  bookSlug: string;
  count: number;
  at: number;
};

type LocalMap = Record<string, LocalRead>;

const EMPTY: LocalMap = {};
let snapshot: LocalMap = EMPTY;
let hydrated = false;

function hydrate() {
  try {
    const raw = localStorage.getItem(STORAGE);
    snapshot = raw ? (JSON.parse(raw) as LocalMap) : EMPTY;
    if (!snapshot || typeof snapshot !== "object") snapshot = EMPTY;
  } catch {
    snapshot = EMPTY;
  }
  hydrated = true;
}

function getSnapshot() {
  if (!hydrated) hydrate();
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY;
}

function saveLocal(map: LocalMap) {
  snapshot = map;
  try {
    localStorage.setItem(STORAGE, JSON.stringify(map));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  const wrap = () => {
    hydrate();
    onChange();
  };
  window.addEventListener(EVENT, wrap);
  window.addEventListener("storage", wrap);
  return () => {
    window.removeEventListener(EVENT, wrap);
    window.removeEventListener("storage", wrap);
  };
}

export function useReadingProgress() {
  const { user } = useAppAccount();
  const local = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const remote = useQuery({
    queryKey: ["chapter-reads", user?.id],
    queryFn: () => listMyChapterReads(),
    enabled: !!user,
  });

  const bySlug = useMemo(() => {
    const map = new Map<string, LocalRead>();
    for (const row of Object.values(local)) map.set(row.slug, row);
    for (const row of remote.data ?? []) {
      const prev = map.get(row.slug);
      map.set(row.slug, {
        id: row.chapterId,
        slug: row.slug,
        bookSlug: row.bookSlug,
        count: Math.max(prev?.count ?? 0, row.readCount),
        at: Math.max(prev?.at ?? 0, new Date(row.lastReadAt).getTime()),
      });
    }
    return map;
  }, [local, remote.data]);

  const isRead = useCallback(
    (idOrSlug: number | string) => {
      if (typeof idOrSlug === "number") {
        for (const row of bySlug.values()) if (row.id === idOrSlug && row.count > 0) return true;
        return false;
      }
      return (bySlug.get(idOrSlug)?.count ?? 0) > 0;
    },
    [bySlug],
  );

  const mark = useCallback((entry: { id: number; slug: string; bookSlug: string }) => {
    const current = { ...getSnapshot() };
    const prev = current[entry.slug];
    current[entry.slug] = {
      id: entry.id,
      slug: entry.slug,
      bookSlug: entry.bookSlug,
      count: (prev?.count ?? 0) + 1,
      at: Date.now(),
    };
    saveLocal(current);
  }, []);

  return { isRead, mark, bySlug, refetch: remote.refetch };
}
