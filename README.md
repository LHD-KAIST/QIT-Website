# KAIST QIT — Lab Website

The website for the **Quantum Information Theory group, Department of Physics, KAIST**.

You do **not** need to be a programmer to keep this site up to date. Everything
visitors see — every paper, every member, every research area — comes from three
plain text files. You edit those files on GitHub in your browser, and the site
rebuilds and republishes itself automatically. No terminal, no software to install.

- **The three files you edit** live in the folder `src/data/`:
  - `publications.json` — the list of papers
  - `members.json` — the list of people
  - `tags.json` — the research areas and keyword labels
- **Everything else** (the design, the pages, the code) you can leave alone.

---

## How updating works (read this once)

1. You open one of the three files on GitHub and click the **✏️ pencil** (Edit).
2. You make your change (add a paper, add a person…).
3. You click **Commit changes** at the bottom.
4. Netlify notices the change and rebuilds the site. **In 1–2 minutes the live
   site updates by itself.**

### The safety net 🛡️

The site is **checked automatically** every time you save. If a required piece of
information is missing or mistyped, the rebuild **stops** and — importantly — the
**old, working site stays exactly as it was.** A mistake can never take the site
down or publish something broken; it just means "the update didn't go through yet."

If an update doesn't appear after a couple of minutes, see
[When an update doesn't show up](#when-an-update-doesnt-show-up) below.

> **Tip:** JSON is fussy about punctuation. Every item is wrapped in `{ }`, items
> are separated by commas, and text goes in `"double quotes"`. The safest way to
> add an entry is to **copy an existing one and change the values** — don't type
> the punctuation from scratch.

---

## How to add a paper

1. Open **`src/data/publications.json`** and click the pencil to edit.
2. Papers are ordered newest-first automatically; you don't have to place it in
   any particular spot in the file. Copy this template and paste it as a new
   entry (right after the opening `[`, or after any existing paper — remember the
   comma between entries):

```json
{
  "id": "lee2027example",
  "title": "The exact title of the paper",
  "authors": [
    { "name": "H. Lee", "group": true, "memberId": "lee-hodong" },
    { "name": "C. Oh", "group": true, "corresponding": true, "memberId": "oh-changhun" },
    { "name": "J. Doe" }
  ],
  "year": 2027,
  "order": 0,
  "type": "preprint",
  "venue": "arXiv",
  "citation": "arXiv:2701.00000 (2027)",
  "arxiv": "2701.00000",
  "url": "https://arxiv.org/abs/2701.00000",
  "tags": ["quantum-learning", "sample-complexity"],
  "highlight": false,
  "note": null
}
```

**What each field means:**

| Field | What to put |
|---|---|
| `id` | Any short unique label, e.g. `lee2027example`. No spaces. Must not repeat another paper's id. |
| `title` | The paper title, exactly. |
| `authors` | The author list **in order**. Each author is `{ "name": "..." }`. Add `"group": true` for a lab member, `"corresponding": true` for a corresponding author (shows a `∗`), and `"memberId": "..."` to link the name to their card on the People page (use their `id` from `members.json`). |
| `year` | Publication year, a number (no quotes). |
| `order` | Ordering **within that year** — smaller numbers appear first. If unsure, use `0`. |
| `type` | `"journal"` or `"preprint"`. Controls the badge style. |
| `venue` | Short venue name shown on the badge, e.g. `"Nature Physics"`, `"PRX Quantum"`, `"arXiv"`. |
| `citation` | The full citation line, e.g. `"Nat. Phys. 20, 225 (2024)"`. |
| `arxiv` | The arXiv number, or delete this line if none. |
| `url` | Link the title points to. Must start with `http`. |
| `tags` | A list of tag ids **that already exist in `tags.json`** (see [Tags](#about-tags-research-areas--keywords)). At least one. |
| `highlight` | `true` to feature it in "Selected papers" on the home page, otherwise `false`. |
| `note` | A short note like `"Editors' Suggestion"`, or `null` for none. |

3. Click **Commit changes**. Done — the paper appears (and its tag counts update)
   after the rebuild.

---

## How to add a person

1. Open **`src/data/members.json`** and click the pencil.
2. Copy this template as a new entry (mind the comma between entries):

```json
{
  "id": "kim-example",
  "name": "Example Kim",
  "authorKey": "E. Kim",
  "role": "grad",
  "roleLabel": "Graduate Student",
  "order": 5,
  "title": null,
  "affiliation": "KAIST Physics",
  "emails": [
    { "user": "example", "domain": "kaist.ac.kr", "primary": true }
  ],
  "photo": "/images/people/kim-example.jpg",
  "bio": "One sentence about their background.",
  "education": [],
  "interests": ["Quantum learning", "Boson sampling"],
  "links": {},
  "period": { "start": null, "end": null },
  "nextPosition": null,
  "roleOrder": 3
}
```

**What each field means:**

| Field | What to put |
|---|---|
| `id` | Unique label, e.g. `kim-example`. No spaces. This is also what you use in a paper's `memberId`. |
| `name` | Full display name. |
| `authorKey` | How the name appears in publications, e.g. `"E. Kim"`, or `null`. |
| `role` | One of: `pi`, `postdoc`, `grad`, `undergrad`, `ra`, `alumni`. Controls which section they appear in. |
| `roleLabel` | The title shown on the card, e.g. `"Graduate Student"`. |
| `order` | Order within their section (smaller = first). |
| `title` | An extra title like `"Assistant Professor"`, or `null`. |
| `affiliation` | Department/school text. |
| `emails` | One or more `{ "user": "...", "domain": "...", "primary": true }`. The address shown is `user@domain`. |
| `photo` | Leave as `/images/people/<id>.jpg`. A placeholder shows until you add the photo (see [Photos](#how-to-add-photos-and-figures)). |
| `bio` | One sentence, or `null`. If `null`, the card falls back to their degree/affiliation. |
| `education` | Can stay `[]`. To add entries: `{ "period": "2024 – present", "position": "B.Sc. Physics", "org": "KAIST" }` (any of these may be `null`). |
| `interests` | A list of short phrases, or `[]`. |
| `links` | Can stay `{}`. Add any of: `"scholar"`, `"website"`, `"arxiv"`, `"orcid"`, e.g. `{ "scholar": "https://..." }`. |
| `period`, `nextPosition`, `roleOrder` | Metadata — copy the template values; `roleOrder` is 1=PI, 2=postdoc, 3=grad, 4=undergrad, 5=ra, 6=alumni. |

Empty photo, bio, links, interests, or education are all fine — the card adjusts
itself and never looks broken.

3. Click **Commit changes**.

**To mark someone as alumni:** change their `"role"` to `"alumni"` (and
`"roleLabel"` e.g. to `"Alumnus"`). They move to the Alumni section automatically.

---

## About tags (research areas & keywords)

`tags.json` holds two kinds of tags:

- **`area`** (3 of them) — the big research directions shown on the Research page.
  These have extra fields (`tagline`, `description`, `figure`).
- **`keyword`** (the rest) — the filter labels on the Publications page.

The number next to each tag (e.g. *Boson Sampling 10*) is **counted
automatically** — you never edit counts.

**To use an existing tag on a paper,** just put its `id` in the paper's `tags`
list. **To add a new keyword tag,** add an entry like:

```json
{ "id": "my-new-topic", "label": "My New Topic", "kind": "keyword" }
```

then use `"my-new-topic"` in a paper's `tags`. (A paper may only use tag ids that
exist here — that's one of the things the safety net checks.)

---

## How to add photos and figures

Photos aren't required — a tasteful placeholder shows until you add one.

- **Member photos:** upload a file named after the member's `id` into
  `public/images/people/`, e.g. `public/images/people/lee-hodong.jpg`. It replaces
  that person's placeholder automatically.
- **Research figures:** upload into `public/images/research/` using the filename in
  the area's `figure` field, e.g. `public/images/research/nisq.jpg`.
- **Group photo:** the People page has a "Group photo" slot ready for a designer to
  wire up when a photo exists.

To upload on GitHub: open the folder, click **Add file → Upload files**, drag the
image in, and **Commit changes**.

---

## When an update doesn't show up

If you committed a change and the site didn't update after ~2 minutes, the safety
net most likely caught a typo (a missing comma, a missing field, a tag id that
doesn't exist). The **old site stays live** — nothing is broken. To find out what
happened:

1. Go to the project's page on **Netlify** → **Deploys**.
2. The most recent deploy will be marked **Failed**. Click it.
3. Read the last lines of the log. It names the problem in plain terms, e.g.
   *"publications → lee2027example … year: Required"* (a paper is missing its year)
   or *"references unknown tag 'boson-samlping'"* (a misspelled tag id).
4. Fix that field in the file on GitHub and commit again.

When in doubt, undo your last edit: on GitHub open the file, click **History**,
open your commit, and revert it — the site returns to the previous good state.

---

## For developers

Static site built with **[Astro](https://astro.build)** + **Tailwind CSS v4**.
Data is loaded through Astro Content Collections with Zod schemas
(`src/content.config.ts`) plus a referential-integrity check
(`src/lib/collections.ts`), so bad data fails the build instead of shipping.

```bash
npm install      # first time
npm run dev      # local preview at http://localhost:4321
npm run build    # production build into dist/ (also runs all validation)
npm run preview  # serve the built site locally
```

Node 20+ (see `.nvmrc`). Deployment config is in `netlify.toml`. The original
design handoff bundle is kept in `design-reference/` for reference and is not part
of the build.

### First-time deployment setup

See the numbered walkthrough your developer provided, or in short: push this repo
to GitHub, then in Netlify choose **Add new site → Import an existing project**,
pick the repo, and accept the detected settings (`npm run build` → publish `dist`).
After that, every commit to the default branch redeploys automatically.
