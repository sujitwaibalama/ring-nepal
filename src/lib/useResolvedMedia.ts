import { useEffect, useState } from 'react'
import { isIdbRef, resolveMediaUrl } from './mediaStore'

const cache = new Map<string, string>()

/** Resolve idb: media refs to playable blob URLs for display */
export function useResolvedMedia(src: string | undefined): string {
  const [url, setUrl] = useState(() => {
    if (!src) return ''
    if (!isIdbRef(src)) return src
    return cache.get(src) || ''
  })

  useEffect(() => {
    if (!src) {
      setUrl('')
      return
    }
    if (!isIdbRef(src)) {
      setUrl(src)
      return
    }
    if (cache.has(src)) {
      setUrl(cache.get(src)!)
      return
    }
    let cancelled = false
    void resolveMediaUrl(src).then((resolved) => {
      if (cancelled) return
      if (resolved) cache.set(src, resolved)
      setUrl(resolved)
    })
    return () => {
      cancelled = true
    }
  }, [src])

  return url
}

/** Batch-resolve many media fields (optional prewarm) */
export async function resolveMany(srcs: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  await Promise.all(
    srcs.map(async (src) => {
      if (!src) return
      if (!isIdbRef(src)) {
        map.set(src, src)
        return
      }
      if (cache.has(src)) {
        map.set(src, cache.get(src)!)
        return
      }
      const u = await resolveMediaUrl(src)
      if (u) {
        cache.set(src, u)
        map.set(src, u)
      }
    }),
  )
  return map
}
