import fs from 'node:fs';
import path from 'node:path';

/**
 * Build-time check for whether a `public/` asset actually exists on disk.
 * Lets components render a real <img> when a photo/figure has been added, and
 * fall back to the interference Placeholder when it hasn't — so a non-developer
 * can just drop a file into public/images/... and it appears, with no broken
 * images in the meantime.
 */
const PUBLIC_DIR = path.join(process.cwd(), 'public');

export function publicAssetExists(publicPath: string | null | undefined): boolean {
  if (!publicPath) return false;
  const rel = publicPath.replace(/^\/+/, '');
  return fs.existsSync(path.join(PUBLIC_DIR, rel));
}
