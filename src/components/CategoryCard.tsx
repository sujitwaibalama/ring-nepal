import { ResolvedCover } from './ResolvedMedia'

type CategoryCardProps = {
  name: string
  blurb: string
  image: string
  /** When set, card acts as a button (e.g. filter products) */
  onSelect?: () => void
  href?: string
  active?: boolean
}

/** Category tile — image or muted looping video (same media as products/showreel) */
export function CategoryCard({
  name,
  blurb,
  image,
  onSelect,
  href = '#featured',
  active,
}: CategoryCardProps) {
  const className = `group card-lift relative block aspect-[4/5] overflow-hidden rounded-2xl bg-mist ring-2 sm:rounded-3xl ${
    active ? 'ring-pink shadow-md' : 'ring-transparent hover:ring-pink/40'
  }`

  const inner = (
    <>
      <ResolvedCover
        src={image}
        alt={name}
        className="media-zoom absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent transition-opacity duration-500 group-hover:from-ink/75" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
        <p className="font-script text-2xl text-white sm:text-3xl">{name}</p>
        <p className="mt-0.5 line-clamp-2 text-[10px] uppercase tracking-[0.12em] text-white/75 sm:mt-1 sm:text-xs sm:tracking-[0.16em]">
          {blurb}
        </p>
        {onSelect && (
          <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-pink transition-transform duration-300 group-hover:translate-x-0.5 sm:mt-2 sm:text-[10px] sm:tracking-[0.14em]">
            {active ? 'Showing now' : 'Tap to shop'}
          </p>
        )}
      </div>
    </>
  )

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={`${className} w-full text-left`}>
        {inner}
      </button>
    )
  }

  return (
    <a href={href} className={className}>
      {inner}
    </a>
  )
}
