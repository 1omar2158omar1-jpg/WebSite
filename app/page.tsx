import { ParticleBackground } from "@/components/particle-background"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { DeviceCompatibility } from "@/components/device-compatibility"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DeviceCompatibility />
      <Footer />
    </main>
  )
}
