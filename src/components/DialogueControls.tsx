import type { AnimatorFormState } from '../domain/form'
import { Field } from './ui/Field'

interface DialogueControlsProps {
  form: AnimatorFormState
  updateForm: (patch: Partial<AnimatorFormState>) => void
  onResetDefaults?: () => void
}

export function DialogueControls({ form, updateForm, onResetDefaults }: DialogueControlsProps) {
  return (
    <>
      <Field label="Speaker name">
        <input value={form.name} onChange={(event) => updateForm({ name: event.target.value })} />
      </Field>

      <Field label="Boxed name characters (comma-separated indices)">
        <input
          type="text"
          value={form.highlightIndices}
          placeholder="e.g. 0,6,14"
          onChange={(event) => updateForm({ highlightIndices: event.target.value })}
        />
        <small className="hint">Zero-based positions. Boxes alternate black, dark grey.</small>
      </Field>

      <button type="button" className="link" onClick={onResetDefaults} disabled={!onResetDefaults}>
        Reset speaker name/box defaults
      </button>

      <Field label="Dialogue text">
        <textarea
          rows={5}
          value={form.dialogue}
          onChange={(event) => updateForm({ dialogue: event.target.value })}
        />
      </Field>

      <Field label={`Dialogue hold: ${form.holdSeconds.toFixed(1)}s`}>
        <input
          type="range"
          min={1}
          max={20}
          step={0.5}
          value={form.holdSeconds}
          onChange={(event) => updateForm({ holdSeconds: Number(event.target.value) })}
        />
      </Field>
    </>
  )
}
