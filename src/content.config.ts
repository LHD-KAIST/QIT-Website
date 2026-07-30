import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

/**
 * Content Collections + schema validation.
 *
 * These schemas are the contract for the three data files in `src/data/`.
 * If an entry is missing a required field or has the wrong type, `astro build`
 * FAILS with a message pointing at the offending entry — so a broken data edit
 * can never reach the live site (Netlify keeps the last good deploy).
 *
 * Cross-file references (a publication's tags / memberId) are checked
 * separately at build time in `src/lib/collections.ts`.
 */

// ---- publications.json (34 papers) ---------------------------------------
const author = z.object({
  name: z.string(),
  group: z.boolean().optional(), // true = lab member (emphasised)
  corresponding: z.boolean().optional(), // true = corresponding author (*)
  memberId: z.string().optional(), // links to members.json id, if a lab member
});

const publications = defineCollection({
  // One file per paper: src/data/publications/<id>.json.
  loader: glob({ pattern: '**/*.json', base: './src/data/publications' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(author).min(1),
    year: z.number().int(),
    order: z.number().default(0),
    type: z.enum(['journal', 'preprint']),
    venue: z.string(),
    citation: z.string(),
    arxiv: z.string().nullable().optional(),
    url: z.string().url(),
    tags: z.array(z.string()).min(1),
    highlight: z.boolean().default(false),
    note: z.string().nullable().optional(),
  }),
});

// ---- members.json (12 people) --------------------------------------------
const email = z.object({
  user: z.string(),
  domain: z.string(),
  primary: z.boolean(),
});

const educationEntry = z.object({
  position: z.string(),
  period: z.string().nullable().optional(),
  org: z.string().nullable().optional(),
});

// links may be an empty object; every key is optional and may be null.
const links = z
  .object({
    scholar: z.string().nullable(),
    website: z.string().nullable(),
    arxiv: z.string().nullable(),
    orcid: z.string().nullable(),
  })
  .partial();

const members = defineCollection({
  // One file per member: src/data/members/<id>.json (edited via /admin/member).
  loader: glob({ pattern: '**/*.json', base: './src/data/members' }),
  // Required fields = the ones a member must have. The rest are optional so that
  // a form (CMS) saving a profile with empty fields never breaks the build.
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.enum(['pi', 'postdoc', 'grad', 'undergrad', 'ra', 'alumni']),
    roleLabel: z.string(),
    affiliation: z.string(),
    order: z.number().default(0), // order within a role group
    title: z.string().nullable().optional(),
    emails: z.array(email).default([]),
    photo: z.string().optional().default(''),
    bio: z.string().nullable().optional(),
    education: z.array(educationEntry).default([]),
    interests: z.array(z.string()).default([]),
    links: links.optional().default({}),
    authorKey: z.string().nullable().optional(),
    nextPosition: z.string().nullable().optional(),
    period: z
      .object({ start: z.string().nullable(), end: z.string().nullable() })
      .partial()
      .optional(),
    roleOrder: z.number().optional(),
  }),
});

// ---- tags.json (28 tags) -------------------------------------------------
// area tags (3) drive the Research page and REQUIRE the descriptive fields.
// keyword tags (25) are filter-only and stay minimal.
const areaTag = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.literal('area'),
  order: z.number().int(),
  tagline: z.string(),
  description: z.string(),
  figure: z.string(),
  figureAlt: z.string(),
});

const keywordTag = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.literal('keyword'),
});

const tags = defineCollection({
  loader: file('src/data/tags.json'),
  schema: z.discriminatedUnion('kind', [areaTag, keywordTag]),
});

export const collections = { publications, members, tags };
