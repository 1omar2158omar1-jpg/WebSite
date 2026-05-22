import { Check } from "lucide-react"

const devices = [
  { name: "iPhone 5s, 6, 6 Plus" },
  { name: "iPhone 6s, 6s Plus, SE" },
  { name: "iPhone 7, 7 Plus" },
  { name: "iPhone 8, 8 Plus, X" },
  { name: "iPhone XS, XS Max, XR" },
  { name: "iPhone 11, 11 Pro, 11 Pro Max" },
  { name: "iPhone SE 2020 / SE 2022" },
  { name: "iPhone 12 mini, 12, 12 Pro, 12 Pro Max" },
  { name: "iPhone 13 mini to iPhone 17 Pro Max" },
  { name: "iPad Air, iPad mini, iPad Pro" },
]

export function DeviceCompatibility() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-silver">Wide Device</span>{" "}
            <span className="text-foreground">Compatibility</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our tool supports a broad range of iPhone and iPad models. Check if your device is supported below.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {devices.map((device, index) => (
            <div
              key={index}
              className="glass-card rounded-lg p-4 flex items-start gap-3 hover:border-primary/30 transition-all duration-300"
            >
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{device.name}</span>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="glass-card rounded-xl p-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-foreground font-medium mb-2">
                All these devices are fully supported and compatible.
              </p>
              <p className="text-muted-foreground">
                The tool supports the latest iOS versions, and the list is updated regularly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
