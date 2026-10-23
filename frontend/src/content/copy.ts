// All store copy lives here, grouped by the section or page that shows it.
// `TODO(client)` marks business facts the client still has to confirm.
// Labels shown in both languages are { en, bn } pairs (see store/langStore.ts).

export const brand = {
  name: "Moon's Wardrobe",
  nameBn: 'মুন’স ওয়ারড্রোব',
  tagline: 'Woven for every celebration', // TODO(client)
  // TODO(client): real contact details. Empty values hide the number and show a notice.
  phone: '',
  whatsapp: '', // international format without +, e.g. 8801XXXXXXXXX
  messenger: '', // Facebook page username for m.me/<username>
  email: '',
  address: 'Dhaka, Bangladesh', // TODO(client): showroom address
  hours: 'Every day, 10 am to 9 pm', // TODO(client)
  instagram: '', // TODO(client): confirm the official Instagram handle
};

export const demo = {
  ribbon: 'Demo store: payments are simulated and no order is shipped.',
  short: 'Demo store',
};

export const nav = {
  shop: { en: 'Shop', bn: 'শপ' },
  weaves: { en: 'Weaves', bn: 'বুনন' },
  occasions: { en: 'Occasions', bn: 'উপলক্ষ' },
  newIn: { en: 'New in', bn: 'নতুন' },
  track: { en: 'Track order', bn: 'অর্ডার ট্র্যাক' },
  search: { en: 'Search', bn: 'খুঁজুন' },
  wishlist: { en: 'Wishlist', bn: 'পছন্দের তালিকা' },
  bag: { en: 'Bag', bn: 'ব্যাগ' },
  menu: { en: 'Menu', bn: 'মেনু' },
  close: { en: 'Close', bn: 'বন্ধ' },
  language: { en: 'বাংলা', bn: 'English' },
  languageLabel: { en: 'Switch to Bangla', bn: 'ইংরেজিতে দেখুন' },
};

export const hero = {
  accent: 'শাড়ি',
  primary: 'Shop the collection',
  primaryHref: '/shop',
  secondary: 'New arrivals',
  secondaryHref: '/shop?sort=new',
  pause: 'Pause slideshow',
  play: 'Play slideshow',
};

export const weaves = {
  title: 'Shop by weave',
  titleBn: 'বুনন অনুযায়ী',
  intro: 'Every saree here is one of these weaves, and each card says which.',
  count: (n: number) => (n === 1 ? '1 saree' : `${n} sarees`),
  soon: (names: string[]) => `${names.join(', ')} arriving soon.`,
};

export const weaveStory = {
  kicker: 'The weave',
  title: 'Jamdani: woven by hand in Narayanganj',
  body: 'Jamdani motifs are not printed or embroidered. The weaver lays each one into the cloth by hand, thread by thread, as the saree grows on the loom. A detailed piece can take a pair of weavers weeks.',
  facts: [
    { term: 'Where', detail: 'Rupganj, Sonargaon and Demra, around the Shitalakshya river' },
    { term: 'Recognised', detail: 'UNESCO Intangible Cultural Heritage, 2013' },
    {
      term: 'Look for',
      detail: 'Motifs that sit in the weave, with loose thread ends on the back',
    },
  ],
  cta: 'Shop Jamdani',
};

export const occasionEdits = {
  title: 'Edits for the occasion',
  items: [
    {
      name: 'Wedding',
      bn: 'বিয়ে',
      note: 'Katan, Benarasi and red tissue',
      image: '/products/khoyeri-jaal-benarasi',
    },
    {
      name: 'Holud',
      bn: 'হলুদ',
      note: 'Marigold, parrot green and bright prints',
      image: '/products/genda-holud-silk',
    },
    {
      name: 'Eid',
      bn: 'ঈদ',
      note: 'Tissue, silk and soft silk for the day and the dinner',
      image: '/products/sage-tissue-silk',
    },
    {
      name: 'Pohela Boishakh',
      bn: 'বৈশাখ',
      note: 'Red and white, cotton and tant',
      image: '/products/lal-pakhi-mul-cotton',
      short: 'Boishakh',
    },
  ],
};

export const sections = {
  newArrivals: { title: 'New arrivals', link: 'See all new sarees' },
  bestSellers: { title: 'Most loved', link: 'Shop best sellers', prev: 'Previous', next: 'Next' },
  recent: { title: 'Recently viewed' },
  related: { title: 'You may also like' },
};

export const reviews = {
  title: 'What customers say',
  label: 'Sample reviews: placeholder text until real customer reviews are collected.',
  items: [
    {
      quote:
        'The Jamdani was even finer than the photos. It arrived folded in cloth, with a note on how to store it.',
      name: 'Sample review',
      place: 'Dhanmondi, Dhaka',
    },
    {
      quote: 'I paid on delivery and the rider waited while I checked the saree. Easy.',
      name: 'Sample review',
      place: 'Agrabad, Chattogram',
    },
    {
      quote: 'Ordered fall and pico with my Katan, so it was ready to wear for my sister’s holud.',
      name: 'Sample review',
      place: 'Sylhet',
    },
  ],
};

export const lookbook = {
  title: 'From the lookbook',
  handle: brand.instagram,
  note: 'Styled looks from the collection.',
  images: [
    {
      src: '/products/tia-sui-kantha-cotton',
      alt: 'Lime green Kantha cotton saree with pink tassels',
    },
    {
      src: '/products/alpona-gram-print-cotton',
      alt: 'Cream cotton saree with a folk-figure print',
    },
    { src: '/products/sobuj-sona-tissue', alt: 'Green and gold tissue saree in the sun' },
    { src: '/products/kalo-buti-cotton', alt: 'Black cotton saree with woven motifs' },
    { src: '/products/gulabi-rupali-katan', alt: 'Rose mauve katan silk with silver zari' },
    { src: '/products/nil-paar-tangail', alt: 'Ivory handloom saree with a navy and gold border' },
  ],
};

export const newsletter = {
  title: 'Letters from the loom',
  body: 'New weaves, festival edits and care notes, about twice a month.',
  label: 'Email address',
  placeholder: 'you@example.com',
  button: 'Subscribe',
  invalid: 'Please enter a valid email address',
};

export const faq = {
  title: 'Questions, answered',
  items: [
    {
      q: 'How should I care for a Jamdani or Katan?',
      a: 'Dry clean silk, half-silk, Jamdani and Katan. Store each saree folded in a soft cotton cloth, away from damp, and refold it every few months so the folds do not set. Keep perfume and deodorant off zari.',
    },
    {
      q: 'How long does delivery take, and what does it cost?',
      a: 'Inside Dhaka: 1 to 3 days for ৳80. Outside Dhaka: 3 to 5 days for ৳150, to all 64 districts. You can pay the rider in cash.', // TODO(client): confirm courier times
    },
    {
      q: 'Can I exchange a saree?',
      a: 'Yes, within 3 days of delivery if it is unworn, with its tag and in its original fold. Sarees with fall and pico stitched cannot be exchanged unless they are faulty.', // TODO(client): confirm policy
    },
    {
      q: 'How do I know a saree is really handwoven?',
      a: 'Handloom Jamdani and tant show small irregularities and loose thread ends on the back of each motif; a power-loom copy is perfectly even and the back is cut clean. Every product page says whether a saree is handwoven and where it comes from, and we will happily send close-up photos on WhatsApp.',
    },
    {
      q: 'What length is a saree, and is there a blouse piece?',
      a: 'Most sarees are about 5.5 m, plus a 0.8 m blouse piece where the product page says so. The blouse piece is unstitched.',
    },
    {
      q: 'What is fall and pico?',
      a: 'A fall is a strip of cloth stitched inside the lower border so the saree hangs well; pico finishes the raw edge of the pallu. Add it for ৳150 and the saree arrives ready to wear.',
    },
  ],
};

export const product = {
  type: { en: 'Type', bn: 'ধরন' },
  fabric: { en: 'Fabric', bn: 'কাপড়' },
  weave: { en: 'Weave', bn: 'বুনন' },
  origin: { en: 'Origin', bn: 'উৎস' },
  length: { en: 'Length', bn: 'দৈর্ঘ্য' },
  blouse: { en: 'Blouse piece', bn: 'ব্লাউজ পিস' },
  colours: { en: 'Colours', bn: 'রং' },
  occasion: { en: 'Occasion', bn: 'উপলক্ষ' },
  care: { en: 'Care', bn: 'যত্ন' },
  handwoven: { en: 'Handwoven', bn: 'হাতে বোনা' },
  included: { en: 'Included', bn: 'সাথে আছে' },
  notIncluded: { en: 'Not included', bn: 'নেই' },
  freeSize: { en: 'Free size: one length fits all', bn: 'ফ্রি সাইজ' },
  fallPico: { en: 'Add fall & pico stitching', bn: 'ফল ও পিকো সেলাই যোগ করুন' },
  fallPicoNote: 'Ready to wear; adds about one day.',
  qty: { en: 'Quantity', bn: 'পরিমাণ' },
  addToBag: { en: 'Add to bag', bn: 'ব্যাগে যোগ করুন' },
  added: 'Added to your bag',
  viewBag: 'View bag',
  wish: 'Save to wishlist',
  unwish: 'Remove from wishlist',
  wished: 'Saved to your wishlist',
  quickView: 'Quick view',
  details: 'View full details',
  sale: (pct: number) => `−${pct}%`,
  newBadge: 'New',
  share: 'Share',
  copied: 'Link copied',
  photoNote:
    'Photos are licensed placeholders until our own shoot; the saree you receive is the one described.',
  photoCredit: 'Photo',
  credits: 'All credits',
  zoom: 'Zoom photo',
  zoomClose: 'Close zoom',
  photoOf: (i: number, n: number) => `Photo ${i} of ${n}`,
  notFound: 'We could not find that saree.',
  drapeTitle: 'How to drape it',
  drape: [
    'Tuck the plain end in at the right of your navel and wrap once round, hem just touching the floor.',
    'Make 5 to 7 even pleats about a hand wide, hold them together and tuck them in at the centre.',
    'Take the rest round your back and over the left shoulder. Pleat or leave the pallu open, and pin it at the shoulder.',
    'Silk and Katan hold sharp pleats; let cotton and Jamdani fall a little looser.',
  ],
  deliveryTitle: 'Delivery and payment',
  delivery: [
    'Inside Dhaka: ৳80, 1 to 3 days',
    'Outside Dhaka: ৳150, 3 to 5 days, all 64 districts',
    'Cash on Delivery, bKash, Nagad, Rocket or card',
    'Exchange within 3 days if unworn', // TODO(client): confirm policy
  ],
};

export const shop = {
  title: 'All sarees',
  titleBn: 'সব শাড়ি',
  searchLabel: { en: 'Search sarees', bn: 'শাড়ি খুঁজুন' },
  searchPlaceholder: 'Jamdani, red, wedding…',
  filters: { en: 'Filters', bn: 'ফিল্টার' },
  type: { en: 'Saree type', bn: 'শাড়ির ধরন' },
  fabric: { en: 'Fabric', bn: 'কাপড়' },
  colour: { en: 'Colour', bn: 'রং' },
  occasion: { en: 'Occasion', bn: 'উপলক্ষ' },
  price: { en: 'Price', bn: 'দাম' },
  blouse: { en: 'With blouse piece', bn: 'ব্লাউজ পিস সহ' },
  handwoven: { en: 'Handwoven only', bn: 'শুধু হাতে বোনা' },
  sort: { en: 'Sort', bn: 'সাজান' },
  sorts: {
    popular: 'Most loved',
    new: 'Newest',
    'price-asc': 'Price: low to high',
    'price-desc': 'Price: high to low',
  },
  min: 'Min ৳',
  max: 'Max ৳',
  clear: 'Clear all',
  apply: 'Show sarees',
  results: (n: number) => (n === 1 ? '1 saree' : `${n} sarees`),
  empty: 'No sarees match these filters yet.',
  emptyHint: 'Try fewer filters, or another colour.',
  soon: 'soon',
  loading: 'Loading sarees…',
  error: 'The sarees could not be loaded.',
  retry: 'Try again',
};

export const bag = {
  title: { en: 'Your bag', bn: 'আপনার ব্যাগ' },
  empty: 'Your bag is empty.',
  emptyCta: 'Browse sarees',
  remove: 'Remove',
  fallPico: 'Fall & pico',
  subtotal: { en: 'Sarees', bn: 'শাড়ি' },
  addOns: { en: 'Fall & pico', bn: 'ফল ও পিকো' },
  discount: { en: 'Discount', bn: 'ছাড়' },
  delivery: { en: 'Delivery', bn: 'ডেলিভারি' },
  total: { en: 'Total', bn: 'মোট' },
  insideDhaka: 'Inside Dhaka',
  outsideDhaka: 'Outside Dhaka',
  coupon: { en: 'Coupon code', bn: 'কুপন কোড' },
  couponApply: 'Apply',
  couponRemove: 'Remove coupon',
  couponInvalid: 'This coupon code is not valid',
  couponHint: 'Demo codes: SHARI10, BOISHAKH15',
  checkout: { en: 'Checkout', bn: 'চেকআউট' },
  continue: 'Continue shopping',
};

export const checkout = {
  title: { en: 'Checkout', bn: 'চেকআউট' },
  steps: [
    { en: 'Delivery', bn: 'ডেলিভারি' },
    { en: 'Payment', bn: 'পেমেন্ট' },
    { en: 'Review', bn: 'যাচাই' },
  ],
  name: { en: 'Full name', bn: 'পুরো নাম' },
  phone: { en: 'Mobile number', bn: 'মোবাইল নম্বর' },
  email: { en: 'Email (optional)', bn: 'ইমেইল (ঐচ্ছিক)' },
  address: { en: 'Address (house, road, area)', bn: 'ঠিকানা (বাসা, রোড, এলাকা)' },
  district: { en: 'District', bn: 'জেলা' },
  chooseDistrict: { en: 'Choose your district', bn: 'জেলা নির্বাচন করুন' },
  note: { en: 'Note for the rider (optional)', bn: 'রাইডারের জন্য নোট (ঐচ্ছিক)' },
  payment: { en: 'Payment method', bn: 'পেমেন্ট পদ্ধতি' },
  cod: { en: 'Cash on Delivery', bn: 'ক্যাশ অন ডেলিভারি' },
  codNote: 'Pay the rider in cash when the saree arrives.',
  walletNote: 'You will confirm on a demo wallet screen.',
  cardNote: 'Test card only: 4242 4242 4242 4242, any future date, any CVC.',
  cardNumber: 'Card number',
  cardExpiry: 'Expiry (MM/YY)',
  cardCvc: 'CVC',
  cardName: 'Name on card',
  next: { en: 'Continue', bn: 'পরবর্তী' },
  back: { en: 'Back', bn: 'পেছনে' },
  place: { en: 'Place order', bn: 'অর্ডার করুন' },
  pay: (label: string) => ({ en: `Pay with ${label}`, bn: `${label} দিয়ে পেমেন্ট` }),
  placing: 'Placing your order…',
  summary: { en: 'Order summary', bn: 'অর্ডারের সারাংশ' },
  shipTo: { en: 'Deliver to', bn: 'ডেলিভারি ঠিকানা' },
  edit: 'Edit',
  emptyBag: 'Your bag is empty, so there is nothing to check out.',
  demoNote:
    'Demo store: no money moves. Card numbers and PINs stay in your browser and are never sent or stored.',
  serverNote: 'Prices are checked again by the store when you place the order.',
  wallet: {
    title: (label: string) => `${label} payment`,
    merchant: 'Merchant',
    amount: 'Amount',
    account: (label: string) => `Your ${label} account number`,
    otp: 'Verification code',
    otpHint: 'Demo code: 123456',
    pin: (label: string) => `${label} PIN`,
    pinHint: 'Demo PIN: 12345',
    confirm: 'Confirm',
    cancel: 'Cancel',
    wrongPin: 'Wrong PIN. In the demo the PIN is 12345.',
    wrongOtp: 'Wrong code. In the demo the code is 123456.',
    badAccount: 'Enter an 11-digit mobile number',
    demo: 'Demo screen: not connected to a real wallet.',
  },
};

export const success = {
  title: { en: 'Thank you! Your order is placed.', bn: 'ধন্যবাদ! আপনার অর্ডার হয়েছে।' },
  number: { en: 'Order ID', bn: 'অর্ডার আইডি' },
  keep: 'Keep this ID and your phone number to track the order.',
  eta: 'Expected delivery',
  paid: (label: string) => `Paid with ${label} (demo).`,
  cod: 'You will pay the rider in cash.',
  track: 'Track this order',
  shop: 'Continue shopping',
  demo: 'This is a demo order: nothing will be shipped.',
};

export const track = {
  title: { en: 'Track your order', bn: 'অর্ডার ট্র্যাক করুন' },
  intro: 'Enter the order ID from your confirmation and the phone number you used.',
  orderId: { en: 'Order ID', bn: 'অর্ডার আইডি' },
  phone: { en: 'Mobile number', bn: 'মোবাইল নম্বর' },
  submit: { en: 'Track', bn: 'ট্র্যাক' },
  statuses: {
    placed: 'Placed',
    confirmed: 'Confirmed',
    shipped: 'With the courier',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
  invalidId: 'Order IDs look like SK-12345',
  invalidPhone: 'Enter the 11-digit mobile number used at checkout',
  items: 'Items',
};

export const wishlist = {
  title: { en: 'Wishlist', bn: 'পছন্দের তালিকা' },
  empty: 'Nothing saved yet. Tap the heart on any saree to keep it here.',
  browse: 'Browse sarees',
  remove: 'Remove',
};

export const credits = {
  title: 'Photo credits',
  // TODO(client): confirm the store owns or is licensed to use every product photo
  own: "All product photos on this site belong to Moon's Wardrobe or are used with permission.",
  intro:
    'The photos in this store are placeholders, used under the licences below until the client’s own photoshoot replaces them. Each was cropped to a 3:4 portrait and converted to WebP. Thank you to every photographer who shares their work.',
  by: 'by',
  source: 'Source',
  licence: 'Licence',
  shownAs: 'Shown as',
  sa: 'Our crops of CC BY-SA photos are shared under the same licence.',
};

export const footer = {
  about:
    'Sarees from the looms of Bangladesh: Jamdani from Narayanganj, Katan from Mirpur, silk from Rajshahi and tant from Tangail.', // TODO(client)
  shop: 'Shop',
  help: 'Help',
  links: {
    all: 'All sarees',
    newIn: 'New arrivals',
    wedding: 'Wedding edit',
    jamdani: 'Jamdani',
    track: 'Track order',
    faq: 'FAQ',
    wishlist: 'Wishlist',
    credits: 'Photo credits',
  },
  contact: 'Visit or call',
  contactSoon: 'Phone and showroom details coming soon.', // TODO(client)
  motion: 'Motion',
  motionOptions: { auto: 'System', on: 'On', off: 'Off' },
  rights: (year: number) => `© ${year} ${brand.name}. A demo store.`,
};

export const chat = {
  whatsapp: 'Chat on WhatsApp',
  messenger: 'Message us on Facebook',
  notSet: 'Chat links will be added when the store goes live.',
};

export const finCredit = {
  badge: 'Built by Fin Projukti',
  title: 'Want a website like this?',
  body: 'Contact Fin Projukti.',
  link: 'finprojukti.tech',
  href: 'https://finprojukti.tech',
  close: 'Close',
};

export const notFound = {
  title: 'This page has slipped off the loom.',
  body: 'The link may be old, or the saree may have sold out.',
  cta: 'Go to the shop',
};

export const errors = {
  generic: 'Something went wrong. Please try again.',
  offline: 'The store server is not answering, so you are seeing the demo catalogue.',
};
