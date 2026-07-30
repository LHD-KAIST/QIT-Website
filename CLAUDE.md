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
Self-hosted mini-CMS under `src/pages/admin/` (normal Astro pages; replaced Sveltia CMS).
Lists render public repo data at build time; editing commits **in-page** straight to the
repo via the GitHub Contents API after a one-time GitHub sign-in. The `/admin` pages are
public, but only repo collaborators can actually save (GitHub enforces write access; the
OAuth client secret lives only in Cloudflare env, never in the repo/browser).
- `src/layouts/AdminLayout.astro` — shared shell: top nav (Home/Members/Papers) + a
  **Sign in with GitHub** button, and the shared client helper `window.qitAdmin`
  (`saveFile({path,content,message})` → OAuth popup on demand, then GET sha + PUT to the
  Contents API; token kept in `sessionStorage`).
- `src/pages/admin/index.astro` — hub at `/admin`.
- `src/pages/admin/member.astro` — **Members**: list grouped by section (PI → POSTDOC →
  GRAD → UNDERGRAD → ALUMNI, uppercase, alphabetical). *Edit* loads a member into the form
  (repeatable emails/education, etc.); *Save* commits a create/update. Editing preserves
  fields not shown in the form (e.g. `roleOrder`, `period`) by merging over the loaded doc.
- `src/pages/admin/paper.astro` — **Papers**: "Add a paper" (paste DOI/arXiv → auto-fills
  from `/fetch-paper` → per-author None/Lab member/PI selector + tags), plus a year-grouped
  list where *Edit* loads a paper into the same form; *Save* commits. The form covers every
  paper field, so no merge is needed.
- `functions/{auth,callback,fetch-paper}.js` — **Cloudflare Pages Functions**. auth/callback
  = GitHub OAuth popup flow (`window.qitAdmin` consumes the token); fetch-paper = arXiv +
  Crossref metadata. Secrets `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` live in Cloudflare
  env vars (not the repo). (`netlify/` + `netlify.toml` are stale old-host leftovers — can be
  deleted.)

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
