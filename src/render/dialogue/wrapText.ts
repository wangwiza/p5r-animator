export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []

  for (const paragraph of text.split('\n')) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean)
    if (!words.length) {
      lines.push('')
      continue
    }

    let line = words[0]
    for (let i = 1; i < words.length; i += 1) {
      const candidate = `${line} ${words[i]}`
      if (ctx.measureText(candidate).width > maxWidth && line) {
        lines.push(line)
        line = words[i]
      } else {
        line = candidate
      }
    }
    lines.push(line)
  }

  return lines
}
