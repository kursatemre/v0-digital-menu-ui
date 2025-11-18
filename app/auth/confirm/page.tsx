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
        // Get all URL parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const queryParams = new URLSearchParams(window.location.search)

        // Extract parameters
        const token = queryParams.get("token")
        const type = queryParams.get("type")
        const access_token = hashParams.get("access_token") || queryParams.get("access_token")
        const refresh_token = hashParams.get("refresh_token") || queryParams.get("refresh_token")
        const error_code = hashParams.get("error_code") || queryParams.get("error_code")
        const error_description = hashParams.get("error_description") || queryParams.get("error_description")

        console.log("Confirm email debug:", { 
          hasToken: !!token,
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token,
          type, 
          error_code, 
          error_description,
          fullUrl: window.location.href,
          hash: window.location.hash,
          search: window.location.search
        })

        // Check for errors first
        if (error_code || error_description) {
          console.error("Email confirmation error:", error_code, error_description)
          setStatus("error")
          setMessage(error_description || "E-posta doğrulama hatası oluştu.")
          return
        }

        let user = null

        // Method 1: If we have access_token (old flow)
        if (access_token && refresh_token) {
          console.log("Using access_token flow...")
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token
          })

          if (sessionError || !sessionData.user) {
            console.error("Session error:", sessionError)
            setStatus("error")
            setMessage("Oturum oluşturulamadı. Lütfen tekrar deneyin.")
            return
          }

          user = sessionData.user
        }
        // Method 2: If we have token (PKCE flow)
        else if (token && type === "signup") {
          console.log("Using PKCE token flow...")
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          })

          if (error) {
            console.error("OTP verification error:", error)
            setStatus("error")
            setMessage(`E-posta doğrulama başarısız: ${error.message}`)
            return
          }

          if (!data.user) {
            setStatus("error")
            setMessage("Kullanıcı bilgisi alınamadı.")
            return
          }

          user = data.user
        }
        // Method 3: Check if there's already a session (auto-confirmed)
        else {
          console.log("Checking existing session...")
          const { data: { session }, error: sessionCheckError } = await supabase.auth.getSession()
          
          if (sessionCheckError || !session?.user) {
            console.error("No valid confirmation method found")
            setStatus("error")
            setMessage("Geçersiz doğrulama linki. Lütfen e-postanızdaki linki tam olarak kopyalayın.")
            return
          }

          user = session.user
        }

        if (!user) {
          setStatus("error")
          setMessage("Kullanıcı doğrulanamadı.")
          return
        }

        console.log("User confirmed:", user.id)

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

        // Activate the tenant with free standard plan
        const { error: updateError } = await supabase
          .from("tenants")
          .update({
            is_active: true,
            trial_end_date: null, // No trial needed for free plan
            subscription_status: "active",
            subscription_plan: "standard", // Free standard plan
            subscription_end_date: null, // No expiry for free plan
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
        setMessage("E-posta adresiniz başarıyla doğrulandı! Ücretsiz Standart plan hesabınız aktif edildi.")

        // Redirect to admin panel after 3 seconds
        setTimeout(() => {
          router.push(`/${tenant.slug}/admin`)
        }, 3000)

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
