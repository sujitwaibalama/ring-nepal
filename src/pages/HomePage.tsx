import { Hero } from '../components/Hero'
import { HomeSections } from '../components/HomeSections'
import { Navbar } from '../components/Navbar'
import { WhatsAppFab } from '../components/WhatsAppFab'
import { useCatalog } from '../lib/CatalogContext'

export function HomePage() {
  const { loading } = useCatalog()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blush text-sm text-stone">
        Loading Ring Nepal…
      </div>
    )
  }

  return (
    <main>
      <Navbar />
      <Hero />
      <HomeSections />
      <WhatsAppFab />
    </main>
  )
}
