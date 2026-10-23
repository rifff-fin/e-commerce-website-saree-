# Shari Kotha — progress

Saree-only store for a Bangladeshi women's fashion brand, built by Fin Projukti.
Brief: `prompt-saree-store.md`. Rules: `CLAUDE.md`.

## Status (2026-10-23)

**Working end to end in development** (API + store + admin), verified in a headless browser.
Not deployed yet; no git remote configured.

| Area | State |
|---|---|
| API (Express 5, Mongoose, MVC) | Done: catalog with filters and facets, product + related, meta, banners, coupons, orders (server-side pricing), tracking, newsletter, admin (JWT) |
| Store | Done: home, shop with URL filters, product pages, quick view, bag, checkout (5 payment methods), success, tracking, wishlist, recently viewed, credits, FAQ, 404, EN / বাংলা toggle |
| Admin `/admin` | Done: dashboard, sarees CRUD with photos (Cloudinary upload, store paths, reorder, alt text), orders + status, coupons, banners, subscribers + CSV |
| Photos | 47 licensed Wikimedia Commons photos in the store, 1 marked Unverified and left out; see gaps below |
| Deploy | `netlify.toml` and `render.yaml` ready; needs Atlas, Cloudinary keys and the Render URL |

## Plan (as started)

1. Read the studio repos (StepUp BD for structure: MVC API, fallback catalog, admin, QA rules).
2. Research Bangladeshi and Indian saree stores; pick palette and type.
3. Find, license, label and optimise saree photos; write `content/images.json`.
4. Backend → store → admin, then QA at 1440 × 900 and 390 × 844, full flow, admin flow.
5. Docs, feature checklist, commits.

## Research notes

Live sites were not crawled (the automated browser is blocked by bot walls on most store
sites), so these notes come from familiarity with the stores. Nothing was copied.

- **Aarong (BD)**: browses by craft and fabric, and every product states fabric and care.
  *Take:* type-first navigation ("Shop by weave"), a care section on every product.
- **Tangail and Jamdani sellers on Facebook (BD)**: shoppers ask about length, blouse piece,
  fall & pico and "is it real handloom?" in every comment thread.
  *Take:* length and blouse piece in the spec list, fall & pico as an add-on, an FAQ on telling
  handloom from power loom, COD prominent.
- **Taneira (India)**: weave and origin on every card, short craft stories, large photos.
  *Take:* type and "handwoven" on cards; one short, factual weave story on the homepage.
- **Suta (India)**: warm, human copy and occasion edits instead of dry categories.
  *Take:* occasion edits (Wedding, Holud, Eid, Boishakh) and plain, friendly copy.
- **Nalli / Kankatala (India)**: deep catalogs with practical filters (price bands, fabric,
  occasion). *Take:* price presets plus min / max, fabric and occasion filters.

**Type and colour:** Cormorant Garamond for display (high-contrast, bridal-editorial without
being a wedding-invite script), Jost for text (geometric, clean at small sizes), Noto Serif
Bengali and Hind Siliguri for Bangla. Blush paper and aubergine ink; dusty rose `#9E3A57`
as the single accent (the suggested `#B5576F` is 4.2:1 on the blush, below AA for text;
`#9E3A57` is 5.9:1). Gold only for hairlines and the logo (2.8:1, never text).

## Decisions

- **Working name "Shari Kotha"** (শাড়ি কথা) and the suggested tagline, both `TODO(client)`.
- **Photos only from Wikimedia Commons.** Unsplash and Pexels block automated access (bot
  challenge pages), so none were taken from there. Only CC0, CC BY and CC BY-SA files were used;
  "Public domain" (PD-self etc.), GODL-India and uploads by other saree shops were skipped.
- **Photos of people were avoided** for products (personality rights); where a seller held a
  saree, the crop keeps only the cloth.
- **Benarasi photos are from Varanasi**, mostly museum pieces (Textile Museum of Canada,
  Honolulu Museum of Art, Indian Museum). The weave (silk brocade with zari) is correct for the
  Katan / Benarasi type, and each record says where it was taken. Product origins say Mirpur
  Benarasi Palli (`TODO(client)`), and every product page says photos are licensed
  placeholders.
- **Tangail tant photos are from Phulia (West Bengal)**, a centre weaving in the Tangail tant
  tradition; the records say so. One photo is a true Tangail sari border from the 1970s.
- **Fabric in the photo records is "not stated by source"** where the page doesn't say; the
  product's fabric field is the client's to confirm.
- **Accent `#9E3A57`** instead of `#B5576F` (contrast, above).
- **Coupons apply to sarees only**, not to fall & pico or delivery.
- **Ports:** API 5010, store 5200 (5000 / 5173 / 5180 / 5190 are taken by other projects).
- **Search** matches at the start of words, so "red" does not find "scattered".
- **Floating chat buttons are hidden at checkout** (they covered form fields on phones).

## Photo gaps (no licensed, verifiable photos found)

These types are in the filters (marked "soon") but have **no products** until the client's
photoshoot. Nothing was filled with AI or mismatched photos.

| Type | What was found |
|---|---|
| Monipuri | Commons has Manipuri dance and culture, no identifiable Monipuri saree photos |
| Half-silk / Soft silk | Nothing labelled as half-silk; Jamdani photos may be half-silk but sources don't say |
| Kantha stitch | Commons has Nakshi Kantha quilts, not Kantha-stitch sarees |
| Georgette / Chiffon | Only uploads by other shops (skipped) |
| Tissue / Organza | One upload by an Indian saree shop (skipped) |
| Cotton (everyday) | Only one usable photo (1 product) |
| Muslin | Two photos (2 products), from the Banglar Muslin project |
| Tangail tant | Four photos (3 products) |

Unverified and excluded: `saree-drying-narayanganj-01` (fabric drying in a field; type not
identifiable).

## What still needs the client

- Real photos for all 32 sarees (3:4 portrait drape and detail shots), and for the 5 missing
  types. Drop them in `photos-inbox/` and run `npm run photos` in `backend/`, or upload in the
  admin panel.
- Brand name, tagline, logo approval.
- Phone, WhatsApp number, Facebook page, email, showroom address and hours (`copy.ts → brand`).
- Real prices, names, fabrics and origins for each saree; blouse-piece facts.
- Delivery times, exchange policy and courier (FAQ and product page carry `TODO(client)`).
- Real reviews (the homepage shows labelled samples).
- Accounts: MongoDB Atlas URI, Cloudinary keys, admin email and password, a git remote.

## Next

1. Owner adds the git remote; push.
2. Create Atlas + Cloudinary, fill `backend/.env` (and Render env), test a real Cloudinary
   upload from `/admin` (not tested yet: no keys).
3. Deploy the API on Render, put its URL in `netlify.toml`, deploy the store on Netlify.
4. Replace placeholder photos with the client's shoot.
5. Pick extras from `docs/feature-checklist.md`.

## Log

### 2026-10-23

- Read StepUp BD (structure, pricing rules, fallback catalog, admin, QA) and the studio repo list.
- Searched Wikimedia Commons by category and full text for every saree type; reviewed ~200
  candidates on contact sheets; selected 48, labelled each by what it shows; cropped to 3:4
  WebP (1200×1600 + 480 px) with faces cropped out; wrote `content/images.json`.
- Backend: models (Product with saree metadata and per-photo credits, Order, Coupon, Banner,
  Subscriber), controllers, rate limits, whitelisted input, server pricing with fall & pico,
  seeding of 32 sarees with stable ids, demo export, photo script (sharp).
- Store: design tokens, editorial homepage (arched hero cross-fade, shop by weave, Jamdani story
  with parallax, occasion edits, new arrivals, best-seller carousel, labelled sample reviews,
  lookbook, newsletter, FAQ), shop with URL-synced filters, product page with gallery + zoom,
  quick view, bag drawer, 3-step checkout with mock bKash / Nagad / Rocket screens and test
  card, success, tracking, wishlist, recently viewed, credits, EN / বাংলা toggle, Fin Projukti
  badge, WhatsApp / Messenger buttons.
- Admin: dashboard, sarees CRUD with photo manager, orders, coupons, banners, subscribers CSV.
- QA (headless Chrome): screenshots at 1440 × 900 and 390 × 844; fixed nav "active" states on
  section links, hero arch radius, badge overlap, mobile hero height, "soon" labels in filters,
  card errors that stayed after editing. Full flow passed for COD, bKash, Nagad, Rocket and
  card (desktop), COD outside Dhaka (phone), and COD with `/api` blocked (offline catalog).
  Server totals match the preview (e.g. 2 × ৳18,500 + ৳300 fall & pico − 10% + ৳80 =
  ৳33,680). Admin flow passed: bad login, login rate limit, dashboard, create saree with
  reordered photos, order status, coupon, banner, CSV export, logout; test data deleted.
- Typecheck, lint and build clean.
