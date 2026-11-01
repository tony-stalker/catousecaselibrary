/* window.__EXPORT(svg, prefix, title, desc) -> {svg: static markup, warnings: [...], refs: [sprite ids]}
   Runs in kit-host.html on a freshly mounted svg (source CSS live, so computed styles are real).
   Loaded by _extract/build-diagrams.py. */
window.__EXPORT = function (svg, prefix, title, desc) {
  const warnings = [];
  const NOPRUNE = 'defs,symbol,marker,clipPath,pattern,linearGradient,radialGradient,mask,filter';
  /* 0 · source navigation that means nothing outside the app (engine pages' "← Single Pass Engine" back link) */
  svg.querySelectorAll('[data-gofig="space"]').forEach(el => el.remove());
  /* 0b · paint servers set from CSS (url(#id)) are baked into attributes: a fragment url() in an external
     stylesheet resolves against the stylesheet file, not the page */
  svg.querySelectorAll('*').forEach(el => { if (el.closest('defs,symbol,marker,pattern,linearGradient,radialGradient')) return;
    const cs = getComputedStyle(el);
    ['fill', 'stroke'].forEach(pr => { const v = cs[pr]; const m = /url\("?#([\w-]+)"?\)/.exec(v || '');
      if (m && !(el.getAttribute(pr) || '').includes('url(')) el.setAttribute(pr, 'url(#' + m[1] + ')'); }); });
  /* 1 · prune what the source keeps hidden by default (alternate views, hover hints, hit areas, demo tokens) */
  const all = [...svg.querySelectorAll('*')].filter(el => !el.closest(NOPRUNE));
  all.forEach(el => {
    if (!el.isConnected) return;
    const cls = el.getAttribute('class') || '';
    if (/\b(hs-area|hs-ring|hs-hint|grp-hit)\b/.test(cls)) { el.remove(); return; }
    const cs = getComputedStyle(el);
    if (cs.display === 'none') { el.remove(); return; }
    if (parseFloat(cs.opacity) === 0 && cs.animationName === 'none' && el.tagName !== 'animateMotion') el.remove();
  });
  /* 2 · label fit (English): a label wider than the smallest rect drawn before it that contains its centre */
  const ctm = el => { const m = el.getCTM(), r = svg.getCTM(); return m && r ? r.inverse().multiply(m) : null; };
  const rects = [...svg.querySelectorAll('rect')].filter(r => r.getAttribute('class') && r.getBBox().width > 0).map(r => {
    const m = ctm(r), b = r.getBBox(), p = new DOMPoint(b.x, b.y).matrixTransform(m), q = new DOMPoint(b.x + b.width, b.y + b.height).matrixTransform(m);
    return { r, x: p.x, y: p.y, w: q.x - p.x, h: q.y - p.y }; });
  svg.querySelectorAll('text').forEach(t => {
    if (!t.textContent.trim()) return;
    const m = ctm(t); if (!m) return; const b = t.getBBox();
    const a = new DOMPoint(b.x, b.y).matrixTransform(m), z = new DOMPoint(b.x + b.width, b.y + b.height).matrixTransform(m);
    const cx = (a.x + z.x) / 2, cy = (a.y + z.y) / 2;
    let box = null; rects.forEach(R => { if (cx >= R.x && cx <= R.x + R.w && cy >= R.y && cy <= R.y + R.h && R.w < 700 &&
      (R.r.compareDocumentPosition(t) & 4) && (!box || R.w * R.h < box.w * box.h)) box = R; });
    if (box && (a.x < box.x - 1.5 || z.x > box.x + box.w + 1.5)) {
      /* the source's own rule for wider fonts: compress a label that is at most 20% too long into its box
         (textLength + spacingAndGlyphs, as fitTexts does for translations); anything longer needs rewording */
      const anc = getComputedStyle(t).textAnchor || 'start', x0 = new DOMPoint(+t.getAttribute('x') || b.x, 0).matrixTransform(m).x;
      const room = anc === 'middle' ? 2 * Math.min(x0 - box.x, box.x + box.w - x0) - 6 : anc === 'end' ? x0 - box.x - 5 : box.x + box.w - x0 - 5;
      const need = z.x - a.x, scale = m.a || 1;
      if (room > 0 && need <= room * 1.2 && t.getAttribute('x') !== null && !t.querySelector('tspan, textPath')) {
        t.setAttribute('textLength', (room / scale).toFixed(1)); t.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      } else warnings.push('overflow: "' + t.textContent.trim().slice(0, 40) + '" ' + Math.round(need) + 'px in ' + Math.round(box.w) + 'px box');
    }
    const vb = svg.viewBox.baseVal; if (a.x < vb.x - 1 || z.x > vb.x + vb.width + 1) warnings.push('edge: "' + t.textContent.trim().slice(0, 40) + '"');
  });
  /* 3 · ids: per-diagram for particle paths, x- for everything else; rewrite every reference; rename colour variables */
  const map = new Map();
  svg.querySelectorAll('[id]').forEach(el => { const id = el.id; map.set(id, /^(f\d+|p-[\w-]+|ftp\d+)$/.test(id) ? prefix + '-' + id : 'x-' + id); el.id = map.get(id); });
  const ren = id => map.get(id) || ('x-' + id), refs = new Set();
  svg.querySelectorAll('*').forEach(el => {
    for (const at of [...el.attributes]) {
      if (/^data-|^tabindex$|^aria-(label|pressed|expanded)$/.test(at.name) || (at.name === 'role' && el !== svg)) { el.removeAttribute(at.name); continue; }
      if ((at.name === 'href' || at.name === 'xlink:href') && at.value.startsWith('#')) { const id = at.value.slice(1); if (!map.has(id)) refs.add(id); el.setAttribute(at.name, '#' + ren(id)); }
      else if (/url\(#/.test(at.value)) el.setAttribute(at.name, at.value.replace(/url\(#([\w-]+)\)/g, (m, id) => { if (!map.has(id)) refs.add(id); return 'url(#' + ren(id) + ')'; }));
    }
    for (const at of [...el.attributes]) if (/var\(--/.test(at.value)) el.setAttribute(at.name, at.value.replace(/var\(--(?!x-)([\w-]+)/g, 'var(--x-$1'));
    const c = el.getAttribute('class'); if (c) el.setAttribute('class', c.split(/\s+/).filter(Boolean).map(k => 'x-' + k).join(' '));
  });
  svg.querySelectorAll('[class=""]').forEach(el => el.removeAttribute('class'));
  svg.querySelectorAll('[style^="--d:"]').forEach(el => el.removeAttribute('style'));
  /* 4 · root */
  const vb = svg.getAttribute('viewBox'), rootCls = (svg.getAttribute('class') || '').split(/\s+/).filter(k => k && k !== 'fig').map(k => 'x-' + k);
  [...svg.attributes].forEach(a => svg.removeAttribute(a.name));
  svg.setAttribute('viewBox', vb); svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('class', ['x-fig'].concat(rootCls).join(' ')); svg.setAttribute('role', 'img');
  /* name from <title>; describe from <desc> only when there is one (an empty target is an a11y defect) */
  svg.setAttribute('aria-labelledby', prefix + '-title' + (desc ? ' ' + prefix + '-desc' : ''));
  svg.insertAdjacentHTML('afterbegin', '<title id="' + prefix + '-title"></title>' + (desc ? '<desc id="' + prefix + '-desc"></desc>' : ''));
  svg.querySelector('title').textContent = title || ''; if (desc) svg.querySelector('desc').textContent = desc;
  const out = svg.outerHTML.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ');
  return { svg: out, warnings, refs: [...refs].sort() };
};
