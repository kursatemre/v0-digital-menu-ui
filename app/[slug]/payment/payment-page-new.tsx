"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [tenant, setTenant] = useState<any>(null)
  const [pricing, setPricing] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paytrToken, setPaytrToken] = useState<string | null>(null)

  const [userInfo, setUserInfo] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    user_address: "",
  })

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: tenantData } = await supabase
        .from("tenants")
        .select("*")
        .eq("slug", slug)
        .single()

      if (!tenantData) {
        router.push("/")
        return
      }

      const { data: pricingData } = await supabase
        .from("pricing_view")
        .select("*")
        .single()

      setTenant(tenantData)
      setPricing(pricingData)
      setIsLoading(false)
    }

    loadData()
  }, [slug, router])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const response = await fetch("/api/paytr/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenant.id,
          user_name: userInfo.user_name,
          user_email: userInfo.user_email,
          user_phone: userInfo.user_phone,
          user_address: userInfo.user_address,
          amount: pricing?.premium_price_try || 299,
        }),
      })

      const data = await response.json()

      if (data.success && data.iframe_token) {
        setPaytrToken(data.iframe_token)
      } else {
        throw new Error(data.error || "Token alınamadı")
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      alert("Ödeme oluşturulamadı: " + error.message)
      setProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (paytrToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🔒 Güvenli Ödeme</CardTitle>
              <CardDescription className="text-center">PayTR ile güvenli ödeme</CardDescription>
            </CardHeader>
            <CardContent>
              <iframe
                src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                style={{ width: "100%", height: "800px", border: "none", borderRadius: "8px" }}
              />
            </CardContent>
          </Card>
          <div className="text-center mt-6">
            <Button variant="ghost" onClick={() => { setPaytrToken(null); setProcessing(false) }}>
              ← Geri
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>💳 Premium Ödeme</CardTitle>
            <CardDescription>
              {tenant?.name} için Premium Üyelik - <strong>₺{pricing?.premium_price_try || "299"}</strong>/ay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ad Soyad</label>
                <Input
                  type="text"
                  placeholder="Ahmet Yılmaz"
                  value={userInfo.user_name}
                  onChange={(e) => setUserInfo({ ...userInfo, user_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">E-posta</label>
                <Input
                  type="email"
                  placeholder="ahmet@example.com"
                  value={userInfo.user_email}
                  onChange={(e) => setUserInfo({ ...userInfo, user_email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Telefon</label>
                <Input
                  type="tel"
                  placeholder="5551234567"
                  value={userInfo.user_phone}
                  onChange={(e) => setUserInfo({ ...userInfo, user_phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Adres</label>
                <Input
                  type="text"
                  placeholder="İstanbul, Türkiye"
                  value={userInfo.user_address}
                  onChange={(e) => setUserInfo({ ...userInfo, user_address: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={processing}>
                {processing ? "🔄 Hazırlanıyor..." : "🔒 Güvenli Ödemeye Geç"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                PayTR güvenli ödeme altyapısı ile 256-bit SSL şifreleme
              </p>
            </form>
          </CardContent>
        </Card>
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            Destek: <a href="mailto:destek@menumgo.com" className="text-primary">destek@menumgo.com</a>
          </p>
          <Button variant="ghost" onClick={() => router.push(`/${slug}/admin`)}>
            ← Admin Panele Dön
          </Button>
        </div>
      </div>
    </div>
  )
}
