import { useMemo, useRef } from 'react'
import { useAnimator } from './useAnimator'
import { useExport } from './useExport'
import { usePreviewLoop } from './usePreviewLoop'
import { ControlPanel } from '../components/ControlPanel'
import { PreviewCanvas } from '../components/PreviewCanvas'
import { buildRenderSpec } from '../domain/buildRenderSpec'
import { computeTimeline } from '../domain/timeline'
import '../styles.css'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { form, updateForm, store, error: assetError } = useAnimator()

  const spec = useMemo(() => buildRenderSpec(form, store?.backgroundManifest), [form, store])
  const timeline = useMemo(
    () => (store ? computeTimeline(spec, store.textboxManifest) : null),
    [spec, store],
  )

  usePreviewLoop({ canvasRef, store, spec, timeline })
  const exportState = useExport({ store, spec, timeline })

  if (assetError && !store) return <div className="fatal">Failed to start: {assetError}</div>

  return (
    <main className="app">
      <ControlPanel
        store={store}
        form={form}
        updateForm={updateForm}
        exportState={exportState}
        error={assetError || exportState.error}
      />
      <PreviewCanvas canvasRef={canvasRef} />
    </main>
  )
}
