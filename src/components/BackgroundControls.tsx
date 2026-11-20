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
          disabled={!!form.backgroundUploadUrl}
        >
          {Object.keys(store.backgroundManifest.items).map((key) => (
            <option key={key} value={`preset:${key}`}>
              {formatName(key)}
            </option>
          ))}
          <option value="green">greenscreen</option>
        </select>
      </Field>

      <FilePicker
        label="Or upload a background (1920×1080 recommended)"
        accept="image/png,image/webp,image/jpeg"
        value={form.backgroundUploadUrl}
        clearLabel="Clear background upload and use presets"
        onChange={(url) => updateForm({ backgroundUploadUrl: url })}
      />
    </>
  )
}
