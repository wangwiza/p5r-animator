import type { RenderSpec, Timeline } from '../../domain/types'
import {
  FONT,
  GROUP_OPACITY,
  HIGHLIGHT_BOX_BLACK,
  HIGHLIGHT_BOX_GREY,
  NAME,
} from '../constants'
import { nameMotion } from './motion'

export function drawName(
  ctx: CanvasRenderingContext2D,
  spec: RenderSpec,
  timeline: Timeline,
  time: number,
): void {
  if (time < timeline.nameAppearAt || time >= timeline.textboxDisappearAt || !spec.name) return

  const motion = nameMotion(timeline, time)
  ctx.save()
  ctx.globalAlpha = GROUP_OPACITY
  ctx.translate(NAME.x, NAME.y + motion.y)
  ctx.rotate(((NAME.angleDeg + motion.angle) * Math.PI) / 180)
  ctx.font = `900 ${NAME.fontSize}px ${FONT}`
  ctx.textBaseline = 'middle'

  const chars = Array.from(spec.name)
  const widths = chars.map((char) => ctx.measureText(char).width)
  const total = widths.reduce((sum, width) => sum + width, 0) + Math.max(0, chars.length - 1)
  const boxOrder = new Map(spec.nameHighlightIndices.map((index, order) => [index, order]))
  let x = -total / 2

  for (let i = 0; i < chars.length; i += 1) {
    const width = widths[i]
    const order = boxOrder.get(i)

    if (order !== undefined) {
      ctx.fillStyle = order % 2 === 0 ? HIGHLIGHT_BOX_BLACK : HIGHLIGHT_BOX_GREY
      ctx.fillRect(x, -NAME.fontSize / 2 - 3, width, NAME.fontSize + 6)
      ctx.fillStyle = '#ffffff'
    } else {
      ctx.fillStyle = '#111111'
    }

    ctx.fillText(chars[i], x, 0)
    x += width + 1
  }

  ctx.restore()
}
