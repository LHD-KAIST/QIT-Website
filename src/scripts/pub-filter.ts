/**
 * Publications filter — progressive enhancement over a fully server-rendered
 * list. State lives entirely in the URL (`?tag=…&type=…`), so it is shareable,
 * bookmarkable, and back/forward-friendly. With JS off, every paper is shown
 * (newest first) and chips behave as plain links.
 */
type Type = 'all' | 'journal' | 'preprint';

function normalizeType(v: string | null): Type {
  return v === 'journal' || v === 'preprint' ? v : 'all';
}

function urlFor(tag: string | null, type: Type): string {
  const p = new URLSearchParams();
  if (tag) p.set('tag', tag);
  if (type !== 'all') p.set('type', type);
  const qs = p.toString();
  return '/publications' + (qs ? `?${qs}` : '');
}

function init(): void {
  const root = document.querySelector<HTMLElement>('[data-pub-filter]');
  if (!root) return;

  const chips = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-tag-chip]'));
  const typeBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-type-btn]'));
  const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-year-group]'));
  const statusText = root.querySelector<HTMLElement>('[data-status-text]');
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-clear]');
  const emptyEl = root.querySelector<HTMLElement>('[data-empty]');

  function state(): { tag: string | null; type: Type } {
    const p = new URLSearchParams(location.search);
    return { tag: p.get('tag'), type: normalizeType(p.get('type')) };
  }

  function apply(): void {
    const { tag, type } = state();

    // chips: selected chip clears on click; others select (preserving type)
    let tagLabel = '';
    for (const c of chips) {
      const id = c.dataset.tagId ?? '';
      const sel = id === tag;
      c.classList.toggle('is-selected', sel);
      c.setAttribute('aria-pressed', String(sel));
      c.href = urlFor(sel ? null : id, type);
      if (sel) tagLabel = c.querySelector('.chip__label')?.textContent ?? id;
    }

    // type segmented control
    for (const b of typeBtns) {
      const active = (b.dataset.type as Type) === type;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    }

    // filter papers, update per-year density + visibility
    let total = 0;
    for (const g of groups) {
      const papers = Array.from(g.querySelectorAll<HTMLElement>('.pub'));
      let visible = 0;
      for (const a of papers) {
        const tags = (a.dataset.tags ?? '').split(' ');
        const show = (!tag || tags.includes(tag)) && (type === 'all' || a.dataset.type === type);
        a.hidden = !show;
        if (show) visible++;
        // light up the chip on the paper that matches the active filter
        a.querySelectorAll<HTMLElement>('.pub__tag').forEach((el) =>
          el.classList.toggle('pub__tag--on', tag !== null && el.dataset.tagId === tag),
        );
      }
      total += visible;
      g.hidden = visible === 0;
    }

    // status line + clear affordance
    if (statusText) {
      if (tag) {
        statusText.innerHTML = `Showing <strong>${total} paper${total === 1 ? '' : 's'}</strong> tagged <em>${tagLabel}</em>`;
      } else {
        statusText.textContent = 'All papers, newest first';
      }
    }
    if (clearBtn) clearBtn.hidden = !tag;
    if (emptyEl) emptyEl.hidden = total !== 0;
  }

  function go(url: string): void {
    history.pushState({}, '', url);
    apply();
  }

  for (const c of chips) {
    c.addEventListener('click', (e) => {
      e.preventDefault();
      go(c.getAttribute('href') ?? '/publications');
    });
  }
  for (const b of typeBtns) {
    b.addEventListener('click', () => go(urlFor(state().tag, b.dataset.type as Type)));
  }
  // both the status "Clear filter" and the empty-state "Clear the filter" reset
  root.querySelectorAll<HTMLButtonElement>('[data-clear], [data-clear-inline]').forEach((b) =>
    b.addEventListener('click', () => go('/publications')),
  );
  window.addEventListener('popstate', apply);

  apply();
}

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
