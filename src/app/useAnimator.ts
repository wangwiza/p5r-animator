import { useCallback, useEffect, useState } from 'react'
import { characterSelectionPatch } from '../domain/characterDefaults'
import { DEFAULT_CHARACTER_ID, INITIAL_FORM_STATE } from '../domain/defaults'
import type { AnimatorFormState } from '../domain/form'
import { useAssetLoading } from './useAssetLoading'

export function useAnimator() {
  const [form, setForm] = useState<AnimatorFormState>(INITIAL_FORM_STATE)

  const updateForm = useCallback((patch: Partial<AnimatorFormState>) => {
    setForm((current) => ({ ...current, ...patch }))
  }, [])

  const loading = useAssetLoading(form)
  const { store } = loading

  useEffect(() => {
    if (!store) return

    const character =
      store.getCharacter(DEFAULT_CHARACTER_ID) ?? Object.values(store.presetManifest)[0]
    if (!character) return

    setForm((current) => {
      if (
        current.characterId === character.id &&
        current.variantId === character.defaultVariantId
      ) {
        return current
      }
      return { ...current, ...characterSelectionPatch(character) }
    })
  }, [store])

  return {
    form,
    updateForm,
    ...loading,
  }
}
