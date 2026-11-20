import type { AssetStore } from '../assets/AssetStore'
import { formatName } from '../domain/format'
import type { AnimatorFormState } from '../domain/form'
import { Field } from './ui/Field'
import { FilePicker } from './ui/FilePicker'

interface BackgroundControlsProps {
  store: AssetStore
  form: AnimatorFormState
  updateForm: (patch: Partial<AnimatorFormState>) => void
}

export function BackgroundControls({ store, form, updateForm }: BackgroundControlsProps) {
  return (
    <>
      <Field label="Background">
        <select
          value={form.backgroundChoice}
          onChange={(event) => updateForm({ backgroundChoice: event.target.value })}
        >
          <optgroup label="Presets">
            {Object.keys(store.backgroundManifest.items).map((key) => (
              <option key={key} value={`preset:${key}`}>
                {formatName(key)}
              </option>
            ))}
          </optgroup>
          <option value="green">Greenscreen</option>
          <option value="upload">Upload image</option>
        </select>
      </Field>

      {form.backgroundChoice === 'upload' && (
        <FilePicker
          label="Background image (1920×1080 recommended)"
          accept="image/png,image/webp,image/jpeg"
          value={form.backgroundUploadUrl}
          clearLabel="Clear background upload"
          onChange={(url) => updateForm({ backgroundUploadUrl: url })}
        />
      )}
    </>
  )
}
