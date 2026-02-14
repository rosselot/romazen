import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE_DIR = path.resolve('public/assets/images');
const OUTPUT_DIR = path.resolve('public/assets/images/optimized');
const widths = [640, 1024, 1600];
const quality = 78;

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (fullPath === OUTPUT_DIR) {
          return [];
        }
        return walk(fullPath);
      }
      return [fullPath];
    }),
  );
  return files.flat();
};

const main = async () => {
  const { default: sharp } = await import('sharp').catch(() => ({ default: null }));
  if (!sharp) {
    console.error('Missing optional dependency "sharp". Install it with: npm install -D sharp');
    process.exitCode = 1;
    return;
  }

  await ensureDir(OUTPUT_DIR);

  const sourceFiles = (await walk(SOURCE_DIR)).filter((file) =>
    IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()),
  );

  let generated = 0;

  for (const file of sourceFiles) {
    const rel = path.relative(SOURCE_DIR, file);
    const base = rel.replace(path.extname(rel), '');
    const metadata = await sharp(file).metadata();
    const sourceWidth = metadata.width ?? 0;

    for (const width of widths) {
      if (sourceWidth > 0 && width > sourceWidth) {
        continue;
      }

      const outPath = path.join(OUTPUT_DIR, `${base}-${width}.webp`);
      await ensureDir(path.dirname(outPath));

      await sharp(file)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toFile(outPath);

      generated += 1;
      console.log(`Generated ${path.relative(process.cwd(), outPath)}`);
    }
  }

  console.log(`Optimization complete. Generated ${generated} WebP assets in ${path.relative(process.cwd(), OUTPUT_DIR)}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
