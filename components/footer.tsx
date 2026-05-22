import Link from "next/link"
import { Send } from "lucide-react"
import { GemstoneLogo } from "@/components/gemstone-logo"

export function Footer() {
  return (
    <footer className="py-12 border-t border-border/50 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <GemstoneLogo className="w-10 h-10" />
              <span className="text-xl font-bold text-gradient-silver">Luxury Services</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Professional software activation tool trusted by thousands of users worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/download" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Download
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>

            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://t.me/luxuryservices" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Telegram Channel
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Luxury Services. All Rights Reserved.
          </p>
          <p className="text-muted-foreground/50 text-xs mt-2">
            Secure Registration • Version 2.0.0
          </p>
        </div>
      </div>
    </footer>
  )
}
