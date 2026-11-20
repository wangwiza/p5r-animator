import type { AssetStore } from '../assets/AssetStore'
import { characterSelectionPatch } from '../domain/characterDefaults'
import type { AnimatorFormState } from '../domain/form'
import { Field } from './ui/Field'
import { FilePicker } from './ui/FilePicker'

interface CharacterControlsProps {
  store: AssetStore
  form: AnimatorFormState
  updateForm: (patch: Partial<AnimatorFormState>) => void
}

export function CharacterControls({ store, form, updateForm }: CharacterControlsProps) {
  const characters = Object.values(store.presetManifest).sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  )
  const character = store.getCharacter(form.characterId)
  const variants = character?.variants ?? []
  const uploadActive = !!form.portraitUploadUrl

  return (
    <>
      <Field label="Character">
        <select
          value={form.characterId}
          onChange={(event) => updateForm(characterSelectionPatch(store.getCharacter(event.target.value)))}
          disabled={uploadActive}
        >
          {characters.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.displayName}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Portrait variant">
        <select
          value={form.variantId}
          onChange={(event) => updateForm({ variantId: event.target.value })}
          disabled={uploadActive || variants.length === 0}
        >
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.label}
              {variant.eyes.length === 0 ? ' (mouth only)' : ''}
            </option>
          ))}
        </select>
      </Field>

      <FilePicker
        label="Or upload a portrait (PNG, transparent recommended)"
        accept="image/png,image/webp,image/jpeg"
        value={form.portraitUploadUrl}
        clearLabel="Clear portrait upload and use presets"
        onChange={(url) => updateForm({ portraitUploadUrl: url })}
      />
    </>
  )
}
