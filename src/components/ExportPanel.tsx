import type { ExportController } from '../app/useExport'

interface ExportPanelProps {
  state: ExportController
  error: string
}

export function ExportPanel({ state, error }: ExportPanelProps) {
  const extension = state.downloadName.split('.').pop()?.toUpperCase()

  return (
    <>
      <button
        type="button"
        className="export"
        onClick={state.exportVideo}
        disabled={!!state.status && state.progress < 1}
      >
        Export video
      </button>

      {state.status && <p className="status">{state.status}</p>}

      {state.progress > 0 && state.progress < 1 && (
        <div className="progress">
          <div style={{ width: `${state.progress * 100}%` }} />
        </div>
      )}

      {state.downloadUrl && (
        <a className="download" href={state.downloadUrl} download={state.downloadName}>
          Download {extension}
        </a>
      )}

      {error && <p className="error">{error}</p>}
    </>
  )
}
