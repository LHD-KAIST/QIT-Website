/**
 * Venue badge shortening for PublicationItem.
 * The `venue` field already holds a short-ish name; a few long ones get
 * further abbreviated to keep the badge rail tidy. Anything not listed
 * (Science, PRX Quantum, Quantum, arXiv, …) renders as-is.
 */
const BADGE: Record<string, string> = {
  'Nature Communications': 'Nat. Commun.',
  'Nature Physics': 'Nat. Phys.',
  'Physical Review Letters': 'PRL',
  'Physical Review A': 'PRA',
  'npj Quantum Information': 'npj QI',
  'Current Optics and Photonics': 'Curr. Opt. Photon.',
};

export function venueBadge(venue: string): string {
  return BADGE[venue] ?? venue;
}
