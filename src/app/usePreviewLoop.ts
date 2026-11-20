import { useEffect, type RefObject } from 'react'
import type { AssetStore } from '../assets/AssetStore'
import type { RenderSpec, Timeline } from '../domain/types'
import { renderFrame } from '../render'

interface PreviewLoopParams {
  canvasRef: RefObject<HTMLCanvasElement | null>
  store: AssetStore | null
  spec: RenderSpec
  timeline: Timeline | null
}

export function usePreviewLoop({ canvasRef, store, spec, timeline }: PreviewLoopParams): void {
  useEffect(() => {
    if (!store || !timeline || !canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    let frame = 0
    const start = performance.now()
    const loop = () => {
      const time = ((performance.now() - start) / 1000) % timeline.totalDuration
      renderFrame(ctx, spec, store, timeline, time)
      frame = requestAnimationFrame(loop)
    }

    loop()
    return () => cancelAnimationFrame(frame)
  }, [canvasRef, store, spec, timeline])
}
