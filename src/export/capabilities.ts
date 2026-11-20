import { EXPORT_FPS } from '../domain/constants'
import { EXPORT_BITRATE } from './constants'

// Main/High profile, level 4.0+ covers 1920x1080 @ 30fps. Checked in order.
export function getH264Candidates(): string[] {
  return ['avc1.4d0028', 'avc1.4d0034', 'avc1.640028']
}

export function webCodecsAvailable(): boolean {
  return typeof VideoEncoder !== 'undefined'
}

export async function findH264Codec(width: number, height: number): Promise<string | null> {
  if (!webCodecsAvailable()) return null

  for (const codec of getH264Candidates()) {
    try {
      const { supported } = await VideoEncoder.isConfigSupported({
        codec,
        width,
        height,
        bitrate: EXPORT_BITRATE,
        framerate: EXPORT_FPS,
      })
      if (supported) return codec
    } catch {
      // Try the next candidate.
    }
  }

  return null
}
