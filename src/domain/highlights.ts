type HighlightInput = string | readonly number[] | null | undefined

function parsePart(part: string | number, nameLength: number): number | null {
  let index: number

  if (typeof part === 'number') {
    if (!Number.isInteger(part)) return null
    index = part
  } else {
    const trimmed = part.trim()
    if (!/^\d+$/.test(trimmed)) return null
    index = Number(trimmed)
  }

  return index >= 0 && index < nameLength ? index : null
}

export function parseHighlightIndices(input: HighlightInput, name: string): number[] {
  const nameLength = Array.from(name).length
  if (nameLength === 0) return []

  const parts: ReadonlyArray<string | number> =
    typeof input === 'string' ? input.split(',') : (input ?? [])

  const indices = parts
    .map((part) => parsePart(part, nameLength))
    .filter((index): index is number => index !== null)

  return [...new Set(indices)].sort((a, b) => a - b)
}

export function formatHighlightIndices(indices: readonly number[]): string {
  return indices.join(',')
}
