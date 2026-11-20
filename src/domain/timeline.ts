import type { RenderSpec, TextboxManifest, Timeline } from './types'

const PORTRAIT_ENTER_DURATION = 0.18
const PORTRAIT_FADE_DURATION = 0.3

export function computeTimeline(spec: RenderSpec, manifest: TextboxManifest): Timeline {
  const frameDuration = 1 / manifest.fps
  const repeat = manifest.frameRepeat
  const sourceFrame = (frame: number) => frame * repeat * frameDuration

  // The textbox entry starts exactly when the portrait settles and its shadow
  // begins sliding south-west.
  const textboxStart = PORTRAIT_ENTER_DURATION
  const enterDuration = manifest.enterFrames * frameDuration
  const loopDuration = Math.max(spec.holdSeconds, 1.2)
  const textboxDisappearAt = textboxStart + enterDuration + loopDuration
  const portraitFadeStart = textboxDisappearAt + 0.05
  const totalDuration = portraitFadeStart + PORTRAIT_FADE_DURATION

  return {
    frameDuration,
    enterDuration,
    loopDuration,
    totalDuration,
    textboxStart,
    nameAppearAt: textboxStart + sourceFrame(5),
    nameSwingAt: textboxStart + sourceFrame(6),
    nameBounceAt: textboxStart + sourceFrame(7),
    nameSettleAt: textboxStart + sourceFrame(8),
    dialogueFadeStart: textboxStart + sourceFrame(5),
    dialogueFadeDuration: sourceFrame(3),
    textboxDisappearAt,
    portraitEnterDuration: PORTRAIT_ENTER_DURATION,
    portraitFadeStart,
    portraitFadeDuration: PORTRAIT_FADE_DURATION,
  }
}
