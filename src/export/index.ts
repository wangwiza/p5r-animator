import { findH264Codec, webCodecsAvailable } from './capabilities'
import { WEBM_NOTE } from './constants'
import { encodeWithMediabunny } from './mediabunnyEncoder'
import { recordWebM } from './mediaRecorderEncoder'
import type { ExportRequest, ExportResult } from './types'

export type { ExportExtension, ExportRequest, ExportResult, ExportTier } from './types'

export async function exportVideo(request: ExportRequest): Promise<ExportResult> {
  if (webCodecsAvailable()) {
    const h264 = await findH264Codec(request.spec.width, request.spec.height)

    if (h264) {
      try {
        const blob = await encodeWithMediabunny(request, {
          mp4: true,
          fullCodecString: h264,
        })
        return { blob, extension: 'mp4', tier: 'h264-mp4' }
      } catch (cause) {
        console.warn('MP4 encoding failed; trying WebM instead.', cause)
      }
    }

    try {
      const blob = await encodeWithMediabunny(request, {
        mp4: false,
        fullCodecString: null,
      })
      return { blob, extension: 'webm', tier: 'webm-mediabunny', note: WEBM_NOTE }
    } catch (cause) {
      console.warn('WebCodecs WebM encoding failed; using MediaRecorder.', cause)
    }
  }

  const blob = await recordWebM(request)
  return { blob, extension: 'webm', tier: 'webm-mediarecorder', note: WEBM_NOTE }
}
