import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * The single data-access layer. Every page imports from here — never from
 * `astro:content` directly — so the referential-integrity guard below always
 * runs during the build.
 */

export type Publication = CollectionEntry<'publications'>['data'];
export type Member = CollectionEntry<'members'>['data'];
export type Tag = CollectionEntry<'tags'>['data'];
export type AreaTag = Extract<Tag, { kind: 'area' }>;
export type KeywordTag = Extract<Tag, { kind: 'keyword' }>;

interface LabData {
  publications: Publication[];
  members: Member[];
  tags: Tag[];
  tagById: Map<string, Tag>;
  memberById: Map<string, Member>;
  countByTag: Map<string, number>;
}

let cache: Promise<LabData> | null = null;

/** Load, validate cross-references, and memoise for the rest of the build. */
function load(): Promise<LabData> {
  if (cache) return cache;
  cache = (async () => {
    const publications = (await getCollection('publications')).map((e) => e.data);
    const members = (await getCollection('members')).map((e) => e.data);
    const tags = (await getCollection('tags')).map((e) => e.data);

    const tagById = new Map(tags.map((t) => [t.id, t]));
    const memberById = new Map(members.map((m) => [m.id, m]));

    // --- referential integrity: fail the build on a dangling reference ------
    const errors: string[] = [];
    for (const p of publications) {
      for (const tagId of p.tags) {
        if (!tagById.has(tagId)) {
          errors.push(`publication "${p.id}" references unknown tag "${tagId}"`);
        }
      }
      for (const a of p.authors) {
        if (a.memberId && !memberById.has(a.memberId)) {
          errors.push(`publication "${p.id}" references unknown memberId "${a.memberId}"`);
        }
      }
    }
    if (errors.length) {
      throw new Error(
        `Data integrity check failed (${errors.length}):\n  - ` + errors.join('\n  - '),
      );
    }

    // --- build-time tag counts ----------------------------------------------
    const countByTag = new Map<string, number>();
    for (const t of tags) countByTag.set(t.id, 0);
    for (const p of publications) {
      for (const tagId of p.tags) {
        countByTag.set(tagId, (countByTag.get(tagId) ?? 0) + 1);
      }
    }

    return { publications, members, tags, tagById, memberById, countByTag };
  })();
  return cache;
}

/** Papers sorted for display: year descending, then `order` ascending. */
export function sortPublications(pubs: Publication[]): Publication[] {
  return [...pubs].sort((a, b) => b.year - a.year || a.order - b.order);
}

export async function getPublications(): Promise<Publication[]> {
  const { publications } = await load();
  return sortPublications(publications);
}

export async function getMembers(): Promise<Member[]> {
  return (await load()).members;
}

export async function getTags(): Promise<Tag[]> {
  return (await load()).tags;
}

export async function getAreaTags(): Promise<AreaTag[]> {
  const { tags } = await load();
  return tags
    .filter((t): t is AreaTag => t.kind === 'area')
    .sort((a, b) => a.order - b.order);
}

export async function getKeywordTags(): Promise<KeywordTag[]> {
  const { tags } = await load();
  return tags.filter((t): t is KeywordTag => t.kind === 'keyword');
}

export async function getTagCounts(): Promise<Map<string, number>> {
  return (await load()).countByTag;
}

export async function getTagLabel(id: string): Promise<string> {
  return (await load()).tagById.get(id)?.label ?? id;
}

/** Distinct years present, newest first (used for year dividers). */
export async function getYears(): Promise<number[]> {
  const { publications } = await load();
  return [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
}
