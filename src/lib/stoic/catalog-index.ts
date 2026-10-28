/**
 * The reading catalog is static content that ships with the app. Building an
 * index once keeps Firestore free for per-user data (journals, highlights,
 * bookmarks) and makes search instant with no database round-trip.
 *
 * IDs are deterministic and stable: books are numbered by catalog order,
 * chapters and verses by global order. User documents reference these IDs.
 */
import { CATALOG, type SeedBook, type SeedChapter } from "./catalog";
import { CURATED_QUOTES } from "./quotes-data";
import type {
  BookDetail,
  BookSummary,
  ChapterRead,
  ChapterSummary,
  QuoteCard,
  SearchHit,
  Verse,
} from "./types";

export type IndexedVerse = {
  id: number;
  number: number;
  text: string;
  chapterId: number;
};

export type IndexedChapter = Omit<SeedChapter, "verses"> & {
  id: number;
  bookId: number;
  verses: IndexedVerse[];
};

export type IndexedBook = Omit<SeedBook, "chapters"> & {
  id: number;
  chapters: IndexedChapter[];
};

let chapterCounter = 0;
let verseCounter = 0;

export const BOOKS: IndexedBook[] = CATALOG.map((book, bookIndex) => {
  const bookId = bookIndex + 1;
  const chapters = book.chapters.map((chapter) => {
    const chapterId = ++chapterCounter;
    const verses = chapter.verses.map((text, verseIndex) => ({
      id: ++verseCounter,
      number: verseIndex + 1,
      text,
      chapterId,
    }));
    return { ...chapter, id: chapterId, bookId, verses };
  });
  return { ...book, id: bookId, chapters };
});

export const CHAPTERS: IndexedChapter[] = BOOKS.flatMap((book) => book.chapters);
export const VERSES: IndexedVerse[] = CHAPTERS.flatMap((chapter) => chapter.verses);

export const BOOK_BY_SLUG = new Map(BOOKS.map((book) => [book.slug, book]));
export const BOOK_BY_ID = new Map(BOOKS.map((book) => [book.id, book]));
export const CHAPTER_BY_SLUG = new Map(CHAPTERS.map((chapter) => [chapter.slug, chapter]));
export const CHAPTER_BY_ID = new Map(CHAPTERS.map((chapter) => [chapter.id, chapter]));
export const VERSE_BY_ID = new Map(VERSES.map((verse) => [verse.id, verse]));

export const QUOTES: QuoteCard[] = CURATED_QUOTES.map((quote, index) => ({
  id: `q${index + 1}`,
  text: quote.text,
  author: quote.author,
  attribution: quote.attribution,
}));

export function bookSummary(book: IndexedBook): BookSummary {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    author: book.author,
    description: book.description,
    sourceUrl: book.sourceUrl,
    motif: book.motif,
    tone: book.tone,
    chapterCount: book.chapters.length,
    freeChapterCount: book.chapters.filter((chapter) => chapter.access === "free").length,
  };
}

export function chapterSummary(chapter: IndexedChapter): ChapterSummary {
  return {
    id: chapter.id,
    slug: chapter.slug,
    title: chapter.title,
    number: chapter.number,
    accessType: chapter.access,
    verseCount: chapter.verses.length,
    readCount: 0,
  };
}

export function bookDetail(book: IndexedBook): BookDetail {
  return { ...bookSummary(book), chapters: book.chapters.map(chapterSummary) };
}

export function chapterRead(chapter: IndexedChapter): ChapterRead {
  const book = BOOK_BY_ID.get(chapter.bookId);
  if (!book) throw new Error(`Missing book for chapter ${chapter.slug}`);
  const index = book.chapters.findIndex((entry) => entry.id === chapter.id);
  const verses: Verse[] = chapter.verses.map(({ id, number, text }) => ({ id, number, text }));
  return {
    book: bookSummary(book),
    chapter: chapterSummary(chapter),
    prevSlug: index > 0 ? book.chapters[index - 1].slug : null,
    nextSlug: index < book.chapters.length - 1 ? book.chapters[index + 1].slug : null,
    verses,
  };
}

/** Search books, verses and quotes in memory. */
export function searchCatalog(rawTerm: string): SearchHit[] {
  const term = rawTerm.trim().toLowerCase();
  if (!term) return [];
  const hits: SearchHit[] = [];

  for (const book of BOOKS) {
    const haystack = `${book.title} ${book.author} ${book.description}`.toLowerCase();
    if (!haystack.includes(term)) continue;
    hits.push({
      kind: "book",
      id: book.id,
      title: book.title,
      snippet: book.description,
      href: `/books/${book.slug}`,
      meta: book.author,
    });
    if (hits.length >= 8) break;
  }

  for (const verse of VERSES) {
    if (!verse.text.toLowerCase().includes(term)) continue;
    const chapter = CHAPTER_BY_ID.get(verse.chapterId);
    const book = chapter ? BOOK_BY_ID.get(chapter.bookId) : undefined;
    if (!chapter || !book) continue;
    hits.push({
      kind: "verse",
      id: verse.id,
      title: `${book.title} · ${chapter.title}`,
      snippet: verse.text.slice(0, 220),
      href: `/read/${chapter.slug}/verses/${verse.number}`,
      meta: `Verse ${verse.number}`,
    });
    if (hits.filter((hit) => hit.kind === "verse").length >= 20) break;
  }

  for (const quote of QUOTES) {
    if (!`${quote.text} ${quote.author}`.toLowerCase().includes(term)) continue;
    hits.push({
      kind: "quote",
      id: Number(quote.id.slice(1)),
      title: quote.author,
      snippet: quote.text,
      href: "/quotes",
      meta: quote.attribution ?? "Quote",
    });
    if (hits.filter((hit) => hit.kind === "quote").length >= 8) break;
  }

  return hits;
}

export function randomQuote(): QuoteCard {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)] ?? QUOTES[0];
}
