export interface TextboxManifest {
  sheet: string
  cellWidth: number
  cellHeight: number
  cols: number
  fps: number
  enterFrames: number
  loopFrames: number
  frameRepeat: number
  exitFrames: number
  crop: { x: number; y: number; width: number; height: number }
}

export interface LayerRect {
  x: number
  y: number
  width: number
  height: number
}

export interface PresetLayer {
  file: string
  rect: LayerRect
}

export interface PresetVariant {
  id: string
  label: string
  source: string
  base: string
  eyes: PresetLayer[]
  mouths: PresetLayer[]
}

export interface PresetCharacter {
  id: string
  displayName: string
  defaultSpeakerName: string
  defaultHighlightIndices: number[]
  defaultVariantId: string
  variants: PresetVariant[]
}

export type PresetManifest = Record<string, PresetCharacter>

export interface PresetDefaultOverride {
  displayName?: string
  defaultSpeakerName?: string
  defaultHighlightIndices?: number[]
  defaultVariantId?: string
  labelOverrides?: Record<string, string>
}

export type PresetDefaults = Record<string, PresetDefaultOverride>

export interface BackgroundManifest {
  default: string
  items: Record<string, string>
}

export type PortraitSource =
  | { kind: 'preset'; characterId: string; variantId: string }
  | { kind: 'upload'; url: string }

export type BackgroundSource =
  | { kind: 'green' }
  | { kind: 'preset'; name: string }
  | { kind: 'upload'; url: string }

export interface RenderSpec {
  portrait: PortraitSource
  background: BackgroundSource
  name: string
  nameHighlightIndices: number[]
  dialogue: string
  holdSeconds: number
  width: number
  height: number
}

export interface Timeline {
  frameDuration: number
  enterDuration: number
  loopDuration: number
  totalDuration: number
  textboxStart: number
  nameAppearAt: number
  nameSwingAt: number
  nameBounceAt: number
  nameSettleAt: number
  dialogueFadeStart: number
  dialogueFadeDuration: number
  textboxDisappearAt: number
  portraitEnterDuration: number
  portraitFadeStart: number
  portraitFadeDuration: number
}
