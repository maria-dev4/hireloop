import { HeroSection } from "@/components/hero-section"
import { SiteNavbar } from "@/components/site-navbar"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNavbar />
      <main>
        <HeroSection />
      </main>
    </div>
  )
}
