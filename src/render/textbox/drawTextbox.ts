import type { AssetStore } from '../../assets/AssetStore'
import type { RenderSpec, Timeline } from '../../domain/types'
import { GROUP_OPACITY } from '../constants'
import { textboxFrameIndex } from './frameIndex'

export function drawTextbox(
  ctx: CanvasRenderingContext2D,
  spec: RenderSpec,
  assets: AssetStore,
  timeline: Timeline,
  time: number,
): void {
  if (time < timeline.textboxStart || time >= timeline.textboxDisappearAt) return

  const manifest = assets.textboxManifest
  const index = textboxFrameIndex(time, manifest, timeline)
  const col = index % manifest.cols
  const row = Math.floor(index / manifest.cols)
  const crop = manifest.crop

  ctx.save()
  ctx.globalAlpha = GROUP_OPACITY
  ctx.drawImage(
    assets.getTextboxSheet(),
    col * manifest.cellWidth,
    row * manifest.cellHeight,
    manifest.cellWidth,
    manifest.cellHeight,
    crop.x,
    spec.height - crop.height,
    crop.width,
    crop.height,
  )
  ctx.restore()
}
