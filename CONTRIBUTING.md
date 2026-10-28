# Contributing

Thanks for helping improve Stoic Bible. The project is a TanStack Start app with
Firebase Authentication and Cloud Firestore, deployed with Netlify.

## Development setup

Requirements: Node.js 22+ and npm.

```bash
git clone https://github.com/bernardodsanderson/stoicbible.git
cd stoicbible
npm ci
cp .env.example .env
# Fill in the six VITE_FIREBASE_* values from your own Firebase web app.
npm run dev
```

You need your own Firebase project for auth and per-user data:

1. Create a Firebase project and a web app.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create a **Firestore Native** database.
4. Deploy `firestore.rules`:
   ```bash
   npx firebase-tools deploy --only firestore:rules --project <your-project-id>
   ```
5. Add your local origin (`localhost`, `127.0.0.1`) and any deployed origin to
   **Authentication → Settings → Authorized domains**.

The public catalog works without Firebase; auth and journals require a
configured project.

## Checks

Run these before opening a pull request:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

`npm test` uses Node's test runner through `tsx` and discovers
`src/**/*.test.ts`. Add tests for behavior changes, especially catalog indexing,
Firestore document mapping, auth gates, and weekly action content.

## Pull requests

- Keep changes focused and explain the user-facing outcome.
- Do not commit `.env` files, service-account JSON, Firebase refresh tokens, or
  other credentials.
- Preserve the owner-only Firestore model; do not add client reads of another
  user's private collection.
- If you add reading content, add its public-domain source URL to the catalog
  entry and see [CONTENT.md](CONTENT.md).
- UI changes should work on mobile (390 px wide) and desktop.

## Reporting security issues

Please follow [SECURITY.md](SECURITY.md) instead of opening a public issue.
