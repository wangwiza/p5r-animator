import type { AssetStore, PresetLayerImage } from '../../assets/AssetStore'
import type { RenderSpec, Timeline } from '../../domain/types'
import { PORTRAIT, SHADOW } from '../constants'
import { clamp01, easeOutCubic } from '../math'
import { blinkEyeIndex, mouthVariantIndex, portraitAlpha } from './animation'
import { silhouetteOf } from './silhouette'

function drawPortraitShadow(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha: number,
  timeline: Timeline,
  time: number,
): void {
  if (alpha <= 0) return

  const slide = easeOutCubic(clamp01((time - timeline.portraitEnterDuration) / SHADOW.slideDuration))
  ctx.save()
  ctx.globalAlpha = alpha * SHADOW.opacity
  ctx.drawImage(
    silhouetteOf(image),
    x + SHADOW.x * slide,
    y + SHADOW.y * slide,
    width,
    height,
  )
  ctx.restore()
}

function drawCroppedLayer(
  ctx: CanvasRenderingContext2D,
  layer: PresetLayerImage | null,
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
): void {
  if (!layer) return

  ctx.drawImage(
    layer.image,
    x + layer.rect.x * scaleX,
    y + layer.rect.y * scaleY,
    layer.rect.width * scaleX,
    layer.rect.height * scaleY,
  )
}

export function drawPortrait(
  ctx: CanvasRenderingContext2D,
  spec: RenderSpec,
  assets: AssetStore,
  timeline: Timeline,
  time: number,
): void {
  const alpha = portraitAlpha(timeline, time)
  if (alpha <= 0) return

  const entry = easeOutCubic(clamp01(time / timeline.portraitEnterDuration))
  const x = -PORTRAIT.slide * (1 - entry)

  let image: HTMLImageElement | null = null
  let eye: PresetLayerImage | null = null
  let mouth: PresetLayerImage | null = null
  let width = PORTRAIT.width
  let height = PORTRAIT.height

  if (spec.portrait.kind === 'upload') {
    image = assets.getPortrait(spec.portrait)
    if (image) {
      const scale = Math.min(PORTRAIT.width / image.naturalWidth, PORTRAIT.height / image.naturalHeight)
      width = image.naturalWidth * scale
      height = image.naturalHeight * scale
    }
  } else {
    const { characterId, variantId } = spec.portrait
    const variant = assets.getVariant(characterId, variantId)
    image = assets.getBaseImage(characterId, variantId)

    const eyeIndex = blinkEyeIndex(time, variant?.eyes.length ?? 0)
    if (eyeIndex !== null) eye = assets.getEyeLayer(characterId, variantId, eyeIndex)

    const mouthIndex = mouthVariantIndex(time, timeline, variant?.mouths.length ?? 0)
    if (mouthIndex !== null) mouth = assets.getMouthLayer(characterId, variantId, mouthIndex)
  }

  if (!image) return

  const y = spec.height - height
  const scaleX = width / (image.naturalWidth || PORTRAIT.width)
  const scaleY = height / (image.naturalHeight || PORTRAIT.height)

  // Shadow is always drawn first so it stays behind the portrait.
  drawPortraitShadow(ctx, image, x, y, width, height, alpha, timeline, time)

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.drawImage(image, x, y, width, height)
  drawCroppedLayer(ctx, eye, x, y, scaleX, scaleY)
  drawCroppedLayer(ctx, mouth, x, y, scaleX, scaleY)
  ctx.restore()
}
