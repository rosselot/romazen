import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('image audit exits non-zero in strict mode when threshold is low', () => {
  const result = spawnSync('node', ['scripts/image-audit.mjs', '--threshold-kb=1', '--strict'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 1);
  assert.match(result.stdout, /Oversized images:/);
});

test('image audit exits zero for very high threshold', () => {
  const result = spawnSync('node', ['scripts/image-audit.mjs', '--threshold-kb=5000'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /No oversized images found\./);
});
