import type { RenderSpec, Timeline } from '../../domain/types'
import { DIALOGUE, DIALOGUE_VERTICAL_OFFSET, FONT, GROUP_OPACITY } from '../constants'
import { clamp01 } from '../math'
import { wrapText } from './wrapText'

export function drawDialogue(
  ctx: CanvasRenderingContext2D,
  spec: RenderSpec,
  timeline: Timeline,
  time: number,
): void {
  if (
    time < timeline.dialogueFadeStart ||
    time >= timeline.textboxDisappearAt ||
    !spec.dialogue
  ) {
    return
  }

  let fontSize = DIALOGUE.fontSize
  let lines: string[] = []
  for (; fontSize >= DIALOGUE.minFontSize; fontSize -= 1) {
    ctx.font = `900 ${fontSize}px ${FONT}`
    lines = wrapText(ctx, spec.dialogue, DIALOGUE.width)
    if (lines.length <= DIALOGUE.maxLines) break
  }
  if (fontSize < DIALOGUE.minFontSize) {
    fontSize = DIALOGUE.minFontSize
    lines = lines.slice(0, DIALOGUE.maxLines)
  }

  const alpha = clamp01((time - timeline.dialogueFadeStart) / timeline.dialogueFadeDuration)
  const centerY = DIALOGUE.y + DIALOGUE.height / 2 + DIALOGUE_VERTICAL_OFFSET

  ctx.save()
  ctx.globalAlpha = GROUP_OPACITY * alpha
  ctx.beginPath()
  ctx.rect(DIALOGUE.x, DIALOGUE.y, DIALOGUE.width, DIALOGUE.height)
  ctx.clip()
  ctx.font = `900 ${fontSize}px ${FONT}`
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  lines.forEach((line, index) => {
    const y = centerY + (index - (lines.length - 1) / 2) * DIALOGUE.lineHeight
    ctx.fillText(line, DIALOGUE.x, y)
  })
  ctx.restore()
}
