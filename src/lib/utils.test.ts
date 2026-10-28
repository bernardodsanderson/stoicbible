import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { RESERVED_USERNAMES, relativeTime, slugify, todayInTz } from "./utils.ts";

describe("string helpers", () => {
  it("slugifies titles without accents or punctuation", () => {
    assert.equal(slugify("The Enchiridion!"), "theenchiridion");
    assert.equal(slugify("Café — Déjà vu"), "cafedejavu");
    assert.equal(slugify(""), "stoic");
    assert.equal(slugify("!!!", "journal"), "journal");
    assert.equal(slugify("a".repeat(50)).length, 20);
  });

  it("formats dates in a requested timezone", () => {
    assert.match(todayInTz("UTC"), /^\d{4}-\d{2}-\d{2}$/);
    assert.match(todayInTz("America/Chicago"), /^\d{4}-\d{2}-\d{2}$/);
    assert.match(todayInTz("Not/ARealZone"), /^\d{4}-\d{2}-\d{2}$/);
  });

  it("formats relative times across the common ranges", () => {
    const now = Date.now();
    assert.equal(relativeTime(new Date(now - 10_000)), "just now");
    assert.equal(relativeTime(new Date(now - 2 * 60_000)), "2 minutes ago");
    assert.equal(relativeTime(new Date(now - 60 * 60_000)), "1 hour ago");
    assert.equal(relativeTime(new Date(now - 25 * 60 * 60_000)), "yesterday");
    assert.equal(relativeTime(new Date(now - 10 * 24 * 60 * 60_000)), "10 days ago");
    assert.equal(relativeTime(new Date(now - 60 * 24 * 60 * 60_000)), "2 months ago");
    assert.equal(relativeTime(new Date(now - 400 * 24 * 60 * 60_000)), "1 year ago");
  });

  it("keeps route names reserved", () => {
    for (const name of ["admin", "api", "login", "signup", "privacy", "terms"]) {
      assert.ok(RESERVED_USERNAMES.has(name));
    }
    assert.equal(RESERVED_USERNAMES.has("reader"), false);
  });
});
