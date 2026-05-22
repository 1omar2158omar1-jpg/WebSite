"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Key, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ParticleBackground } from "@/components/particle-background"
import { Navbar } from "@/components/navbar"

export default function ActivatePage() {
  const router = useRouter()
  const [serialKey, setSerialKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // API call to external Node.js server for serial validation
      const response = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serialKey }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Activation failed")
      }

      setSuccess(true)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid serial key")
    } finally {
      setIsLoading(false)
    }
  }

  const formatSerialKey = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    // Add dashes every 4 characters
    const formatted = cleaned.match(/.{1,4}/g)?.join("-") || cleaned
    return formatted.slice(0, 24) // Limit to XXXX-XXXX-XXXX-XXXX-XXXX format
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="glass-card rounded-2xl p-8 animate-float" style={{ animationDuration: '6s' }}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${success ? 'bg-green-500/20' : 'bg-primary/20'}`}>
                {success ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <Key className="w-8 h-8 text-primary" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {success ? "Activation Successful!" : "Activate Your Account"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {success ? "Your account has been activated successfully" : "Enter your serial key to activate your account"}
              </p>
            </div>

            {success ? (
              <div className="text-center">
                <div className="glass rounded-xl p-6 mb-6">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">Welcome to Luxury Services!</p>
                  <p className="text-muted-foreground text-sm">Redirecting to dashboard...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Info Box */}
                <div className="glass rounded-xl p-4 mb-6 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium mb-1">Serial Key Activation</p>
                      <p className="text-muted-foreground">
                        Enter the serial key you received from an authorized reseller to activate your account and access all premium features.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="serialKey" className="text-primary">Serial Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="serialKey"
                        type="text"
                        placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
                        className="pl-10 bg-input border-border/50 focus:border-primary font-mono text-center tracking-wider"
                        value={serialKey}
                        onChange={(e) => setSerialKey(formatSerialKey(e.target.value))}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Format: XXXX-XXXX-XXXX-XXXX-XXXX
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
                    disabled={isLoading || serialKey.length < 24}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Validating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Activate Account
                      </span>
                    )}
                  </Button>
                </form>
              </>
            )}

            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-muted-foreground/50 text-xs flex items-center justify-center gap-2">
                <Shield className="w-3 h-3" />
                Secure Activation • Version 2.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
