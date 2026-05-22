import { Cloud, Smartphone, RefreshCw, Headphones, Sparkles } from "lucide-react"

const features = [
  {
    icon: Cloud,
    title: "تخطي iCloud",
    titleEn: "iCloud Bypass",
    description: "Professional support guaranteed with regular updates for the latest iOS releases.",
  },
  {
    icon: Smartphone,
    title: "يدعم أحدث iOS",
    titleEn: "Latest iOS Support",
    description: "Professional support guaranteed with regular updates for the latest iOS releases.",
  },

  {
    icon: RefreshCw,
    title: "تحديثات مجانية",
    titleEn: "Free Updates",
    description: "Professional support guaranteed with regular updates for the latest iOS releases.",
  },
  {
    icon: Headphones,
    title: "دعم 24/7",
    titleEn: "24/7 Support",
    description: "Our dedicated support team is available around the clock to assist you.",
  },
  {
    icon: Sparkles,
    title: "سهل الاستخدام",
    titleEn: "Easy to Use",
    description: "Intuitive design that makes the process simple and straightforward.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-silver">Why Choose</span>{" "}
            <span className="text-foreground">Luxury Services?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make us the #1 choice for iCloud bypass
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  )
}
