# Cockroach Janta Party (React + Vite)

Youth movement website with:
- Firebase Authentication
- Firestore-backed donations/forum/admin data
- Route-level SEO + prerendered HTML for key routes

## 1) Install

```bash
npm install
```

## 2) Configure Firebase

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Set:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- optional: `VITE_ADMIN_EMAIL` (email to auto-assign admin role on first login/signup)

## 3) Firestore security rules

Deploy `firestore.rules` from this repo in Firebase console or CLI.

## 4) Run locally

```bash
npm run dev
```

## 5) Production build (with prerender)

```bash
npm run build
```

Prerendered output includes:
- `/`
- `/donate`
- `/community`
- `/admin` (noindex)
