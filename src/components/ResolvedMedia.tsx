import { useResolvedMedia } from '../lib/useResolvedMedia'

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
