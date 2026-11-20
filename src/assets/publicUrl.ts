const BASE = import.meta.env.BASE_URL

export function publicUrl(path: string): string {
  return `${BASE}${path.replace(/^\/+/, '')}`
}
