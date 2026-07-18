import { useResolvedMedia } from '../lib/useResolvedMedia'

/** True when path/URL is a playable video (mp4 etc.) */
export function isVideoSrc(src: string): boolean {
  const path = src.split('?')[0].toLowerCase()
  return /\.(mp4|webm|mov|m4v)$/.test(path)
}

/** Image that supports idb: uploaded admin media */
export function ResolvedImg({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const url = useResolvedMedia(src)
  if (!url) {
    return <div className={`bg-mist ${className ?? ''}`} aria-hidden />
  }
  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      style={{ objectPosition: 'center center' }}
    />
  )
}

/** Video that supports idb: uploaded admin media */
export function ResolvedVideo({
  src,
  className,
  ...rest
}: {
  src: string
  className?: string
} & React.VideoHTMLAttributes<HTMLVideoElement>) {
  const url = useResolvedMedia(src)
  if (!url) {
    return <div className={`bg-mist ${className ?? ''}`} aria-hidden />
  }
  return <video src={url} className={className} {...rest} />
}

/**
 * Product / category cover: plays muted looping video when src is .mp4,
 * otherwise shows an image. Use for shop cards & quick view.
 */
export function ResolvedCover({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  if (isVideoSrc(src)) {
    return (
      <ResolvedVideo
        src={src}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt}
      />
    )
  }
  return <ResolvedImg src={src} alt={alt} className={className} />
}
