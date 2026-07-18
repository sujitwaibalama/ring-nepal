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
  const className = `group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-mist ring-2 transition-all ${
    active ? 'ring-pink shadow-md' : 'ring-transparent hover:ring-pink/30'
  }`

  const inner = (
    <>
      <ResolvedCover
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-script text-3xl text-white">{name}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/75">
          {blurb}
        </p>
        {onSelect && (
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-pink">
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
