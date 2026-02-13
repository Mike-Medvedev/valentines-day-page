#!/usr/bin/env node
/**
 * Pre-compress and resize images using ffmpeg.
 * Run before build to reduce source size and bundle output.
 * Max width: 1200px (covers full viewport on most devices).
 */
import { readdir } from "node:fs/promises";
import { join, extname, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = join(__dirname, "../src/assets/photos");
const MAX_WIDTH = 1200;

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const SCALE_FILTER = `scale='min(${MAX_WIDTH},iw)':-2`;

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const base = filePath.slice(0, -ext.length);
  const tempPath = `${base}.tmp${ext}`;

  try {
    if (ext === ".jpg" || ext === ".jpeg") {
      // JPEG: q:v 4 ≈ 85% quality, good balance
      execSync(
        `ffmpeg -y -i "${filePath}" -vf "${SCALE_FILTER}" -q:v 4 "${tempPath}"`,
        { stdio: "pipe" }
      );
    } else if (ext === ".png") {
      // PNG: compression_level 6, convert to PNG-8 for photos
      execSync(
        `ffmpeg -y -i "${filePath}" -vf "${SCALE_FILTER}" -compression_level 6 "${tempPath}"`,
        { stdio: "pipe" }
      );
    } else if (ext === ".webp") {
      // WebP: quality 82
      execSync(
        `ffmpeg -y -i "${filePath}" -vf "${SCALE_FILTER}" -quality 82 "${tempPath}"`,
        { stdio: "pipe" }
      );
    }

    execSync(`mv "${tempPath}" "${filePath}"`);
    // Normalize to lowercase extension for Linux/Docker case-sensitivity
    const baseName = basename(filePath);
    const lowerName = baseName.replace(/\.[^.]+$/, (m) => m.toLowerCase());
    if (baseName !== lowerName) {
      const dir = join(dirname(filePath), "");
      execSync(`mv "${dir}${baseName}" "${dir}${lowerName}"`);
    }
    return true;
  } catch (err) {
    try {
      execSync(`rm -f "${tempPath}"`);
    } catch {}
    return false;
  }
}

async function main() {
  const files = await readdir(PHOTOS_DIR);
  const images = files.filter(
    (f) => EXTENSIONS.includes(extname(f).toLowerCase()) && !f.startsWith(".")
  );

  console.log(`Optimizing ${images.length} images (max width: ${MAX_WIDTH}px)...`);
  let ok = 0;
  for (const file of images) {
    const path = join(PHOTOS_DIR, file);
    if (await optimizeImage(path)) {
      ok++;
      console.log(`  ✓ ${file}`);
    } else {
      console.log(`  ✗ ${file} (skipped)`);
    }
  }
  console.log(`Done. Optimized ${ok}/${images.length} images.`);
}

main().catch(console.error);
