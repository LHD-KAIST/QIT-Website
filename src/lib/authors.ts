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

/**
 * A distinctive accent per journal, echoing each publication venue's own
 * identity (Science red, APS maroon/blue, Nature green, …). Used only for the
 * home "Selected papers" cards to give each journal its own look. Anything not
 * listed (arXiv, unknown) falls back to the site cyan.
 */
const ACCENT: Record<string, string> = {
  Science: '#b02a2a',
  'Nature Communications': '#0b6e5f',
  'Nature Physics': '#5a4b8c',
  'PRX Quantum': '#0e8a94',
  'Physical Review Letters': '#8b2540',
  'Physical Review A': '#35688f',
  'npj Quantum Information': '#2b5ba8',
  Quantum: '#4a54c0',
  'Current Optics and Photonics': '#a9791f',
};

export function venueAccent(venue: string): string {
  return ACCENT[venue] ?? 'var(--cyan)';
}

/**
 * Publisher logo (SVG) per venue, shown on the home "Selected papers" cards in
 * place of the text badge. Venues without a logo fall back to the text badge.
 */
const LOGO: Record<string, string> = {
  Science: '/images/science.svg',
  'Nature Communications': '/images/nature.svg',
  'Nature Physics': '/images/nature.svg',
  'Physical Review Letters': '/images/aps-logo.svg',
  'Physical Review A': '/images/aps-logo.svg',
  'PRX Quantum': '/images/aps-logo.svg',
};

export function venueLogo(venue: string): string | null {
  return LOGO[venue] ?? null;
}
