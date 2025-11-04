"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Building2,
  Users,
  TrendingUp,
  Settings,
  FileEdit,
  LogOut,
  Search,
  Filter,
  Crown,
  Clock,
  Check,
  X,
  Calendar
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Tenant = {
  id: string
  slug: string
  business_name: string
  subscription_status: "trial" | "active" | "cancelled"
  subscription_plan: "trial" | "premium"
  trial_end_date: string
  subscription_end_date: string | null
  is_active: boolean
  created_at: string
}

export default function SuperAdminPanel() {
  const router = useRouter()
  const supabase = createClient()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")

  const [activeTab, setActiveTab] = useState<"dashboard" | "tenants" | "landing">("dashboard")
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "trial" | "active" | "cancelled">("all")

  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    premiumTenants: 0,
    trialTenants: 0
  })

  const [landingContent, setLandingContent] = useState({
    hero: { title: "", subtitle: "" },
    pricing: { plans: [] as any[] }
  })
  const [loadingLanding, setLoadingLanding] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadTenants()
      loadStats()
      if (activeTab === "landing") {
        loadLandingContent()
      }
    }
  }, [isAuthenticated, activeTab])

  const checkAuth = () => {
    const loggedIn = localStorage.getItem("super_admin_logged_in")
    const username = localStorage.getItem("super_admin_username")

    if (loggedIn === "true" && username) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }

  const handleLogin = async () => {
    setLoginError("")

    // For now, use a simple hardcoded check
    // In production, you should verify against the database
    if (loginForm.username === "superadmin" && loginForm.password === "admin123") {
      localStorage.setItem("super_admin_logged_in", "true")
      localStorage.setItem("super_admin_username", loginForm.username)
      setIsAuthenticated(true)
    } else {
      setLoginError("Kullanıcı adı veya şifre hatalı")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("super_admin_logged_in")
    localStorage.removeItem("super_admin_username")
    setIsAuthenticated(false)
  }

  const loadTenants = async () => {
    try {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      if (data) setTenants(data)
    } catch (error) {
      console.error("Error loading tenants:", error)
    }
  }

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from("tenants")
        .select("subscription_status, subscription_plan, is_active")

      if (error) throw error
      if (data) {
        setStats({
          totalTenants: data.length,
          activeTenants: data.filter(t => t.is_active).length,
          premiumTenants: data.filter(t => t.subscription_plan === "premium").length,
          trialTenants: data.filter(t => t.subscription_plan === "trial").length
        })
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const updateTenantSubscription = async (
    tenantId: string,
    plan: "trial" | "premium",
    status: "trial" | "active" | "cancelled",
    endDate?: string
  ) => {
    try {
      const updates: any = {
        subscription_plan: plan,
        subscription_status: status,
        updated_at: new Date().toISOString()
      }

      if (endDate) {
        if (plan === "trial") {
          updates.trial_end_date = endDate
        } else {
          updates.subscription_end_date = endDate
        }
      }

      const { error } = await supabase
        .from("tenants")
        .update(updates)
        .eq("id", tenantId)

      if (error) throw error

      await loadTenants()
      await loadStats()
      alert("Abonelik güncellendi!")
    } catch (error) {
      console.error("Error updating subscription:", error)
      alert("Hata oluştu!")
    }
  }

  const toggleTenantStatus = async (tenantId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("tenants")
        .update({ is_active: !currentStatus })
        .eq("id", tenantId)

      if (error) throw error
      await loadTenants()
      await loadStats()
    } catch (error) {
      console.error("Error toggling tenant status:", error)
    }
  }

  const loadLandingContent = async () => {
    setLoadingLanding(true)
    try {
      const { data, error } = await supabase
        .from("landing_page_content")
        .select("*")

      if (error) throw error
      if (data) {
        const heroData = data.find(d => d.section_key === "hero")
        const pricingData = data.find(d => d.section_key === "pricing")

        setLandingContent({
          hero: heroData?.content || { title: "", subtitle: "" },
          pricing: pricingData?.content || { plans: [] }
        })
      }
    } catch (error) {
      console.error("Error loading landing content:", error)
    } finally {
      setLoadingLanding(false)
    }
  }

  const saveLandingContent = async (sectionKey: string, content: any) => {
    try {
      const { error } = await supabase
        .from("landing_page_content")
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq("section_key", sectionKey)

      if (error) throw error
      alert("İçerik kaydedildi!")
      await loadLandingContent()
    } catch (error) {
      console.error("Error saving landing content:", error)
      alert("Hata oluştu!")
    }
  }

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || tenant.subscription_status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-center">Süper Admin Girişi</CardTitle>
            <CardDescription className="text-center">
              Platform yönetim paneline erişim için giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Kullanıcı Adı</label>
              <Input
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder="superadmin"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Şifre</label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <Button onClick={handleLogin} className="w-full">
              Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold">Menumgo Admin</h1>
              <p className="text-xs text-gray-500">Platform Yönetimi</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={activeTab === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveTab("dashboard")}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "tenants" ? "default" : "outline"}
            onClick={() => setActiveTab("tenants")}
            className="gap-2"
          >
            <Building2 className="w-4 h-4" />
            Restoranlar
          </Button>
          <Button
            variant={activeTab === "landing" ? "default" : "outline"}
            onClick={() => setActiveTab("landing")}
            className="gap-2"
          >
            <FileEdit className="w-4 h-4" />
            Landing Page
          </Button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Toplam Restoran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalTenants}</div>
                  <p className="text-xs text-gray-500 mt-1">Kayıtlı işletme</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Aktif Üyeler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.activeTenants}</div>
                  <p className="text-xs text-gray-500 mt-1">Aktif kullanıcı</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Premium Üyeler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{stats.premiumTenants}</div>
                  <p className="text-xs text-gray-500 mt-1">Premium paket</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Trial Üyeler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{stats.trialTenants}</div>
                  <p className="text-xs text-gray-500 mt-1">Deneme sürümü</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Hızlı Genel Bakış</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Toplam {stats.totalTenants} restoran kayıtlı. Bunların {stats.activeTenants} tanesi aktif durumda.
                  {stats.premiumTenants} premium üye ve {stats.trialTenants} deneme sürümü kullanıcısı bulunmaktadır.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tenants Tab */}
        {activeTab === "tenants" && (
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Restoran ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterStatus === "all" ? "default" : "outline"}
                      onClick={() => setFilterStatus("all")}
                      size="sm"
                    >
                      Tümü
                    </Button>
                    <Button
                      variant={filterStatus === "trial" ? "default" : "outline"}
                      onClick={() => setFilterStatus("trial")}
                      size="sm"
                    >
                      Trial
                    </Button>
                    <Button
                      variant={filterStatus === "active" ? "default" : "outline"}
                      onClick={() => setFilterStatus("active")}
                      size="sm"
                    >
                      Aktif
                    </Button>
                    <Button
                      variant={filterStatus === "cancelled" ? "default" : "outline"}
                      onClick={() => setFilterStatus("cancelled")}
                      size="sm"
                    >
                      İptal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tenants List */}
            <div className="grid gap-4">
              {filteredTenants.map((tenant) => (
                <Card key={tenant.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{tenant.business_name}</h3>
                          <Badge variant={tenant.is_active ? "default" : "secondary"}>
                            {tenant.is_active ? "Aktif" : "Pasif"}
                          </Badge>
                          <Badge variant={tenant.subscription_plan === "premium" ? "default" : "outline"}>
                            {tenant.subscription_plan === "premium" ? (
                              <><Crown className="w-3 h-3 mr-1" /> Premium</>
                            ) : (
                              <><Clock className="w-3 h-3 mr-1" /> Trial</>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">Slug: /{tenant.slug}</p>
                        <p className="text-sm text-gray-500">
                          Kayıt: {new Date(tenant.created_at).toLocaleDateString("tr-TR")}
                        </p>
                        {tenant.subscription_plan === "trial" && (
                          <p className="text-sm text-orange-600">
                            Trial Bitiş: {new Date(tenant.trial_end_date).toLocaleDateString("tr-TR")}
                          </p>
                        )}
                        {tenant.subscription_end_date && (
                          <p className="text-sm text-blue-600">
                            Abonelik Bitiş: {new Date(tenant.subscription_end_date).toLocaleDateString("tr-TR")}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleTenantStatus(tenant.id, tenant.is_active)}
                        >
                          {tenant.is_active ? "Pasifleştir" : "Aktifleştir"}
                        </Button>
                        {tenant.subscription_plan === "trial" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const endDate = new Date()
                              endDate.setMonth(endDate.getMonth() + 1)
                              updateTenantSubscription(
                                tenant.id,
                                "premium",
                                "active",
                                endDate.toISOString()
                              )
                            }}
                          >
                            <Crown className="w-4 h-4 mr-1" />
                            Premium Yap
                          </Button>
                        )}
                        {tenant.subscription_plan === "premium" && tenant.subscription_status === "active" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const months = prompt("Kaç ay uzatmak istiyorsunuz?", "1")
                                if (months) {
                                  const currentEnd = tenant.subscription_end_date
                                    ? new Date(tenant.subscription_end_date)
                                    : new Date()
                                  currentEnd.setMonth(currentEnd.getMonth() + parseInt(months))
                                  updateTenantSubscription(
                                    tenant.id,
                                    "premium",
                                    "active",
                                    currentEnd.toISOString()
                                  )
                                }
                              }}
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Süre Uzat
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (confirm("Bu aboneliği iptal etmek istediğinizden emin misiniz?")) {
                                  updateTenantSubscription(tenant.id, "premium", "cancelled")
                                }
                              }}
                            >
                              Aboneliği İptal Et
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Landing Page Tab */}
        {activeTab === "landing" && (
          <div className="space-y-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Bölümü</CardTitle>
                <CardDescription>
                  Ana sayfanın üst kısmındaki hero bölümünü düzenleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingLanding ? (
                  <p>Yükleniyor...</p>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium">Başlık</label>
                      <Input
                        value={landingContent.hero.title || ""}
                        onChange={(e) => setLandingContent({
                          ...landingContent,
                          hero: { ...landingContent.hero, title: e.target.value }
                        })}
                        placeholder="Dijital Menü Sisteminiz..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Alt Başlık</label>
                      <Input
                        value={landingContent.hero.subtitle || ""}
                        onChange={(e) => setLandingContent({
                          ...landingContent,
                          hero: { ...landingContent.hero, subtitle: e.target.value }
                        })}
                        placeholder="QR kod ile müşterilerinize..."
                      />
                    </div>
                    <Button onClick={() => saveLandingContent("hero", landingContent.hero)}>
                      Hero Bölümünü Kaydet
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Pricing Info */}
            <Card>
              <CardHeader>
                <CardTitle>Fiyatlandırma</CardTitle>
                <CardDescription>
                  Paket bilgileri ve fiyatlandırma (şu an database'de kayıtlı)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Trial Plan: 7 gün ücretsiz
                  </p>
                  <p className="text-sm text-gray-600">
                    Premium Plan: 499₺/ay
                  </p>
                  <p className="text-xs text-gray-500 mt-4">
                    Not: Detaylı düzenleme için database'deki landing_page_content tablosunu güncelleyin.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open("/", "_blank")}
                  >
                    <FileEdit className="w-4 h-4 mr-2" />
                    Landing Page'i Görüntüle
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => loadLandingContent()}
                  >
                    Yenile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
