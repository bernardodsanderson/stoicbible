import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getBook,
  getChapter,
  getVersePage,
  listBooks,
  listLibraryNav,
  listQuotes,
  randomQuote,
  searchContent,
} from "./api-catalog.ts";

describe("catalog API", () => {
  it("lists every book in catalog order", async () => {
    const books = await listBooks();
    assert.equal(books.length, 25);
    assert.equal(books[0].slug, "meditations");
    assert.equal(new Set(books.map((book) => book.id)).size, books.length);
  });

  it("returns a book and its chapters", () => {
    const book = getBook({ data: { slug: "meditations" } });
    assert.ok(book);
    assert.equal(book.slug, "meditations");
    assert.ok(book.chapters.length > 0);
    assert.equal(book.chapterCount, book.chapters.length);
  });

  it("returns null for an unknown book", () => {
    assert.equal(getBook({ data: { slug: "not-a-book" } }), null);
  });

  it("returns a chapter with navigation and verses", () => {
    const chapter = getChapter({ data: { slug: "meditations-book-1" } });
    assert.ok(chapter);
    assert.equal(chapter.book.slug, "meditations");
    assert.ok(chapter.verses.length > 0);
    assert.equal(chapter.verses[0].number, 1);
  });

  it("returns null for an unknown chapter", () => {
    assert.equal(getChapter({ data: { slug: "not-a-chapter" } }), null);
  });

  it("finds a verse page by chapter slug and verse number", () => {
    const page = getVersePage({ data: { slug: "meditations-book-1", verseNumber: 1 } });
    assert.ok(page);
    assert.equal(page.verse?.number, 1);
    assert.equal(page.chapter.chapter.slug, "meditations-book-1");
  });

  it("returns the chapter with a null verse when the number is out of range", () => {
    const page = getVersePage({ data: { slug: "meditations-book-1", verseNumber: 9999 } });
    assert.ok(page);
    assert.equal(page.verse, null);
  });

  it("returns null for a verse page with an unknown chapter", () => {
    assert.equal(getVersePage({ data: { slug: "not-a-chapter", verseNumber: 1 } }), null);
  });

  it("lists quotes and picks one of them", async () => {
    const quotes = await listQuotes();
    assert.equal(quotes.length, 30);
    const picked = await randomQuote();
    assert.ok(quotes.some((quote) => quote.id === picked.id));
  });

  it("searches through the public API", () => {
    assert.deepEqual(searchContent({ data: { q: "" } }), []);
    const hits = searchContent({ data: { q: "seneca" } });
    assert.ok(hits.length > 0);
    assert.ok(hits.some((hit) => hit.kind === "book" || hit.kind === "quote"));
  });

  it("returns the library navigation tree", async () => {
    const nav = await listLibraryNav();
    assert.equal(nav.length, 25);
    assert.ok(nav.every((book) => book.chapters.every((chapter) => chapter.slug.length > 0)));
  });
});
