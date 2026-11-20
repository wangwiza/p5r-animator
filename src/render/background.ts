import type { AssetStore } from '../assets/AssetStore'
import type { RenderSpec } from '../domain/types'
import { GREEN } from './constants'

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  spec: RenderSpec,
  assets: AssetStore,
): void {
  const image = assets.getBackground(spec.background)

  if (!image) {
    ctx.fillStyle = GREEN
    ctx.fillRect(0, 0, spec.width, spec.height)
    return
  }

  const scale = Math.max(spec.width / image.naturalWidth, spec.height / image.naturalHeight)
  const width = image.naturalWidth * scale
  const height = image.naturalHeight * scale
  ctx.drawImage(image, (spec.width - width) / 2, (spec.height - height) / 2, width, height)
}
