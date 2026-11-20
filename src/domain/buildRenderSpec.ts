import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants'
import { DEFAULT_BACKGROUND_PRESET } from './defaults'
import type { AnimatorFormState } from './form'
import { parseHighlightIndices } from './highlights'
import type { BackgroundManifest, BackgroundSource, PortraitSource, RenderSpec } from './types'

const PRESET_PREFIX = 'preset:'

export function parseBackgroundChoice(choice: string): string | null {
  return choice.startsWith(PRESET_PREFIX) ? choice.slice(PRESET_PREFIX.length) : null
}

export function resolveBackgroundPreset(choice: string, manifest?: BackgroundManifest): string {
  const requested = parseBackgroundChoice(choice)
  if (!manifest) return requested || DEFAULT_BACKGROUND_PRESET
  if (!requested || !manifest.items[requested]) return manifest.default || DEFAULT_BACKGROUND_PRESET
  return requested
}

export function buildRenderSpec(form: AnimatorFormState, manifest?: BackgroundManifest): RenderSpec {
  const backgroundPresetName = resolveBackgroundPreset(form.backgroundChoice, manifest)

  let background: BackgroundSource
  if (form.backgroundChoice === 'green') {
    background = { kind: 'green' }
  } else if (form.backgroundChoice === 'upload' && form.backgroundUploadUrl) {
    background = { kind: 'upload', url: form.backgroundUploadUrl }
  } else {
    background = { kind: 'preset', name: backgroundPresetName }
  }

  const portrait: PortraitSource = form.portraitUploadUrl
    ? { kind: 'upload', url: form.portraitUploadUrl }
    : { kind: 'preset', characterId: form.characterId, variantId: form.variantId }

  return {
    portrait,
    background,
    name: form.name,
    nameHighlightIndices: parseHighlightIndices(form.highlightIndices, form.name),
    dialogue: form.dialogue,
    holdSeconds: form.holdSeconds,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  }
}
