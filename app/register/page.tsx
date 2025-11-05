"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    ownerEmail: "",
    password: "",
    confirmPassword: "",
    slug: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [origin, setOrigin] = useState("")

  // Get origin on client side only
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  // Auto-generate slug from business name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ş/g, "s")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/ı/g, "i")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  // Check slug availability
  useEffect(() => {
    const checkSlugAvailability = async () => {
      if (!formData.slug || formData.slug.length < 3) {
        setSlugAvailable(null)
        return
      }

      setCheckingSlug(true)
      try {
        // Use count instead of single to avoid 406 error
        const { count, error } = await supabase
          .from("tenants")
          .select("slug", { count: "exact", head: true })
          .eq("slug", formData.slug)

        if (error) {
          console.error("Slug check error:", error)
          setSlugAvailable(true) // If error, assume available
        } else {
          setSlugAvailable(count === 0)
        }
      } catch (error) {
        console.error("Slug check exception:", error)
        setSlugAvailable(true) // If error, assume available
      } finally {
        setCheckingSlug(false)
      }
    }

    const debounce = setTimeout(checkSlugAvailability, 500)
    return () => clearTimeout(debounce)
  }, [formData.slug, supabase])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) newErrors.businessName = "İşletme adı gerekli"
    if (!formData.ownerName.trim()) newErrors.ownerName = "Adınız gerekli"
    if (!formData.ownerEmail.trim()) newErrors.ownerEmail = "E-posta gerekli"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail))
      newErrors.ownerEmail = "Geçerli bir e-posta girin"
    if (!formData.slug.trim()) newErrors.slug = "URL adı gerekli"
    else if (formData.slug.length < 3) newErrors.slug = "En az 3 karakter olmalı"
    else if (!/^[a-z0-9-]+$/.test(formData.slug)) newErrors.slug = "Sadece küçük harf, rakam ve tire kullanın"
    if (!formData.password) newErrors.password = "Şifre gerekli"
    else if (formData.password.length < 6) newErrors.password = "Şifre en az 6 karakter olmalı"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Şifreler eşleşmiyor"
    if (slugAvailable === false) newErrors.slug = "Bu URL adı kullanılıyor"

    return newErrors
  }

  const createDemoData = async (tenantId: string) => {
    try {
      // Create demo categories
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .insert([
          {
            name: "Başlangıçlar",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
            display_order: 0,
            tenant_id: tenantId,
          },
          {
            name: "Ana Yemekler",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
            display_order: 1,
            tenant_id: tenantId,
          },
          {
            name: "İçecekler",
            image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
            display_order: 2,
            tenant_id: tenantId,
          },
          {
            name: "Tatlılar",
            image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
            display_order: 3,
            tenant_id: tenantId,
          },
        ])
        .select()

      if (categoriesError) {
        console.error("Categories creation error:", categoriesError)
        return
      }

      // Create demo products
      if (categories && categories.length === 4) {
        await supabase.from("products").insert([
          // Başlangıçlar
          {
            name: "Mercimek Çorbası",
            description: "Geleneksel Türk usulü mercimek çorbası",
            price: 45,
            category_id: categories[0].id,
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
            display_order: 0,
            tenant_id: tenantId,
            badge: "populer",
          },
          {
            name: "Humus",
            description: "Taze nohuttan hazırlanan ev yapımı humus",
            price: 65,
            category_id: categories[0].id,
            image: "https://images.unsplash.com/photo-1603588558857-b9c3c5ce8778?w=400",
            display_order: 1,
            tenant_id: tenantId,
          },
          // Ana Yemekler
          {
            name: "Kuzu Şiş",
            description: "Mangalda közlenmiş kuzu eti, yanında pilav ve salata",
            price: 220,
            category_id: categories[1].id,
            image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400",
            display_order: 0,
            tenant_id: tenantId,
            badge: "sefin_onerisi",
          },
          {
            name: "Izgara Tavuk",
            description: "Marine edilmiş tavuk göğsü, sebzeli pilav ile",
            price: 180,
            category_id: categories[1].id,
            image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
            display_order: 1,
            tenant_id: tenantId,
          },
          {
            name: "Mantı",
            description: "El açması mantı, yoğurt ve tereyağlı sos ile",
            price: 150,
            category_id: categories[1].id,
            image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400",
            display_order: 2,
            tenant_id: tenantId,
          },
          // İçecekler
          {
            name: "Taze Sıkılmış Portakal Suyu",
            description: "Günlük taze portakallardan",
            price: 55,
            category_id: categories[2].id,
            image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
            display_order: 0,
            tenant_id: tenantId,
          },
          {
            name: "Türk Kahvesi",
            description: "Geleneksel Türk kahvesi",
            price: 40,
            category_id: categories[2].id,
            image: "https://images.unsplash.com/photo-1610632380989-680fe40816a6?w=400",
            display_order: 1,
            tenant_id: tenantId,
          },
          {
            name: "Ayran",
            description: "Ev yapımı yoğurttan taze ayran",
            price: 25,
            category_id: categories[2].id,
            image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400",
            display_order: 2,
            tenant_id: tenantId,
          },
          // Tatlılar
          {
            name: "Künefe",
            description: "Tel kadayıftan özel künefe, bol antep fıstıklı",
            price: 120,
            category_id: categories[3].id,
            image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400",
            display_order: 0,
            tenant_id: tenantId,
            badge: "gunun_urunu",
          },
          {
            name: "Sütlaç",
            description: "Fırında pişmiş karamelize sütlaç",
            price: 75,
            category_id: categories[3].id,
            image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
            display_order: 1,
            tenant_id: tenantId,
          },
        ])
      }

      // Create default admin user (email as username, password from form)
      await supabase.from("admin_users").insert({
        username: formData.ownerEmail,
        password_hash: formData.password,
        display_name: formData.ownerName,
        tenant_id: tenantId,
      })

      console.log("Demo data created successfully!")
    } catch (error) {
      console.error("Error creating demo data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      // Step 1: Create Supabase Auth user with email confirmation required
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.ownerEmail,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            business_name: formData.businessName,
            owner_name: formData.ownerName,
            slug: formData.slug,
          },
        },
      })

      if (authError) {
        console.error("Auth signup error:", authError)
        if (authError.message.includes("already registered")) {
          setErrors({ submit: "Bu e-posta adresi zaten kayıtlı." })
        } else {
          setErrors({ submit: "Kayıt oluşturulamadı. Lütfen tekrar deneyin." })
        }
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setErrors({ submit: "Kullanıcı oluşturulamadı." })
        setIsLoading(false)
        return
      }

      // Check if email confirmation is required
      // If user.email_confirmed_at is null, it means email confirmation is enabled
      const emailConfirmationRequired = !authData.user.email_confirmed_at

      console.log("Email confirmation required:", emailConfirmationRequired)
      console.log("User email confirmed at:", authData.user.email_confirmed_at)

      // Step 2: Create tenant record (inactive until email confirmed)
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          slug: formData.slug,
          business_name: formData.businessName,
          owner_name: formData.ownerName,
          owner_email: formData.ownerEmail,
          auth_user_id: authData.user.id,
          subscription_status: "trial",
          subscription_plan: "trial",
          is_active: false, // Will be activated after email confirmation
          trial_end_date: null, // Will be set after email confirmation
        })
        .select()
        .single()

      if (tenantError) {
        console.error("Tenant creation error:", tenantError)

        // Check if it's a unique constraint violation
        if (tenantError.code === '23505') {
          if (tenantError.message.includes('unique_auth_user_id')) {
            setErrors({ submit: "Bu e-posta adresi zaten kayıtlı." })
          } else if (tenantError.message.includes('slug')) {
            setErrors({ submit: "Bu restoran adı zaten kullanılıyor." })
          } else {
            setErrors({ submit: "Bu kayıt zaten mevcut. Farklı bir e-posta veya restoran adı deneyin." })
          }
        } else {
          setErrors({ submit: `Kayıt oluşturulamadı: ${tenantError.message}` })
        }

        setIsLoading(false)
        return
      }

      // Step 3: Create demo data for new tenant
      await createDemoData(tenant.id)

      // Note: createDemoData already creates admin_users, so we don't need to create it again here

      // If email confirmation is NOT required (already confirmed), show warning
      if (!emailConfirmationRequired) {
        console.warn("⚠️ UYARI: E-posta onayı Supabase'de kapalı! Hesap direkt aktif oldu.")
        console.warn("Üretim ortamında Authentication -> Email Auth -> Enable email confirmations aktif olmalı!")

        // Auto-activate for development (but this should NOT happen in production)
        const trialEndDate = new Date()
        trialEndDate.setDate(trialEndDate.getDate() + 3)

        await supabase
          .from("tenants")
          .update({
            is_active: true,
            trial_end_date: trialEndDate.toISOString(),
          })
          .eq("id", tenant.id)
      }

      // Redirect to email confirmation page (or show warning if already confirmed)
      router.push(`/auth/confirm-email?email=${encodeURIComponent(formData.ownerEmail)}${!emailConfirmationRequired ? '&auto_confirmed=true' : ''}`)
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ submit: "Bir hata oluştu. Lütfen tekrar deneyin." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-2xl shadow-2xl border-2">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl">3 Gün Ücretsiz Başlayın</CardTitle>
            <CardDescription className="text-base">
              Kredi kartı gerektirmez. İstediğiniz zaman iptal edebilirsiniz.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  İşletme Adı <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => {
                    setFormData({ ...formData, businessName: e.target.value, slug: generateSlug(e.target.value) })
                    if (errors.businessName) setErrors({ ...errors, businessName: "" })
                  }}
                  placeholder="Örn: Lezzet Kulesi Restaurant"
                  className={errors.businessName ? "border-red-500" : ""}
                />
                {errors.businessName && <p className="text-red-600 text-sm mt-1">{errors.businessName}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Menü URL Adı <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <span className="bg-slate-100 px-3 py-2 text-sm text-muted-foreground border-r">
                        {origin || "menumgo.digital"}/
                      </span>
                      <Input
                        value={formData.slug}
                        onChange={(e) => {
                          setFormData({ ...formData, slug: generateSlug(e.target.value) })
                          if (errors.slug) setErrors({ ...errors, slug: "" })
                        }}
                        placeholder="lezzet-kulesi"
                        className={`border-0 focus:ring-0 ${errors.slug ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
                    {!errors.slug && formData.slug && (
                      <div className="flex items-center gap-1 mt-1">
                        {checkingSlug ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        ) : slugAvailable === true ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">Kullanılabilir!</span>
                          </>
                        ) : slugAvailable === false ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-600">Bu URL kullanılıyor</span>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Name & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Adınız Soyadınız <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.ownerName}
                    onChange={(e) => {
                      setFormData({ ...formData, ownerName: e.target.value })
                      if (errors.ownerName) setErrors({ ...errors, ownerName: "" })
                    }}
                    placeholder="Ahmet Yılmaz"
                    className={errors.ownerName ? "border-red-500" : ""}
                  />
                  {errors.ownerName && <p className="text-red-600 text-sm mt-1">{errors.ownerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => {
                      setFormData({ ...formData, ownerEmail: e.target.value })
                      if (errors.ownerEmail) setErrors({ ...errors, ownerEmail: "" })
                    }}
                    placeholder="ornek@email.com"
                    className={errors.ownerEmail ? "border-red-500" : ""}
                  />
                  {errors.ownerEmail && <p className="text-red-600 text-sm mt-1">{errors.ownerEmail}</p>}
                </div>
              </div>

              {/* Password */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Şifre <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (errors.password) setErrors({ ...errors, password: "" })
                    }}
                    placeholder="••••••"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Şifre Tekrar <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value })
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" })
                    }}
                    placeholder="••••••"
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading || slugAvailable === false} size="lg" className="w-full text-lg py-6">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  "Ücretsiz Denemeyi Başlat"
                )}
              </Button>

              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                Kayıt olarak{" "}
                <a href="#" className="underline hover:text-primary">
                  Kullanım Şartları
                </a>{" "}
                ve{" "}
                <a href="#" className="underline hover:text-primary">
                  Gizlilik Politikası
                </a>
                'nı kabul etmiş olursunuz.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
