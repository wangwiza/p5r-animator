import type { TextboxManifest, Timeline } from '../../domain/types'

export function textboxFrameIndex(
  time: number,
  manifest: TextboxManifest,
  timeline: Timeline,
): number {
  const { enterFrames, loopFrames } = manifest
  const { frameDuration, textboxStart, enterDuration } = timeline
  const local = time - textboxStart

  if (local < enterDuration) {
    return Math.min(enterFrames - 1, Math.floor(local / frameDuration))
  }
  const phase = Math.floor(((local - enterDuration) / frameDuration) % loopFrames)
  return enterFrames + phase
}
