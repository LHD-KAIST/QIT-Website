import type { Member } from './collections';

export interface RoleGroup {
  slug: string;
  label: string;
  role: string | null; // null = the "Group photos" page (no members)
}

/** The People sections, in display order. Each is its own page at /people/<slug>. */
export const ROLE_GROUPS: RoleGroup[] = [
  { slug: 'team-leader', label: 'Team Leader', role: 'pi' },
  { slug: 'postdoctoral-researcher', label: 'Postdoctoral Researcher', role: 'postdoc' },
  { slug: 'graduate-students', label: 'Graduate Students', role: 'grad' },
  { slug: 'undergraduate-students', label: 'Undergraduate Students', role: 'undergrad' },
  { slug: 'alumni', label: 'Alumni', role: 'alumni' },
  { slug: 'group-photos', label: 'Group photos', role: null },
];

const ROLE_TO_SLUG: Record<string, string> = Object.fromEntries(
  ROLE_GROUPS.filter((g) => g.role).map((g) => [g.role as string, g.slug]),
);

export function membersOf(members: Member[], role: string): Member[] {
  return members.filter((m) => m.role === role).sort((a, b) => a.order - b.order);
}

/** memberId -> canonical URL of that person's card on its group sub-page. */
export function buildMemberHrefs(members: Member[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of members) {
    const slug = ROLE_TO_SLUG[m.role];
    if (slug) map.set(m.id, `/people/${slug}#${m.id}`);
  }
  return map;
}
