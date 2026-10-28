import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  actionCodeSettings,
  appOrigin,
  isFirebaseConfigured,
  resolveFirebaseConfig,
} from "./config.ts";

const complete = {
  VITE_FIREBASE_API_KEY: "key",
  VITE_FIREBASE_AUTH_DOMAIN: "example.firebaseapp.com",
  VITE_FIREBASE_PROJECT_ID: "example",
  VITE_FIREBASE_STORAGE_BUCKET: "example.firebasestorage.app",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "123",
  VITE_FIREBASE_APP_ID: "1:123:web:abc",
};

describe("Firebase configuration", () => {
  it("reads and trims all six Vite variables", () => {
    assert.deepEqual(
      resolveFirebaseConfig({
        ...complete,
        VITE_FIREBASE_PROJECT_ID: "  example  ",
      }),
      {
        apiKey: "key",
        authDomain: "example.firebaseapp.com",
        projectId: "example",
        storageBucket: "example.firebasestorage.app",
        messagingSenderId: "123",
        appId: "1:123:web:abc",
      },
    );
  });

  it("reports missing values as unconfigured instead of using maintainer defaults", () => {
    const config = resolveFirebaseConfig({ VITE_FIREBASE_PROJECT_ID: "example" });
    assert.equal(config.projectId, "example");
    assert.equal(config.apiKey, "");
    assert.equal(isFirebaseConfigured(config), false);
  });

  it("is configured only when every required value is present", () => {
    assert.equal(isFirebaseConfigured(resolveFirebaseConfig(complete)), true);
    assert.equal(
      isFirebaseConfigured(resolveFirebaseConfig({ ...complete, VITE_FIREBASE_APP_ID: "" })),
      false,
    );
  });
});

describe("auth action links", () => {
  it("uses the configured public origin on the server", () => {
    assert.equal(appOrigin(), "http://localhost:8080");
    assert.deepEqual(actionCodeSettings("/reset-password"), {
      url: "http://localhost:8080/reset-password",
      handleCodeInApp: false,
    });
  });
});
