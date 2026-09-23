# ATS Frontend

Applicant Tracking System frontend, built with Next.js. Uses EdgeStore for file uploads and Resend for email.

## Stack

Next.js, Tiptap editor, EdgeStore, Resend, Radix UI / NextUI.

## Getting Started

```bash
git clone https://github.com/dhruv-sanan/ATS-Frontend.git
cd ATS-Frontend
npm install
```

Create a `.env` file in the project root:

```
EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=
RESEND_API_KEY=
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — lint
