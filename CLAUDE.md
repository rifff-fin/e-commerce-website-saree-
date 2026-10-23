# Moon's Wardrobe — project brief for Claude Code

Client store built by **Fin Projukti** (finprojukti.tech). Original brief: `prompt-saree-store.md`.
**Status and log: `PROGRESS.md`. Update it at the end of every piece of work.**

## What it is

A saree-only fashion store for Bangladesh: Moon's Wardrobe.
Editorial and feminine: blush paper (`--paper #FBF1F2`), aubergine ink (`--ink #2B1420`), one
accent, dusty rose `--accent #9E3A57` (the brief's `#B5576F` fails AA for text), gold `#B88A44`
only for hairlines and the logo. Tokens in `frontend/src/styles/tokens.css`. Type: Cormorant
Garamond (display), Jost (text), Noto Serif Bengali + Hind Siliguri (Bangla). Rectangular
buttons (3 px radius), arched photo frames, slow reveals and cross-fades. Avoid template tells:
eyebrow-plus-giant-headline everywhere, gradient text, glows, fake stats, icon-card grids,
pill buttons, loaders, cursor effects. It must look nothing like the studio's StepUp BD.
It is a **demo store**: payments are simulated and orders are never fulfilled.

## Stack and layout

- `backend/`: Node ≥22, Express 5, Mongoose, CommonJS, MVC (`models/ controllers/ routes/
  middleware/ services/ data/ scripts/ utils/`). Controllers carry `@desc / @route / @access`.
- `frontend/`: Vite 8, React 19, TypeScript 6, react-router 8, zustand, axios. All copy in
  `src/content/copy.ts`; one homepage section per file in `src/sections/`; Prettier (single
  quotes, width 100) and ESLint with the React Compiler hook rules.
- `content/images.json`: one record per photo (type, fabric, weave, colours, occasion,
  description, source, author, licence, date). The `/credits` page reads it.

## Commands

- API: `cd backend && npm run dev` (port 5010; in-memory MongoDB when `MONGODB_URI` is unset),
  `npm run seed`, `npm run export:demo`, `npm run photos` (client photos → WebP)
- Store: `cd frontend && npm run dev` (port 5200, proxies `/api`), `npm run typecheck`,
  `npm run lint`, `npm run build`, `npm run format`

## Rules (do not break)

1. **The server owns money.** Totals, the fall & pico add-on (৳150 per saree), coupons (sarees
   only, never stitching or delivery) and delivery (৳80 Dhaka district, ৳150 elsewhere) are
   recalculated in `backend/services/pricingService.js`. `frontend/src/lib/pricing.ts` mirrors
   it for the preview only. Change both together.
2. **Payment details never leave the browser.** Card numbers, wallet numbers, codes and PINs
   live only in component state (`CheckoutPage`, `WalletMock`). `createOrder` sends the method
   name only; `validateOrder` builds the order from whitelisted fields. Demo values: card
   `4242…`, wallet code `123456`, PIN `12345`.
3. **Photos.** The store uses the owner's photos (supplied 2026-10-23), one per saree, each
   recorded in `content/images.json` with `clientPhoto: true` and `credit: null`; their usage
   rights are `TODO(client)`. Any third-party photo added later must be CC0 / CC BY / CC BY-SA
   (Unsplash, Pexels or Wikimedia Commons), carry a `credit`, and is then listed on `/credits`.
   New photos: drop them in `photos-inbox/` and run `npm run photos` in `backend/`.
4. **Photo files.** `frontend/public/products/<name>.webp` (3:4, 1200×1600 max) plus
   `<name>-480.webp`; Cloudinary uploads from the admin are resized by URL (`lib/images.ts`).
5. **Never empty.** If the API cannot be reached, `services/fallback.ts` switches to
   `content/demoCatalog.json` (written by `npm run export:demo`; ids are stable hashes of the
   slug). Re-export after editing `backend/data/`.
6. **Seed catalog** `backend/data/products.js` (37 sarees) was generated once from the photo
   records; edit it by hand or through the admin panel, then `npm run export:demo`.
7. **Sample content is labelled.** Reviews say they are samples; unconfirmed facts (names,
   prices, contacts, policies) carry `TODO(client)` in `copy.ts`.
8. **Motion.** `html[data-reduced]` (set before first paint) drives CSS and JS; the footer
   Motion switch overrides the OS. `.in` (scroll reveal) is added to the DOM directly: put
   `data-reveal` only on elements whose className React never changes.
9. **Bangla / English.** Nav, product details and checkout labels are `{ en, bn }` pairs read
   with `useT()` (`store/langStore.ts`); `<html lang>` follows the toggle.
10. **Secrets** only in git-ignored `backend/.env` (Atlas URI, Cloudinary, admin login,
    `JWT_SECRET`). Never commit or print them; the browser uploads to Cloudinary with a
    one-time signature from `/api/admin/uploads/sign`.
11. **Admin** (`frontend/src/admin`, lazy chunk at `/admin`; API `/api/admin/*` behind
    `adminAuth`, JWT 12 h, login rate limited). Input whitelisted in `services/productInput.js`;
    banner links must be store paths; CSV export guards against formula injection.
12. **Commits** (owner's rule): several focused commits written as the owner, with no
    co-author trailer; push after each.

## QA

After changes: typecheck, lint and build, then check 1440 × 900 and 390 × 844 in a headless
browser. Run the flow search → product → bag → SHARI10 → checkout (each payment) → success →
track, with the API on and with `/api` blocked.
