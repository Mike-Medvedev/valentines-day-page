#!/usr/bin/env node
/**
 * Pre-compress and resize images using ffmpeg.
 * Run before build to reduce source size and bundle output.
 * Max width: 800px (covers ScratchCard 400px + retina, captcha thumbnails).
 *
 * PNG photos → WebP (huge savings, e.g. 1.6MB → ~80KB)
 * JPEG → recompress at q:v 5 for smaller size
 */
import { readdir, stat } from "node:fs/promises";
import { join, extname, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { unlink } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = join(__dirname, "../src/assets/photos");
const MAX_WIDTH = 800;
const PNG_TO_WEBP_THRESHOLD = 200 * 1024; // Convert PNGs > 200KB to WebP

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const SCALE_FILTER = `scale='min(${MAX_WIDTH},iw)':-2`;

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const base = filePath.slice(0, -ext.length);
  const tempPath = `${base}.tmp`;

  try {
    if (ext === ".jpg" || ext === ".jpeg") {
      // JPEG: q:v 5 ≈ 82% quality, smaller files
      const outPath = `${tempPath}${ext}`;
      execSync(
        `ffmpeg -y -i "${filePath}" -vf "${SCALE_FILTER}" -q:v 5 -movflags +faststart "${outPath}"`,
        { stdio: "pipe" }
      );
      await unlink(filePath).catch(() => {});
      execSync(`mv "${outPath}" "${filePath}"`);
    } else if (ext === ".png") {
      const stats = await stat(filePath);
      // Large PNG photos compress poorly; convert to WebP for ~80-90% savings
      if (stats.size > PNG_TO_WEBP_THRESHOLD) {
        const webpPath = `${base}.webp`;
        execSync(
          `ffmpeg -y -i "${filePath}" -vf "${SCALE_FILTER}" -quality 82 "${webpPath}"`,
          { stdio: "pipe" }
        );
        await unlink(filePath).catch(() => {});
        return { converted: true, newExt: ".webp" };
      }
      // Small PNGs: keep as PNG, compress
      const outPath = `${tempPath}.png`;
      execSync(
        `ffmpeg -y -i "${filePath}" -vf "${SCALE_FILTER}" -compression_level 6 "${outPath}"`,
        { stdio: "pipe" }
      );
      await unlink(filePath).catch(() => {});
      execSync(`mv "${outPath}" "${filePath}"`);
    } else if (ext === ".webp") {
      const outPath = `${tempPath}.webp`;
      execSync(
        `ffmpeg -y -i "${filePath}" -vf "${SCALE_FILTER}" -quality 82 "${outPath}"`,
        { stdio: "pipe" }
      );
      await unlink(filePath).catch(() => {});
      execSync(`mv "${outPath}" "${filePath}"`);
    }

    // Normalize to lowercase extension
    const baseName = basename(filePath);
    const lowerName = baseName.replace(/\.[^.]+$/, (m) => m.toLowerCase());
    if (baseName !== lowerName) {
      const dir = join(dirname(filePath), "");
      execSync(`mv "${dir}${baseName}" "${dir}${lowerName}"`);
    }
    return { converted: false };
  } catch (err) {
    try {
      execSync(`rm -f "${tempPath}"*`);
    } catch {}
    return null;
  }
}

async function main() {
  const files = await readdir(PHOTOS_DIR);
  const images = files.filter(
    (f) => EXTENSIONS.includes(extname(f).toLowerCase()) && !f.startsWith(".")
  );

  console.log(`Optimizing ${images.length} images (max width: ${MAX_WIDTH}px)...`);
  let ok = 0;
  const conversions = [];
  for (const file of images) {
    const path = join(PHOTOS_DIR, file);
    const result = await optimizeImage(path);
    if (result) {
      ok++;
      const msg = result.converted ? `  ✓ ${file} → ${basename(file, extname(file))}.webp` : `  ✓ ${file}`;
      console.log(msg);
      if (result.converted) {
        conversions.push({ from: file, to: basename(file, extname(file)) + ".webp" });
      }
    } else {
      console.log(`  ✗ ${file} (skipped)`);
    }
  }
  console.log(`Done. Optimized ${ok}/${images.length} images.`);
  if (conversions.length > 0) {
    console.log("\nUpdate imports for converted PNG→WebP files:");
    conversions.forEach(({ from, to }) => console.log(`  ${from} → ${to}`));
  }
}

main().catch(console.error);
