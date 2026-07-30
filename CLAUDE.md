# QIT Website — project context for Claude Code

KAIST Physics **Quantum Information Theory** lab website. Static site, non-developer
maintainable. Read this first, then `README.md` (non-dev guide) and `MEMBER-GUIDE.md`.

## Stack & hosting
- **Astro 5** (static output) + **Tailwind CSS v4** (via `@tailwindcss/vite`). No React/SPA.
- Fonts self-hosted (`@fontsource`). Light/dark via `prefers-color-scheme`.
- **Hosting: Cloudflare Pages.** Pushing to `main` auto-builds (`npm run build`, output `dist/`)
  and deploys. Live at **kaist-qit.pages.dev**. Repo: `LHD-KAIST/QIT-Website` (public).

## Data = source of truth (edit these, don't hardcode content)
- `src/data/members/<id>.json` — one file per member
- `src/data/publications/<id>.json` — one file per paper
- `src/data/tags.json` — research areas (kind: area) + keyword tags
- Schemas + validation: `src/content.config.ts` (Zod, `glob()` loaders). Bad/missing data
  **fails the build** on purpose (the live site stays on the last good deploy).
- `src/lib/collections.ts` — single data-access layer: cross-reference integrity check,
  build-time tag counts, year-desc/order-asc sort. Every page imports from here.
- `src/lib/people.ts` — role groups (People sections) + `buildMemberHrefs` (author deep-links).
- `src/lib/authors.ts` — venue badge / accent color / logo per journal.
- `src/lib/assets.ts` — build-time image existence checks (photos fall back to placeholders).

## Pages (`src/pages/`)
- `index.astro` — home: group-photo hero + Welcome overlay; "Selected papers" cards (highlights).
- `research.astro` — three area blocks (`ResearchAreaBlock`), link into filtered publications.
- `publications.astro` — all papers, year groups, keyword filter (progressive JS in
  `src/scripts/pub-filter.ts`; state in `?tag=` URL). Max 2 tag chips shown per paper.
- `people.astro` — index of sections; `people/[group].astro` — one page per role
  (Team Leader / Postdoc / Grad / Undergrad / Alumni / Group photos), profile layout
  (`MemberProfile`: photo left, details right).
- `join.astro` — image + one centered invitation line.

## Admin / content editing
Self-hosted admin under `src/pages/admin/` (built as normal Astro pages). **No CMS,
no login, no secrets in our code**: the lists render public repo data, and every
"Create"/"Edit" action deep-links to **github.com**, where GitHub handles sign-in and
enforces write access (only repo collaborators can commit). The `/admin` pages are
public but harmless — a stranger can build JSON but cannot commit it. Uses `AdminLayout`.
- `src/layouts/AdminLayout.astro` — shared shell (top nav Home/Members/Papers + styles).
- `src/pages/admin/index.astro` — hub at `/admin` linking the two tools.
- `src/pages/admin/member.astro` — **Members**: list grouped by section (PI → POSTDOC →
  GRAD → UNDERGRAD → ALUMNI, uppercase, alphabetical) with per-member *Edit on GitHub*
  deep-links, plus an *Add a new member* form → "Create on GitHub" (pre-filled new file).
- `src/pages/admin/paper.astro` — **Papers**: "Add a paper" (paste DOI/arXiv → auto-fills
  from `/fetch-paper` → per-author None/Lab member/PI selector + tags → "Create on GitHub"),
  plus a year-grouped list of existing papers with *Edit on GitHub* deep-links.
- Deep-link URLs: `github.com/<repo>/new/<branch>?filename=…&value=…` (create) and
  `github.com/<repo>/edit/<branch>/<path>` (edit). `REPO`/`BRANCH` are constants in each page.
- `functions/fetch-paper.js` — **Cloudflare Pages Function**: arXiv + Crossref metadata for
  the paper tool. (Sveltia CMS + its GitHub-OAuth functions `auth.js`/`callback.js` and
  `public/admin/` were removed when the admin moved to this deep-link model; the Cloudflare
  `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` env vars are now unused and can be deleted there.
  `netlify/` + `netlify.toml` are stale leftovers from the old host — can be deleted.)

## Commands
```
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # production build into dist/ (runs all validation)
```

## Conventions
- Keep everything **data-driven** from `src/data/` — never hardcode member/paper content.
- Optimize large image uploads (use `sharp`) before committing; e.g. group photo, join image.
- Only commit/push when the user asks. End commit messages with the Co-Authored-By line.
- `design-reference/` holds the original design handoff bundle (not built).
