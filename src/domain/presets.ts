import { parseHighlightIndices } from './highlights'
import type { PresetDefaults, PresetManifest } from './types'

export function mergePresetDefaults(
  manifest: PresetManifest,
  defaults: PresetDefaults,
): PresetManifest {
  const merged: PresetManifest = {}

  for (const [id, character] of Object.entries(manifest)) {
    const override = defaults[id] ?? {}
    const speakerName = override.defaultSpeakerName ?? character.defaultSpeakerName
    const labelOverrides = override.labelOverrides ?? {}
    const requestedVariant = override.defaultVariantId
    const defaultVariantId =
      requestedVariant && character.variants.some((variant) => variant.id === requestedVariant)
        ? requestedVariant
        : character.defaultVariantId

    merged[id] = {
      ...character,
      displayName: override.displayName ?? character.displayName,
      defaultSpeakerName: speakerName,
      defaultHighlightIndices: parseHighlightIndices(
        override.defaultHighlightIndices ?? character.defaultHighlightIndices,
        speakerName,
      ),
      defaultVariantId,
      variants: character.variants.map((variant) => ({
        ...variant,
        label: labelOverrides[variant.id] ?? variant.label,
      })),
    }
  }

  return merged
}
