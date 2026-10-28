import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapFirebaseUser } from "./session.ts";

describe("Firebase user mapping", () => {
  it("normalizes a Firebase user", () => {
    const user = mapFirebaseUser({
      uid: "uid-1",
      displayName: "Ada",
      email: "ada@example.com",
      photoURL: null,
      emailVerified: true,
    } as never);
    assert.deepEqual(user, {
      id: "uid-1",
      displayName: "Ada",
      primaryEmail: "ada@example.com",
      profileImageUrl: null,
      emailVerified: true,
    });
  });

  it("returns null when there is no user", () => {
    assert.equal(mapFirebaseUser(null), null);
    assert.equal(mapFirebaseUser(undefined), null);
  });
});

describe("server auth snapshot", () => {
  it("starts pending with no user for deterministic SSR", async () => {
    const { getServerAuthState } = await import("./session.ts");
    assert.deepEqual(getServerAuthState(), { user: null, isPending: true });
  });
});
