import { useCallback, useState } from 'react'
import { Film, ImagePlus, Loader2 } from 'lucide-react'
import {
  saveMediaFile,
  validateMediaFile,
} from '../../lib/mediaStore'

type MediaDropzoneProps = {
  kind: 'image' | 'video'
  /** Current src (path, data:, blob:, or idb:) */
  value: string
  /** Preview URL (already resolved blob if needed) */
  previewUrl?: string
  onUploaded: (ref: string) => void
  label?: string
  className?: string
}

/**
 * Drag-and-drop or click-to-upload — no file path typing required.
 */
export function MediaDropzone({
  kind,
  value,
  previewUrl,
  onUploaded,
  label,
  className = '',
}: MediaDropzoneProps) {
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const processFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return
      const err = validateMediaFile(file, kind)
      if (err) {
        setError(err)
        return
      }
      setError('')
      setBusy(true)
      try {
        const ref = await saveMediaFile(file)
        onUploaded(ref)
      } catch {
        setError('Upload failed. Try a smaller file.')
      } finally {
        setBusy(false)
      }
    },
    [kind, onUploaded],
  )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    void processFile(file)
  }

  const display = previewUrl || (value.startsWith('idb:') ? '' : value)
  const isVideo = kind === 'video'

  return (
    <div className={className}>
      {label && (
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone">
          {label}
        </p>
      )}
      <label
        onDragEnter={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragging(false)
        }}
        onDrop={onDrop}
        className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
          dragging
            ? 'border-pink bg-pink/10'
            : 'border-line bg-blush/40 hover:border-pink/50 hover:bg-blush'
        } ${isVideo ? 'min-h-[160px] aspect-video' : 'aspect-square min-h-[120px]'}`}
      >
        {busy ? (
          <div className="flex flex-col items-center gap-2 text-stone">
            <Loader2 className="size-8 animate-spin text-pink" />
            <span className="text-xs font-medium">Uploading…</span>
          </div>
        ) : display ? (
          <>
            {isVideo ? (
              <video
                src={display}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                loop
                autoPlay
              />
            ) : (
              <img
                src={display}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink/70 to-transparent p-3">
              <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-ink">
                Drop or click to replace
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-center text-stone">
            {isVideo ? (
              <Film className="size-8 text-pink" />
            ) : (
              <ImagePlus className="size-8 text-pink" />
            )}
            <p className="text-sm font-medium text-ink">
              Drag & drop {isVideo ? 'video' : 'image'} here
            </p>
            <p className="text-xs">or click to choose from your files</p>
            <p className="text-[10px] text-stone/80">
              {isVideo ? 'MP4 / WebM · max 25MB' : 'JPG / PNG / WebP · max 4MB'}
            </p>
          </div>
        )}
        <input
          type="file"
          accept={isVideo ? 'video/*' : 'image/*'}
          className="hidden"
          onChange={(e) => void processFile(e.target.files?.[0])}
        />
      </label>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}
