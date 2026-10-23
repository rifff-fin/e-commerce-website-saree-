// Turns the client's raw photos into store photos: a 3:4 portrait crop, WebP at 1600 px on
// the long side, plus a 480 px thumbnail, written to frontend/public/products/.
//
//   1. put the originals in photos-inbox/ (git-ignored), named the way you want them in the
//      store, e.g. jamdani-red-gold-01.jpg
//   2. npm run photos            (or: npm run photos -- path/to/folder)
//   3. use /products/<name>.webp in the admin panel, or upload through Cloudinary instead
//
// The crop keeps the centre of the photo; for drape shots frame the saree in the middle.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', '..');
const INBOX = path.resolve(process.argv[2] || path.join(ROOT, 'photos-inbox'));
const OUT = path.join(ROOT, 'frontend', 'public', 'products');
const SIZES = [
  { suffix: '', width: 1200, height: 1600, quality: 82 },
  { suffix: '-480', width: 480, height: 640, quality: 78 },
];

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const run = async () => {
  if (!fs.existsSync(INBOX)) {
    console.error(`❌ No folder at ${INBOX}. Create it and add the photos first.`);
    process.exit(1);
  }
  const files = fs.readdirSync(INBOX).filter((f) => /\.(jpe?g|png|webp|tiff?|heic)$/i.test(f));
  if (!files.length) {
    console.log(`Nothing to do: ${INBOX} has no photos.`);
    return;
  }
  fs.mkdirSync(OUT, { recursive: true });
  for (const file of files) {
    const name = slugify(path.parse(file).name);
    // The largest 3:4 box the photo allows, so small photos are cropped but never enlarged
    const { width: w, height: h } = await sharp(path.join(INBOX, file)).rotate().metadata();
    const cropWidth = Math.min(w, Math.round((h * 3) / 4));
    for (const size of SIZES) {
      const width = Math.min(size.width, cropWidth);
      await sharp(path.join(INBOX, file))
        .rotate() // respect the camera's orientation
        .resize(width, Math.round((width * 4) / 3), { fit: 'cover', position: 'attention' })
        .webp({ quality: size.quality })
        .toFile(path.join(OUT, `${name}${size.suffix}.webp`));
    }
    console.log(`✅ ${file} -> /products/${name}.webp`);
  }
  console.log(
    `\nDone: ${files.length} photo(s). Add them to content/images.json if they need credits.`,
  );
};

run().catch((error) => {
  console.error('❌ Photo processing failed:', error);
  process.exit(1);
});
