"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, LogIn, UserPlus, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GemstoneLogo } from "@/components/gemstone-logo"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
      scrolled ? "w-[95%] max-w-5xl" : "w-[90%] max-w-6xl"
    }`}>
      <div className={`relative rounded-2xl border transition-all duration-500 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-primary/30 shadow-lg shadow-primary/10" 
          : "bg-background/40 backdrop-blur-md border-border/50"
      }`}>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        
        <div className="relative px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <GemstoneLogo className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gradient-silver leading-tight">Luxury</span>
                <span className="text-xs text-muted-foreground -mt-0.5">Services</span>
              </div>
            </Link>

            {/* Desktop Navigation - Pill Style */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center gap-1 bg-muted/30 rounded-full px-2 py-1.5">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/features">Features</NavLink>
                <NavLink href="/pricing">Pricing</NavLink>
                <NavLink href="/resellers">Resellers</NavLink>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full px-4"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 rounded-full px-4 shadow-lg shadow-primary/25"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground rounded-full hover:bg-muted/50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 px-6 py-4 bg-background/90 backdrop-blur-xl rounded-b-2xl">
            <div className="flex flex-col gap-2">
              <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="/features" onClick={() => setIsMenuOpen(false)}>Features</MobileNavLink>
              <MobileNavLink href="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</MobileNavLink>
              <MobileNavLink href="/resellers" onClick={() => setIsMenuOpen(false)}>Resellers</MobileNavLink>
              <div className="flex gap-2 pt-4 mt-2 border-t border-border/50">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full rounded-full border-primary/50 text-primary">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-full transition-all duration-200"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-xl transition-colors"
    >
      {children}
    </Link>
  )
}
