// Seed homepage banners (the hero cross-fades between them). Editable in /admin > Banners.
// TODO(client): headlines are placeholders; the photos are the owner's (content/images.json).
const banners = [
  {
    title: 'Woven for every celebration',
    subtitle: 'Katan, tissue, soft silk and everyday cotton, chosen one saree at a time.',
    image: '/products/gulabi-rupali-katan.webp',
    alt: 'Rose mauve katan silk saree with silver zari brocade border',
    ctaLabel: 'Shop Katan',
    ctaHref: '/shop?type=katan-benarasi',
    order: 1,
    active: true,
  },
  {
    title: 'Light for Eid and every evening after',
    subtitle: 'Tissue and organza with a soft metallic sheen.',
    image: '/products/sage-tissue-silk.webp',
    alt: 'Sage green tissue silk saree with gold buti, by a sunlit window',
    ctaLabel: 'Shop tissue',
    ctaHref: '/shop?type=tissue-organza',
    order: 2,
    active: true,
  },
  {
    title: 'Gold for the wedding day',
    subtitle: 'Katan and Benarasi brocade in zari.',
    image: '/products/khoyeri-jaal-benarasi.webp',
    alt: 'Maroon Benarasi saree with an all-over gold floral jaal',
    ctaLabel: 'Wedding edit',
    ctaHref: '/shop?occasion=Wedding',
    order: 3,
    active: true,
  },
];

module.exports = banners;
