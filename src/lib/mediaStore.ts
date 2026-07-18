/**
 * Store images/videos in IndexedDB so admin can upload without file paths.
 * Catalog JSON only keeps refs like "idb:abc123".
 */

const DB_NAME = 'ringnepal_media_v1'
const STORE = 'files'

export function isIdbRef(src: string) {
  return src.startsWith('idb:')
}

export function isStaticPath(src: string) {
  return (
    src.startsWith('/') ||
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  )
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveMediaFile(file: File): Promise<string> {
  const id = `idb:${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(
      {
        blob: file,
        type: file.type,
        name: file.name,
        size: file.size,
        createdAt: Date.now(),
      },
      id,
    )
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
  return id
}

export async function getMediaBlob(ref: string): Promise<Blob | null> {
  if (!isIdbRef(ref)) return null
  const db = await openDb()
  const row = await new Promise<{ blob: Blob } | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(ref)
    req.onsuccess = () => resolve(req.result as { blob: Blob } | undefined)
    req.onerror = () => reject(req.error)
  })
  db.close()
  return row?.blob ?? null
}

/** Resolve idb: refs to blob: URLs; leave normal paths as-is */
export async function resolveMediaUrl(src: string): Promise<string> {
  if (!src) return src
  if (!isIdbRef(src)) return src
  const blob = await getMediaBlob(src)
  if (!blob) return ''
  return URL.createObjectURL(blob)
}

export async function deleteMedia(ref: string) {
  if (!isIdbRef(ref)) return
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(ref)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}

const IMAGE_MAX = 4 * 1024 * 1024 // 4MB
const VIDEO_MAX = 25 * 1024 * 1024 // 25MB (browser IDB)

export function validateMediaFile(
  file: File,
  kind: 'image' | 'video',
): string | null {
  if (kind === 'image') {
    if (!file.type.startsWith('image/')) return 'Please drop an image (JPG, PNG, WebP).'
    if (file.size > IMAGE_MAX) return 'Image too large (max 4MB). Compress and try again.'
  } else {
    if (!file.type.startsWith('video/')) return 'Please drop a video (MP4, WebM).'
    if (file.size > VIDEO_MAX) return 'Video too large (max 25MB). Use a shorter/compressed clip.'
  }
  return null
}
