import { ParticleBackground } from "@/components/particle-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Cloud, Smartphone, HardDrive, RefreshCw, Headphones, Sparkles } from "lucide-react"

const features = [
  {
    icon: Cloud,
    title: "تخطي iCloud لأجهزة iPhone و iPad",
    titleEn: "iCloud Bypass for iPhone & iPad",
    description: "Professional support guaranteed with regular updates for the latest iOS releases.",
  },
  {
    icon: Smartphone,
    title: "يدعم أحدث إصدارات iOS",
    titleEn: "Supports Latest iOS Versions",
    description: "Professional support guaranteed with regular updates for the latest iOS releases.",
  },
  {
    icon: HardDrive,
    title: "بدون فقد بيانات الجهاز",
    titleEn: "No Data Loss",
    description: "Professional support guaranteed with regular updates for the latest iOS releases.",
  },
  {
    icon: RefreshCw,
    title: "تحديثات دورية مجانية",
    titleEn: "Free Regular Updates",
    description: "Professional support guaranteed with regular updates for the latest iOS releases.",
  },
  {
    icon: Headphones,
    title: "دعم فني سريع 24/7",
    titleEn: "24/7 Fast Support",
    description: "Professional support guaranteed with regular updates for the latest iOS releases.",
  },
  {
    icon: Sparkles,
    title: "واجهة سهلة الاستخدام",
    titleEn: "Easy to Use Interface",
    description: "Professional support guaranteed with regular updates for the latest iOS releases.",
  },
]

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />
      
      <section className="pt-32 pb-24 relative">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-silver">Our</span>{" "}
              <span className="text-foreground">Features</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover the powerful features that make our service the best choice for iCloud bypass
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex flex-col h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="w-12 h-1 bg-primary/50 rounded-full mb-4 group-hover:w-16 transition-all duration-300" />
                  <h3 className="text-xl font-semibold text-foreground mb-1 text-right" dir="rtl">
                    {feature.title}
                  </h3>
                  <h4 className="text-sm text-primary mb-3">{feature.titleEn}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
