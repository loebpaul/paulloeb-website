const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');

test('vendored Bootstrap keeps the exact official CSS/fonts and excludes vulnerable JavaScript', () => {
  const provenance = require('../assets/vendor/bootstrap-3.4.1/provenance.json');
  for (const file of provenance.files) {
    const bytes = fs.readFileSync(path.join(root, file.path));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), file.sha256);
    assert.ok(!file.path.endsWith('.js'));
  }
  const lock = require('../package-lock.json');
  assert.equal(lock.packages['node_modules/bootstrap'], undefined);
});

test('Next exports a real homepage with the maintained testimonial component', () => {
  const html = fs.readFileSync(path.join(root, 'out/index.html'), 'utf8');
  assert.match(html, /<html/);
  assert.match(html, /id="testimonials"/);
  assert.match(html, /swiper-container-horizontal/);
  assert.match(html, /main-slider-pagination/);
  assert.ok(fs.existsSync(path.join(root, 'out/_next/static')));
});
