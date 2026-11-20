import type { AssetStore } from '../assets/AssetStore'
import type { RenderSpec, Timeline } from '../domain/types'
import { drawBackground } from './background'
import { drawDialogue } from './dialogue/drawDialogue'
import { drawName } from './name/drawName'
import { drawPortrait } from './portrait/drawPortrait'
import { drawTextbox } from './textbox/drawTextbox'

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  spec: RenderSpec,
  assets: AssetStore,
  timeline: Timeline,
  time: number,
): void {
  ctx.save()
  drawBackground(ctx, spec, assets)
  drawPortrait(ctx, spec, assets, timeline, time)
  drawTextbox(ctx, spec, assets, timeline, time)
  drawName(ctx, spec, timeline, time)
  drawDialogue(ctx, spec, timeline, time)
  ctx.restore()
}
