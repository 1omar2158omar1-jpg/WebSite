"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  User, 
  Key, 
  Download, 
  Settings, 
  LogOut, 
  Shield, 
  CheckCircle,
  Clock,
  Calendar,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ParticleBackground } from "@/components/particle-background"
import { Navbar } from "@/components/navbar"

export default function DashboardPage() {
  const [user] = useState({
    username: "DemoUser",
    email: "demo@example.com",
    status: "active",
    plan: "Premium",
    activatedAt: "2025-01-15",
    expiresAt: "2026-01-15",
  })

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.username}!</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Account Status</h2>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground text-sm">Plan</span>
                    </div>
                    <p className="text-xl font-semibold text-foreground">{user.plan}</p>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground text-sm">Expires</span>
                    </div>
                    <p className="text-xl font-semibold text-foreground">{user.expiresAt}</p>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground text-sm">Activated</span>
                    </div>
                    <p className="text-xl font-semibold text-foreground">{user.activatedAt}</p>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground text-sm">Days Remaining</span>
                    </div>
                    <p className="text-xl font-semibold text-foreground">365</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link href="/download">
                    <Button className="w-full h-auto py-4 bg-primary text-primary-foreground hover:bg-primary/90">
                      <div className="flex items-center gap-3">
                        <Download className="w-6 h-6" />
                        <div className="text-left">
                          <p className="font-semibold">Download Tool</p>
                          <p className="text-xs opacity-80">Get the latest version</p>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/activate">
                    <Button variant="outline" className="w-full h-auto py-4 border-primary/50 text-primary hover:bg-primary/10">
                      <div className="flex items-center gap-3">
                        <Key className="w-6 h-6" />
                        <div className="text-left">
                          <p className="font-semibold">Activate Key</p>
                          <p className="text-xs opacity-80">Enter a new serial</p>
                        </div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="glass-card rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{user.username}</h3>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>

                <div className="space-y-2">
                  <Link href="/settings">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>

              {/* Support Card */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Our support team is available 24/7 to assist you with any questions.
                </p>
                <Link href="/support">
                  <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
