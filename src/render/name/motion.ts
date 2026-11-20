import type { Timeline } from '../../domain/types'
import { clamp01 } from '../math'

export function nameMotion(timeline: Timeline, time: number): { y: number; angle: number } {
  const keys = [
    { t: timeline.nameAppearAt, y: 0, angle: 0 },
    { t: timeline.nameSwingAt, y: 12, angle: 2 },
    { t: timeline.nameBounceAt, y: -2, angle: -1 },
    { t: timeline.nameSettleAt, y: 0, angle: 0 },
  ]

  for (let i = 1; i < keys.length; i += 1) {
    if (time <= keys[i].t) {
      const span = Math.max(keys[i].t - keys[i - 1].t, 0.001)
      const progress = clamp01((time - keys[i - 1].t) / span)
      return {
        y: keys[i - 1].y + (keys[i].y - keys[i - 1].y) * progress,
        angle: keys[i - 1].angle + (keys[i].angle - keys[i - 1].angle) * progress,
      }
    }
  }

  return { y: 0, angle: 0 }
}
