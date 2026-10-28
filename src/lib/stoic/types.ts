export type AccessType = "free" | "paid";
export type ThemeId = "default" | "dark" | "dark2" | "dim";
export type HighlightColor = "yellow" | "green" | "orange" | "pink" | "blue" | "purple";
export type Motif = "column" | "lamp" | "quill" | "sun" | "oak" | "wave" | "scroll" | "star";

export type BookSummary = {
  id: number;
  slug: string;
  title: string;
  author: string;
  description: string;
  sourceUrl: string | null;
  motif: Motif;
  tone: number;
  chapterCount: number;
  freeChapterCount: number;
};

export type ChapterSummary = {
  id: number;
  slug: string;
  title: string;
  number: number;
  accessType: AccessType;
  verseCount: number;
  readCount: number;
};

export type BookDetail = BookSummary & {
  chapters: ChapterSummary[];
};

export type Verse = {
  id: number;
  number: number;
  text: string;
};

export type ChapterRead = {
  book: BookSummary;
  chapter: ChapterSummary;
  prevSlug: string | null;
  nextSlug: string | null;
  verses: Verse[];
};

export type Profile = {
  userId: string;
  username: string;
  displayName: string | null;
  email: string | null;
  timezone: string;
  theme: ThemeId;
  highlightColor: HighlightColor;
  reminderMorning: boolean;
  reminderAfternoon: boolean;
  reminderEvening: boolean;
  reminderQuote: boolean;
  readerFont: "serif" | "sans";
  readerSize: "sm" | "md" | "lg" | "xl";
  showVerseNumbers: boolean;
  createdAt: string;
};

export type JournalCard = {
  id: string;
  slug: string;
  title: string | null;
  body: string;
  isPublic: boolean;
  quoteText: string | null;
  quoteAuthor: string | null;
  verseId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type HighlightCard = {
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
};

export type BookmarkCard = {
  id: string;
  createdAt: string;
  verseId: number;
  verseNumber: number;
  verseText: string;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumber: number;
  bookTitle: string;
  bookSlug: string;
};

export type QuoteCard = {
  id: string;
  text: string;
  author: string;
  attribution: string | null;
};

export type SearchHit = {
  kind: "book" | "verse" | "quote";
  id: number;
  title: string;
  snippet: string;
  href: string;
  meta: string;
};

export type Streaks = {
  checkinCount: number;
  readingCount: number;
  journalingCount: number;
};

export const HIGHLIGHT_COLORS: HighlightColor[] = [
  "yellow",
  "green",
  "orange",
  "pink",
  "blue",
  "purple",
];
