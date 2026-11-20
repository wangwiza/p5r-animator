import type { AssetStore } from '../assets/AssetStore'
import type { ExportController } from '../app/useExport'
import { nameDefaultsPatch } from '../domain/characterDefaults'
import type { AnimatorFormState } from '../domain/form'
import { BackgroundControls } from './BackgroundControls'
import { CharacterControls } from './CharacterControls'
import { DialogueControls } from './DialogueControls'
import { ExportPanel } from './ExportPanel'

interface ControlPanelProps {
  store: AssetStore | null
  form: AnimatorFormState
  updateForm: (patch: Partial<AnimatorFormState>) => void
  exportState: ExportController
  error: string
}

export function ControlPanel({
  store,
  form,
  updateForm,
  exportState,
  error,
}: ControlPanelProps) {
  const character = store?.getCharacter(form.characterId) ?? null

  return (
    <section className="controls">
      <h1>P5R Dialogue Animator</h1>
      <p className="subtitle">Animated dialogue clips with your choice of background.</p>

      {!store ? (
        <p>Loading assets…</p>
      ) : (
        <>
          <BackgroundControls store={store} form={form} updateForm={updateForm} />
          <CharacterControls store={store} form={form} updateForm={updateForm} />
          <DialogueControls
            form={form}
            updateForm={updateForm}
            onResetDefaults={character ? () => updateForm(nameDefaultsPatch(character)) : undefined}
          />
          <ExportPanel state={exportState} error={error} />
        </>
      )}
    </section>
  )
}
