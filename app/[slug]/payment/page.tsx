"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CheckCircle2,
  CreditCard,
  Shield,
  Zap,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  Award,
  ArrowLeft
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type PlanType = "standard" | "monthly" | "yearly"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [tenant, setTenant] = useState<any>(null)
  const [pricing, setPricing] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paytrToken, setPaytrToken] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly")
  const [isFormValid, setIsFormValid] = useState(false)

  // Billing information
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    taxNumber: "",
    companyName: "",
  })

  const supabase = createClient()
  
  // Form validation check
  useEffect(() => {
    const isValid = billingInfo.fullName.trim() !== "" &&
                    billingInfo.email.trim() !== "" &&
                    billingInfo.phone.trim() !== "" &&
                    billingInfo.address.trim() !== ""
    setIsFormValid(isValid)
  }, [billingInfo])
  
  // Auto-load PayTR iframe when form is valid
  useEffect(() => {
    if (isFormValid && !paytrToken && !processing && tenant) {
      loadPaytrIframe()
    }
  }, [isFormValid, tenant])
  
  const loadPaytrIframe = async () => {
    setProcessing(true)

    try {
      let amount: number
      let planName: string
      let subscriptionPlan: string

      if (selectedPlan === "standard") {
        amount = standardPrice
        planName = "Standart Abonelik - Aylık"
        subscriptionPlan = "standard"
      } else if (selectedPlan === "monthly") {
        amount = discountedFirstMonth
        planName = "Premium Abonelik - Aylık (İlk Ay %50 İndirim)"
        subscriptionPlan = "premium"
      } else {
        amount = yearlyPrice
        planName = "Premium Abonelik - Yıllık (2 Ay Bedava)"
        subscriptionPlan = "premium"
      }

      console.log('Auto-loading PayTR iframe:', {
        tenant_id: tenant.id,
        amount,
        plan_type: selectedPlan,
      })

      const response = await fetch('/api/paytr/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenant.id,
          user_name: billingInfo.fullName,
          user_email: billingInfo.email,
          user_phone: billingInfo.phone,
          user_address: `${billingInfo.address}, ${billingInfo.city} ${billingInfo.zipCode}`,
          amount,
          plan_type: selectedPlan,
          plan_name: planName,
          subscription_plan: subscriptionPlan,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success && data.iframe_token) {
        if (data.merchant_oid) {
          sessionStorage.setItem('last_payment_merchant_oid', data.merchant_oid)
          sessionStorage.setItem('last_payment_tenant_id', tenant.id)
        }
        setPaytrToken(data.iframe_token)
      } else {
        throw new Error(data.error || 'Token alınamadı')
      }
    } catch (error: any) {
      console.error('PayTR iframe load error:', error)
      setPaytrToken(null)
    } finally {
      setProcessing(false)
    }
  }

  // Calculate prices
  const monthlyPrice = pricing?.premium_price_try || 299
  const standardPrice = Math.round(monthlyPrice * 0.5) // Standard is 50% of premium
  const discountedFirstMonth = Math.round(monthlyPrice * 0.5) // %50 first month discount
  const yearlyPrice = Math.round(monthlyPrice * 10) // 10 months price (2 months free)
  const yearlySavings = monthlyPrice * 2 // 2 months savings

  useEffect(() => {
    const loadData = async () => {
      // Load tenant
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .select("*")
        .eq("slug", slug)
        .single()

      if (tenantError || !tenantData) {
        router.push("/")
        return
      }

      // Load dynamic pricing
      const { data: pricingData } = await supabase
        .from("pricing_view")
        .select("*")
        .single()

      setTenant(tenantData)
      setPricing(pricingData)
      setIsLoading(false)
    }

    loadData()
  }, [slug, router, supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                Premium'a Geçiş Yapın
              </span>
            </h1>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            <strong>{tenant?.business_name}</strong> - Dijital menü deneyiminizi sınırsız hale getirin
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Plan Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Plan Seçin
                </CardTitle>
                <CardDescription>Size en uygun planı seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Standard Plan */}
                <div
                  onClick={() => setSelectedPlan("standard")}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                    selectedPlan === "standard"
                      ? "border-primary bg-primary/5 shadow-lg scale-105"
                      : "border-border hover:border-primary/50 hover:shadow"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold">Standart Plan</h3>
                      <p className="text-sm text-muted-foreground">Temel özellikler</p>
                    </div>
                    {selectedPlan === "standard" && (
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">₺{standardPrice}</span>
                      <span className="text-xs text-muted-foreground">/ay</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Temel menü ve kategori yönetimi</p>
                  </div>
                  <div className="mt-3 pt-3 border-t text-xs space-y-1">
                    <p className="text-green-600">✓ Sınırsız ürün ve kategori</p>
                    <p className="text-green-600">✓ Tema özelleştirme</p>
                    <p className="text-red-600">✗ Sipariş yönetimi</p>
                    <p className="text-red-600">✗ Garson çağırma</p>
                    <p className="text-red-600">✗ QR kod oluşturma</p>
                  </div>
                </div>

                {/* Premium Monthly Plan */}
                <div
                  onClick={() => setSelectedPlan("monthly")}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                    selectedPlan === "monthly"
                      ? "border-primary bg-primary/5 shadow-lg scale-105"
                      : "border-border hover:border-primary/50 hover:shadow"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold">Premium Aylık</h3>
                      <p className="text-sm text-muted-foreground">Tüm özellikler dahil</p>
                    </div>
                    {selectedPlan === "monthly" && (
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">₺{discountedFirstMonth}</span>
                      <span className="text-sm text-muted-foreground line-through">₺{monthlyPrice}</span>
                    </div>
                    <p className="text-xs text-green-600 font-semibold">🎉 İlk ay %50 indirim</p>
                    <p className="text-xs text-muted-foreground">Sonraki aylar ₺{monthlyPrice}/ay</p>
                  </div>
                </div>

                {/* Premium Yearly Plan */}
                <div
                  onClick={() => setSelectedPlan("yearly")}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all relative ${
                    selectedPlan === "yearly"
                      ? "border-primary bg-primary/5 shadow-lg scale-105"
                      : "border-border hover:border-primary/50 hover:shadow"
                  }`}
                >
                  <div className="absolute -top-3 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    EN AVANTAJLI
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold">Premium Yıllık</h3>
                      <p className="text-sm text-muted-foreground">2 ay bedava kazanın</p>
                    </div>
                    {selectedPlan === "yearly" && (
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">₺{yearlyPrice}</span>
                      <span className="text-sm text-muted-foreground line-through">₺{monthlyPrice * 12}</span>
                    </div>
                    <p className="text-xs text-green-600 font-semibold">💰 ₺{yearlySavings} tasarruf!</p>
                    <p className="text-xs text-muted-foreground">Sadece ₺{Math.round(yearlyPrice / 12)}/ay</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Premium Özellikleri</CardTitle>
                <CardDescription>Tüm özellikler dahil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <span>Sınırsız ürün ve kategori</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span>QR kod menü sistemi ve özelleştirme</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <span>Gerçek zamanlı sipariş takibi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <span>Garson çağırma sistemi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-primary" />
                    </div>
                    <span>Çoklu kullanıcı ve rol yönetimi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <span>Gelişmiş raporlama ve analiz</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <span>TV ekran menü görünümü</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span>Çok dilli destek (TR/EN)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span>Ürün rozet ve etiketleri</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span>Tema ve renk özelleştirme</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span>Mobil responsive tasarım</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <span>7/24 öncelikli teknik destek</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Billing Information & Payment */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CreditCard className="w-6 h-6" />
                  Fatura ve Ödeme Bilgileri
                </CardTitle>
                <CardDescription>Güvenli ödeme ile hemen başlayın</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Kişisel Bilgiler</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          Ad Soyad <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Ahmet Yılmaz"
                          value={billingInfo.fullName}
                          onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          E-posta <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="ahmet@ornek.com"
                          value={billingInfo.email}
                          onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Telefon <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="5551234567"
                        value={billingInfo.phone}
                        onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value.replace(/\D/g, '') })}
                        maxLength={11}
                        required
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Adres Bilgileri</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        Adres <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="Mahalle, Sokak, No"
                        value={billingInfo.address}
                        onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Şehir</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="İstanbul"
                          value={billingInfo.city}
                          onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Posta Kodu</Label>
                        <Input
                          id="zipCode"
                          type="text"
                          placeholder="34000"
                          value={billingInfo.zipCode}
                          onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                          maxLength={5}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Information (Optional) */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Firma Bilgileri (Opsiyonel)</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Firma Adı</Label>
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="Firma Adı (varsa)"
                          value={billingInfo.companyName}
                          onChange={(e) => setBillingInfo({ ...billingInfo, companyName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxNumber">Vergi No / TC No</Label>
                        <Input
                          id="taxNumber"
                          type="text"
                          placeholder="Vergi No (varsa)"
                          value={billingInfo.taxNumber}
                          onChange={(e) => setBillingInfo({ ...billingInfo, taxNumber: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border-2 border-primary/30 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-center">Ödeme Özeti</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Seçilen Plan</span>
                        <span className="font-semibold">
                          {selectedPlan === "standard" ? "Standart" : selectedPlan === "monthly" ? "Premium Aylık" : "Premium Yıllık"}
                        </span>
                      </div>
                      {selectedPlan === "monthly" && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">İndirim</span>
                          <span className="text-green-600 font-semibold">-%50 (İlk Ay)</span>
                        </div>
                      )}
                      {selectedPlan === "yearly" && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Tasarruf</span>
                          <span className="text-green-600 font-semibold">₺{yearlySavings} (2 Ay Bedava)</span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Toplam Tutar</span>
                          <span className="text-3xl font-bold text-primary">
                            ₺{selectedPlan === "standard" ? standardPrice : selectedPlan === "monthly" ? discountedFirstMonth : yearlyPrice}
                          </span>
                        </div>
                      </div>
                      {selectedPlan === "standard" && (
                        <p className="text-xs text-center text-muted-foreground">
                          Aylık ₺{standardPrice} olarak faturalandırılacak
                        </p>
                      )}
                      {selectedPlan === "monthly" && (
                        <p className="text-xs text-center text-muted-foreground">
                          Sonraki aylık ödemeler ₺{monthlyPrice} olacaktır
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PayTR Iframe - Shows when form is valid */}
                  {isFormValid && paytrToken && (
                    <div className="space-y-4 pt-6 border-t">
                      <div className="flex items-center justify-center gap-2 text-primary mb-4">
                        <Shield className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">Güvenli Ödeme</h3>
                      </div>
                      <div className="border-2 border-primary/20 rounded-lg overflow-hidden shadow-lg">
                        <iframe
                          src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                          className="w-full border-0"
                          style={{ minHeight: "600px" }}
                          title="PayTR Güvenli Ödeme"
                          allow="payment"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          <span>PCI-DSS Sertifikalı</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          <span>Kart bilgileriniz saklanmaz</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>256-bit SSL</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading state when form is valid but iframe not loaded yet */}
                  {isFormValid && !paytrToken && processing && (
                    <div className="space-y-4 pt-6 border-t">
                      <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-muted-foreground">Ödeme sayfası hazırlanıyor...</p>
                      </div>
                    </div>
                  )}

                  {/* Info message when form is incomplete */}
                  {!isFormValid && (
                    <div className="space-y-2 pt-6 border-t">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <p className="text-sm text-blue-800">
                          <strong>ℹ️ Bilgi:</strong> Formu doldurun, ödeme ekranı otomatik olarak aşağıda görünecek
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                          <Shield className="w-4 h-4" />
                          PayTR ile 256-bit SSL şifreli güvenli ödeme
                        </p>
                        <p className="text-xs text-center text-muted-foreground">
                          Kart bilgileriniz saklanmaz. PCI-DSS sertifikalı ödeme altyapısı.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Sorularınız mı var?{" "}
                <a href="mailto:info@menumgo.digital" className="text-primary hover:underline font-medium">
                  info@menumgo.digital
                </a>
                {" "}| Telefon:{" "}
                <a href="tel:05457154305" className="text-primary hover:underline font-medium">
                  0545 715 43 05
                </a>
              </p>
              <Button
                variant="ghost"
                onClick={() => router.push(`/${slug}/admin`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Admin Panele Dön
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
