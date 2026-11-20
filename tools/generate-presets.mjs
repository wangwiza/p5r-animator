import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const INPUT_DIR = path.join(ROOT, 'assets', 'frames')
const OUTPUT_DIR = path.join(ROOT, 'public', 'presets')
const MANIFEST_PATH = path.join(ROOT, 'public', 'presets.json')
const PADDING = 1
const QUALITY = '90'
const MANIFEST_ONLY = process.argv.includes('--manifest-only')

const LAYER_RE = /_([em])(\d+)\.png$/

function run(command, args) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function titleFromId(id) {
  return id
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function labelFromStem(stem) {
  return stem.split('_').join(' · ')
}

function identifyLayer(file) {
  const output = run('magick', ['identify', '-format', '%wx%h %@', file]).trim()
  const [size, trim = ''] = output.split(/\s+/)
  const [width, height] = size.split('x').map(Number)
  const match = /^(\d+)x(\d+)\+(\d+)\+(\d+)$/.exec(trim)

  if (!match) {
    return {
      width,
      height,
      crop: { x: 0, y: 0, width, height },
    }
  }

  const [, cropWidthText, cropHeightText, xText, yText] = match
  const cropWidth = Number(cropWidthText)
  const cropHeight = Number(cropHeightText)
  const x = Math.max(0, Number(xText) - PADDING)
  const y = Math.max(0, Number(yText) - PADDING)

  return {
    width,
    height,
    crop: {
      x,
      y,
      width: Math.min(width - x, cropWidth + PADDING * 2),
      height: Math.min(height - y, cropHeight + PADDING * 2),
    },
  }
}

function cropToWebp(input, output, crop) {
  const geometry = `${crop.width}x${crop.height}+${crop.x}+${crop.y}`
  run('magick', [input, '-crop', geometry, '+repage', '-quality', QUALITY, output])
}

function copyToWebp(input, output) {
  run('magick', [input, '-quality', QUALITY, output])
}

function layersFor(files, stem, kind) {
  const pattern = new RegExp(`^${escapeRegExp(stem)}_${kind}(\\d+)\\.png$`)
  return files
    .map((file) => ({ file, match: pattern.exec(file.name) }))
    .filter((entry) => entry.match)
    .sort((a, b) => Number(a.match[1]) - Number(b.match[1]))
    .map((entry) => ({ file: entry.file, index: Number(entry.match[1]) }))
}

function relative(character, stem, name) {
  return `presets/${character}/${stem}/${name}`.split(path.sep).join('/')
}

function generateVariant(character, stem, files) {
  const outputDir = path.join(OUTPUT_DIR, character, stem)
  if (!MANIFEST_ONLY) mkdirSync(outputDir, { recursive: true })

  const baseFile = files.find((file) => file.name === `${stem}.png`)
  if (!baseFile) return null

  const mouthFiles = layersFor(files, stem, 'm')
  if (!mouthFiles.length) return null

  if (!MANIFEST_ONLY) copyToWebp(baseFile.path, path.join(outputDir, 'base.webp'))

  const makeLayer = (entry, kind) => {
    const info = identifyLayer(entry.file.path)
    const name = `${kind}${entry.index}.webp`
    if (!MANIFEST_ONLY) cropToWebp(entry.file.path, path.join(outputDir, name), info.crop)
    return {
      file: relative(character, stem, name),
      rect: info.crop,
    }
  }

  return {
    id: stem,
    label: labelFromStem(stem),
    source: stem,
    base: relative(character, stem, 'base.webp'),
    eyes: layersFor(files, stem, 'e').map((entry) => makeLayer(entry, 'eye')),
    mouths: mouthFiles.map((entry) => makeLayer(entry, 'mouth')),
  }
}

function main() {
  if (!MANIFEST_ONLY) {
    rmSync(OUTPUT_DIR, { recursive: true, force: true })
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const manifest = {}
  let variantCount = 0

  const characterDirs = readdirSync(INPUT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'textbox')
    .sort((a, b) => a.name.localeCompare(b.name))

  for (const characterDir of characterDirs) {
    const character = characterDir.name
    const dir = path.join(INPUT_DIR, character)
    const files = readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.png'))
      .map((entry) => ({ name: entry.name, path: path.join(dir, entry.name) }))

    const bases = files
      .filter((file) => !LAYER_RE.test(file.name))
      .map((file) => file.name.replace(/\.png$/, ''))
      .sort()

    const variants = []
    for (const stem of bases) {
      const variant = generateVariant(character, stem, files)
      if (!variant) continue
      variants.push(variant)
      variantCount += 1
    }

    if (!variants.length) continue

    const defaultVariant = variants.find((variant) => variant.eyes.length > 0) ?? variants[0]
    const displayName = titleFromId(character)

    manifest[character] = {
      id: character,
      displayName,
      defaultSpeakerName: displayName,
      defaultHighlightIndices: [0],
      defaultVariantId: defaultVariant.id,
      variants,
    }

    console.log(`${character}: ${variants.length} variants`)
  }

  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Generated ${variantCount} variants across ${Object.keys(manifest).length} characters.`)
}

main()
