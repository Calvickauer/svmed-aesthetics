// Single source of truth for business facts. Change here, not in pages.
export const SITE = {
  name: 'Salinas Valley Medical Aesthetics',
  short: 'SVMA',
  url: 'https://svmedaesthetics.com', // canonical production domain (live site; preview lives on GitHub Pages)
  phone: '831-975-4175',
  tel: '+18319754175',
  email: 'Luz.svma@gmail.com',
  address: { street: '30 Central Avenue', city: 'Salinas', region: 'CA', zip: '93901', country: 'US' },
  // From the practice's own Google Maps embed on the current Contact page
  geo: { lat: 36.67694967997414, lng: -121.65916148471351 },
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3199.8981552567598!2d-121.65916148471351!3d36.67694967997414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808df8c3df36e801%3A0x8bc891d149a569bf!2s30%20Central%20Ave%2C%20Salinas%2C%20CA%2093901%2C%20USA!5e0!3m2!1sen!2sus!4v1675690083748!5m2!1sen!2sus',
  directions: 'https://goo.gl/maps/yCUJgjnZEBE4Tvtz9',
  hours: [
    ['Monday', '9:00 am – 5:00 pm'],
    ['Tuesday', '9:00 am – 5:00 pm'],
    ['Wednesday', '9:00 am – 5:00 pm'],
    ['Thursday', '9:00 am – 5:00 pm'],
    ['Friday', '9:00 am – 5:00 pm'],
    ['Saturday & Sunday', 'Closed'],
  ] as const,
  years: 'over 12 years',
  facebook: 'https://www.facebook.com/salinasvalleymed/',
  instagram: 'https://www.instagram.com/svmedaesthetics/',
  store: 'https://salinas-valley-medical-aesthetics-inc.square.site/',
  booking: 'https://book.squareup.com/appointments/1zj3pb9rr1378z/location/LBVWHRETQQ7B4',
  bookingWidget: 'https://app.squareup.com/appointments/buyer/widget/1zj3pb9rr1378z/LBVWHRETQQ7B4',
  careCredit: 'https://www.carecredit.com/go/936NSZ/?dtc=DS9X&sitecode=CCLBADS9X',
  cherrySlug: 'salinas-valley-medical-aesthetics-inc--',
  ga4: 'G-8ZDFZM1P1M',
  googlePlaceId: 'ChIJ_82jluv4jYARZtBNDPQw83I',
  googleReviewCount: 44,
};

export const mailto = `mailto:${SITE.email}`;
export const telHref = `tel:${SITE.tel}`;

/** Prefix an internal path with the deploy base ("/svmed-aesthetics/"). */
export function u(path = '/'): string {
  if (/^(https?:|mailto:|tel:|#|\/\/)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return base + p;
}

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us/', children: [{ label: 'Meet the Team', href: '/about-us/meet-the-team/' }] },
  { label: 'Galleries', href: '/before-after/' },
  {
    label: 'Services',
    href: '/services/',
    children: [
      { label: 'Neuromodulators (Botox)', href: '/services/neuromodulators/' },
      { label: 'Dermal Fillers', href: '/services/dermal-fillers/' },
      { label: 'Laser Hair Removal', href: '/services/laser-hair-removal/' },
      { label: 'Laser Services', href: '/services/laser-skin-rejuvenation/' },
      { label: 'Microneedling', href: '/services/microneedling/' },
      { label: 'PDO Threads', href: '/services/pdo-threads/' },
      { label: 'CoolSculpting®', href: '/services/coolsculptings/', children: [{ label: 'CoolTone', href: '/services/coolsculptings/cool-tone/' }] },
      { label: 'PRF / Plasma Rejuvenation', href: '/services/prf-plasma-rejuvenation/' },
      { label: 'PRF Hair Restoration', href: '/services/prf-hair-restoration/' },
      { label: 'Biostimulators', href: '/services/biostimulators/' },
      { label: 'Radiofrequency Microneedling', href: '/services/radio-frequency-microneedling/' },
    ],
  },
  { label: 'CoolSculpting®', href: '/services/coolsculptings/' },
  {
    label: 'Skin Care',
    href: '/skin-care/',
    children: [
      { label: 'Skin Care – All', href: '/skin-care/' },
      { label: 'Colorescience', href: '/skin-care/colorscience/' },
      { label: 'Alastin', href: '/skin-care/alastins/' },
      { label: 'Obagi', href: '/skin-care/obagi/' },
      { label: 'SkinCeuticals', href: '/skin-care/skinceuticals/' },
      { label: 'SkinMedica', href: '/skin-care/skin-medica/' },
      { label: 'SkinBetter', href: '/skin-care/skinbetter/' },
      { label: 'Noon Aesthetics', href: '/skin-care/noon-aesthetics/' },
      { label: 'Epicutis', href: '/skin-care/epicutis/' },
    ],
  },
  { label: 'Store', href: SITE.store, external: true },
  { label: 'Book Appointment', href: '/request-appointment/' },
  { label: 'Contact Us', href: '/contact-us/' },
  {
    label: 'Financing',
    href: '/financing/',
    children: [
      { label: 'Cherry Payment Plans', href: '/financing/cherry-payment-plans/' },
      { label: 'Care Credit', href: '/financing/#credit' },
    ],
  },
] as NavItem[];

export type NavItem = { label: string; href: string; external?: boolean; children?: NavItem[] };

/** Services shown in the "What We Offer" carousel (one canonical photo each). */
export const SERVICE_CARDS = [
  { title: 'Neuromodulators', href: '/services/neuromodulators/', img: '2022/11/derma.png', text: 'Smooth and soften lines in the forehead, frown lines and crow’s feet with neuromodulators.' },
  { title: 'Dermal Fillers', href: '/services/dermal-fillers/', img: '2022/11/dermal-fillers.jpg', text: 'Restore a youthful appearance and smooth lines with dermal fillers.' },
  { title: 'Laser Hair Removal', href: '/services/laser-hair-removal/', img: '2022/11/LhR.png', text: 'Long term solution for unwanted hair.' },
  { title: 'Laser Skin Rejuvenation', href: '/services/laser-skin-rejuvenation/', img: '2022/11/lsr.png', text: 'The latest laser technology for resurfacing, collagen stimulation and treating dark spots.' },
  { title: 'Microneedling', href: '/services/microneedling/', img: '2022/11/laser.png', text: 'Boost collagen production, and leave with glowing and youthful looking skin.' },
  { title: 'PDO Threads', href: '/services/pdo-threads/', img: '2022/11/pdo.png', text: 'Lift and smooth sagging skin and lower face laxity with PDO threads.' },
  { title: 'CoolSculpting®', href: '/services/coolsculptings/', img: '2023/07/weightloss.png', text: 'Non-surgical fat reduction treatment.' },
  { title: 'CoolTone', href: '/services/coolsculptings/cool-tone/', img: '2025/09/cooltonev2.jpg', text: 'Tone, strengthen and firm muscles.' },
  { title: 'Biostimulators', href: '/services/biostimulators/', img: '2023/07/bio-naturalss.png', text: 'Enhance your collagen for the most natural looking results.' },
  { title: 'Radiofrequency Microneedling', href: '/services/radio-frequency-microneedling/', img: '2023/07/bio-stimulator.png', text: 'Skin tightening & improve fine lines and scars with RF microneedling.' },
];

export const BRAND_CARDS: Record<string, { title: string; href: string; img: string }[]> = {
  '/skin-care/alastins/': [{ title: 'Obagi', href: '/skin-care/obagi/', img: '2022/11/LhR.png' }, { title: 'Colorescience', href: '/skin-care/colorscience/', img: '2022/11/laser.png' }],
  '/skin-care/colorscience/': [{ title: 'Alastin', href: '/skin-care/alastins/', img: '2022/11/derma.png' }, { title: 'SkinMedica', href: '/skin-care/skin-medica/', img: '2022/11/laser.png' }],
  '/skin-care/epicutis/': [{ title: 'Alastin', href: '/skin-care/alastins/', img: '2022/11/LhR.png' }, { title: 'Obagi', href: '/skin-care/obagi/', img: '2022/11/derma.png' }],
  '/skin-care/noon-aesthetics/': [{ title: 'Alastin', href: '/skin-care/alastins/', img: '2022/11/LhR.png' }, { title: 'Obagi', href: '/skin-care/obagi/', img: '2022/11/derma.png' }],
  '/skin-care/obagi/': [{ title: 'Alastin', href: '/skin-care/alastins/', img: '2022/11/laser.png' }, { title: 'SkinMedica', href: '/skin-care/skin-medica/', img: '2022/11/derma.png' }],
  '/skin-care/skin-medica/': [{ title: 'Obagi', href: '/skin-care/obagi/', img: '2022/11/LhR.png' }, { title: 'SkinBetter', href: '/skin-care/skinbetter/', img: '2022/11/derma.png' }],
  '/skin-care/skinbetter/': [{ title: 'Obagi', href: '/skin-care/obagi/', img: '2022/11/LhR.png' }, { title: 'SkinCeuticals', href: '/skin-care/skinceuticals/', img: '2022/11/derma.png' }],
  '/skin-care/skinceuticals/': [{ title: 'Alastin', href: '/skin-care/alastins/', img: '2022/11/LhR.png' }, { title: 'SkinMedica', href: '/skin-care/skin-medica/', img: '2022/11/derma.png' }],
};

export const TEAM = [
  { name: 'Teresa McMillin', role: 'PA-C, MPAS, Owner', img: '2025/09/Teresav2.jpg', href: '/about-us/meet-the-team/teresa-mcmillin/' },
  { name: 'Rachel Bojka', role: 'PA-C, Medical Aesthetic Specialist', img: '2025/09/Rachelv2.jpg', href: '/about-us/meet-the-team/rachel-bojka/', instagram: 'https://www.instagram.com/rachel.svma/' },
  { name: 'Michael Daniels', role: 'RN', img: '2025/09/Michealv2.jpg', href: '/about-us/meet-the-team/michael-daniels-rn/', instagram: 'https://www.instagram.com/michael.svma/' },
  { name: 'Veronica Santa Cruz', role: 'RN', img: '2025/09/Veronicav2.jpg', href: '/about-us/meet-the-team/veronica-santa-cruz/' },
];
export const TEAM_FULL = [
  { name: 'Dr. Atul Jani', role: 'Medical Director', img: '2022/11/atul.png' },
  ...TEAM,
  { name: 'Luz Ruelas', role: 'Office Manager & CoolSculpting Specialist', img: '2025/09/Luzv2.jpg', href: '/about-us/meet-the-team/luz-reules/' },
  { name: 'Giselle Ruiz', role: 'Receptionist', img: '2025/09/Gisellev2.jpg' },
];

/** The six testimonials shown in the site's own quote slider (verbatim, typos in names fixed). */
export const TESTIMONIALS = [
  { name: 'Celeste K', text: 'Michael and Rachel are so good! I have seen Michael for Botox, Dysport, fillers (lips, cheeks, tear troughs), and BBL laser treatments. He has talent and a wonderful personality that made me so comfortable. He has many years experience with aesthetics along with skills as a surgical RN. I feel very confident in his treatments and my results have been amazing. Very happy with Salinas Valley Medical Aesthetics!' },
  { name: 'Grace E', text: 'I absolutely love this place, the entire staff is so welcoming, professional and knowledgeable. I’ve had a great experience with all the girls in the office from Diana who is the best with CoolSculpting, Rachel who went far past what I was hoping for with my fillers, to the super sweet girls up front. I am beyond happy with my results, I would not consider going anywhere else.' },
  { name: 'Marbelli T', text: 'Veronica definitely puts her heart into her work. My skin looks amazing. Thank you so much 🙂' },
  { name: 'Stephanie S', text: 'ALWAYS great results! Professional, friendly staff and I highly recommend a visit. They also carry very nice products.' },
  { name: 'Marilyn M', text: 'I love going to Rachel and Teresa. they are so professional and amazing at what they do.' },
  { name: 'Christianna K', text: 'Teresa is amazing! All staff in the office are so nice. Rachel did my PDO threads recently and was excellent. I didn’t even get a single bruise! Highly recommend Teresa and Racheal for any service.' },
];

/** Snapshot of the Trustindex Google-reviews widget as rendered on 2026-10-07 (5 of 44 reviews shown by the widget). */
export const GOOGLE_REVIEWS = [
  { name: 'Marbelli Tinajero', text: 'Veronica definitely puts her heart into her work. My skin looks amazing. Thank you so much :)' },
  { name: 'Celeste Krilanovich Cook', text: 'Michael and Rachel are so good! I have seen Michael for Botox, Dysport, fillers (lips, cheeks, tear troughs), and BBL laser treatments. He has talent and a wonderful personality that made me so comfortable. He has many years experience with aesthetics along with skills as a surgical RN. I feel very confident in his treatments and my results have been amazing. Very happy with Salinas Valley Medical Aesthetics!' },
  { name: 'Peyton Jeffries', text: 'Got coolsculpting done here on my lower belly. And I am so so happy with the results. Good service as well as very clean and welcoming environment!! Thanks guys!' },
  { name: 'Virginia Basgall', text: 'Teresa recommended IPL laser treatments for my sun damage to my face and I am so happy with the results.  Totally worth it!  She is very very good at what she does, I highly recommend Teresa!' },
  { name: 'Bryce Hoops', text: 'Teresa and the other members of SVMA do an amazing job!' },
];

/** Static snapshot of the 8 posts the (stale) Smash Balloon feed shows, newest first. */
export const INSTAGRAM = [
  ['434159901_1350753115600225_7934779170475907111_nfull.jpg', 'https://www.instagram.com/reel/C4yV_PcvexJ/', 'Everyday makeup look featuring Colorescience products'],
  ['434018884_930243508565264_3247031594910709303_nfull.jpg', 'https://www.instagram.com/reel/C4wHHRBSpbm/', 'PRF microneedling on our microneedling giveaway winner'],
  ['430414204_395315119761576_4592787395107636301_nfull.jpg', 'https://www.instagram.com/reel/C3_M_fhyDyy/', 'Microneedling, also known as collagen induction therapy'],
  ['429465006_1071889377236344_1580962005730608615_nfull.jpg', 'https://www.instagram.com/reel/C3qkSQDSIo7/', 'Lip filler and nonsurgical rhinoplasty maintenance treatment'],
  ['421921762_124780604063769_9114207820549952570_nfull.jpg', 'https://www.instagram.com/reel/C2f-tpNyDdA/', 'Nonsurgical rhinoplasty transformation'],
  ['419572429_915089553400582_6197468722144419639_nfull.jpg', 'https://www.instagram.com/reel/C2S2328y3EH/', 'Rachel’s CoolSculpting journey, six months later'],
  ['418101878_2522592034566823_4261011467571287654_nfull.jpg', 'https://www.instagram.com/reel/C18KbqQxwNx/', 'PRF (platelet-rich fibrin) explained'],
  ['407708565_1803085820126111_4906069915927753094_nfull.jpg', 'https://www.instagram.com/reel/C0hogLESKiw/', 'Liquid rhinoplasty transformation for a giveaway winner'],
].map(([f, href, alt]) => ({ img: 'instagram-feed/' + f, href, alt }));
