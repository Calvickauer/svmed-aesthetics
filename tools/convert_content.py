#!/usr/bin/env python3
"""One-off converter: /workspace/svmed/content/*.md (crawl capture) -> src/content/pages/*.md
for the generic templates (service, brand, team bio). Pages with bespoke layouts are
written by hand in src/pages/. Kept in the repo for provenance; re-running overwrites
hand edits, so don't re-run after editing."""
import csv, json, re, os, sys
SV = '/workspace/svmed'
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'pages')
rows = list(csv.DictReader(open(f'{SV}/assets/manifest.csv')))
byurl, bystem = {}, {}
for r in rows:
    lf = r['local_file'].replace('assets/', '', 1)
    byurl[r['original_url']] = lf
    for v in r['variant_urls_seen'].split():
        byurl.setdefault(v, lf)
    bystem.setdefault(re.sub(r'\.\w+$', '', r['original_url']), lf)

def resolve(u):
    u = u.strip()
    if u in byurl: return byurl[u]
    u2 = re.sub(r'-\d+x\d+(?=\.\w+$)', '', u)
    for cand in (u2, u2.replace('-scaled', '')):
        if cand in byurl: return byurl[cand]
        st = re.sub(r'\.\w+$', '', cand)
        if st in bystem: return bystem[st]
    return None

pageimgs = json.load(open('os.path.join(os.path.dirname(__file__), 'pageimgs.json')'))
FIX = [
    ('Benifits', 'Benefits'), ('pickied', 'picked'), ("Michaels easy-going", "Michael’s easy-going"),
    ('working for dr. Laser', 'working for Dr. Laser'), ('Is there a age', 'Is there an age'),
    ('at least 21 ,', 'at least 21,'), ('lower pack pain', 'lower back pain'),
    ('other that your own', 'other than your own'), ('For over 10 years', 'For over 12 years'),
    ('http://www.alastin.com/SalinasValleyMedicalAesthetics', 'https://www.alastin.com/SalinasValleyMedicalAesthetics'),
    ('https://www.coolsculpting.com/tone-muscle/how-cooltone-works', 'https://www.cooltone.com/'),
    ('?provider=salinas-valley-medical-aesthetics  ', '?provider=salinas-valley-medical-aesthetics '),
    ('Luz Reules at', 'Luz Ruelas at'), ('  ', ' '),
]

def convert(slug, kind):
    src = open(f'{SV}/content/{slug}.md').read()
    head, body = src.split('\n---\n', 1)
    h1 = re.search(r'^# (.+)$', head, re.M).group(1).strip()
    title = re.search(r'<title>: (.+)$', head, re.M).group(1).strip()
    desc = re.search(r'meta description: (.+)$', head, re.M).group(1).strip()
    og = re.search(r'og:image: (.+)$', head, re.M).group(1).strip()
    body = re.split(r'^###### What We Offer', body, flags=re.M)[0]
    body = re.split(r'^## TREAT YOURSELF', body, flags=re.M)[0]
    # [![alt](thumb)](full-upload) -> ![alt](thumb)
    body = re.sub(r'\[(!\[[^\]]*\]\([^)]+\))\]\(https://svmedaesthetics\.com/wp-content/uploads/[^)]+\)', r'\1', body)
    def img(m):
        alt, url = m.group(1), m.group(2).split(' ')[0]
        lf = resolve(url)
        if not lf: print('UNRESOLVED', slug, url, file=sys.stderr); return m.group(0)
        if alt.strip().lower() in ('null',): alt = ''
        return f'![{alt}](img:{lf})'
    body = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', img, body)
    body = re.sub(r'\]\(https://svmedaesthetics\.com(/[^)\s]*)', r'](\1', body)
    for a, b in FIX: body = body.replace(a, b)
    body = re.sub(r'\n{3,}', '\n\n', body).strip() + '\n'
    used = set(re.findall(r'img:([^)\s]+)', body))
    info = pageimgs.get(slug, {})
    banner = (info.get('banner') or '').replace('assets/', '', 1) or None
    seen=set(); gallery=[]
    for x in info.get('extra', []):
        x = x.replace('assets/', '', 1)
        if x.endswith('.pdf') or x in used: continue
        key = re.sub(r'-1(?=\.\w+$)', '', x)  # 89677-1.png duplicates 89677.png
        if key in seen: continue
        seen.add(key); gallery.append(x)
    path = '/' + slug.replace('__', '/') + '/'
    fm = {
        'title': h1, 'metaTitle': title.replace(' - Best Cosmetic Dermatologist Near Salinas, CA', ''),
        'description': None if desc == '(none)' else desc, 'path': path, 'kind': kind,
        'banner': banner, 'gallery': gallery,
        'ogImage': resolve(og) if og.startswith('http') else None,
    }
    lines = ['---']
    for k, v in fm.items():
        lines.append(f'{k}: {json.dumps(v, ensure_ascii=False)}')
    lines.append('---')
    open(os.path.join(OUT, slug + '.md'), 'w').write('\n'.join(lines) + '\n\n' + body)

for f in sorted(os.listdir(f'{SV}/content')):
    s = f[:-3]
    if s.startswith('services__'): convert(s, 'service')
    elif s.startswith('skin-care__'): convert(s, 'brand')
    elif s.startswith('about-us__meet-the-team__'): convert(s, 'team')
print('ok')
