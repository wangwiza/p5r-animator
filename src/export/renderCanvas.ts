import type { RenderSpec } from '../domain/types'

export function createRenderCanvas(spec: RenderSpec): {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
} {
  const canvas = document.createElement('canvas')
  canvas.width = spec.width
  canvas.height = spec.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D is unavailable')
  return { canvas, ctx }
}
