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

  const onHero = !scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-line bg-white/95 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 md:py-3.5">
        <a href="#" className="flex items-center gap-2">
          <img
            src={onHero ? '/brand/logo-white.png' : '/brand/logo-black.png'}
            alt={`${brand.nameNp} — Estd ${brand.estd}`}
            className="h-11 w-auto transition-opacity md:h-12"
          />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[12px] font-medium uppercase tracking-[0.2em] transition-colors ${
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
            className={`transition-colors ${
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
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#1ebe57]"
          >
            <MessageCircle className="size-3.5" />
            WhatsApp
          </a>
        </nav>

        <button
          type="button"
          className={`rounded-full border p-2.5 md:hidden ${
            onHero ? 'border-white/30 text-white' : 'border-ink/15 text-ink'
          }`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-5 py-4 shadow-xl md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-blush-deep"
              >
                {link.label}
              </a>
            ))}
            <a
              href={wa('Hi Ring Nepal, I want to shop!')}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1ebe57]"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="mt-1 text-center text-xs text-stone"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
