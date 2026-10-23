// The fixed lists the catalog is built from: saree types, fabrics, occasions and colours.
// The store's filters, the admin form and the Product schema all read these.

const SAREE_TYPES = [
  {
    name: 'Jamdani',
    slug: 'jamdani',
    bn: 'জামদানি',
    blurb: 'Handwoven on the loom in Narayanganj and Demra; a UNESCO-listed weaving tradition.',
  },
  {
    name: 'Katan / Benarasi',
    slug: 'katan-benarasi',
    bn: 'কাতান / বেনারসি',
    blurb: 'Silk brocade with zari work, for weddings and holud.',
  },
  {
    name: 'Rajshahi silk',
    slug: 'rajshahi-silk',
    bn: 'রাজশাহী সিল্ক',
    blurb: 'Soft silk from Rajshahi, printed or plain.',
  },
  {
    name: 'Tangail tant',
    slug: 'tangail-tant',
    bn: 'টাঙ্গাইল তাঁত',
    blurb: 'Light handloom cotton for every day and Pohela Boishakh.',
  },
  {
    name: 'Monipuri',
    slug: 'monipuri',
    bn: 'মণিপুরী',
    blurb: 'Light, textured weaves from Sylhet.',
  },
  {
    name: 'Muslin',
    slug: 'muslin',
    bn: 'মসলিন',
    blurb: 'The revival of a very fine handwoven cotton.',
  },
  {
    name: 'Half-silk / Soft silk',
    slug: 'half-silk',
    bn: 'হাফ সিল্ক',
    blurb: 'Everyday premium with a soft fall.',
  },
  {
    name: 'Kantha stitch',
    slug: 'kantha',
    bn: 'কাঁথা স্টিচ',
    blurb: 'Hand embroidery on silk or cotton.',
  },
  {
    name: 'Georgette / Chiffon',
    slug: 'georgette-chiffon',
    bn: 'জর্জেট / শিফন',
    blurb: 'Fluid party wear.',
  },
  {
    name: 'Tissue / Organza',
    slug: 'tissue-organza',
    bn: 'টিস্যু / অরগাঞ্জা',
    blurb: 'Sheer and festive.',
  },
  {
    name: 'Cotton (everyday)',
    slug: 'cotton',
    bn: 'সুতি',
    blurb: 'Easy cotton for the office and daily wear.',
  },
];

const TYPE_NAMES = SAREE_TYPES.map((type) => type.name);

const FABRICS = [
  'Cotton',
  'Half-silk',
  'Silk',
  'Muslin cotton',
  'Georgette',
  'Chiffon',
  'Tissue',
  'Organza',
];

const OCCASIONS = [
  'Wedding',
  'Holud',
  'Eid',
  'Puja',
  'Pohela Boishakh',
  'Party',
  'Office',
  'Everyday',
];

// Swatch hex values are for the colour filter only
const COLORS = [
  { name: 'Red', hex: '#B3202A' },
  { name: 'Maroon', hex: '#6B1E2B' },
  { name: 'Pink', hex: '#E07A9B' },
  { name: 'Magenta', hex: '#A3195B' },
  { name: 'Peach', hex: '#F2A97E' },
  { name: 'Orange', hex: '#E0701F' },
  { name: 'Yellow', hex: '#E9B824' },
  { name: 'Gold', hex: '#B88A44' },
  { name: 'Green', hex: '#3E7B4F' },
  { name: 'Teal', hex: '#1F9A9A' },
  { name: 'Blue', hex: '#3A5BA0' },
  { name: 'Purple', hex: '#5B3A8C' },
  { name: 'Brown', hex: '#6A4630' },
  { name: 'Black', hex: '#1E1A1C' },
  { name: 'Grey', hex: '#8E8A8C' },
  { name: 'White', hex: '#F7F4EF' },
  { name: 'Ivory', hex: '#EFE6D2' },
  { name: 'Multicolour', hex: '#C2185B' },
];

// Standard length shown on every product (overridable per product)
const DEFAULT_LENGTH = { sareeMetres: 5.5, blouseMetres: 0.8 };

// Optional add-on at checkout, per saree
const FALL_PICO_PRICE = 150;

module.exports = {
  SAREE_TYPES,
  TYPE_NAMES,
  FABRICS,
  OCCASIONS,
  COLORS,
  DEFAULT_LENGTH,
  FALL_PICO_PRICE,
};
