import { ParticleBackground } from "@/components/particle-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, ShoppingCart } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "3 Months",
    nameAr: "3 شهور",
    price: 5,
    duration: "90 days",
    durationAr: "90 يوم",
    features: [
      { ar: "تخطي iCloud لأجهزة iPhone و iPad", en: "iCloud Bypass for iPhone & iPad" },
      { ar: "يدعم أحدث إصدارات iOS", en: "Supports Latest iOS Versions" },
      { ar: "تحديثات دورية مجانية", en: "Free Regular Updates" },
      { ar: "دعم فني سريع 24/7", en: "24/7 Fast Support" },
      { ar: "واجهة سهلة الاستخدام", en: "Easy to Use Interface" },
    ],
    popular: false,
  },
  {
    name: "1 Year",
    nameAr: "سنة كاملة",
    price: 10,
    duration: "365 days",
    durationAr: "365 يوم",
    features: [
      { ar: "تخطي iCloud لأجهزة iPhone و iPad", en: "iCloud Bypass for iPhone & iPad" },
      { ar: "يدعم أحدث إصدارات iOS", en: "Supports Latest iOS Versions" },
      { ar: "تحديثات دورية مجانية", en: "Free Regular Updates" },
      { ar: "دعم فني سريع 24/7", en: "24/7 Fast Support" },
      { ar: "واجهة سهلة الاستخدام", en: "Easy to Use Interface" },
    ],
    popular: true,
  },
]

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />
      
      <section className="pt-32 pb-24 relative">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-silver">Simple</span>{" "}
              <span className="text-foreground">Pricing</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Choose the plan that works best for you
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative glass-card rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                  plan.popular 
                    ? "border-primary/50 shadow-lg shadow-primary/10" 
                    : "hover:border-primary/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Best Value
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm" dir="rtl">{plan.nameAr}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gradient-silver">${plan.price}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {plan.duration} <span className="text-muted-foreground/70">/ {plan.durationAr}</span>
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground text-sm" dir="rtl">{feature.ar}</p>
                        <p className="text-muted-foreground text-xs">{feature.en}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/register" className="block">
                  <Button 
                    className={`w-full rounded-xl py-6 text-base font-semibold ${
                      plan.popular 
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90" 
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm">
              All plans include the same features. The only difference is the duration.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
