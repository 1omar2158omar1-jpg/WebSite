"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Users, 
  Key, 
  CreditCard, 
  Settings, 
  Shield, 
  UserCheck, 
  UserX,
  Trash2,
  RefreshCw,
  Plus,
  Copy,
  Check,
  ChevronDown,
  BarChart3,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ParticleBackground } from "@/components/particle-background"

interface User {
  id: number
  username: string
  email: string
  role: "user" | "admin" | "super_admin"
  status: "inactive" | "active" | "expired" | "banned"
  created_at: string
}

interface Subscription {
  id: number
  user_id: number
  plan_id: number
  plan_name: string
  username: string
  email: string
  activated_at: string
  expires_at: string
  status: "active" | "expired" | "cancelled"
  is_trial: boolean
}

interface SerialKey {
  id: number
  serial_key: string
  plan_id: number
  plan_name: string
  status: "available" | "used" | "expired" | "revoked"
  used_by_username?: string
  created_at: string
}

interface Plan {
  id: number
  name: string
  price: number
  duration_days: number
}

interface Setting {
  setting_key: string
  setting_value: string
  description: string
}

interface Stats {
  totalUsers: number
  activeUsers: number
  totalSubscriptions: number
  activeSubscriptions: number
  totalSerialKeys: number
  availableSerialKeys: number
}

type TabType = "dashboard" | "users" | "subscriptions" | "serials" | "settings"

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [settings, setSettings] = useState<Setting[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [serialKeys, setSerialKeys] = useState<SerialKey[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [generateCount, setGenerateCount] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<number>(0)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await fetch("/api/admin")
      if (!res.ok) {
        router.push("/login")
        return
      }
      const data = await res.json()
      setStats(data.stats)
      setSettings(data.settings)
      setIsLoading(false)
    } catch {
      router.push("/login")
    }
  }

  const loadUsers = async () => {
    const res = await fetch("/api/admin/users")
    if (res.ok) {
      const data = await res.json()
      setUsers(data.users)
    }
  }

  const loadSubscriptions = async () => {
    const res = await fetch("/api/admin/subscriptions")
    if (res.ok) {
      const data = await res.json()
      setSubscriptions(data.subscriptions)
      setPlans(data.plans)
    }
  }

  const loadSerialKeys = async () => {
    const res = await fetch("/api/admin/serial-keys")
    if (res.ok) {
      const data = await res.json()
      setSerialKeys(data.serialKeys)
      setPlans(data.plans)
      if (data.plans.length > 0 && selectedPlan === 0) {
        setSelectedPlan(data.plans[0].id)
      }
    }
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (tab === "users") loadUsers()
    if (tab === "subscriptions") loadSubscriptions()
    if (tab === "serials") loadSerialKeys()
  }

  const updateSetting = async (key: string, value: string) => {
    await fetch("/api/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    })
    setSettings(settings.map(s => 
      s.setting_key === key ? { ...s, setting_value: value } : s
    ))
  }

  const updateUser = async (userId: number, action: string, value?: string) => {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action, value }),
    })
    loadUsers()
  }

  const generateKeys = async () => {
    const res = await fetch("/api/admin/serial-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: selectedPlan, count: generateCount }),
    })
    if (res.ok) {
      loadSerialKeys()
    }
  }

  const revokeKey = async (keyId: number) => {
    await fetch("/api/admin/serial-keys", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serialKeyId: keyId, action: "revoke" }),
    })
    loadSerialKeys()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 glass-card border-r border-border/50 p-4 flex flex-col">
          <div className="flex items-center gap-3 mb-8 p-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Admin Panel</span>
          </div>

          <nav className="space-y-2 flex-1">
            {[
              { id: "dashboard", icon: BarChart3, label: "Dashboard" },
              { id: "users", icon: Users, label: "Users" },
              { id: "subscriptions", icon: CreditCard, label: "Subscriptions" },
              { id: "serials", icon: Key, label: "Serial Keys" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && stats && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  subtitle={`${stats.activeUsers} active`}
                  icon={Users}
                />
                <StatCard
                  title="Subscriptions"
                  value={stats.totalSubscriptions}
                  subtitle={`${stats.activeSubscriptions} active`}
                  icon={CreditCard}
                />
                <StatCard
                  title="Serial Keys"
                  value={stats.totalSerialKeys}
                  subtitle={`${stats.availableSerialKeys} available`}
                  icon={Key}
                />
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
                <Button variant="outline" onClick={loadUsers}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Created</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{user.username}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={user.role}
                            onChange={(e) => updateUser(user.id, "role", e.target.value)}
                            className="bg-transparent border border-border/50 rounded px-2 py-1 text-sm"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {user.status === "active" ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateUser(user.id, "status", "banned")}
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateUser(user.id, "status", "active")}
                              >
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => updateUser(user.id, "delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
                <Button variant="outline" onClick={loadSubscriptions}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Plan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Expires</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{sub.username}</p>
                            <p className="text-sm text-muted-foreground">{sub.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-foreground">{sub.plan_name}</span>
                          {sub.is_trial && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                              Trial
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(sub.expires_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Serial Keys Tab */}
          {activeTab === "serials" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Serial Keys</h1>
                <Button variant="outline" onClick={loadSerialKeys}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Generate Keys */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Generate New Keys</h3>
                <div className="flex items-end gap-4">
                  <div className="space-y-2">
                    <Label>Plan</Label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(Number(e.target.value))}
                      className="w-48 bg-input border border-border/50 rounded-lg px-3 py-2"
                    >
                      {plans.filter(p => p.name !== "Trial").map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - ${plan.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Count</Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={generateCount}
                      onChange={(e) => setGenerateCount(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                  <Button onClick={generateKeys}>
                    <Plus className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Serial Key</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Plan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Used By</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {serialKeys.map((key) => (
                      <tr key={key.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <code className="text-sm font-mono text-primary">{key.serial_key}</code>
                        </td>
                        <td className="px-4 py-3 text-foreground">{key.plan_name}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={key.status} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {key.used_by_username || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(key.serial_key)}
                            >
                              {copiedKey === key.serial_key ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            {key.status === "available" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                                onClick={() => revokeKey(key.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground">System Settings</h1>

              <div className="glass-card rounded-xl p-6 space-y-6">
                {/* Auto Trial Setting */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <h3 className="font-medium text-foreground">Auto Trial for New Users</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically give new users a trial subscription
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.find(s => s.setting_key === "auto_trial_enabled")?.setting_value === "true"}
                      onChange={(e) => updateSetting("auto_trial_enabled", e.target.checked ? "true" : "false")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                {/* Trial Days Setting */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <h3 className="font-medium text-foreground">Trial Duration (Days)</h3>
                    <p className="text-sm text-muted-foreground">
                      Number of days for auto trial subscription
                    </p>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={settings.find(s => s.setting_key === "auto_trial_days")?.setting_value || "7"}
                    onChange={(e) => updateSetting("auto_trial_days", e.target.value)}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function StatCard({ title, value, subtitle, icon: Icon }: { 
  title: string
  value: number
  subtitle: string
  icon: React.ElementType 
}) {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground">{title}</span>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/20 text-green-400",
    inactive: "bg-yellow-500/20 text-yellow-400",
    expired: "bg-orange-500/20 text-orange-400",
    banned: "bg-red-500/20 text-red-400",
    cancelled: "bg-red-500/20 text-red-400",
    available: "bg-green-500/20 text-green-400",
    used: "bg-blue-500/20 text-blue-400",
    revoked: "bg-red-500/20 text-red-400",
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  )
}
