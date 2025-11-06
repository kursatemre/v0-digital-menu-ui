"use client"

import React, { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Building2,
  Users,
  TrendingUp,
  FileEdit,
  LogOut,
  Search,
  Filter,
  Crown,
  Clock,
  Check,
  X,
  Calendar,
  Trash2
} from "lucide-react"

// Types
interface Tenant {
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

interface Hero {
  title: string
  subtitle: string
  logoUrl?: string
  faviconUrl?: string
  backgroundImage?: string
  buttonText?: string
  buttonLink?: string
  badgeText?: string
}

interface LandingContent {
  id: string
  section_key: string
  title: string
  content: Hero | Record<string, any>
  created_at: string
}

interface Stats {
  totalTenants: number
  activeTenants: number
  premiumTenants: number
  trialTenants: number
}

// React 18 ve sonrası için JSX namespace tanımlaması gerekmez

export default function SuperAdminPanel() {
  const router = useRouter()
  const supabase = createClient()

  // States
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")

  const [activeTab, setActiveTab] = useState<"dashboard" | "tenants" | "landing" | "pricing">("dashboard")
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "trial" | "active" | "cancelled">("all")
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    premiumTenants: 0,
    trialTenants: 0
  })

  // Pricing settings state
  const [pricingSettings, setPricingSettings] = useState({
    usdToTryRate: 34.50,
    premiumPriceUsd: 9.99,
    lastRateUpdate: null as string | null,
    settingsId: null as string | null
  })
  const [loadingPricing, setLoadingPricing] = useState(false)
  const [savingPricing, setSavingPricing] = useState(false)

  const [landingContent, setLandingContent] = useState<{
    hero: Hero,
    pricing: { plans: any[] }
  }>({
    hero: { 
      title: "", 
      subtitle: "",
      logoUrl: "",
      backgroundImage: "",
      buttonText: "",
      buttonLink: "",
      badgeText: ""
    },
    pricing: { plans: [] }
  })
  const [loadingLanding, setLoadingLanding] = useState(false)

  // Extension dialog state
  const [extensionDialog, setExtensionDialog] = useState({
    open: false,
    tenantId: "",
    tenantName: "",
    currentEndDate: null as string | null,
    months: "1"
  })

  // Actions

  const loadTenants = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      if (data) {
        setTenants(data)
      }
    } catch (error) {
      console.error("Error loading tenants:", error)
    }
  }, [supabase])

  const loadStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tenants")
        .select("subscription_status, subscription_plan, is_active")

      if (error) throw error
      if (data) {
        const tenants = data as Tenant[]
        setStats({
          totalTenants: tenants.length,
          activeTenants: tenants.filter(t => t.is_active).length,
          premiumTenants: tenants.filter(t => t.subscription_plan === "premium").length,
          trialTenants: tenants.filter(t => t.subscription_plan === "trial").length
        })
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }, [supabase])

  const loadLandingContent = useCallback(async () => {
    setLoadingLanding(true)
    try {
      const { data, error } = await supabase
        .from("landing_page_content")
        .select("*")

      if (error) throw error
      if (data) {
        const heroData = data.find((d: LandingContent) => d.section_key === "hero")
        const pricingData = data.find((d: LandingContent) => d.section_key === "pricing")

        setLandingContent({
          hero: heroData?.content || {
            title: "",
            subtitle: "",
            logoUrl: "",
            backgroundImage: "",
            buttonText: "",
            buttonLink: "",
            badgeText: ""
          },
          pricing: pricingData?.content || { plans: [] }
        })
      }
    } catch (error) {
      console.error("Error loading landing content:", error)
    } finally {
      setLoadingLanding(false)
    }
  }, [supabase])

  const loadPricingSettings = useCallback(async () => {
    setLoadingPricing(true)
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("id, usd_to_try_rate, premium_price_usd, last_rate_update")
        .single()

      if (error) throw error
      if (data) {
        setPricingSettings({
          usdToTryRate: data.usd_to_try_rate || 34.50,
          premiumPriceUsd: data.premium_price_usd || 9.99,
          lastRateUpdate: data.last_rate_update,
          settingsId: data.id
        })
      }
    } catch (error) {
      console.error("Error loading pricing settings:", error)
    } finally {
      setLoadingPricing(false)
    }
  }, [supabase])

  const savePricingSettings = async () => {
    if (!pricingSettings.settingsId) {
      alert("Platform ayarları bulunamadı")
      return
    }

    setSavingPricing(true)
    try {
      const { error } = await supabase
        .from("platform_settings")
        .update({
          usd_to_try_rate: pricingSettings.usdToTryRate,
          premium_price_usd: pricingSettings.premiumPriceUsd
        })
        .eq("id", pricingSettings.settingsId)

      if (error) throw error
      
      alert("Fiyatlandırma ayarları başarıyla güncellendi!")
      await loadPricingSettings() // Reload to get updated timestamp
    } catch (error) {
      console.error("Error saving pricing settings:", error)
      alert("Fiyatlandırma ayarları güncellenirken hata oluştu")
    } finally {
      setSavingPricing(false)
    }
  }

  const updateExchangeRateFromAPI = async () => {
    setSavingPricing(true)
    try {
      const response = await fetch('/api/cron/update-exchange-rate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'ran22dom_se2cure_s2k1m1y3tri22ng'}`
        }
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'API güncellemesi başarısız')
      }

      alert(`✅ Kur başarıyla güncellendi!\n\nYeni kur: $1 = ₺${data.rate}\nZaman: ${new Date(data.timestamp).toLocaleString('tr-TR')}`)
      await loadPricingSettings() // Reload to get updated rate
    } catch (error: any) {
      console.error("Error fetching exchange rate:", error)
      alert(`❌ Kur güncellenirken hata oluştu:\n${error.message}`)
    } finally {
      setSavingPricing(false)
    }
  }

  // Auth check effect
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("super_admin_logged_in")
      const username = localStorage.getItem("super_admin_username")

      if (loggedIn === "true" && username) {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Data loading effect
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return

      await Promise.all([
        loadTenants(),
        loadStats(),
        activeTab === "landing" ? loadLandingContent() : Promise.resolve(),
        activeTab === "pricing" ? loadPricingSettings() : Promise.resolve()
      ])
    }

    loadData()
  }, [isAuthenticated, activeTab, loadTenants, loadStats, loadLandingContent, loadPricingSettings])



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

  const updateTenantSubscription = useCallback(async (
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

      const { data, error } = await supabase
        .from("tenants")
        .update(updates)
        .eq("id", tenantId)
        .select()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      await loadTenants()
      await loadStats()
      alert("Abonelik güncellendi!")
    } catch (error: any) {
      console.error("Error updating subscription:", error)
      alert(`Hata oluştu: ${error?.message || "Bilinmeyen hata"}`)
    }
  }, [supabase, loadTenants, loadStats])

  const toggleTenantStatus = useCallback(async (tenantId: string, currentStatus: boolean) => {
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
  }, [supabase, loadTenants, loadStats])

  const saveLandingContent = async (sectionKey: string, content: any) => {
    try {
      const { data, error } = await supabase
        .from("landing_page_content")
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq("section_key", sectionKey)
        .select()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      alert("İçerik kaydedildi!")
      await loadLandingContent()
    } catch (error: any) {
      console.error("Error saving landing content:", error)
      alert(`Hata oluştu: ${error?.message || "Bilinmeyen hata"}`)
    }
  }

  const handleExtendSubscription = async () => {
    try {
      const monthsToAdd = parseInt(extensionDialog.months)
      if (isNaN(monthsToAdd) || monthsToAdd < 1) {
        alert("Lütfen geçerli bir ay sayısı girin")
        return
      }

      const currentEnd = extensionDialog.currentEndDate
        ? new Date(extensionDialog.currentEndDate)
        : new Date()
      currentEnd.setMonth(currentEnd.getMonth() + monthsToAdd)

      await updateTenantSubscription(
        extensionDialog.tenantId,
        "premium",
        "active",
        currentEnd.toISOString()
      )

      setExtensionDialog({
        open: false,
        tenantId: "",
        tenantName: "",
        currentEndDate: null,
        months: "1"
      })
    } catch (error) {
      console.error("Error extending subscription:", error)
    }
  }

  const filteredTenants = tenants.filter((tenant: Tenant) => {
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginForm({ ...loginForm, password: e.target.value })}
                onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleLogin()}
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
          <Button
            variant={activeTab === "pricing" ? "default" : "outline"}
            onClick={() => setActiveTab("pricing")}
            className="gap-2"
          >
            <Crown className="w-4 h-4" />
            Fiyatlandırma
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
              {filteredTenants.map((tenant: Tenant) => (
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
                            ) : tenant.subscription_plan === "trial" ? (
                              <><Clock className="w-3 h-3 mr-1" /> Trial</>
                            ) : (
                              <><Clock className="w-3 h-3 mr-1" /> {tenant.subscription_plan || "N/A"}</>
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

                        {(!tenant.subscription_plan || tenant.subscription_plan === "trial") && (
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
                                setExtensionDialog({
                                  open: true,
                                  tenantId: tenant.id,
                                  tenantName: tenant.business_name,
                                  currentEndDate: tenant.subscription_end_date,
                                  months: "1"
                                })
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Logo URL</label>
                        <Input
                          value={landingContent.hero.logoUrl || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setLandingContent({
                            ...landingContent,
                            hero: { ...landingContent.hero, logoUrl: e.target.value }
                          })}
                          placeholder="https://example.com/logo.png"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Logo görselinin URL'sini girin</p>
                      </div>

                      <div className="col-span-2">
                        <label className="text-sm font-medium">Favicon URL</label>
                        <Input
                          value={landingContent.hero.faviconUrl || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setLandingContent({
                            ...landingContent,
                            hero: { ...landingContent.hero, faviconUrl: e.target.value }
                          })}
                          placeholder="https://example.com/favicon.png"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Tarayıcı sekmesinde görünecek favicon URL'si (önerilen: 32x32 veya 192x192 PNG)
                        </p>
                      </div>

                      <div className="col-span-2">
                        <label className="text-sm font-medium">Arka Plan Görseli URL</label>
                        <Input
                          value={landingContent.hero.backgroundImage || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setLandingContent({
                            ...landingContent,
                            hero: { ...landingContent.hero, backgroundImage: e.target.value }
                          })}
                          placeholder="https://images.unsplash.com/..."
                        />
                        <p className="text-xs text-muted-foreground mt-1">Hero bölümü arka plan resminin URL'sini girin</p>
                      </div>

                      <div className="col-span-2">
                        <label className="text-sm font-medium">Başlık</label>
                        <Input
                          value={landingContent.hero.title || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setLandingContent({
                            ...landingContent,
                            hero: { ...landingContent.hero, title: e.target.value }
                          })}
                          placeholder="Dijital Menü Sisteminiz..."
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-sm font-medium">Alt Başlık</label>
                        <Input
                          value={landingContent.hero.subtitle || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setLandingContent({
                            ...landingContent,
                            hero: { ...landingContent.hero, subtitle: e.target.value }
                          })}
                          placeholder="QR kod ile müşterilerinize..."
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Rozet Metni</label>
                        <Input
                          value={landingContent.hero.badgeText || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setLandingContent({
                            ...landingContent,
                            hero: { ...landingContent.hero, badgeText: e.target.value }
                          })}
                          placeholder="🎉 3 Gün Ücretsiz!"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Buton Metni</label>
                        <Input
                          value={landingContent.hero.buttonText || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setLandingContent({
                            ...landingContent,
                            hero: { ...landingContent.hero, buttonText: e.target.value }
                          })}
                          placeholder="Ücretsiz Deneyin"
                        />
                      </div>
                    </div>

                    <Button onClick={() => saveLandingContent("hero", landingContent.hero)} className="w-full">
                      Hero Bölümünü Kaydet
                    </Button>
                  </>
                )}
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

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Fiyatlandırma Ayarları
                </CardTitle>
                <CardDescription>
                  Premium abonelik fiyatını USD cinsinden belirleyin. TL karşılığı otomatik hesaplanır.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingPricing ? (
                  <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
                ) : (
                  <>
                    {/* Exchange Rate Section */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="exchangeRate" className="text-sm font-medium">
                          USD/TRY Kuru
                        </Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={updateExchangeRateFromAPI}
                          disabled={savingPricing}
                          className="text-xs"
                        >
                          {savingPricing ? "Güncelleniyor..." : "🔄 API'den Güncelle"}
                        </Button>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold text-gray-700">$1 =</span>
                          <Input
                            id="exchangeRate"
                            type="number"
                            step="0.01"
                            min="0"
                            value={pricingSettings.usdToTryRate}
                            onChange={(e) => setPricingSettings({
                              ...pricingSettings,
                              usdToTryRate: parseFloat(e.target.value) || 0
                            })}
                            className="max-w-[150px] text-lg font-semibold"
                          />
                          <span className="text-2xl font-bold text-gray-700">₺</span>
                        </div>
                        {pricingSettings.lastRateUpdate && (
                          <p className="text-xs text-gray-500 mt-2">
                            Son güncelleme: {new Date(pricingSettings.lastRateUpdate).toLocaleString('tr-TR')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="premiumPrice" className="text-sm font-medium">
                          Premium Aylık Fiyat (USD)
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xl font-bold text-gray-700">$</span>
                          <Input
                            id="premiumPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={pricingSettings.premiumPriceUsd}
                            onChange={(e) => setPricingSettings({
                              ...pricingSettings,
                              premiumPriceUsd: parseFloat(e.target.value) || 0
                            })}
                            className="max-w-[150px] text-lg font-semibold"
                          />
                        </div>
                      </div>

                      {/* Calculated TL Price Display */}
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-900">TL Karşılığı (Otomatik)</p>
                            <p className="text-xs text-green-700 mt-1">
                              Müşterilere gösterilecek aylık ücret
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-green-900">
                              ₺{(pricingSettings.premiumPriceUsd * pricingSettings.usdToTryRate).toFixed(2)}
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                              / ay
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Calculation Details */}
                      <div className="text-xs text-gray-500 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="font-semibold text-blue-900 mb-1">ℹ️ Hesaplama Detayı:</p>
                        <p>
                          ${pricingSettings.premiumPriceUsd} × ₺{pricingSettings.usdToTryRate} = 
                          <span className="font-bold text-blue-900">
                            {' '}₺{(pricingSettings.premiumPriceUsd * pricingSettings.usdToTryRate).toFixed(2)}
                          </span>
                        </p>
                        <p className="mt-2 text-blue-800">
                          Kur değiştiğinde tüm fiyatlar otomatik olarak güncellenir.
                        </p>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                      <Button 
                        onClick={savePricingSettings}
                        disabled={savingPricing}
                        className="w-full"
                        size="lg"
                      >
                        {savingPricing ? "Kaydediliyor..." : "Fiyatlandırma Ayarlarını Kaydet"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">💡 Neden USD?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Sabit değer, enflasyondan korunma</li>
                    <li>Uluslararası müşteriler için şeffaflık</li>
                    <li>Kur değişikliklerinde esnek fiyatlandırma</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">🔄 Otomatik Güncelleme</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Her gün saat 09:00'da otomatik güncellenir</li>
                    <li>exchangerate-api.com API kullanılır</li>
                    <li>Manuel "API'den Güncelle" butonu ile anında güncelleme</li>
                    <li>Kur güncellemesi tüm fiyatları etkiler</li>
                    <li>Mevcut abonelikler etkilenmez</li>
                    <li>Yeni aboneliklerde güncel kur kullanılır</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Extension Dialog */}
      <Dialog open={extensionDialog.open} onOpenChange={(open: boolean) => setExtensionDialog({ ...extensionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abonelik Süresini Uzat</DialogTitle>
            <DialogDescription>
              {extensionDialog.tenantName} için premium abonelik süresini uzatın
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="months">Kaç ay uzatmak istiyorsunuz?</Label>
              <Input
                id="months"
                type="number"
                min="1"
                value={extensionDialog.months}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setExtensionDialog({ ...extensionDialog, months: e.target.value })}
                placeholder="1"
              />
            </div>
            {extensionDialog.currentEndDate && (
              <p className="text-sm text-muted-foreground">
                Mevcut bitiş tarihi: {new Date(extensionDialog.currentEndDate).toLocaleDateString("tr-TR")}
              </p>
            )}
            {extensionDialog.months && parseInt(extensionDialog.months) > 0 && (
              <p className="text-sm text-primary font-medium">
                Yeni bitiş tarihi: {(() => {
                  const currentEnd = extensionDialog.currentEndDate
                    ? new Date(extensionDialog.currentEndDate)
                    : new Date()
                  currentEnd.setMonth(currentEnd.getMonth() + parseInt(extensionDialog.months))
                  return currentEnd.toLocaleDateString("tr-TR")
                })()}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExtensionDialog({ ...extensionDialog, open: false })}
            >
              İptal
            </Button>
            <Button onClick={handleExtendSubscription}>
              Uzat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
