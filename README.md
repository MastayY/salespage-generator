# AI Sales Page Generator

**Live Application:** _TBD_

**YouTube Video Explanation:** _TBD_

## Project Approach & Philosophy (The Why)

- **Framework choice:** I chose Next.js (App Router) over Laravel to leverage modern React paradigms, serverless deployment agility on Vercel, and a highly component-driven architecture that fits the tight delivery timeline.
- **Design approach:** The UI is intentionally dark-first and cinematic, inspired by Shopify’s visual system. Tailwind v4 and custom CSS variables enable precise control without heavy UI libraries, keeping performance fast and styling consistent.

## Tech Stack & Tools (The What)

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS v4 (custom tokens via CSS variables)
- **Authentication:** NextAuth.js (Google Provider, secure sessions)
- **Database & ORM:** PostgreSQL + Prisma
- **AI Engine:** Google Gemini 2.5 Flash API (structured JSON generation)
- **Media Storage:** Vercel Blob (image upload + optimization)

## System Logic & Architecture (The How)

1. Users authenticate via Google OAuth.
2. Users submit product details through a validated form (Zod + React Hook Form).
3. `/api/generate-page` builds a strict, schema-driven prompt and requests JSON from Gemini.
4. Inputs and structured output are persisted in PostgreSQL via Prisma.
5. The frontend renders the JSON into a high-fidelity, responsive sales page using the cinematic design system.

## Local Setup Instructions

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```
