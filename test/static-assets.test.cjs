const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const site = path.join(__dirname, '../site');
const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
const analytics = fs.readFileSync(path.join(site, 'analytics.js'), 'utf8');

test('the studio homepage and its assets are ready to serve at the domain root', () => {
  assert.match(html, /<title>Paul Loeb<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/paulloeb\.net\/"/);
  assert.doesNotMatch(html, /<base\b/);
  assert.match(html, /id="studio"/);
  assert.ok(html.indexOf('src="analytics.js"') < html.indexOf('src="experience.js"'));
  for (const [, file] of html.matchAll(/(?:src|href)="([^":/#][^":]*)"/g)) {
    assert.ok(fs.statSync(path.join(site, file)).isFile(), file);
  }
  assert.ok(fs.statSync(path.join(site, 'assets/dreams-audio.js')).isFile());
  for (const entry of fs.readdirSync(site).filter(file => file.endsWith('.js'))) {
    new vm.Script(fs.readFileSync(path.join(site, entry), 'utf8'), { filename: entry });
  }
  for (const legacy of ['studio', 'portfolio', '_next']) {
    assert.ok(!fs.existsSync(path.join(site, legacy)), legacy);
  }
});

function runAnalytics(hostname) {
  const addedTags = [];
  const context = {
    location: { hostname },
    window: {},
    document: {
      createElement: name => ({ name }),
      head: { append: node => addedTags.push(node) }
    }
  };
  vm.createContext(context);
  vm.runInContext(analytics, context);
  return { context, addedTags };
}

test('production pageviews and studio events use the verified Google Analytics stream', () => {
  for (const host of ['paulloeb.net', 'www.paulloeb.net']) {
    const { context, addedTags } = runAnalytics(host);
    const measurementId = 'G-JLJKB7Q7BX';
    assert.deepEqual(addedTags, [{
      name: 'script',
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=' + measurementId
    }]);
    const [js, config] = context.window.dataLayer;
    assert.equal(js[0], 'js');
    assert.equal(config[0], 'config');
    assert.equal(config[1], measurementId);
    assert.equal(config[2].send_page_view, undefined);
    assert.equal(config[2].allow_google_signals, false);
    context.trackStudioEvent('studio_piano_play');
    context.trackStudioEvent('studio_music_link', 'Velvet Circuits');
    assert.equal(JSON.stringify(Array.from(context.window.dataLayer[2])),
      '["event","studio_piano_play",{}]');
    assert.equal(JSON.stringify(Array.from(context.window.dataLayer[3])),
      '["event","studio_music_link",{"studio_item":"Velvet Circuits"}]');
  }
});

test('local previews do not send events to production Analytics', () => {
  for (const host of ['localhost', '127.0.0.1', 'preview.example']) {
    const { context, addedTags } = runAnalytics(host);
    context.trackStudioEvent('studio_piano_play');
    assert.deepEqual(addedTags, []);
    assert.equal(context.window.dataLayer, undefined);
  }
});
