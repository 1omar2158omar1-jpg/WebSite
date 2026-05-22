"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Key, Shield, CheckCircle, AlertCircle, Lock, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ParticleBackground } from "@/components/particle-background"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function ActivatePage() {
  const router = useRouter()
  const [serialKey, setSerialKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    plan_name: string
    expires_at: string
  } | null>(null)

  useEffect(() => {
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    try {
      const res = await fetch("/api/user/subscription")
      if (res.ok) {
        const data = await res.json()
        if (data.subscription) {
          setHasSubscription(true)
          setSubscriptionInfo(data.subscription)
        }
      }
    } catch {
      // Not logged in or error
    } finally {
      setIsCheckingSubscription(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
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
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    const formatted = cleaned.match(/.{1,4}/g)?.join("-") || cleaned
    return formatted.slice(0, 24)
  }

  if (isCheckingSubscription) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <ParticleBackground />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8 animate-float relative" style={{ animationDuration: '6s' }}>
            
            {/* Non-subscriber overlay */}
            {!hasSubscription && !success && (
              <div className="absolute inset-0 z-10 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-md bg-background/80"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">Subscription Required</h2>
                  <p className="text-muted-foreground mb-6">
                    You need an active subscription to register a serial key. Please subscribe first.
                  </p>
                  <Link href="/pricing">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Crown className="w-5 h-5 mr-2" />
                      View Plans
                    </Button>
                  </Link>
                </div>
              </div>
            )}

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
              
              {hasSubscription && subscriptionInfo && (
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-green-400 text-sm flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Active: {subscriptionInfo.plan_name}
                  </p>
                </div>
              )}
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
                        Enter your serial key to activate your account and access all premium features.
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
                        disabled={!hasSubscription}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Format: XXXX-XXXX-XXXX-XXXX-XXXX
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
                    disabled={isLoading || serialKey.length < 24 || !hasSubscription}
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
