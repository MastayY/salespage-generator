# PROJECT CONTEXT: AI SALES PAGE GENERATOR (VIBE CODING MASTER PLAN)

## 1. Project Overview
You are an Expert Full-Stack Developer specializing in Next.js, Tailwind CSS, and AI Integration. [cite_start]We are building an "AI Sales Page Generator"[cite: 19, 20]. [cite_start]This web application transforms raw product/service information into a complete, structured, and visually appealing sales page with persuasive marketing copy[cite: 20].

**Critical Constraint:** The project is on an extremely tight deadline. You must prioritize efficiency, zero-error generation, and strictly follow the DRY (Don't Repeat Yourself) and KISS (Keep It Simple, Stupid) principles. No spaghetti code.

## 2. Tech Stack & Architecture
* **Framework:** Next.js (App Router, latest stable version).
* **Styling:** Tailwind CSS.
* **Authentication:** NextAuth.js (Google Social Auth provider). [cite_start]*Note: Overriding the original Laravel Auth requirement based on allowed technical flexibility.* [cite: 22, 63]
* **Database & ORM:** PostgreSQL (via Vercel Postgres or Supabase) with Prisma or Drizzle ORM.
* **AI Integration:** Google Gemini API.
* **Storage (Images):** Vercel Blob CDN (with automatic conversion to WebP and compression).
* **Design System:** Adhere strictly to the rules defined in `design.md` (to be provided).

## 3. Core Features & Requirements
The system must be fully modular and readable, fulfilling all primary and bonus requirements:

### A. Authentication & User Management
* [cite_start]Implement secure Login, Register, and Logout functionality using NextAuth (Google).
* Ensure protected routes for the dashboard and generation history.

### B. Product Input Form
* [cite_start]A structured, clean UI form capturing: Product/Service Name, Description, Key Features (multi-input), Target Audience, Price, and Unique Selling Points (USPs)[cite: 23].

### C. AI-Powered Sales Page Generation
* [cite_start]Integrate Gemini API to process form data into a structured layout[cite: 24].
* [cite_start]The output must include: Compelling Headline, Sub-headline, Product Description, Benefits Section, Features Breakdown, Social Proof Placeholder, Pricing Display, and a Clear CTA[cite: 24].
* [cite_start]**Crucial:** Output MUST be rendered as a styled, presentable page component, NOT raw text[cite: 25].

### D. Live Preview & Templates (Bonus Included)
* [cite_start]Display the generated page in a Live Preview mode resembling a real landing page[cite: 28].
* [cite_start]Provide 2-3 selectable design templates/styles for the generated page[cite: 31].

### E. Advanced AI Editing (Bonus Included)
* [cite_start]Implement section-by-section regeneration (e.g., user can click a button to regenerate *only* the headline or *only* the CTA using Gemini)[cite: 32].

### F. Data Persistence & History
* [cite_start]Save all generated sales pages to the database, linked to the authenticated user[cite: 26].
* [cite_start]Dashboard for users to View, Edit (re-generate), and Delete their past pages[cite: 27].

### G. Export Functionality (Bonus Included)
* [cite_start]Allow users to export the final generated sales page as a standalone, functional HTML file[cite: 30].

## 4. Strict Engineering Rules & Security
1.  **Security First:** Implement CSRF protection, input sanitization (especially before sending to Gemini API), and secure API routes to prevent unauthorized access.
2.  **SEO Optimization:** Implement robust SEO practices including dynamic Sitemap generation, OpenGraph tags, robots.txt, and JSON-LD structured data for hierarchical sitelinks.
3.  **Media Optimization:** Any user-uploaded assets must go through Vercel Blob, explicitly converted to WebP, and highly compressed.
4.  **Documentation & Comments:** Code must be self-documenting through clear variable/function naming. Omit unnecessary boilerplate comments. Include proper technical documentation for setup.
5.  **Execution Standard:** Fetch and verify the latest documentation of Next.js and Gemini API before writing implementations. Test every feature boundary before proceeding to the next step to ensure zero runtime errors.