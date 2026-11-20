const silhouetteCanvases = new WeakMap<HTMLImageElement, HTMLCanvasElement>()

export function silhouetteOf(image: HTMLImageElement): HTMLCanvasElement {
  const cached = silhouetteCanvases.get(image)
  if (cached) return cached

  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(image, 0, 0)
    ctx.globalCompositeOperation = 'source-in'
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  silhouetteCanvases.set(image, canvas)
  return canvas
}
