"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, CreditCard, Shield, Zap, Clock, Users, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [tenant, setTenant] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const supabase = createClient()

  useEffect(() => {
    const loadTenant = async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("slug", slug)
        .single()

      if (error || !data) {
        router.push("/")
        return
      }

      setTenant(data)
      setIsLoading(false)
    }

    loadTenant()
  }, [slug, router, supabase])

  const monthlyPrice = 299
  const yearlyPrice = 2990 // 2 ay bedava (10 ay fiyatı)
  const discountedFirstMonth = 149

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Update tenant subscription status
        const { error } = await supabase
          .from("tenants")
          .update({
            subscription_status: "active",
            subscription_plan: selectedPlan,
            subscription_start_date: new Date().toISOString(),
            subscription_end_date: new Date(
              Date.now() + (selectedPlan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", tenant.id)

        if (error) throw error

        alert("Ödeme başarılı! Hoş geldiniz 🎉")
        router.push(`/${slug}/admin`)
      } catch (error) {
        console.error("Payment error:", error)
        alert("Ödeme sırasında bir hata oluştu. Lütfen tekrar deneyin.")
      } finally {
        setProcessing(false)
      }
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Premium'a Geçiş Yapın
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            {tenant?.business_name} - Dijital menü deneyiminizi sınırsız hale getirin
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Plan Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Seçin</CardTitle>
                <CardDescription>Size en uygun planı seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Monthly Plan */}
                <div
                  onClick={() => setSelectedPlan("monthly")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedPlan === "monthly"
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Aylık Plan</h3>
                      <p className="text-sm text-muted-foreground">Esnek ve iptal edilebilir</p>
                    </div>
                    {selectedPlan === "monthly" && (
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">₺{discountedFirstMonth}</span>
                      <span className="text-lg text-muted-foreground line-through">₺{monthlyPrice}</span>
                      <span className="text-sm text-green-600 font-semibold">İlk ay %50 İndirim</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Sonraki aylar ₺{monthlyPrice}/ay</p>
                  </div>
                </div>

                {/* Yearly Plan */}
                <div
                  onClick={() => setSelectedPlan("yearly")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all relative ${
                    selectedPlan === "yearly"
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    2 AY BEDAVA
                  </div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Yıllık Plan</h3>
                      <p className="text-sm text-muted-foreground">En avantajlı seçenek</p>
                    </div>
                    {selectedPlan === "yearly" && (
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">₺{yearlyPrice}</span>
                      <span className="text-lg text-muted-foreground line-through">₺3,588</span>
                    </div>
                    <p className="text-sm text-green-600 font-semibold">₺598 tasarruf edin!</p>
                    <p className="text-sm text-muted-foreground">Sadece ₺249/ay</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Premium Özellikleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Sınırsız ürün ve kategori</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>QR kod menü sistemi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Sipariş ve garson çağrı yönetimi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Sınırsız admin kullanıcısı</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Gelişmiş raporlama (yakında)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>7/24 öncelikli destek</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Ödeme Bilgileri
                </CardTitle>
                <CardDescription>Güvenli ödeme ile hemen başlayın</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Kart Üzerindeki İsim</label>
                    <Input
                      type="text"
                      placeholder="AD SOYAD"
                      value={cardInfo.cardName}
                      onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Kart Numarası</label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardInfo.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, "")
                        const formatted = value.match(/.{1,4}/g)?.join(" ") || value
                        setCardInfo({ ...cardInfo, cardNumber: formatted })
                      }}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Son Kullanma</label>
                      <Input
                        type="text"
                        placeholder="AA/YY"
                        maxLength={5}
                        value={cardInfo.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "")
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4)
                          }
                          setCardInfo({ ...cardInfo, expiryDate: value })
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <Input
                        type="text"
                        placeholder="123"
                        maxLength={3}
                        value={cardInfo.cvv}
                        onChange={(e) =>
                          setCardInfo({ ...cardInfo, cvv: e.target.value.replace(/\D/g, "") })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Plan</span>
                      <span className="font-semibold">
                        {selectedPlan === "monthly" ? "Aylık" : "Yıllık"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {selectedPlan === "monthly" ? "İlk Ay Tutarı" : "Yıllık Tutar"}
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        ₺{selectedPlan === "monthly" ? discountedFirstMonth : yearlyPrice}
                      </span>
                    </div>
                    {selectedPlan === "monthly" && (
                      <p className="text-xs text-muted-foreground text-center">
                        Sonraki aylık ödemeler ₺{monthlyPrice} olacaktır
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg"
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
                        Güvenli Ödeme Yap
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    <Shield className="w-4 h-4 inline mr-1" />
                    256-bit SSL ile güvenli ödeme. Kart bilgileriniz saklanmaz.
                  </p>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Sorularınız mı var?{" "}
                <a href="mailto:destek@dijitalmenü.com" className="text-primary hover:underline">
                  destek@dijitalmenü.com
                </a>
              </p>
              <Button
                variant="ghost"
                onClick={() => router.push(`/${slug}/admin`)}
              >
                Admin Panele Dön
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
