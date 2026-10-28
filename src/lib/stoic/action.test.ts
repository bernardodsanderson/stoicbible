import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PATHS, REPS, currentWeekKey, repForWeek } from "./action.ts";
import { CHAPTER_BY_SLUG } from "./catalog-index.ts";

describe("weekly action paths", () => {
  it("only links to chapters that exist", () => {
    for (const path of PATHS) {
      assert.ok(path.id.length > 0);
      assert.ok(path.reads.length > 0);
      for (const read of path.reads) {
        assert.ok(CHAPTER_BY_SLUG.has(read.slug), `missing chapter ${read.slug}`);
      }
    }
    for (const rep of REPS) {
      assert.ok(CHAPTER_BY_SLUG.has(rep.read.slug), `missing chapter ${rep.read.slug}`);
    }
  });

  it("computes ISO week keys consistently", () => {
    assert.equal(currentWeekKey(new Date("2026-01-01T12:00:00Z")), "2026-W01");
    assert.equal(currentWeekKey(new Date("2026-01-05T12:00:00Z")), "2026-W02");
    assert.equal(currentWeekKey(new Date("2026-12-31T12:00:00Z")), "2026-W53");
  });

  it("chooses a repeatable weekly rep", () => {
    assert.equal(repForWeek("2026-W01"), REPS[0]);
    assert.equal(repForWeek("2026-W09"), REPS[0]);
    assert.equal(repForWeek("2026-W02"), REPS[1]);
    assert.equal(repForWeek("not-a-week"), REPS[0]);
  });
});
