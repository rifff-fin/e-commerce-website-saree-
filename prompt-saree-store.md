# Prompt: build a saree-only fashion store for Bangladesh


---

## Who you are working for

You are building a production-quality e-commerce website for **Fin Projukti**
(finprojukti.tech), a web studio in Bangladesh. The client is a women's fashion brand in
Bangladesh that sells **only sarees**, in the space of brands like Nish Fashion BD.

- **Brand name:** `{{BRAND NAME}}` (working name until the client confirms; e.g. "Shari
  Kotha").
- **Tagline:** `{{TAGLINE}}` (suggestion: "Woven for every celebration").
- **Studio repos to follow for structure:** https://github.com/rifff-fin?tab=repositories
- **Git remote:** `{{GIT REMOTE URL}}`

**Do not copy any real brand.** Nish Fashion BD is only a reference for the market and the
category. Use none of its name, logo, photos, copy, colours or layout. Everything here must
be original.

## What the store sells

Only sarees: no blouses-only, menswear, jewellery or 3D models. Organise the catalog by
saree type, and give each product its type, fabric, weave, occasion and care. At minimum
cover these types, which a Bangladeshi shopper expects:

| Type | Notes for the copy and filters |
|---|---|
| **Jamdani** (Dhakai) | handwoven, Narayanganj / Demra, UNESCO-listed weaving tradition, cotton or half-silk |
| **Katan / Benarasi** (Mirpur Benarasi) | silk brocade, zari work; weddings and holud |
| **Rajshahi silk** | soft silk, prints and plain |
| **Tangail tant** | light cotton, everyday and Pohela Boishakh |
| **Monipuri** | Sylhet, light and textured |
| **Muslin** (revival) | very fine, premium |
| **Half-silk / Soft silk** | everyday premium |
| **Kantha stitch** | hand embroidery on silk or cotton |
| **Georgette / Chiffon** | party wear |
| **Tissue / Organza** | festive, sheer |
| **Cotton (everyday)** | office and daily wear |

**Filters:** type, fabric, colour, occasion (Wedding, Holud, Eid, Puja, Pohela Boishakh,
Party, Office, Everyday), price range, "with blouse piece", and "handwoven".

**Prices:** BDT, roughly ৳1,800 to ৳45,000. Cotton and tant sit at the low end, Katan and
Jamdani at the high end; make each price realistic for its type.

## Photos: find them, license them, record them

1. **Find real saree photos.** Download decent, high-quality photos only from sources whose
   licence allows commercial use:
   - **Unsplash** and **Pexels** (their own licences, free for commercial use);
   - **Wikimedia Commons** files under **CC0, CC BY or CC BY-SA**.

   Never take photos from other stores, Facebook pages, Pinterest or Google Images. If a
   licence is unclear, skip the photo.
2. **Write a metadata record for every photo** in `content/images.json` (and in each
   product's seed data):

   ```json
   {
     "file": "jamdani-white-red-01.webp",
     "sareeType": "Jamdani",
     "fabric": "Cotton",
     "weave": "Handwoven, Dhakai motifs",
     "colours": ["White", "Red"],
     "occasion": ["Pohela Boishakh", "Holud"],
     "description": "White Dhakai Jamdani with red paar and floral buti",
     "source": "https://commons.wikimedia.org/wiki/File:…",
     "author": "…",
     "license": "CC BY-SA 4.0",
     "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
     "downloadedAt": "{{DATE}}"
   }
   ```

3. **Label photos only by what they show.** Set `sareeType` by looking at the photo and
   reading its source page. If you can't tell the type with confidence, set
   `"sareeType": "Unverified"` and leave that photo out of the store. Never present a
   generic photo as a specific weave.
4. **Credit the photos.** Show the required credits on a `/credits` page linked from the
   footer.
5. **Optimise the photos.** Convert each one to WebP at 1600 px on the long side, plus a
   480 px thumbnail. Use a 3:4 portrait crop, which suits drape shots.
6. **Plan for the real photos.** Aim for 30–40 products across the types above. Mark
   everything with `TODO(client)` so the client's own photoshoot can replace it later.
   The admin panel must make replacing photos easy (see below).
7. **If there aren't enough licensed photos for a type, say so** in `PROGRESS.md`. Do not
   fill the gap with AI-generated or mismatched images.

## Look and feel: a pink vibe, professional, not template-like

**Mood:** a refined, feminine and editorial fashion house, like a magazine lookbook, not a
gadget store. It must look clearly different from the studio's sneaker store (StepUp BD).
Do not reuse its layout, glass navbar, 3D hero or section patterns.

**Palette:** pink-led but grown-up, not candy:
- blush paper as the background, around `#FBF1F2`;
- rose as the accent, around `#C2185B` or a dusty rose like `#B5576F`;
- deep plum or aubergine for text, around `#2B1420`;
- gold (`#B88A44`) used very sparingly, for hairlines and the logo only.

Check every text colour for WCAG AA contrast. Write the colours as CSS tokens, with one
accent.

**Type:** an elegant display serif for headings (e.g. Cormorant Garamond, Fraunces or
Playfair Display) and a clean sans for text (e.g. Jost or DM Sans). Add **Hind Siliguri**
or **Noto Serif Bengali** for Bangla words. Bangla accents in headings, such as
"শাড়ি", are welcome.

**Imagery:** large portrait photos, generous white space, slow and elegant motion:
- image reveals and gentle parallax;
- a cross-fade to a second photo on hover;
- nothing bouncy, no glows, no cursor effects, no loader screens.

**Layout ideas (pick and refine; don't do all of them):**
- **Hero:** a full-bleed editorial image or a slow crossfade of 3 looks, with one strong
  serif line and two buttons ("Shop Jamdani", "New arrivals").
- **"Shop by weave"** row of tall arched or rounded image tiles, one per saree type.
- **Story strip about the weave:** e.g. "Jamdani: woven by hand in Narayanganj". Keep it
  short and factual.
- **Occasion edits:** Wedding, Holud, Eid, Boishakh.
- **New arrivals grid**, "best sellers" carousel, sample reviews clearly labelled as
  samples, and an Instagram-style lookbook grid using the same licensed photos.
- **Product page** with:
  - gallery and zoom;
  - fabric, length (e.g. 5.5 m + 0.8 m blouse piece), weave, origin and care;
  - "how to drape" tips;
  - delivery and COD info;
  - related sarees.

**Avoid the AI-template tells:**
- the same eyebrow-plus-giant-headline formula in every section;
- gradient text, neon glow, fake stats ("10K+ happy customers");
- icon-card grids with ghost numbers;
- pill buttons everywhere.

It must read as a real Bangladeshi fashion brand that a professional designer made.

## Features

- **Catalog:** search, filters (above), sort, quick view, product pages with their own
  URLs (good for sharing on Facebook), wishlist, cart in localStorage (with a fallback),
  and "recently viewed".
- **Size and length:** sarees are free size, so show the length, the blouse piece and the
  fall/pico option. Offer the add-on "Fall & pico stitching (+৳150)" as a demo.
- **Checkout (demo):** shipping with all 64 districts; delivery ৳80 inside Dhaka and ৳150
  outside; payments **bKash, Nagad, Rocket** (mock wallet screens, demo PIN), card (test
  card only) and **Cash on Delivery**. Card numbers and PINs never leave the browser, and
  the server recalculates all prices. Show a clear "Demo store" note.
- **Order tracking** by order ID and phone.
- **Admin panel** (`/admin`):
  - JWT login, with the credentials only in `.env`;
  - dashboard;
  - products CRUD with **Cloudinary** photo upload (signed uploads, so the API secret
    stays on the server), photo reordering and saree metadata fields;
  - orders with status;
  - coupons;
  - subscribers with CSV export;
  - homepage banners editable from the admin.
- **Bangla / English:** at least the nav, product meta and checkout labels in both
  (optional toggle).
- **WhatsApp + Messenger** buttons, newsletter, FAQ (care, delivery, exchange,
  authenticity of handloom).
- **Credit badge:** a small "Built by Fin Projukti" badge in a corner. When tapped it
  shows "Want a website like this? Contact Fin Projukti" with a link to
  https://finprojukti.tech.
- **Accessibility:** keyboard access, focus states, alt text from the metadata, reduced
  motion respected, and a layout that works at 390 px wide.

## Tech (same as the studio's other projects)

- **Backend:** `backend/`, Node ≥22, Express 5, Mongoose, CommonJS, MVC (`models/
  controllers/ routes/ middleware/ services/ data/ scripts/`). Controllers carry
  `@desc / @route / @access` headers. Add rate limiting and whitelisted input.
- **Frontend:** `frontend/`, Vite + React + TypeScript, react-router, zustand, axios.
  - All copy goes in `src/content/copy.ts`, one section per file.
  - Prettier (single quotes, width 100) and ESLint.
- **Database:** MongoDB Atlas via `MONGODB_URI`, with an in-memory fallback in dev. The
  catalog seeds itself into an empty database.
- **Images:** Cloudinary for admin uploads; seed photos in `public/products/`.
- **Deploy:** Netlify (frontend, proxying `/api/*`) and Render (API), with `render.yaml`
  and `netlify.toml`.
- **Secrets:** only in a git-ignored `backend/.env`; ship a `.env.example` without values.
  Never commit or print secrets. The owner will paste them when asked.

## How to work

1. Keep **`PROGRESS.md`** (status, decisions, what's next, a dated log) and a short
   **`CLAUDE.md`** with the project rules. Update both at the end of every piece of work.
2. **Research first:**
   - look at 3–4 real Bangladeshi and Indian saree stores for structure and features
     (don't copy them);
   - check typography and colour choices;
   - write down what you'll take from them and why.
3. Build the backend, then the store, then the admin panel.
4. **Check your own work:**
   - typecheck, lint and build;
   - open the site in a headless browser at **1440 × 900** and **390 × 844**, take
     screenshots, look at them and fix what looks off;
   - run the full flow: search → product → cart → coupon → checkout (each payment) →
     success → track;
   - test the admin flow, including a Cloudinary upload, and delete the test data
     afterwards.
5. **Git (the owner's rule):**
   - several focused commits written as the owner, with **no co-author trailer**;
   - push after each.
6. **Finish with:**
   - a short report;
   - the admin login location;
   - what still needs the client (real photos, phone, address, prices);
   - a `docs/feature-checklist.md` of optional extras with `- [ ]` boxes for the owner to
     tick: courier booking (Steadfast / Pathao), SSLCommerz, SMS, OTP login, stock per
     product, Facebook Pixel and catalog feed, etc.

Start by reading the studio repos, then write a short plan in `PROGRESS.md` and begin.
