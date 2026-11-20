import type { Timeline } from '../../domain/types'
import { clamp01, easeOutCubic } from '../math'

const MOUTH_PATTERNS = [
  [0, 1, 0],
  [0, 1, 2, 1, 0],
  [0, 1, 2, 1, 2, 1, 0],
]
const MOUTH_FRAME_DURATION = 0.09

const BLINK_START = 3.15
const BLINK_STAGE_DURATION = 2 / 30
const BLINK_STAGES = [null, 1, 0, null] as const

const MOUTH_STREAM = (() => {
  const stream: number[] = []
  let seed = 12345
  for (let phrase = 0; phrase < 64; phrase += 1) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    stream.push(...MOUTH_PATTERNS[seed % MOUTH_PATTERNS.length])
  }
  return stream
})()

export function portraitAlpha(timeline: Timeline, time: number): number {
  const enter = easeOutCubic(clamp01(time / timeline.portraitEnterDuration))
  const fadeSpan = Math.max(timeline.frameDuration, timeline.portraitFadeDuration)
  const fade = 1 - clamp01((time - timeline.portraitFadeStart) / fadeSpan)
  return Math.max(0, Math.min(enter, fade))
}

export function blinkEyeIndex(time: number, eyeCount: number): number | null {
  if (eyeCount <= 0) return null

  const phase = time % 3.4
  const blinkSpan = BLINK_STAGES.length * BLINK_STAGE_DURATION
  if (phase < BLINK_START || phase >= BLINK_START + blinkSpan) return null

  const stage = Math.floor((phase - BLINK_START) / BLINK_STAGE_DURATION)
  const index = BLINK_STAGES[stage]
  if (index === null) return null

  return index % eyeCount
}

export function mouthVariantIndex(
  time: number,
  timeline: Timeline,
  mouthCount: number,
): number | null {
  if (mouthCount <= 0) return null

  const talking = time >= timeline.dialogueFadeStart && time < timeline.textboxDisappearAt
  if (!talking) return 0

  const index = Math.floor(time / MOUTH_FRAME_DURATION) % MOUTH_STREAM.length
  return MOUTH_STREAM[index] % mouthCount
}
