import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const appPath = new URL('../src/App.jsx', import.meta.url);

const requiredRoutes = [
  '/',
  '/shop',
  '/candles',
  '/soaps',
  '/fragrances',
  '/cleaning',
  '/about',
  '/sustainability',
  '/contact',
  '/privacy',
  '/terms',
  '/scan',
];

test('app declares required routes', async () => {
  const source = await fs.readFile(appPath, 'utf8');

  requiredRoutes.forEach((route) => {
    assert.ok(source.includes(`path="${route}"`), `missing route: ${route}`);
  });

  assert.ok(source.includes('path="*"'), 'missing fallback route');
});
