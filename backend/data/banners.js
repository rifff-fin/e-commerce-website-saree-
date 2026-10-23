// Seed homepage banners (the hero cross-fades between them). Editable in /admin > Banners.
// TODO(client): swap the placeholder photos for the client's own campaign shots.
const banners = [
  {
    title: 'Woven for every celebration',
    subtitle: 'Jamdani, Katan and Rajshahi silk, chosen one saree at a time.',
    image: '/products/benarasi-ivory-drape-01.webp',
    alt: 'Ivory silk brocade saree draped on a form',
    ctaLabel: 'Shop Jamdani',
    ctaHref: '/shop?type=jamdani',
    order: 1,
    active: true,
  },
  {
    title: 'Silk for Eid and every evening after',
    subtitle: 'Soft Rajshahi silk with woven borders.',
    image: '/products/rajshahi-silk-magenta-01.webp',
    alt: 'Magenta Rajshahi silk saree with a gold border, draped on a form',
    ctaLabel: 'Shop Rajshahi silk',
    ctaHref: '/shop?type=rajshahi-silk',
    order: 2,
    active: true,
  },
  {
    title: 'Gold for the wedding day',
    subtitle: 'Katan and Benarasi brocade in zari.',
    image: '/products/benarasi-gold-drape-01.webp',
    alt: 'Gold silk brocade saree draped on a form',
    ctaLabel: 'Wedding edit',
    ctaHref: '/shop?occasion=Wedding',
    order: 3,
    active: true,
  },
];

module.exports = banners;
