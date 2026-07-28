const test = require('node:test');
const assert = require('node:assert');
const path = require('path');

const { buildPhotoCarouselCatalog } = require('../scripts/generate_photos_json');

test('buildPhotoCarouselCatalog groups campanhas before still-produtos and uses real image paths', () => {
  const rootDir = path.resolve(__dirname, '..');
  const catalog = buildPhotoCarouselCatalog(rootDir);

  assert.ok(Array.isArray(catalog));
  assert.equal(catalog[0].section, 'campanhas');
  assert.equal(catalog[1].section, 'still-produtos');
  assert.ok(catalog[0].carousels.length > 0);
  assert.ok(catalog[1].carousels.length > 0);
  assert.ok(catalog[0].carousels[0].images.length > 0);
  assert.ok(catalog[0].carousels[0].images[0].src.startsWith('fotos/'));
});
