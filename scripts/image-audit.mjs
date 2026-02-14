import fs from 'node:fs/promises';
import path from 'node:path';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg']);
const DEFAULT_THRESHOLD_KB = 500;

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const thresholdArg = args.find((arg) => arg.startsWith('--threshold-kb='));
const thresholdKb = thresholdArg ? Number(thresholdArg.split('=')[1]) : DEFAULT_THRESHOLD_KB;

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return fullPath;
    }),
  );
  return files.flat();
};

const formatKb = (bytes) => `${(bytes / 1024).toFixed(1)}KB`;

const main = async () => {
  const publicDir = path.resolve('public');
  const allFiles = await walk(publicDir);
  const imageFiles = allFiles.filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()));

  const rows = await Promise.all(
    imageFiles.map(async (file) => {
      const stat = await fs.stat(file);
      return {
        file: path.relative(process.cwd(), file),
        bytes: stat.size,
      };
    }),
  );

  const oversized = rows
    .filter((row) => row.bytes > thresholdKb * 1024)
    .sort((a, b) => b.bytes - a.bytes);

  const totalBytes = rows.reduce((sum, row) => sum + row.bytes, 0);

  console.log(`Image audit: ${rows.length} files, total ${(totalBytes / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`Threshold: ${thresholdKb}KB`);

  if (oversized.length === 0) {
    console.log('No oversized images found.');
    return;
  }

  console.log('Oversized images:');
  oversized.forEach((row) => {
    console.log(`- ${row.file} (${formatKb(row.bytes)})`);
  });

  if (strict) {
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
