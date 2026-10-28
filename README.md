# Stoic Bible

[![CI](https://github.com/bernardodsanderson/stoicbible/actions/workflows/ci.yml/badge.svg)](https://github.com/bernardodsanderson/stoicbible/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Stoic reading library and journaling app. Read public-domain Stoic texts,
highlight and bookmark passages, and keep private journals with streaks and
reading progress.

**Live demo:** https://stoicbible-714.netlify.app

![Stoic Bible landing page](docs/screenshot.png)

The demo uses the maintainer's Firebase project. Run your own Firebase project
for development so your test data stays separate.

## Features

- A bundled catalog of 25 public-domain works, 92 chapters, 355 verses, and 30
  curated quotes
- Reader with verse navigation, highlights, bookmarks, and font controls
- Private journals, saved quotes, reading progress, and daily streaks
- Search across books, verses, and quotes
- Email/password authentication with persistent sessions
- Email verification and password-reset flows
- Installable PWA with offline reading for saved chapters
- Responsive layout with a mobile tab bar and accessible controls

There is no paid membership and no social login.

## Stack

| Concern  | Implementation                                    |
| -------- | ------------------------------------------------- |
| App      | TanStack Start, React 19, Vite                    |
| Hosting  | Netlify (`@netlify/vite-plugin-tanstack-start`)   |
| Auth     | Firebase Authentication, email + password         |
| Database | Cloud Firestore (browser SDK, owner-scoped rules) |
| Catalog  | Static TypeScript data compiled into the app      |
| Styling  | Tailwind CSS v4 + Radix primitives                |
| Tests    | Node test runner + `tsx`                          |

The catalog is static, so browsing and search do not consume Firestore reads.
Only per-user data is stored in Firebase.

## Getting started

Requirements: Node.js 22+ and npm.

```bash
git clone https://github.com/bernardodsanderson/stoicbible.git
cd stoicbible
npm ci
cp .env.example .env
```

Create a Firebase project and a web app, then fill in the six
`VITE_FIREBASE_*` values in `.env`:

1. Enable **Authentication → Sign-in method → Email/Password**.
2. Create a **Cloud Firestore** database in Native mode.
3. Deploy the rules:
   ```bash
   npx firebase-tools deploy --only firestore:rules --project <your-project-id>
   ```
4. Add `localhost` and `127.0.0.1` (and any deployed host) under
   **Authentication → Settings → Authorized domains**.

Then start the app:

```bash
npm run dev
# http://localhost:8080 (set PORT to use another port)
```

The public catalog still renders without Firebase; sign-in and per-user data
require the configuration above.

> New Firebase projects may need Identity Platform enabled and a billing account
> linked before email/password Authentication can be used. Review current
> Firebase pricing for your own project.

## Environment variables

All Firebase values are public web-app identifiers, not secrets. They are read
at build time and must be present in the Netlify build environment as well as in
local `.env` when building locally.

| Variable                            | Required | Purpose                                        |
| ----------------------------------- | -------- | ---------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | yes      | Firebase web API key                           |
| `VITE_FIREBASE_AUTH_DOMAIN`         | yes      | Firebase Auth domain                           |
| `VITE_FIREBASE_PROJECT_ID`          | yes      | Firebase project ID                            |
| `VITE_FIREBASE_STORAGE_BUCKET`      | yes      | Firebase storage bucket                        |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | yes      | Firebase sender ID                             |
| `VITE_FIREBASE_APP_ID`              | yes      | Firebase web app ID                            |
| `VITE_PUBLIC_SITE_URL`              | no       | Absolute origin for server-side auth fallbacks |

See [.env.example](.env.example).

## Architecture

```text
src/
  components/          UI, reader, journals, PWA shell
  lib/auth/            Firebase session store and route gates
  lib/firebase/        Firebase app/auth/Firestore singletons and config
  lib/stoic/           static catalog, API adapters, Firestore mappers
  routes/              TanStack Router file routes
  styles.css           Tailwind entry and design tokens
firestore.rules        owner-scoped Firestore access
firebase.json          Firebase CLI rules/index configuration
netlify.toml           Netlify build and publish settings
```

Firestore layout:

```text
users/{uid}                     profile, preferences, streak counters
users/{uid}/journals/{id}       private journals
users/{uid}/highlights/{id}     highlights
users/{uid}/bookmarks/{verseId} bookmarks
users/{uid}/quotes/{id}         saved quotes
users/{uid}/chapterReads/{id}   reading progress
usernames/{username}            { uid } reservation for unique usernames
publicProfiles/{uid}            username + display name for /{username}
feedback/{id}                   contact form submissions (write-only)
```

All private data is read and written from the browser with the signed-in
Firebase ID token. Firestore rules allow only the owner to access
`users/{uid}` and its subcollections. There is no service-account key in the
app and no server-side database credential.

## Tests and checks

```bash
npm run typecheck    # tsc --noEmit
npm test             # unit tests
npm run lint         # ESLint
npm run build        # production build
npm run format:check # Prettier
```

Tests cover the static catalog invariants and search caps, catalog API shapes,
Firestore document mapping, auth gate state, weekly action content, helpers, and
Firebase configuration resolution.

## Deployment

The included Netlify configuration builds with `npm run build`, publishes
`dist/client`, and bundles the SSR function through the Netlify Vite plugin.

1. Create a Netlify site from this repository.
2. Add the six `VITE_FIREBASE_*` variables in **Site configuration →
   Environment variables**.
3. Set `NODE_VERSION=22` if the build image does not pick up `.nvmrc`.
4. Add the Netlify domain to Firebase Auth's authorized domains.
5. Deploy. Every environment change requires a redeploy because Vite inlines
   these values at build time.

For a custom domain, add it to Netlify and to Firebase Auth's authorized
domains before relying on verification or reset links.

### Email delivery

Firebase Auth sends verification and password-reset emails using the project's
templates. Customize the templates and sender in **Authentication → Templates**
and review Firebase's per-project email rate limits before launch.

### Netlify HTML injection

Netlify adds a hosting-facts HTML comment (and whitespace) to served documents.
React hydration compares the head tree, so `src/routes/__root.tsx` removes those
injected nodes before hydration. If Netlify stops injecting them, the cleanup is
a harmless no-op.

## Security

- The Firebase web configuration is public by design; Firestore rules are the
  security boundary.
- Private journals are not published. Share cards are generated locally as
  images.
- Account deletion requires the current password, removes the user's Firestore
  data, then deletes the Firebase Auth account.
- Do not open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md).

## Content and license

The **code** is released under the [MIT License](LICENSE). Reading texts are
public-domain works; see [CONTENT.md](CONTENT.md) for source and attribution
guidance. The project is not affiliated with Firebase, Netlify, or Google.

## Contributing

Bug reports, fixes, and focused improvements are welcome. Please read
[CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md) first.
