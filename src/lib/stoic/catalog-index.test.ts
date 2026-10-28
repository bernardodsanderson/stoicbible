import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BOOKS,
  BOOK_BY_ID,
  BOOK_BY_SLUG,
  CHAPTERS,
  CHAPTER_BY_ID,
  CHAPTER_BY_SLUG,
  QUOTES,
  VERSES,
  VERSE_BY_ID,
  bookDetail,
  bookSummary,
  chapterRead,
  chapterSummary,
  randomQuote,
  searchCatalog,
} from "./catalog-index.ts";

describe("static catalog", () => {
  it("keeps the shipped catalog stable", () => {
    assert.equal(BOOKS.length, 25);
    assert.equal(CHAPTERS.length, 92);
    assert.equal(VERSES.length, 355);
    assert.equal(QUOTES.length, 30);
  });

  it("assigns deterministic, sequential book, chapter and verse IDs", () => {
    assert.deepEqual(
      BOOKS.map((book) => book.id),
      Array.from({ length: BOOKS.length }, (_, index) => index + 1),
    );
    assert.deepEqual(
      CHAPTERS.map((chapter) => chapter.id),
      Array.from({ length: CHAPTERS.length }, (_, index) => index + 1),
    );
    assert.deepEqual(
      VERSES.map((verse) => verse.id),
      Array.from({ length: VERSES.length }, (_, index) => index + 1),
    );
  });

  it("keeps slugs unique and all relationships resolvable", () => {
    const bookSlugs = new Set(BOOKS.map((book) => book.slug));
    const chapterSlugs = new Set(CHAPTERS.map((chapter) => chapter.slug));
    assert.equal(bookSlugs.size, BOOKS.length);
    assert.equal(chapterSlugs.size, CHAPTERS.length);

    for (const chapter of CHAPTERS) {
      assert.ok(BOOK_BY_ID.has(chapter.bookId), `missing book ${chapter.bookId}`);
      assert.ok(CHAPTER_BY_SLUG.get(chapter.slug) === chapter);
      for (const verse of chapter.verses) {
        assert.equal(verse.chapterId, chapter.id);
        assert.ok(VERSE_BY_ID.get(verse.id) === verse);
      }
    }
    for (const book of BOOKS) {
      assert.ok(BOOK_BY_SLUG.get(book.slug) === book);
      assert.ok(book.chapters.length > 0);
    }
  });

  it("builds summaries without leaking mutable catalog internals", () => {
    const book = BOOKS[0];
    const summary = bookSummary(book);
    assert.equal(summary.id, book.id);
    assert.equal(summary.chapterCount, book.chapters.length);
    assert.equal(
      summary.freeChapterCount,
      book.chapters.filter((chapter) => chapter.access === "free").length,
    );

    const detail = bookDetail(book);
    assert.equal(detail.chapters.length, book.chapters.length);
    assert.equal(detail.chapters[0].readCount, 0);

    const chapter = book.chapters[0];
    assert.equal(chapterSummary(chapter).verseCount, chapter.verses.length);
    assert.equal(chapterSummary(chapter).accessType, chapter.access);
  });

  it("returns prev/next chapter slugs in reading order", () => {
    const book = BOOKS.find((entry) => entry.chapters.length > 1);
    assert.ok(book);
    const first = chapterRead(book.chapters[0]);
    assert.equal(first.prevSlug, null);
    assert.equal(first.nextSlug, book.chapters[1].slug);

    const last = chapterRead(book.chapters.at(-1)!);
    assert.equal(last.prevSlug, book.chapters.at(-2)!.slug);
    assert.equal(last.nextSlug, null);

    assert.equal(first.verses[0].id, book.chapters[0].verses[0].id);
  });

  it("searches books, verses and quotes case-insensitively with caps", () => {
    assert.deepEqual(searchCatalog(""), []);
    assert.deepEqual(searchCatalog("   "), []);

    const meditations = searchCatalog("MEDITATIONS");
    assert.ok(meditations.some((hit) => hit.kind === "book" && hit.href === "/books/meditations"));

    const death = searchCatalog("death");
    assert.ok(death.some((hit) => hit.kind === "verse"));
    assert.ok(death.some((hit) => hit.kind === "quote"));

    const hits = searchCatalog("the");
    assert.ok(hits.filter((hit) => hit.kind === "book").length <= 8);
    assert.ok(hits.filter((hit) => hit.kind === "verse").length <= 20);
    assert.ok(hits.filter((hit) => hit.kind === "quote").length <= 8);

    for (const hit of hits) {
      assert.ok(hit.title.length > 0);
      assert.ok(hit.snippet.length <= 220);
      assert.match(hit.href, /^\//);
    }
  });

  it("uses string quote IDs and returns a quote", () => {
    assert.ok(QUOTES.every((quote) => /^q\d+$/.test(quote.id)));
    const quote = randomQuote();
    assert.ok(QUOTES.some((entry) => entry.id === quote.id));
  });

  it("can resolve every chapter by slug", () => {
    for (const chapter of CHAPTERS) {
      assert.ok(CHAPTER_BY_ID.get(chapter.id) === chapter);
      assert.ok(CHAPTER_BY_SLUG.get(chapter.slug) === chapter);
    }
  });
});
