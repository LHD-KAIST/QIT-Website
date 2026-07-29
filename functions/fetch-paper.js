/**
 * Cloudflare Pages Function — paper metadata lookup.
 * Route: /fetch-paper?id=<doi | arXiv id | url>
 * Returns normalized metadata from arXiv (preprints) or Crossref (DOIs).
 */
function detect(raw) {
  const s = (raw || '').trim();
  let m =
    s.match(/arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})/i) ||
    s.match(/^arxiv:\s*(\d{4}\.\d{4,5})/i) ||
    s.match(/^(\d{4}\.\d{4,5})(v\d+)?$/);
  if (m) return { kind: 'arxiv', value: m[1] };
  m = s.match(/(10\.\d{4,9}\/[^\s"'<>?#]+)/);
  if (m) return { kind: 'doi', value: m[1].replace(/[.,;]+$/, '') };
  return { kind: 'unknown', value: s };
}

async function fromArxiv(id) {
  const res = await fetch(`https://export.arxiv.org/api/query?id_list=${id}`);
  const xml = await res.text();
  const entry = xml.slice(xml.indexOf('<entry>'));
  const pick = (t) => {
    const mm = entry.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`));
    return mm ? mm[1].replace(/\s+/g, ' ').trim() : null;
  };
  const title = pick('title');
  if (!entry || !title) throw new Error('No arXiv paper found for that id.');
  const published = pick('published') || pick('updated');
  const year = published ? published.slice(0, 4) : '';
  const authors = [...entry.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((x) => x[1].trim());
  return {
    title,
    authors,
    year,
    type: 'preprint',
    venue: 'arXiv',
    url: `https://arxiv.org/abs/${id}`,
    arxiv: id,
    citation: `arXiv:${id} (${year})`,
  };
}

async function fromDoi(doi) {
  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
    headers: { 'User-Agent': 'QIT-site/1.0 (mailto:changhun0218@kaist.ac.kr)' },
  });
  if (!res.ok) throw new Error('No paper found for that DOI.');
  const { message: m } = await res.json();
  const authors = (m.author || []).map((a) => [a.given, a.family].filter(Boolean).join(' '));
  const year = String(
    m.published?.['date-parts']?.[0]?.[0] ?? m.issued?.['date-parts']?.[0]?.[0] ?? '',
  );
  const journal = m['container-title']?.[0] ?? '';
  const vol = m.volume ?? '';
  const page = m.page ?? m['article-number'] ?? '';
  const citation = `${journal}${vol ? ` ${vol}` : ''}${page ? `, ${page}` : ''}${
    year ? ` (${year})` : ''
  }`.trim();
  const isPreprint = /posted-content|preprint/i.test(m.type || '');
  return {
    title: m.title?.[0] ?? '',
    authors,
    year,
    type: isPreprint ? 'preprint' : 'journal',
    venue: journal,
    url: m.URL || `https://doi.org/${doi}`,
    doi,
    citation,
  };
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequest(context) {
  try {
    const id = new URL(context.request.url).searchParams.get('id');
    if (!id) return json({ error: 'Provide ?id=<DOI, arXiv id, or link>.' }, 400);
    const { kind, value } = detect(id);
    if (kind === 'arxiv') return json(await fromArxiv(value));
    if (kind === 'doi') return json(await fromDoi(value));
    return json({ error: 'Could not find a DOI or arXiv id in what you pasted.' }, 400);
  } catch (e) {
    return json({ error: String(e.message || e) }, 502);
  }
}
