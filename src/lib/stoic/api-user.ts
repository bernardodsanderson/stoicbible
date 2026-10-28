import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  type User,
} from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  increment,
  type CollectionReference,
  type DocumentData,
} from "firebase/firestore";
import { firebaseAuth, firestoreDb } from "@/lib/firebase/client";
import { RESERVED_USERNAMES, slugify, todayInTz } from "@/lib/utils";
import { BOOKS, CHAPTER_BY_ID, VERSE_BY_ID, bookSummary, randomQuote } from "./catalog-index";
import {
  mapBookmarkDoc,
  mapChapterReadDoc,
  mapHighlightDoc,
  mapJournalDoc,
  mapProfileDoc,
  mapUserQuoteDoc,
  toIso,
  type BookmarkDoc,
  type ChapterReadDoc,
  type HighlightDoc,
  type JournalDoc,
  type ProfileDoc,
  type UserQuoteDoc,
} from "./map";
import type {
  BookmarkCard,
  HighlightCard,
  HighlightColor,
  JournalCard,
  Profile,
  Streaks,
} from "./types";

/**
 * Per-user data API backed by Firestore.
 *
 * These are plain browser functions: the signed-in Firebase user's ID token is
 * attached by the SDK, and `firestore.rules` restricts every `users/{uid}`
 * document and subcollection to its owner. The previous `{ data }` call shape
 * is kept so components did not need to change.
 */

type SessionUser = User;

const db = () => firestoreDb();

function currentUser(): SessionUser {
  const user = firebaseAuth().currentUser;
  if (!user) throw new Error("Unauthorized");
  return user;
}

function userRef(userId: string) {
  return doc(db(), "users", userId);
}

function userCollection(userId: string, name: string) {
  return collection(db(), "users", userId, name);
}

function nameFromEmail(email: string | null): string {
  const local = email?.split("@")[0]?.split("+")[0]?.trim();
  return local || "reader";
}

function isTakenUsernameError(err: unknown): boolean {
  return err instanceof Error && err.message === "username-taken";
}

/** Default profile document written on first sign-in. */
function profilePayload(username: string, user: SessionUser): ProfileDoc {
  return {
    username,
    displayName: user.displayName ?? null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    theme: "default",
    highlightColor: "yellow",
    reminderMorning: false,
    reminderAfternoon: false,
    reminderEvening: false,
    reminderQuote: false,
    readerFont: "serif",
    readerSize: "md",
    showVerseNumbers: true,
    createdAt: Timestamp.now(),
    checkinCount: 0,
    readingCount: 0,
    journalingCount: 0,
    lastCheckin: null,
    lastReading: null,
    lastJournaling: null,
  };
}

async function createProfile(user: SessionUser): Promise<Profile> {
  const base = slugify(user.displayName || nameFromEmail(user.email) || "reader");
  const preferred = RESERVED_USERNAMES.has(base) ? `${base}reader` : base;

  for (let attempt = 0; attempt < 60; attempt += 1) {
    const candidate = attempt === 0 ? preferred : `${preferred}${attempt + 1}`;
    try {
      return await runTransaction(db(), async (tx) => {
        const existing = await tx.get(userRef(user.uid));
        if (existing.exists()) {
          return mapProfileDoc(user.uid, existing.data() as ProfileDoc, user.email);
        }
        const nameRef = doc(db(), "usernames", candidate);
        const nameSnap = await tx.get(nameRef);
        if (nameSnap.exists()) throw new Error("username-taken");

        const payload = profilePayload(candidate, user);
        tx.set(userRef(user.uid), payload);
        tx.set(nameRef, { uid: user.uid, createdAt: Timestamp.now() });
        tx.set(doc(db(), "publicProfiles", user.uid), {
          username: candidate,
          displayName: user.displayName ?? null,
          createdAt: Timestamp.now(),
        });
        return mapProfileDoc(user.uid, payload, user.email);
      });
    } catch (err) {
      if (isTakenUsernameError(err)) continue;
      const code = (err as { code?: string })?.code;
      // Two first-visit requests (e.g. home data and a check-in) can race to
      // create the same profile. If the other writer won, adopt its document.
      if (code === "already-exists" || code === "aborted" || code === "failed-precondition") {
        const snap = await getDoc(userRef(user.uid));
        if (snap.exists()) {
          return mapProfileDoc(user.uid, snap.data() as ProfileDoc, user.email);
        }
        continue;
      }
      throw err;
    }
  }
  throw new Error("Could not find an available username.");
}

export async function ensureMyProfile(): Promise<Profile> {
  const user = currentUser();
  const snap = await getDoc(userRef(user.uid));
  if (snap.exists()) {
    return mapProfileDoc(user.uid, snap.data() as ProfileDoc, user.email);
  }
  return createProfile(user);
}

export async function getMyProfile(): Promise<Profile> {
  return ensureMyProfile();
}

type UpdateProfileInput = {
  displayName?: string;
  username?: string;
  timezone?: string;
  theme?: "default" | "dark" | "dark2" | "dim";
  highlightColor?: HighlightColor;
  reminderMorning?: boolean;
  reminderAfternoon?: boolean;
  reminderEvening?: boolean;
  reminderQuote?: boolean;
  readerFont?: "serif" | "sans";
  readerSize?: "sm" | "md" | "lg" | "xl";
  showVerseNumbers?: boolean;
};

export async function updateMyProfile({ data }: { data: UpdateProfileInput }): Promise<Profile> {
  const user = currentUser();
  const current = await ensureMyProfile();

  const patch: Record<string, unknown> = {};
  if (data.displayName !== undefined) patch.displayName = data.displayName.trim() || null;
  if (data.timezone !== undefined) patch.timezone = data.timezone.trim() || "UTC";
  if (data.theme !== undefined) patch.theme = data.theme;
  if (data.highlightColor !== undefined) patch.highlightColor = data.highlightColor;
  if (data.reminderMorning !== undefined) patch.reminderMorning = data.reminderMorning;
  if (data.reminderAfternoon !== undefined) patch.reminderAfternoon = data.reminderAfternoon;
  if (data.reminderEvening !== undefined) patch.reminderEvening = data.reminderEvening;
  if (data.reminderQuote !== undefined) patch.reminderQuote = data.reminderQuote;
  if (data.readerFont !== undefined) patch.readerFont = data.readerFont;
  if (data.readerSize !== undefined) patch.readerSize = data.readerSize;
  if (data.showVerseNumbers !== undefined) patch.showVerseNumbers = data.showVerseNumbers;

  const nextUsername = data.username?.trim();
  if (nextUsername && nextUsername !== current.username) {
    if (!/^[a-z0-9_]{3,24}$/.test(nextUsername)) {
      throw new Error(
        "Username must be 3–24 characters: lowercase letters, numbers, or underscores.",
      );
    }
    if (RESERVED_USERNAMES.has(nextUsername)) throw new Error("That username is reserved.");

    await runTransaction(db(), async (tx) => {
      const nameRef = doc(db(), "usernames", nextUsername);
      const nameSnap = await tx.get(nameRef);
      if (nameSnap.exists() && nameSnap.data()?.uid !== user.uid) {
        throw new Error("That username is taken.");
      }
      tx.set(nameRef, { uid: user.uid, createdAt: Timestamp.now() });
      tx.delete(doc(db(), "usernames", current.username));
      tx.update(userRef(user.uid), { ...patch, username: nextUsername });
      tx.set(
        doc(db(), "publicProfiles", user.uid),
        {
          username: nextUsername,
          displayName: patch.displayName !== undefined ? patch.displayName : current.displayName,
        },
        { merge: true },
      );
    });
  } else if (Object.keys(patch).length > 0) {
    await updateDoc(userRef(user.uid), patch);
    if (patch.displayName !== undefined) {
      await setDoc(
        doc(db(), "publicProfiles", user.uid),
        { displayName: patch.displayName },
        { merge: true },
      );
    }
  }

  return ensureMyProfile();
}

async function deleteCollection(col: CollectionReference<DocumentData>): Promise<void> {
  const snap = await getDocs(col);
  let batch = writeBatch(db());
  let pending = 0;
  for (const entry of snap.docs) {
    batch.delete(entry.ref);
    pending += 1;
    if (pending === 400) {
      await batch.commit();
      batch = writeBatch(db());
      pending = 0;
    }
  }
  if (pending > 0) await batch.commit();
}

/** Delete the user's data, then the Firebase Auth account. */
export async function deleteMyAccount({
  data,
}: {
  data: { email: string; password: string };
}): Promise<{ ok: true }> {
  const user = currentUser();
  if (!user.email) throw new Error("This account has no email address.");
  if (user.email.toLowerCase() !== data.email.trim().toLowerCase()) {
    throw new Error("Email does not match this account.");
  }
  if (!data.password) throw new Error("Enter your password to delete your account.");

  try {
    await reauthenticateWithCredential(
      user,
      EmailAuthProvider.credential(user.email, data.password),
    );
  } catch {
    throw new Error("Password is incorrect.");
  }

  const profileSnap = await getDoc(userRef(user.uid));
  const username = profileSnap.exists() ? (profileSnap.data() as ProfileDoc).username : null;

  for (const name of ["journals", "highlights", "bookmarks", "quotes", "chapterReads"]) {
    await deleteCollection(userCollection(user.uid, name));
  }

  const cleanup = writeBatch(db());
  cleanup.delete(userRef(user.uid));
  cleanup.delete(doc(db(), "publicProfiles", user.uid));
  if (username) cleanup.delete(doc(db(), "usernames", username));
  await cleanup.commit();

  await deleteUser(user);
  return { ok: true };
}

type PublicProfile = { username: string; displayName: string | null; createdAt: string };

async function publicProfileByUsername(
  username: string,
): Promise<(PublicProfile & { uid: string }) | null> {
  const snap = await getDocs(
    query(collection(db(), "publicProfiles"), where("username", "==", username), limit(1)),
  );
  const entry = snap.docs[0];
  if (!entry) return null;
  const data = entry.data();
  return {
    uid: entry.id,
    username: String(data.username ?? username),
    displayName: (data.displayName as string | null) ?? null,
    createdAt: toIso(data.createdAt),
  };
}

export async function getPublicProfile({
  data,
}: {
  data: { username: string };
}): Promise<PublicProfile | null> {
  const found = await publicProfileByUsername(data.username);
  if (!found) return null;
  return { username: found.username, displayName: found.displayName, createdAt: found.createdAt };
}

function yesterday(today: string): string {
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

async function bumpStreak(
  userId: string,
  kind: "checkin" | "reading" | "journaling",
  timezone: string,
): Promise<Streaks> {
  const today = todayInTz(timezone);
  return runTransaction(db(), async (tx) => {
    const ref = userRef(userId);
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Profile not found.");
    const data = snap.data() as ProfileDoc;
    const counts: Streaks = {
      checkinCount: data.checkinCount ?? 0,
      readingCount: data.readingCount ?? 0,
      journalingCount: data.journalingCount ?? 0,
    };
    const last =
      kind === "checkin"
        ? data.lastCheckin
        : kind === "reading"
          ? data.lastReading
          : data.lastJournaling;
    if (last === today) return counts;

    const previous =
      kind === "checkin"
        ? counts.checkinCount
        : kind === "reading"
          ? counts.readingCount
          : counts.journalingCount;
    const next = last === yesterday(today) ? previous + 1 : 1;
    if (kind === "checkin") counts.checkinCount = next;
    else if (kind === "reading") counts.readingCount = next;
    else counts.journalingCount = next;

    tx.update(ref, {
      ...(kind === "checkin" ? { checkinCount: next, lastCheckin: today } : {}),
      ...(kind === "reading" ? { readingCount: next, lastReading: today } : {}),
      ...(kind === "journaling" ? { journalingCount: next, lastJournaling: today } : {}),
    });
    return counts;
  });
}

export async function markChapterRead({ data }: { data: { chapterId: number } }): Promise<Streaks> {
  const user = currentUser();
  const profile = await ensureMyProfile();
  const chapter = CHAPTER_BY_ID.get(data.chapterId);
  const book = chapter ? BOOKS.find((entry) => entry.id === chapter.bookId) : undefined;

  await setDoc(
    doc(userCollection(user.uid, "chapterReads"), String(data.chapterId)),
    {
      chapterId: data.chapterId,
      slug: chapter?.slug ?? "",
      bookSlug: book?.slug ?? "",
      readCount: increment(1),
      lastReadAt: Timestamp.now(),
    },
    { merge: true },
  );
  return bumpStreak(user.uid, "reading", profile.timezone);
}

export async function listMyChapterReads() {
  const user = currentUser();
  const snap = await getDocs(userCollection(user.uid, "chapterReads"));
  return snap.docs.map((entry) => mapChapterReadDoc(entry.id, entry.data() as ChapterReadDoc));
}

export async function getHomeData() {
  const user = currentUser();
  const profile = await ensureMyProfile();
  const streaks = await bumpStreak(user.uid, "checkin", profile.timezone);

  const [journalsSnap, highlightsSnap] = await Promise.all([
    getDocs(query(userCollection(user.uid, "journals"), orderBy("updatedAt", "desc"), limit(2))),
    getDocs(query(userCollection(user.uid, "highlights"), orderBy("createdAt", "desc"), limit(2))),
  ]);

  const journals: JournalCard[] = journalsSnap.docs.map((entry) =>
    mapJournalDoc(entry.id, entry.data() as JournalDoc),
  );
  const highlights: HighlightCard[] = highlightsSnap.docs.map((entry) =>
    mapHighlightDoc(entry.id, entry.data() as HighlightDoc),
  );
  const frequent = BOOKS.filter((book) =>
    ["meditations", "letters-from-a-stoic-vol-1", "enchiridion"].includes(book.slug),
  ).map(bookSummary);

  return {
    profile,
    streaks,
    journals,
    highlights,
    frequent,
    quote: randomQuote(),
  };
}

async function findJournalDoc(userId: string, slug: string) {
  const snap = await getDocs(
    query(userCollection(userId, "journals"), where("slug", "==", slug), limit(1)),
  );
  return snap.docs[0] ?? null;
}

export async function listMyJournals(): Promise<JournalCard[]> {
  const user = currentUser();
  const snap = await getDocs(
    query(userCollection(user.uid, "journals"), orderBy("updatedAt", "desc")),
  );
  return snap.docs.map((entry) => mapJournalDoc(entry.id, entry.data() as JournalDoc));
}

export async function getJournal({
  data,
}: {
  data: { username?: string; slug: string };
}): Promise<JournalCard | null> {
  const user = currentUser();
  let ownerId = user.uid;
  if (data.username) {
    const found = await publicProfileByUsername(data.username);
    if (!found || found.uid !== user.uid) return null;
    ownerId = found.uid;
  }
  const entry = await findJournalDoc(ownerId, data.slug);
  return entry ? mapJournalDoc(entry.id, entry.data() as JournalDoc) : null;
}

type SaveJournalInput = {
  slug?: string;
  title: string | null;
  body: string;
  quoteText?: string | null;
  quoteAuthor?: string | null;
  verseId?: number | null;
};

export async function saveJournal({ data }: { data: SaveJournalInput }): Promise<JournalCard> {
  const user = currentUser();
  const profile = await ensureMyProfile();

  if (!data.slug) {
    const ref = doc(userCollection(user.uid, "journals"));
    const now = Timestamp.now();
    const payload: JournalDoc = {
      slug: `${slugify(data.title || "", "journal")}-${Date.now().toString(36)}`,
      title: data.title,
      body: data.body,
      isPublic: false,
      quoteText: data.quoteText ?? null,
      quoteAuthor: data.quoteAuthor ?? null,
      verseId: data.verseId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(ref, payload);
    await bumpStreak(user.uid, "journaling", profile.timezone);
    return mapJournalDoc(ref.id, payload);
  }

  const entry = await findJournalDoc(user.uid, data.slug);
  if (!entry) throw new Error("Journal not found.");
  const updates = {
    title: data.title,
    body: data.body,
    isPublic: false,
    quoteText: data.quoteText ?? null,
    quoteAuthor: data.quoteAuthor ?? null,
    verseId: data.verseId ?? null,
    updatedAt: Timestamp.now(),
  };
  await updateDoc(entry.ref, updates);
  await bumpStreak(user.uid, "journaling", profile.timezone);
  const fresh = await getDoc(entry.ref);
  return mapJournalDoc(fresh.id, fresh.data() as JournalDoc);
}

export async function deleteJournal({ data }: { data: { slug: string } }): Promise<{ ok: true }> {
  const user = currentUser();
  const entry = await findJournalDoc(user.uid, data.slug);
  if (entry) await deleteDoc(entry.ref);
  return { ok: true };
}

export async function listMyHighlights(): Promise<HighlightCard[]> {
  const user = currentUser();
  const snap = await getDocs(
    query(userCollection(user.uid, "highlights"), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((entry) => mapHighlightDoc(entry.id, entry.data() as HighlightDoc));
}

type HighlightInput = {
  verseId: number;
  chapterId: number;
  bookId: number;
  text: string;
  color: HighlightColor;
  note?: string | null;
};

export async function createHighlight({ data }: { data: HighlightInput }): Promise<{ id: string }> {
  const user = currentUser();
  const verse = VERSE_BY_ID.get(data.verseId);
  const chapter = CHAPTER_BY_ID.get(data.chapterId);
  const book = BOOKS.find((entry) => entry.id === data.bookId);
  const payload = {
    verseId: data.verseId,
    verseNumber: verse?.number ?? 0,
    chapterId: data.chapterId,
    chapterSlug: chapter?.slug ?? "",
    chapterTitle: chapter?.title ?? "",
    chapterNumber: chapter?.number ?? 0,
    bookId: data.bookId,
    bookTitle: book?.title ?? "",
    bookSlug: book?.slug ?? "",
    text: data.text,
    color: data.color,
    note: data.note ?? null,
    createdAt: Timestamp.now(),
  };
  const ref = await addDoc(userCollection(user.uid, "highlights"), payload);
  return { id: ref.id };
}

export async function deleteHighlight({ data }: { data: { id: string } }): Promise<{ ok: true }> {
  const user = currentUser();
  await deleteDoc(doc(userCollection(user.uid, "highlights"), data.id));
  return { ok: true };
}

export async function listMyBookmarks(): Promise<BookmarkCard[]> {
  const user = currentUser();
  const snap = await getDocs(
    query(userCollection(user.uid, "bookmarks"), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((entry) => mapBookmarkDoc(entry.id, entry.data() as BookmarkDoc));
}

export async function toggleBookmark({
  data,
}: {
  data: { verseId: number; chapterId: number; bookId: number };
}): Promise<{ bookmarked: boolean }> {
  const user = currentUser();
  const ref = doc(userCollection(user.uid, "bookmarks"), String(data.verseId));
  const existing = await getDoc(ref);
  if (existing.exists()) {
    await deleteDoc(ref);
    return { bookmarked: false };
  }

  const verse = VERSE_BY_ID.get(data.verseId);
  const chapter = CHAPTER_BY_ID.get(data.chapterId);
  const book = BOOKS.find((entry) => entry.id === data.bookId);
  await setDoc(ref, {
    verseId: data.verseId,
    verseNumber: verse?.number ?? 0,
    verseText: verse?.text ?? "",
    chapterId: data.chapterId,
    chapterSlug: chapter?.slug ?? "",
    chapterTitle: chapter?.title ?? "",
    chapterNumber: chapter?.number ?? 0,
    bookId: data.bookId,
    bookTitle: book?.title ?? "",
    bookSlug: book?.slug ?? "",
    createdAt: Timestamp.now(),
  });
  return { bookmarked: true };
}

export async function chapterHighlights({ data }: { data: { chapterId: number } }) {
  const user = currentUser();
  const snap = await getDocs(
    query(userCollection(user.uid, "highlights"), where("chapterId", "==", data.chapterId)),
  );
  return snap.docs.map((entry) => mapHighlightDoc(entry.id, entry.data() as HighlightDoc));
}

export async function chapterBookmarks({ data }: { data: { chapterId: number } }) {
  const user = currentUser();
  const snap = await getDocs(
    query(userCollection(user.uid, "bookmarks"), where("chapterId", "==", data.chapterId)),
  );
  return snap.docs.map((entry) => ({ verseId: (entry.data() as BookmarkDoc).verseId }));
}

type UserQuoteInput = {
  text: string;
  author?: string | null;
  bookId?: number | null;
  verseId?: number | null;
  thought?: string | null;
};

export async function saveUserQuote({ data }: { data: UserQuoteInput }): Promise<{ id: string }> {
  const user = currentUser();
  const ref = await addDoc(userCollection(user.uid, "quotes"), {
    text: data.text,
    author: data.author ?? null,
    bookId: data.bookId ?? null,
    verseId: data.verseId ?? null,
    thought: data.thought ?? null,
    createdAt: Timestamp.now(),
  });
  return { id: ref.id };
}

export async function listMyQuotes() {
  const user = currentUser();
  const snap = await getDocs(
    query(userCollection(user.uid, "quotes"), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((entry) => mapUserQuoteDoc(entry.id, entry.data() as UserQuoteDoc));
}

export async function deleteMyQuote({ data }: { data: { id: string } }): Promise<{ ok: true }> {
  const user = currentUser();
  await deleteDoc(doc(userCollection(user.uid, "quotes"), data.id));
  return { ok: true };
}

export async function submitFeedback({
  data,
}: {
  data: { name?: string; email?: string; message: string };
}): Promise<{ ok: true }> {
  const user = firebaseAuth().currentUser;
  await addDoc(collection(db(), "feedback"), {
    userId: user?.uid ?? null,
    name: data.name ?? null,
    email: data.email || null,
    message: data.message,
    createdAt: Timestamp.now(),
  });
  return { ok: true };
}
