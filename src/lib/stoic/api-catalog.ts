import {
  bookDetail,
  bookSummary,
  BOOKS,
  BOOK_BY_SLUG,
  CHAPTER_BY_SLUG,
  chapterRead,
  QUOTES,
  randomQuote as pickRandomQuote,
  searchCatalog,
} from "./catalog-index";
import type { BookDetail, BookSummary, ChapterRead, QuoteCard, SearchHit, Verse } from "./types";

/**
 * Public catalog API. All content is static (shipped with the app), so these
 * functions are synchronous and work during SSR without Firebase.
 */

export async function listBooks(): Promise<BookSummary[]> {
  return BOOKS.map(bookSummary);
}

export function getBook({ data }: { data: { slug: string } }): BookDetail | null {
  const book = BOOK_BY_SLUG.get(data.slug);
  return book ? bookDetail(book) : null;
}

export function getChapter({ data }: { data: { slug: string } }): ChapterRead | null {
  const chapter = CHAPTER_BY_SLUG.get(data.slug);
  return chapter ? chapterRead(chapter) : null;
}

export function getVersePage({
  data,
}: {
  data: { slug: string; verseNumber: number };
}): { chapter: ChapterRead; verse: Verse | null } | null {
  const chapter = CHAPTER_BY_SLUG.get(data.slug);
  if (!chapter) return null;
  const read = chapterRead(chapter);
  return {
    chapter: read,
    verse: read.verses.find((verse) => verse.number === data.verseNumber) ?? null,
  };
}

export async function listQuotes(): Promise<QuoteCard[]> {
  return QUOTES;
}

export async function randomQuote(): Promise<QuoteCard> {
  return pickRandomQuote();
}

export function searchContent({ data }: { data: { q: string } }): SearchHit[] {
  return searchCatalog(data.q);
}

export async function listLibraryNav() {
  return BOOKS.map((book) => ({
    ...bookSummary(book),
    chapters: book.chapters.map((chapter) => ({
      slug: chapter.slug,
      title: chapter.title,
      number: chapter.number,
    })),
  }));
}

export type { BookDetail, ChapterRead, QuoteCard, SearchHit };
