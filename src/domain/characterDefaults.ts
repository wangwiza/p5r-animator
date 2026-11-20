import type { AnimatorFormState } from './form'
import { formatHighlightIndices, parseHighlightIndices } from './highlights'
import type { PresetCharacter } from './types'

function defaultHighlightString(character: PresetCharacter): string {
  return formatHighlightIndices(
    parseHighlightIndices(character.defaultHighlightIndices, character.defaultSpeakerName),
  )
}

export function characterSelectionPatch(
  character: PresetCharacter | null,
): Partial<AnimatorFormState> {
  if (!character) return {}

  return {
    characterId: character.id,
    variantId: character.defaultVariantId,
    name: character.defaultSpeakerName,
    highlightIndices: defaultHighlightString(character),
  }
}

export function nameDefaultsPatch(character: PresetCharacter | null): Partial<AnimatorFormState> {
  if (!character) return {}

  return {
    name: character.defaultSpeakerName,
    highlightIndices: defaultHighlightString(character),
  }
}
