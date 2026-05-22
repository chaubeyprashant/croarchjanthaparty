# Cockroach Janta Party (React + Vite)

Youth movement website with:
- Firebase Authentication
- Firestore-backed donations/forum/admin data
- Route-level SEO + prerendered HTML for key routes
- Public Complaint & Corruption Reporting module

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

```bash
firebase deploy --only firestore:rules
```

## 4) Firebase Storage rules (complaint uploads)

Deploy upload rules from this repo:

```bash
firebase deploy --only storage
```
## 5) Run locally

```bash
npm run dev
```

## 6) Production build (with prerender)

```bash
npm run build
```

Prerendered output includes:
- `/`
- `/donate`
- `/community`
- `/complaints`
- `/complaints/new`
- `/complaints/heatmap`

## 7) Complaints module routes

- `/complaints` public issue feed with filters and support
- `/complaints/new` multi-step complaint wizard with media upload
- `/complaints/:id` complaint tracking timeline + comments + QR tracking
- `/complaints/heatmap` civic hotspot board
- `/admin/complaints` admin moderation console

## 8) Production validation checklist

- Verify authenticated user can submit complaint and gets a `CJP-YYYY-XXXXXX` reference ID.
- Verify anonymous complaint hides reporter identity in public feed/detail.
- Verify media upload succeeds and file links render in complaint detail.
- Verify admin can update complaint status and timeline updates immediately.
- Verify comments/support controls work and counters update.
- Re-run `npm run lint` and `npm run build` before deploying.
