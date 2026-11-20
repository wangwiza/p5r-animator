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
      <p className="preview-legal">
        Unofficial fan project. Persona 5 Royal and related characters are copyright © ATLUS/SEGA.
        Character sprites are derived from the game and sourced from{' '}
        <a
          href="https://www.spriters-resource.com/playstation_4/persona5royal/"
          target="_blank"
          rel="noreferrer"
        >
          The Spriters Resource
        </a>
        . Textbox asset by{' '}
        <a
          href="https://www.youtube.com/@Vermilionaire/featured"
          target="_blank"
          rel="noreferrer"
        >
          Vermillionaire
        </a>
        . Not affiliated with or endorsed by ATLUS or SEGA. Rights remain with their respective
        owners.
      </p>
      <p className="preview-repo">
        <a
          href="https://github.com/wangwiza/p5r-animator"
          target="_blank"
          rel="noreferrer"
        >
          View source on GitHub
        </a>
      </p>
    </section>
  )
}
