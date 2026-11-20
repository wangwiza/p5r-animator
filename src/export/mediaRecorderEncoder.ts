import { EXPORT_FPS } from '../domain/constants'
import { renderFrame } from '../render'
import { EXPORT_BITRATE, WEBM_MIME_TYPES } from './constants'
import { createRenderCanvas } from './renderCanvas'
import type { ExportRequest } from './types'

export async function recordWebM({
  spec,
  assets,
  timeline,
  onProgress,
}: ExportRequest): Promise<Blob> {
  const { canvas, ctx } = createRenderCanvas(spec)
  const mimeType = WEBM_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type))
  if (!mimeType) throw new Error('This browser cannot record WebM video')

  const stream = canvas.captureStream(EXPORT_FPS)
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: EXPORT_BITRATE,
  })
  const chunks: BlobPart[] = []
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data)
  }

  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve()
  })
  recorder.start()

  const start = performance.now()
  await new Promise<void>((resolve) => {
    const step = () => {
      const elapsed = (performance.now() - start) / 1000
      renderFrame(ctx, spec, assets, timeline, Math.min(elapsed, timeline.totalDuration))
      onProgress(Math.min(1, elapsed / timeline.totalDuration))
      if (elapsed >= timeline.totalDuration) {
        resolve()
        return
      }
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })

  recorder.stop()
  await stopped
  stream.getTracks().forEach((track) => track.stop())
  return new Blob(chunks, { type: mimeType })
}
