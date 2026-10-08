// Site-wide progressive enhancement. Everything works without this file.
const doc = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- sticky header state ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
const toTop = document.querySelector<HTMLButtonElement>('[data-to-top]');
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    const topH = parseFloat(getComputedStyle(doc).getPropertyValue('--hdr-top')) || 0;
    header?.classList.toggle('is-stuck', y > topH + 4);
    toTop?.classList.toggle('show', y > 700);
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
  document.getElementById('main')?.focus({ preventScroll: true });
});

/* ---------- mobile menu ---------- */
const menu = document.querySelector<HTMLElement>('[data-menu]');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');
function setMenu(open: boolean) {
  if (!menu || !openBtn) return;
  menu.classList.toggle('open', open);
  openBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('no-scroll', open);
  if (open) (menu.querySelector('a, summary') as HTMLElement | null)?.focus();
  else openBtn.focus();
}
openBtn?.addEventListener('click', () => setMenu(true));
closeBtn?.addEventListener('click', () => setMenu(false));
menu?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
  if (e.key === 'Tab') {
    const f = [...menu.querySelectorAll<HTMLElement>('button, a, summary')].filter((el) => el.offsetParent !== null);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
menu?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false); });

/* ---------- scroll reveal (only for elements that start below the fold) ---------- */
if ('IntersectionObserver' in window && !reduce.matches) {
  const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  const vh = window.innerHeight;
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  doc.classList.add('reveal-on');
  for (const el of els) {
    if (el.getBoundingClientRect().top > vh) { el.classList.add('pre'); io.observe(el); }
  }
}

/* ---------- carousels ---------- */
for (const root of document.querySelectorAll<HTMLElement>('[data-carousel]')) {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const nav = root.querySelector<HTMLElement>('[data-nav]')!;
  const dotsEl = root.querySelector<HTMLElement>('[data-dots]')!;
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const items = [...track.children] as HTMLElement[];
  let pages = 1;
  const step = () => (items[1] ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth);
  const perView = () => Math.max(1, Math.round(track.clientWidth / step()));
  function build() {
    pages = Math.max(1, Math.ceil(items.length / perView()));
    nav.hidden = pages <= 1;
    dotsEl.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to slide ${i + 1} of ${pages}`);
      b.addEventListener('click', () => go(i));
      dotsEl.append(b);
    }
    sync();
  }
  function go(page: number) {
    const max = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: Math.min(max, page * perView() * step()), behavior: reduce.matches ? 'auto' : 'smooth' });
  }
  function current() {
    const max = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= max - 4) return pages - 1;
    return Math.round(track.scrollLeft / (perView() * step()));
  }
  function sync() {
    const c = current();
    [...dotsEl.children].forEach((d, i) => d.setAttribute('aria-current', String(i === c)));
    prev.disabled = c <= 0;
    next.disabled = c >= pages - 1;
  }
  prev.addEventListener('click', () => go(current() - 1));
  next.addEventListener('click', () => go(current() + 1));
  let t = 0;
  track.addEventListener('scroll', () => { cancelAnimationFrame(t); t = requestAnimationFrame(sync); }, { passive: true });
  new ResizeObserver(() => build()).observe(track);
}

/* ---------- footer year (stays current even if the site isn't rebuilt) ---------- */
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));

/* ---------- third parties, loaded lazily ---------- */
const body = document.body;
let thirdPartyLoaded = false;
function loadScript(src: string) {
  const s = document.createElement('script');
  s.src = src; s.async = true;
  document.head.append(s);
  return s;
}
let gaLoaded = false;
// GA4 only reports from the production domain, so previews (GitHub Pages, localhost)
// never pollute the practice's analytics.
const GA_HOSTS = /(^|\.)svmedaesthetics\.com$/;
function loadGA() {
  const id = body.dataset.ga;
  if (!id || gaLoaded || !GA_HOSTS.test(location.hostname)) return;
  gaLoaded = true;
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer.push(arguments); };
  w.gtag('js', new Date());
  w.gtag('config', id);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
}
function loadCherryFloating() {
  if (body.dataset.cherry !== 'float') return;
  const w = window as any;
  w._hw = w._hw || function () { (w._hw.q = w._hw.q || []).push(arguments); };
  const el = document.createElement('div');
  el.id = 'floatingEstimator';
  body.append(el);
  const s = loadScript('https://files.withcherry.com/widgets/widget.js');
  s.id = '_hw';
  w._hw('init', {
    debug: false,
    variables: { slug: body.dataset.cherrySlug, name: 'Salinas Valley Medical Aesthetics', images: [26], customLogo: '', defaultPurchaseAmount: 750, customImage: '', imageCategory: 'medspa', language: 'en' },
    styles: {
      primaryColor: '#5f7224', secondaryColor: '#9bb24d10', fontFamily: 'Varela', headerFontFamily: 'Source Sans 3',
      floatingEstimator: { position: 'bottom-right', offset: { x: '16px', y: '16px' }, zIndex: 30, ctaFontFamily: 'Source Sans 3', bodyFontFamily: 'Varela', ctaColor: '#5f7224', ctaTextColor: '#FFFFFF' },
    },
  }, ['floatingEstimator']);
}
function loadThirdParty() {
  if (thirdPartyLoaded) return;
  thirdPartyLoaded = true;
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((ev) => window.removeEventListener(ev, loadThirdParty));
  loadGA();
  // Cherry's floating pill waits a little longer so it never competes with first paint or content.
  setTimeout(loadCherryFloating, 2500);
}
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((ev) => window.addEventListener(ev, loadThirdParty, { once: true, passive: true }));
// Analytics also loads on idle for visitors who never interact.
window.addEventListener('load', () => {
  const idle = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1));
  setTimeout(() => idle(loadGA), 6000);
});
