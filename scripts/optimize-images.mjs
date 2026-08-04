/**
 * One-off image optimiser for /public.
 *
 * next/image optimises on delivery, but multi-megabyte sources make the first
 * request for each size slow, bloat the repo, and inflate build time. This
 * downscales anything larger than MAX_WIDTH and re-encodes it, in place.
 *
 * Usage:  node scripts/optimize-images.mjs [--dry]
 *
 * Originals are tracked in git — `git checkout -- public/` reverts.
 */

import sharp from "sharp"
import { readdir, stat, rename, unlink } from "node:fs/promises"
import { join, extname, basename } from "node:path"

const PUBLIC_DIR = new URL("../public/", import.meta.url).pathname
const MAX_WIDTH = 1600
const JPEG_QUALITY = 80
const PNG_QUALITY = 80
// Anything under this is already fine; leave it alone.
const SIZE_THRESHOLD = 400 * 1024
// GLTF textures are UV-mapped and loaded directly by three.js, not next/image.
// Downscaling them risks visible seams, so they are left untouched.
const EXCLUDE_DIRS = ["models"]

const DRY_RUN = process.argv.includes("--dry")

const fmt = (bytes) => `${(bytes / 1024).toFixed(0)}KB`

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.includes(entry.name)) continue
      out.push(...(await walk(full)))
    }
    else out.push(full)
  }
  return out
}

async function main() {
  const files = (await walk(PUBLIC_DIR)).filter((f) =>
    [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase())
  )

  let before = 0
  let after = 0

  for (const file of files) {
    const { size } = await stat(file)
    if (size < SIZE_THRESHOLD) continue

    const image = sharp(file)
    const meta = await image.metadata()
    const ext = extname(file).toLowerCase()

    let pipeline = image
    if (meta.width && meta.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    }
    pipeline =
      ext === ".png"
        ? pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 })
        : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })

    if (DRY_RUN) {
      const buf = await pipeline.toBuffer()
      console.log(`  ${basename(file)}  ${fmt(size)} → ${fmt(buf.length)}  (dry)`)
      before += size
      after += buf.length
      continue
    }

    // sharp cannot write to the file it is reading, so stage then swap.
    const tmp = `${file}.tmp`
    await pipeline.toFile(tmp)
    const { size: newSize } = await stat(tmp)

    if (newSize >= size) {
      await unlink(tmp)
      console.log(`  ${basename(file)}  ${fmt(size)} — already optimal, skipped`)
      before += size
      after += size
      continue
    }

    await rename(tmp, file)
    console.log(`  ${basename(file)}  ${fmt(size)} → ${fmt(newSize)}`)
    before += size
    after += newSize
  }

  const saved = before - after
  console.log(
    `\nTotal: ${fmt(before)} → ${fmt(after)}  (saved ${fmt(saved)}, ${(
      (saved / before) * 100
    ).toFixed(0)}%)`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
