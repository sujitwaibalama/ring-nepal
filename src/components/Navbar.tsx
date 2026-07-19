import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, MessageCircle, X } from 'lucide-react'
import { useCatalog } from '../lib/CatalogContext'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const links = [
  { label: 'New', href: '#new' },
  { label: 'Shop', href: '#showreel' },
  { label: 'Bestsellers', href: '#featured' },
  { label: 'How to order', href: '#how' },
  { label: 'Stores', href: '#stores' },
]

export function Navbar() {
  const { catalog, wa } = useCatalog()
  const { brand } = catalog
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close menu on hash navigation / resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onHero = !scrolled && !open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open
          ? 'border-b border-line bg-white shadow-sm'
          : scrolled
            ? 'border-b border-line bg-white/95 shadow-sm backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 md:px-8 md:py-3.5">
        <a href="#" className="flex min-h-11 min-w-11 items-center gap-2">
          <img
            src={onHero ? '/brand/logo-white.png' : '/brand/logo-black.png'}
            alt={`${brand.nameNp} — Estd ${brand.estd}`}
            className="h-10 w-auto transition-opacity sm:h-11 md:h-12"
          />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[12px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                onHero
                  ? 'text-white/90 hover:text-pink'
                  : 'text-ink/80 hover:text-pink'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className={`pressable transition-colors duration-300 ${
              onHero ? 'text-white/90 hover:text-pink' : 'text-ink/80 hover:text-pink'
            }`}
            aria-label={`Instagram ${brand.instagramHandle}`}
          >
            <InstagramIcon className="size-4" />
          </a>
          <a
            href={wa('Hi Ring Nepal, I want to shop!')}
            target="_blank"
            rel="noreferrer"
            className="pressable inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#1ebe57]"
          >
            <MessageCircle className="size-3.5" />
            WhatsApp
          </a>
        </nav>

        {/* Mobile: quick WhatsApp + menu */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={wa('Hi Ring Nepal, I want to shop!')}
            target="_blank"
            rel="noreferrer"
            className={`pressable inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border ${
              onHero
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-[#25D366]/30 bg-[#25D366]/10 text-[#128C7E]'
            }`}
            aria-label="WhatsApp order"
          >
            <MessageCircle className="size-5" />
          </a>
          <button
            type="button"
            className={`pressable inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border ${
              open || !onHero
                ? 'border-ink/15 text-ink'
                : 'border-white/30 text-white'
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Full-screen mobile drawer */}
      {open && (
        <div
          className="sheet-backdrop fixed inset-0 top-0 z-40 flex flex-col bg-white md:hidden"
          style={{ paddingTop: 'calc(3.75rem + env(safe-area-inset-top, 0px))' }}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <nav className="flex flex-1 flex-col overflow-y-auto px-5 pb-6 pt-2">
            <div className="flex flex-col gap-0.5">
              {links.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="menu-item-enter rounded-2xl px-4 py-4 text-base font-semibold uppercase tracking-[0.12em] text-ink transition-colors active:bg-blush-deep"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div
              className="menu-item-enter mt-auto space-y-3 pt-8"
              style={{ animationDelay: `${links.length * 45 + 40}ms` }}
            >
              <a
                href={wa('Hi Ring Nepal, I want to shop!')}
                target="_blank"
                rel="noreferrer"
                className="pressable inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#1ebe57]"
              >
                <MessageCircle className="size-5" />
                Order on WhatsApp
              </a>
              <a
                href={brand.instagram}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="pressable inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-blush/60 px-4 py-3.5 text-sm font-semibold text-ink hover:bg-blush-deep"
              >
                <InstagramIcon className="size-4" />
                {brand.instagramHandle}
              </a>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="block py-2 text-center text-xs text-stone"
              >
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
