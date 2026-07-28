import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

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
  loader: file('src/data/publications.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(author).min(1),
    year: z.number().int(),
    order: z.number().int(),
    type: z.enum(['journal', 'preprint']),
    venue: z.string(),
    citation: z.string(),
    arxiv: z.string().nullable().optional(),
    url: z.string().url(),
    tags: z.array(z.string()).min(1),
    highlight: z.boolean(),
    note: z.string().nullable(),
  }),
});

// ---- members.json (12 people) --------------------------------------------
const email = z.object({
  user: z.string(),
  domain: z.string(),
  primary: z.boolean(),
});

const educationEntry = z.object({
  period: z.string().nullable(),
  position: z.string(),
  org: z.string().nullable(),
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
  loader: file('src/data/members.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    authorKey: z.string().nullable(), // matches publications author name, or null
    role: z.enum(['pi', 'postdoc', 'grad', 'undergrad', 'ra', 'alumni']),
    roleLabel: z.string(),
    order: z.number().int(), // order within a role group
    title: z.string().nullable(),
    affiliation: z.string(),
    emails: z.array(email),
    photo: z.string(),
    bio: z.string().nullable(),
    education: z.array(educationEntry),
    interests: z.array(z.string()),
    links,
    period: z.object({
      start: z.string().nullable(),
      end: z.string().nullable(),
    }),
    nextPosition: z.string().nullable(),
    roleOrder: z.number().int(), // display order of the role group itself
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
