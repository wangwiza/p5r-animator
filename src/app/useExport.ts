import { useCallback, useEffect, useRef, useState } from 'react'
import type { AssetStore } from '../assets/AssetStore'
import { DEFAULT_DOWNLOAD_NAME } from '../domain/defaults'
import type { RenderSpec, Timeline } from '../domain/types'
import { exportVideo } from '../export'

interface ExportParams {
  store: AssetStore | null
  spec: RenderSpec
  timeline: Timeline | null
}

export interface ExportController {
  status: string
  progress: number
  downloadUrl: string | null
  downloadName: string
  error: string
  exportVideo: () => Promise<void>
}

export function useExport({ store, spec, timeline }: ExportParams): ExportController {
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadName, setDownloadName] = useState(DEFAULT_DOWNLOAD_NAME)
  const [error, setError] = useState('')
  const downloadUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    }
  }, [])

  const runExport = useCallback(async () => {
    if (!store || !timeline) return

    setError('')
    setStatus('Rendering video…')
    setProgress(0)

    try {
      const result = await exportVideo({
        spec,
        assets: store,
        timeline,
        onProgress: (value) => setProgress(value * 0.98),
      })

      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
      const url = URL.createObjectURL(result.blob)
      downloadUrlRef.current = url

      setDownloadUrl(url)
      setDownloadName(`p5r-dialogue.${result.extension}`)
      setStatus(result.note ? `Done. ${result.note}` : 'Done — your MP4 is ready.')
      setProgress(1)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
      setStatus('')
    }
  }, [spec, store, timeline])

  return {
    status,
    progress,
    downloadUrl,
    downloadName,
    error,
    exportVideo: runExport,
  }
}
