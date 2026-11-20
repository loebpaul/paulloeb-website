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

test('the published homepage loads the studio from the static export', () => {
  const html = fs.readFileSync(path.join(root, 'out/index.html'), 'utf8');
  assert.match(html, /id="studio"/);
  assert.match(html, /<base href="\/studio\/">/);
  assert.match(html, /Explore Paul’s recording studio/);
  for (const [, file] of html.matchAll(/(?:src|href)="([^":/#][^":]*)"/g)) {
    assert.ok(fs.existsSync(path.join(root, 'out/studio', file)), file);
  }
  assert.ok(fs.existsSync(path.join(root, 'out/studio/assets/dreams-audio.js')));
});

test('the studio export preserves the three static portfolio pages', () => {
  for (const [slug, title] of [
    ['guided-shopping', 'Guided Shopping'],
    ['on-demand', 'On-Demand'],
    ['pitch-deck-uploader', 'Pitch Deck Uploader']
  ]) {
    const page = fs.readFileSync(path.join(root, 'out/portfolio', slug + '.html'), 'utf8');
    assert.ok(page.includes('<title>' + title + ' | Paul Loeb</title>'));
    assert.match(page, /href="\/">Home \/<\/a>/);
  }
  assert.ok(fs.existsSync(path.join(root, 'out/_next/static')));
});
