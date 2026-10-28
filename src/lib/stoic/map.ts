import type { BookmarkCard, HighlightColor, JournalCard, Profile, ThemeId } from "./types";

/** Firestore Timestamps, Date objects and ISO strings all become ISO strings. */
export function toIso(value: unknown, fallback = new Date().toISOString()): string {
  if (typeof value === "string" && value) return value;
  if (value instanceof Date) return value.toISOString();
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export type ProfileDoc = {
  username: string;
  displayName?: string | null;
  timezone?: string;
  theme?: string;
  highlightColor?: string;
  reminderMorning?: boolean;
  reminderAfternoon?: boolean;
  reminderEvening?: boolean;
  reminderQuote?: boolean;
  readerFont?: string;
  readerSize?: string;
  showVerseNumbers?: boolean;
  createdAt?: unknown;
  checkinCount?: number;
  readingCount?: number;
  journalingCount?: number;
  lastCheckin?: string | null;
  lastReading?: string | null;
  lastJournaling?: string | null;
};

export function mapProfileDoc(userId: string, data: ProfileDoc, email: string | null): Profile {
  return {
    userId,
    username: data.username,
    displayName: data.displayName?.trim() || null,
    email,
    timezone: data.timezone || "UTC",
    theme: (data.theme as ThemeId) || "default",
    highlightColor: (data.highlightColor as HighlightColor) || "yellow",
    reminderMorning: Boolean(data.reminderMorning),
    reminderAfternoon: Boolean(data.reminderAfternoon),
    reminderEvening: Boolean(data.reminderEvening),
    reminderQuote: Boolean(data.reminderQuote),
    readerFont: data.readerFont === "sans" ? "sans" : "serif",
    readerSize: (["sm", "md", "lg", "xl"].includes(data.readerSize ?? "")
      ? data.readerSize
      : "md") as Profile["readerSize"],
    showVerseNumbers: data.showVerseNumbers !== false,
    createdAt: toIso(data.createdAt),
  };
}

export type JournalDoc = {
  slug: string;
  title?: string | null;
  body: string;
  isPublic?: boolean;
  quoteText?: string | null;
  quoteAuthor?: string | null;
  verseId?: number | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export function mapJournalDoc(id: string, data: JournalDoc): JournalCard {
  return {
    id,
    slug: data.slug,
    title: data.title ?? null,
    body: data.body,
    isPublic: Boolean(data.isPublic),
    quoteText: data.quoteText ?? null,
    quoteAuthor: data.quoteAuthor ?? null,
    verseId: data.verseId ?? null,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

export type HighlightDoc = {
  text: string;
  color?: string;
  note?: string | null;
  createdAt?: unknown;
  verseId: number;
  verseNumber?: number;
  chapterId: number;
  chapterSlug?: string;
  chapterTitle?: string;
  chapterNumber?: number;
  bookId: number;
  bookTitle?: string;
  bookSlug?: string;
};

export function mapHighlightDoc(
  id: string,
  data: HighlightDoc,
): {
  id: string;
  text: string;
  color: HighlightColor;
  note: string | null;
  createdAt: string;
  verseId: number;
  verseNumber: number;
  chapterId: number;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumber: number;
  bookTitle: string;
  bookSlug: string;
} {
  return {
    id,
    text: data.text,
    color: (data.color as HighlightColor) || "yellow",
    note: data.note ?? null,
    createdAt: toIso(data.createdAt),
    verseId: data.verseId,
    verseNumber: data.verseNumber ?? 0,
    chapterId: data.chapterId,
    chapterSlug: data.chapterSlug ?? "",
    chapterTitle: data.chapterTitle ?? "",
    chapterNumber: data.chapterNumber ?? 0,
    bookTitle: data.bookTitle ?? "",
    bookSlug: data.bookSlug ?? "",
  };
}

export type BookmarkDoc = {
  verseId: number;
  verseNumber?: number;
  verseText?: string;
  chapterId: number;
  chapterSlug?: string;
  chapterTitle?: string;
  chapterNumber?: number;
  bookId: number;
  bookTitle?: string;
  bookSlug?: string;
  createdAt?: unknown;
};

export function mapBookmarkDoc(id: string, data: BookmarkDoc): BookmarkCard {
  return {
    id,
    createdAt: toIso(data.createdAt),
    verseId: data.verseId,
    verseNumber: data.verseNumber ?? 0,
    verseText: data.verseText ?? "",
    chapterSlug: data.chapterSlug ?? "",
    chapterTitle: data.chapterTitle ?? "",
    chapterNumber: data.chapterNumber ?? 0,
    bookTitle: data.bookTitle ?? "",
    bookSlug: data.bookSlug ?? "",
  };
}

export type UserQuoteDoc = {
  text: string;
  author?: string | null;
  thought?: string | null;
  createdAt?: unknown;
};

export function mapUserQuoteDoc(
  id: string,
  data: UserQuoteDoc,
): { id: string; text: string; author: string | null; thought: string | null; createdAt: string } {
  return {
    id,
    text: data.text,
    author: data.author ?? null,
    thought: data.thought ?? null,
    createdAt: toIso(data.createdAt),
  };
}

export type ChapterReadDoc = {
  chapterId?: number;
  slug?: string;
  bookSlug?: string;
  readCount?: number;
  lastReadAt?: unknown;
};

export function mapChapterReadDoc(
  id: string,
  data: ChapterReadDoc,
): {
  chapterId: number;
  slug: string;
  bookSlug: string;
  readCount: number;
  lastReadAt: string;
} {
  return {
    chapterId: data.chapterId ?? Number(id),
    slug: data.slug ?? "",
    bookSlug: data.bookSlug ?? "",
    readCount: data.readCount ?? 0,
    lastReadAt: toIso(data.lastReadAt),
  };
}
