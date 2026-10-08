// Rehype plugin for page markdown:
//  - ![alt](img:2022/12/x.png)  ->  responsive <picture> (AVIF/WebP srcset) from src/data/images.json
//  - internal links "/x/" get the deploy base; external links open in a new tab
//  - CTA-style links ("Request Appointment", "Shop Now", "Learn More", ...) become pill buttons
//  - lists that only contain images become an image grid; "Q:" paragraphs get a class
import { readFileSync } from 'node:fs';

export default function rehypeSvma({ base = '/' } = {}) {
  const b = base.replace(/\/$/, '');
  let DB;
  const db = () => (DB ??= JSON.parse(readFileSync(new URL('../data/images.json', import.meta.url), 'utf8')));
  const url = (p) => `${b}/${p}`;
  const srcset = (vs) => vs.map(([p, w]) => `${url(p)} ${w}w`).join(', ');
  const text = (n) => (n.type === 'text' ? n.value : (n.children || []).map(text).join(''));
  const CTA = /^(request appointment|shop now|learn more|read more|book now|discover more)$/i;

  function picture(rel, alt) {
    const e = db()[rel];
    if (!e) throw new Error(`[rehype-svma] unknown image ${rel}`);
    // Wrapped in a <span> so Astro's own markdown image pass doesn't revert the <img>.
    if (e.svg) return { type: 'element', tagName: 'span', properties: { className: ['logo-svg'] }, children: [{ type: 'element', tagName: 'img', properties: { src: url(e.src), alt, loading: 'lazy', decoding: 'async' }, children: [] }] };
    const sizes = '(min-width: 1200px) 760px, (min-width: 768px) 60vw, 92vw';
    const fb = (e.webp.find(([, w]) => w >= 960) || e.webp[e.webp.length - 1])[0];
    return {
      type: 'element', tagName: 'picture', properties: {},
      children: [
        { type: 'element', tagName: 'source', properties: { type: 'image/avif', srcSet: srcset(e.avif), sizes }, children: [] },
        { type: 'element', tagName: 'source', properties: { type: 'image/webp', srcSet: srcset(e.webp), sizes }, children: [] },
        { type: 'element', tagName: 'img', properties: { src: url(fb), alt, width: e.w, height: e.h, loading: 'lazy', decoding: 'async' }, children: [] },
      ],
    };
  }

  function walk(node, parent) {
    if (node.type === 'element') {
      let p = node.properties || {};
      if (node.tagName === 'img' && typeof p.src === 'string' && p.src.startsWith('img:')) {
        const pic = picture(p.src.slice(4), p.alt || '');
        Object.assign(node, pic);
        p = node.properties; // don't restore the old img src/alt onto the new wrapper
      } else if (node.tagName === 'a' && typeof p.href === 'string') {
        if (/^\/(?!\/)/.test(p.href)) p.href = b + p.href;
        else if (/^https?:/.test(p.href)) { p.target = '_blank'; p.rel = ['noopener']; }
        delete p.title;
        if (CTA.test(text(node).trim())) p.className = ['btn', ...(p.className || [])];
      } else if (node.tagName === 'ul') {
        const lis = node.children.filter((c) => c.type === 'element');
        if (lis.length && lis.every((li) => li.children.some((c) => c.tagName === 'img') && !text(li).trim())) p.className = ['img-grid'];
      } else if (node.tagName === 'p') {
        const t = text(node).trim();
        if (/^Q:/.test(t)) p.className = ['q'];
        if (node.children.length === 1 && node.children[0].tagName === 'a' && CTA.test(text(node).trim())) p.className = ['cta'];
        if (node.children.every((c) => c.tagName === 'img' || (c.type === 'text' && !c.value.trim())) && node.children.some((c) => c.tagName === 'img')) p.className = ['figure'];
      }
      node.properties = p;
    }
    (node.children || []).forEach((c) => walk(c, node));
  }
  return (tree) => walk(tree, null);
}
