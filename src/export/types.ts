import type { AssetStore } from '../assets/AssetStore'
import type { RenderSpec, Timeline } from '../domain/types'

export type ProgressCallback = (progress: number) => void
export type ExportExtension = 'mp4' | 'webm'
export type ExportTier = 'h264-mp4' | 'webm-mediabunny' | 'webm-mediarecorder'

export interface ExportResult {
  blob: Blob
  extension: ExportExtension
  tier: ExportTier
  note?: string
}

export interface ExportRequest {
  spec: RenderSpec
  assets: AssetStore
  timeline: Timeline
  onProgress: ProgressCallback
}
