"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [restaurantSlug, setRestaurantSlug] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Try both hash and query params (Supabase can use either)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const queryParams = new URLSearchParams(window.location.search)

        const token = queryParams.get("token")
        const type = queryParams.get("type")
        const error_code = hashParams.get("error_code") || queryParams.get("error_code")
        const error_description = hashParams.get("error_description") || queryParams.get("error_description")

        console.log("Confirm email debug:", { 
          token: !!token, 
          type, 
          error_code, 
          error_description,
          fullUrl: window.location.href 
        })

        // Check for errors first
        if (error_code || error_description) {
          console.error("Email confirmation error:", error_code, error_description)
          setStatus("error")
          setMessage(error_description || "E-posta doğrulama hatası oluştu.")
          return
        }

        // Supabase PKCE flow - let Supabase handle the token exchange
        if (token && type === "signup") {
          // Verify the token with Supabase
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          })

          if (error) {
            console.error("OTP verification error:", error)
            setStatus("error")
            setMessage("E-posta doğrulama başarısız. Link geçersiz veya süresi dolmuş olabilir.")
            return
          }

          if (!data.user) {
            setStatus("error")
            setMessage("Kullanıcı bilgisi alınamadı.")
            return
          }

          const user = data.user

          // Find the tenant by auth_user_id
          const { data: tenant, error: tenantError } = await supabase
            .from("tenants")
            .select("*")
            .eq("auth_user_id", user.id)
            .single()

          if (tenantError || !tenant) {
            console.error("Tenant error:", tenantError)
            setStatus("error")
            setMessage("Restoran kaydı bulunamadı. Lütfen destek ekibi ile iletişime geçin.")
            return
          }

          // Calculate trial end date (3 days from now)
          const trialEndDate = new Date()
          trialEndDate.setDate(trialEndDate.getDate() + 3)

          // Activate the tenant and set trial period
          const { error: updateError } = await supabase
            .from("tenants")
            .update({
              is_active: true,
              trial_end_date: trialEndDate.toISOString(),
              subscription_status: "trial",
              subscription_plan: "trial",
            })
            .eq("id", tenant.id)

          if (updateError) {
            console.error("Update error:", updateError)
            setStatus("error")
            setMessage("Hesap aktifleştirilemedi. Lütfen destek ekibi ile iletişime geçin.")
            return
          }

          // Success!
          setRestaurantSlug(tenant.slug)
          setStatus("success")
          setMessage("E-posta adresiniz başarıyla doğrulandı! 3 günlük ücretsiz deneme süreniz başladı.")

          // Redirect to admin panel after 3 seconds
          setTimeout(() => {
            router.push(`/${tenant.slug}/admin`)
          }, 3000)
        } else {
          setStatus("error")
          setMessage("Geçersiz doğrulama linki. Lütfen e-postanızdaki linki kullanın.")
        }
      } catch (error) {
        console.error("Confirmation error:", error)
        setStatus("error")
        setMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
      }
    }

    confirmEmail()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {status === "loading" && <Loader2 className="w-8 h-8 text-primary animate-spin" />}
            {status === "success" && <CheckCircle2 className="w-8 h-8 text-green-600" />}
            {status === "error" && <XCircle className="w-8 h-8 text-red-600" />}
          </div>
          <CardTitle className="text-2xl sm:text-3xl">
            {status === "loading" && "E-posta Doğrulanıyor..."}
            {status === "success" && "E-posta Doğrulandı!"}
            {status === "error" && "Doğrulama Başarısız"}
          </CardTitle>
          <CardDescription className="text-base">
            {message}
          </CardDescription>
        </CardHeader>

        {status === "success" && (
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-2 text-sm text-green-800">
                <p className="font-medium">✓ Hesabınız aktifleştirildi</p>
                <p className="font-medium">✓ 3 günlük ücretsiz deneme başladı</p>
                <p className="font-medium">✓ Yönetim paneline yönlendiriliyorsunuz...</p>
              </div>
            </div>

            {restaurantSlug && (
              <div className="text-center text-sm text-muted-foreground">
                <p>Admin paneline yönlendiriliyorsunuz...</p>
                <p className="mt-2">
                  <a
                    href={`/${restaurantSlug}/admin`}
                    className="text-primary hover:underline"
                  >
                    Hemen gitmek için tıklayın
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        )}

        {status === "error" && (
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="space-y-2 text-sm text-red-800">
                <p>Aşağıdaki adımları deneyebilirsiniz:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>E-postanızdaki linki tekrar tıklayın</li>
                  <li>Yeni bir doğrulama e-postası isteyin</li>
                  <li>Destek ekibi ile iletişime geçin</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/"
                className="text-primary hover:underline text-sm"
              >
                Ana sayfaya dön
              </a>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
