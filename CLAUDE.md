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
- `public/admin/` — **Sveltia CMS** (`index.html` + `config.yml`). Form-based editor that
  commits to GitHub. Login = GitHub OAuth; only repo collaborators can edit.
- `src/pages/admin/paper.astro` — **"Add a paper" tool**: paste a DOI/arXiv link →
  auto-fills from `/fetch-paper` → per-author None/Lab member/PI selector + tags →
  "Create on GitHub" opens a pre-filled new file.
- `functions/{auth,callback,fetch-paper}.js` — **Cloudflare Pages Functions**.
  auth/callback = GitHub OAuth for the CMS; fetch-paper = arXiv + Crossref metadata.
  Secrets `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` live in Cloudflare env vars (not the repo).
  (`netlify/` + `netlify.toml` are stale leftovers from the old host — can be deleted.)

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
