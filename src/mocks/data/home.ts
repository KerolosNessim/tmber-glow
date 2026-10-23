import type { HomeContent } from '@/features/home/types/home.types'

const img = (name: string) => `/images/${name}.jpg`

export const homeContent: HomeContent = {
  slides: [
    {
      id: 'winter',
      photo: { src: img('s1'), alt: { ar: 'هودي Ridge أسود تقيل', en: 'The black Ridge heavy hoodie' }, focus: '50% 22%' },
      eyebrow: { kind: 'spec', text: 'WINTER 26 · 320 GSM' },
      title: { ar: '*دفا* من غير تقل.', en: 'Built for *cold* mornings' },
      body: {
        ar: 'ملتون قطن ٣٢٠ جرام مبطن من جوه، متفصّل يفضل محافظ على شكله غسلة ورا غسلة.',
        en: 'Heavy 320 GSM cotton fleece, brushed inside. Cut to keep its shape wash after wash.',
      },
      cta: { label: { ar: 'شوف الكولكشن', en: 'Shop the collection' }, to: '/collections' },
    },
    {
      id: 'quarter-zip',
      photo: { src: img('s2'), alt: { ar: 'سويتشيرت ربع سوستة لونه زيتي فاتح', en: 'Sage quarter-zip sweatshirt' }, focus: '50% 30%' },
      eyebrow: { kind: 'new' },
      title: { ar: 'ربع سوستة. *أخف وأشيك.*', en: 'The *quarter zip*' },
      body: {
        ar: 'تريكو مضلّع بلون زيتي هادي. تلبسه على تيشيرت أو تحت جاكيت.',
        en: 'Ribbed knit in sage. Wear it over a tee, or under a jacket.',
      },
      cta: { label: { ar: 'شوف الكولكشن', en: 'Shop the collection' }, to: '/collections/quarter-zip' },
    },
    {
      id: 'washed',
      photo: { src: img('s3'), alt: { ar: 'هودي أوفر سايز مغسول', en: 'Washed oversize hoodie' }, focus: '50% 28%' },
      eyebrow: { kind: 'spec', text: 'WASHED · 360 GSM' },
      title: { ar: 'مغسول. *أوفر سايز.*', en: 'Washed. *Oversize.*' },
      body: {
        ar: 'صبغة مغسولة بتدي الهودي شكل ملبوس من أول يوم.',
        en: 'A garment-dyed wash that looks lived-in from day one.',
      },
      cta: { label: { ar: 'شوف الأوفر سايز', en: 'Shop oversize' }, to: '/collections/oversize' },
    },
  ],
  perks: [
    { id: 'ship', icon: 'truck', title: { ar: 'شحن مجاني', en: 'Free shipping' }, text: { ar: 'على الطلبات فوق ١٥٠٠ جنيه', en: 'On orders over 1,500 EGP' } },
    { id: 'swap', icon: 'swap', title: { ar: 'استبدال ١٤ يوم', en: '14-day exchange' }, text: { ar: 'المقاس مش مظبوط؟ بدّله', en: 'Size not right? Swap it' } },
    { id: 'cod', icon: 'cash', title: { ar: 'الدفع عند الاستلام', en: 'Cash on delivery' }, text: { ar: 'أو كارت وانستاباي ومحافظ', en: 'Or card, InstaPay, wallets' } },
    { id: 'cotton', icon: 'leaf', title: { ar: 'ملتون قطن ١٠٠٪', en: '100% cotton fleece' }, text: { ar: 'صناعة مصرية', en: 'Made in Egypt' } },
  ],
  intro: {
    spec: '100% COTTON · BRUSHED FLEECE · MADE TO LAST',
    title: { ar: 'كولكشن الشتا *نزل*', en: 'The winter collection *is here*' },
    body: {
      ar: 'ملتون قطن تقيل بقصّات هتلبسها كل يوم. اختار القسم وابدأ.',
      en: 'Heavy cotton fleece in cuts you will wear every day. Pick a category to start.',
    },
  },
  look: {
    id: 'fleece-season',
    title: 'Fleece Season',
    subtitle: { ar: 'هودي وبنطلون، نفس الخامة ونفس اللون.', en: 'Hoodie + pants, same fabric, same colour.' },
    photo: { src: img('look'), alt: { ar: 'هودي بيج مع بنطلون كارجو رمادي', en: 'Beige hoodie with grey cargo pants' }, focus: '50% 35%' },
    productIds: ['ridge', 'trail'],
    setPrice: 2350,
    hotspots: [
      { productId: 'ridge', x: 38, y: 42 },
      { productId: 'trail', x: 60, y: 84 },
    ],
  },
  lookbook: {
    handle: '@timberglow',
    posts: [
      { id: 'g1', photo: { src: img('g1'), alt: { ar: 'صورة من انستجرام ١', en: 'Instagram photo 1' }, focus: '50% 40%' }, href: '#' },
      { id: 'g2', photo: { src: img('g2'), alt: { ar: 'صورة من انستجرام ٢', en: 'Instagram photo 2' }, focus: '50% 30%' }, href: '#' },
      { id: 'g3', photo: { src: img('g3'), alt: { ar: 'صورة من انستجرام ٣', en: 'Instagram photo 3' }, focus: '50% 20%' }, href: '#' },
      { id: 'g4', photo: { src: img('g4'), alt: { ar: 'صورة من انستجرام ٤', en: 'Instagram photo 4' }, focus: '50% 25%' }, href: '#' },
    ],
  },
}
