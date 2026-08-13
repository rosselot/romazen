import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('static discovery files use the production authority and exclude admin', async () => {
  const files = await Promise.all([
    fs.readFile(new URL('../index.html', import.meta.url), 'utf8'),
    fs.readFile(new URL('../public/robots.txt', import.meta.url), 'utf8'),
    fs.readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8'),
  ]);
  const source = files.join('\n');

  assert.doesNotMatch(source, /romazen\.vercel\.app/);
  assert.match(source, /https:\/\/www\.romazen\.com/);
  assert.doesNotMatch(files[2], /\/admin/);
  assert.match(files[1], /Disallow: \/admin/);
});
