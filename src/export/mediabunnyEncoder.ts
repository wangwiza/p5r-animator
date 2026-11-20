import {
  BufferTarget,
  CanvasSource,
  Mp4OutputFormat,
  Output,
  Quality,
  WebMOutputFormat,
} from 'mediabunny'
import { EXPORT_FPS } from '../domain/constants'
import { renderFrame } from '../render'
import { EXPORT_BITRATE } from './constants'
import { createRenderCanvas } from './renderCanvas'
import type { ExportRequest } from './types'

export interface MediabunnyEncoderOptions {
  mp4: boolean
  fullCodecString: string | null
}

export async function encodeWithMediabunny(
  { spec, assets, timeline, onProgress }: ExportRequest,
  options: MediabunnyEncoderOptions,
): Promise<Blob> {
  const { canvas, ctx } = createRenderCanvas(spec)
  const target = new BufferTarget()
  const output = new Output({
    format: options.mp4 ? new Mp4OutputFormat() : new WebMOutputFormat(),
    target,
  })
  const source = new CanvasSource(canvas, {
    codec: options.mp4 ? 'avc' : 'vp8',
    ...(options.fullCodecString ? { fullCodecString: options.fullCodecString } : {}),
    quality: new Quality({ bitrate: EXPORT_BITRATE }),
  })
  output.addVideoTrack(source, { frameRate: EXPORT_FPS })

  await output.start()

  const frameDuration = 1 / EXPORT_FPS
  const totalFrames = Math.ceil(timeline.totalDuration * EXPORT_FPS)
  for (let index = 0; index < totalFrames; index += 1) {
    const time = Math.min(index * frameDuration, timeline.totalDuration)
    renderFrame(ctx, spec, assets, timeline, time)
    await source.add(index * frameDuration, frameDuration)
    onProgress((index + 1) / totalFrames)
  }

  source.close()
  await output.finalize()

  const buffer = target.buffer
  if (!buffer) throw new Error('Encoder did not produce a video file')
  return new Blob([buffer], { type: options.mp4 ? 'video/mp4' : 'video/webm' })
}
