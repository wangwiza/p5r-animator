import type { RefObject } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../domain/constants'

interface PreviewCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

export function PreviewCanvas({ canvasRef }: PreviewCanvasProps) {
  return (
    <section className="preview">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      <p>Preview loops continuously. Export renders the full enter → hold → exit timeline in your browser.</p>
    </section>
  )
}
