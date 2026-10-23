const crypto = require('crypto');

// A fixed ObjectId-shaped id from a slug, so a seeded product keeps the same id in every
// database and in the frontend's offline demo catalog (carts keep working across both).
const stableId = (slug) =>
  crypto.createHash('md5').update(`saree:${slug}`).digest('hex').slice(0, 24);

module.exports = { stableId };
