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

type PlanType = "monthly" | "yearly"

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

  // Calculate prices
  const monthlyPrice = pricing?.premium_price_try || 299
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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!billingInfo.fullName || !billingInfo.email || !billingInfo.phone || !billingInfo.address) {
      alert("Lütfen tüm zorunlu alanları doldurun")
      return
    }

    setProcessing(true)

    try {
      const amount = selectedPlan === "monthly" ? discountedFirstMonth : yearlyPrice
      const planName = selectedPlan === "monthly"
        ? "Premium Abonelik - Aylık (İlk Ay %50 İndirim)"
        : "Premium Abonelik - Yıllık (2 Ay Bedava)"

      console.log('Payment request data:', {
        tenant_id: tenant.id,
        user_name: billingInfo.fullName,
        user_email: billingInfo.email,
        user_phone: billingInfo.phone,
        user_address: `${billingInfo.address}, ${billingInfo.city} ${billingInfo.zipCode}`,
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
        }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      if (data.success && data.iframe_token) {
        setPaytrToken(data.iframe_token)
      } else {
        throw new Error(data.error || 'Token alınamadı')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      alert(`Ödeme Hatası: ${error.message || "Ödeme oluşturulamadı. Lütfen tekrar deneyin."}`)
      setProcessing(false)
    }
  }

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

  // PayTR iframe view
  if (paytrToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-2">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Shield className="w-6 h-6 text-green-600" />
                Güvenli Ödeme
              </CardTitle>
              <CardDescription>PayTR ile 256-bit SSL şifreli güvenli ödeme</CardDescription>
            </CardHeader>
            <CardContent>
              <iframe
                src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                style={{
                  width: "100%",
                  height: "800px",
                  border: "none",
                  borderRadius: "8px"
                }}
                title="PayTR Güvenli Ödeme"
              />
            </CardContent>
          </Card>
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setPaytrToken(null)
                setProcessing(false)
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
          </div>
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
                {/* Monthly Plan */}
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
                      <h3 className="text-lg font-bold">Aylık Plan</h3>
                      <p className="text-sm text-muted-foreground">Esnek ve iptal edilebilir</p>
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

                {/* Yearly Plan */}
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
                      <h3 className="text-lg font-bold">Yıllık Plan</h3>
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
                    <span>QR kod menü sistemi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <span>Sipariş ve garson çağrı yönetimi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <span>Sınırsız admin kullanıcısı</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <span>Gelişmiş raporlama</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <span>7/24 öncelikli destek</span>
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
                <form onSubmit={handlePayment} className="space-y-6">
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
                          {selectedPlan === "monthly" ? "Aylık Premium" : "Yıllık Premium"}
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
                            ₺{selectedPlan === "monthly" ? discountedFirstMonth : yearlyPrice}
                          </span>
                        </div>
                      </div>
                      {selectedPlan === "monthly" && (
                        <p className="text-xs text-center text-muted-foreground">
                          Sonraki aylık ödemeler ₺{monthlyPrice} olacaktır
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg py-6"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Güvenli Ödeme Sayfasına Geç
                      </>
                    )}
                  </Button>

                  <div className="space-y-2">
                    <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      PayTR ile 256-bit SSL şifreli güvenli ödeme
                    </p>
                    <p className="text-xs text-center text-muted-foreground">
                      Kart bilgileriniz saklanmaz. PCI-DSS sertifikalı ödeme altyapısı.
                    </p>
                  </div>
                </form>
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
