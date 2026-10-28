import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mapBookmarkDoc,
  mapChapterReadDoc,
  mapHighlightDoc,
  mapJournalDoc,
  mapProfileDoc,
  mapUserQuoteDoc,
  toIso,
} from "./map.ts";

const ISO = "2026-10-27T12:00:00.000Z";

function timestamp(date: Date) {
  return { toDate: () => date };
}

describe("Firestore mappers", () => {
  it("normalizes strings, Dates and Firestore Timestamps to ISO strings", () => {
    assert.equal(toIso(ISO), ISO);
    assert.equal(toIso(new Date(ISO)), ISO);
    assert.equal(toIso(timestamp(new Date(ISO))), ISO);
    assert.equal(toIso(null, "fallback"), "fallback");
    assert.equal(toIso("", "fallback"), "fallback");
    assert.equal(
      toIso(
        {
          toDate: () => {
            throw new Error("bad");
          },
        },
        "fallback",
      ),
      "fallback",
    );
  });

  it("maps profile defaults without trusting malformed optional fields", () => {
    const profile = mapProfileDoc(
      "uid-1",
      {
        username: "reader",
        displayName: "  ",
        theme: "neon",
        highlightColor: "neon",
        readerFont: "comic",
        readerSize: "huge",
        showVerseNumbers: false,
        createdAt: ISO,
      },
      "reader@example.com",
    );

    assert.equal(profile.userId, "uid-1");
    assert.equal(profile.username, "reader");
    assert.equal(profile.displayName, null);
    assert.equal(profile.email, "reader@example.com");
    assert.equal(profile.timezone, "UTC");
    assert.equal(profile.theme, "neon");
    assert.equal(profile.highlightColor, "neon");
    assert.equal(profile.readerFont, "serif");
    assert.equal(profile.readerSize, "md");
    assert.equal(profile.showVerseNumbers, false);
    assert.equal(profile.createdAt, ISO);
    assert.equal(profile.reminderMorning, false);
  });

  it("honors valid profile preferences", () => {
    const profile = mapProfileDoc(
      "uid-2",
      {
        username: "reader2",
        displayName: "Ada",
        timezone: "America/Chicago",
        theme: "dark",
        highlightColor: "green",
        readerFont: "sans",
        readerSize: "lg",
        reminderMorning: true,
        reminderAfternoon: true,
        reminderEvening: true,
        reminderQuote: true,
      },
      null,
    );

    assert.equal(profile.displayName, "Ada");
    assert.equal(profile.timezone, "America/Chicago");
    assert.equal(profile.theme, "dark");
    assert.equal(profile.highlightColor, "green");
    assert.equal(profile.readerFont, "sans");
    assert.equal(profile.readerSize, "lg");
    assert.equal(profile.reminderMorning, true);
    assert.equal(profile.reminderAfternoon, true);
    assert.equal(profile.reminderEvening, true);
    assert.equal(profile.reminderQuote, true);
  });

  it("maps journals and fills optional fields with null", () => {
    const journal = mapJournalDoc("journal-1", {
      slug: "a-day",
      body: "A day.",
      createdAt: ISO,
      updatedAt: ISO,
    });
    assert.equal(journal.id, "journal-1");
    assert.equal(journal.slug, "a-day");
    assert.equal(journal.title, null);
    assert.equal(journal.isPublic, false);
    assert.equal(journal.quoteText, null);
    assert.equal(journal.quoteAuthor, null);
    assert.equal(journal.verseId, null);
    assert.equal(journal.createdAt, ISO);
    assert.equal(journal.updatedAt, ISO);
  });

  it("maps highlights with stable defaults", () => {
    const highlight = mapHighlightDoc("highlight-1", {
      text: "Memento mori",
      verseId: 12,
      chapterId: 3,
      bookId: 1,
    });
    assert.equal(highlight.id, "highlight-1");
    assert.equal(highlight.color, "yellow");
    assert.equal(highlight.note, null);
    assert.equal(highlight.verseNumber, 0);
    assert.equal(highlight.chapterSlug, "");
    assert.equal(highlight.chapterTitle, "");
    assert.equal(highlight.chapterNumber, 0);
    assert.equal(highlight.bookTitle, "");
    assert.equal(highlight.bookSlug, "");
  });

  it("maps bookmarks with stable defaults", () => {
    const bookmark = mapBookmarkDoc("12", { verseId: 12, chapterId: 3, bookId: 1 });
    assert.equal(bookmark.id, "12");
    assert.equal(bookmark.verseId, 12);
    assert.equal(bookmark.verseNumber, 0);
    assert.equal(bookmark.verseText, "");
    assert.equal(bookmark.chapterSlug, "");
  });

  it("maps user quotes and article metadata", () => {
    const quote = mapUserQuoteDoc("quote-1", { text: "Enough.", createdAt: ISO });
    assert.deepEqual(quote, {
      id: "quote-1",
      text: "Enough.",
      author: null,
      thought: null,
      createdAt: ISO,
    });
  });

  it("maps chapter reads and falls back to the document id", () => {
    const read = mapChapterReadDoc("42", { readCount: 2, lastReadAt: ISO });
    assert.equal(read.chapterId, 42);
    assert.equal(read.slug, "");
    assert.equal(read.bookSlug, "");
    assert.equal(read.readCount, 2);
    assert.equal(read.lastReadAt, ISO);
  });
});
