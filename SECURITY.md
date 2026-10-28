# Security Policy

## Supported versions

Security fixes are applied to the `main` branch. There are no maintained release
branches.

## Reporting a vulnerability

Please do **not** open a public issue for a security problem.

Use GitHub's private vulnerability reporting:
**https://github.com/bernardodsanderson/stoicbible/security/advisories/new**

Include a description, reproduction steps, impact, and any suggested fix. Please
avoid accessing other users' data, disrupting the live demo, or running
destructive tests against the production Firebase project. A local Firebase
project with the same `firestore.rules` is the right place to test.

## Scope

The important security boundary in this app is `firestore.rules`. The Firebase
web configuration (API key, project ID, app ID) is public by design and is not a
secret. Reports about Firestore authorization, account deletion, auth-session
handling, or leaking another user's data are in scope.

Reports about third-party services (Firebase, Netlify, Google Fonts) should go to
those providers. Dependency-audit findings that only affect development tooling
are noted below.

## Dependency notes

`npm audit` currently reports advisories in transitive Firebase/Netlify
dependencies. The app does not ship a service-account key or database
connection string. Keep dependencies current and re-run `npm audit` when
upgrading Firebase or Netlify tooling.

## Disclosure

We aim to acknowledge reports within a few days and to coordinate a fix and
public disclosure with the reporter.
