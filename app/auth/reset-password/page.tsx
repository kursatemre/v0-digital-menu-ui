"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2, AlertCircle, Eye, EyeOff, Key } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isValidToken, setIsValidToken] = useState(false)
  const [checkingToken, setCheckingToken] = useState(true)

  // Check if there's a valid access token in the URL
  useEffect(() => {
    const checkToken = async () => {
      // Get all URL parameters
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const queryParams = new URLSearchParams(window.location.search)

      const token = queryParams.get("token")
      const type = queryParams.get("type")
      const access_token = hashParams.get("access_token") || queryParams.get("access_token")
      const refresh_token = hashParams.get("refresh_token") || queryParams.get("refresh_token")
      const error_code = hashParams.get("error_code") || queryParams.get("error_code")
      const error_description = hashParams.get("error_description") || queryParams.get("error_description")

      console.log("Reset password debug:", {
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
        setIsValidToken(false)

        // Provide user-friendly error messages
        if (error_code === "otp_expired" || error_description?.includes("expired")) {
          setErrorMessage("Şifre sıfırlama bağlantısının süresi dolmuş. Lütfen yeni bir şifre sıfırlama talebi oluşturun.")
        } else if (error_code === "access_denied") {
          setErrorMessage("Şifre sıfırlama bağlantısı geçersiz veya zaten kullanılmış. Lütfen yeni bir talep oluşturun.")
        } else {
          setErrorMessage(error_description || "Bir hata oluştu. Lütfen yeni bir şifre sıfırlama talebi oluşturun.")
        }

        setCheckingToken(false)
        return
      }

      let user = null

      // Method 1: If we have access_token (old flow)
      if (access_token && refresh_token && type === "recovery") {
        console.log("Using access_token flow for password reset...")
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token
        })

        if (sessionError || !sessionData.user) {
          console.error("Session error:", sessionError)
          setIsValidToken(false)
          setErrorMessage("Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı")
          setCheckingToken(false)
          return
        }

        user = sessionData.user
        setIsValidToken(true)
      }
      // Method 2: If we have token (PKCE flow)
      else if (token && type === "recovery") {
        console.log("Using PKCE token flow for password reset...")
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'recovery'
        })

        if (error) {
          console.error("OTP verification error:", error)
          setIsValidToken(false)
          setErrorMessage(`Şifre sıfırlama başarısız: ${error.message}`)
          setCheckingToken(false)
          return
        }

        if (!data.user) {
          setIsValidToken(false)
          setErrorMessage("Kullanıcı bilgisi alınamadı.")
          setCheckingToken(false)
          return
        }

        user = data.user
        setIsValidToken(true)
      }
      // Method 3: Check if there's already a session
      else {
        console.log("Checking existing session for password reset...")
        const { data: { session }, error: sessionCheckError } = await supabase.auth.getSession()
        
        if (sessionCheckError || !session?.user) {
          console.error("No valid recovery method found")
          setIsValidToken(false)
          setErrorMessage("Geçersiz şifre sıfırlama bağlantısı. Lütfen yeni bir talep oluşturun.")
          setCheckingToken(false)
          return
        }

        user = session.user
        setIsValidToken(true)
      }

      if (user) {
        console.log("Password reset session established for user:", user.id)
      }

      setCheckingToken(false)
    }

    checkToken()
  }, [supabase])

  const validatePassword = () => {
    if (!password) {
      setErrorMessage("Şifre gerekli")
      return false
    }

    if (password.length < 6) {
      setErrorMessage("Şifre en az 6 karakter olmalı")
      return false
    }

    if (password !== confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!validatePassword()) {
      setStatus("error")
      return
    }

    setStatus("loading")

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        console.error("Password update error:", error)
        setErrorMessage("Şifre güncellenemedi. Lütfen tekrar deneyin.")
        setStatus("error")
      } else {
        console.log("Password updated successfully")
        setStatus("success")
        
        // Sign out to ensure fresh login with new password
        await supabase.auth.signOut()
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/")
        }, 2000)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
      setStatus("error")
    }
  }

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Doğrulanıyor...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl">Geçersiz Bağlantı</CardTitle>
            <CardDescription className="text-base">
              {errorMessage || "Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="space-y-2 text-sm text-red-800">
                <p className="font-medium">⏰ Bu bağlantının süresi dolmuş veya zaten kullanılmış</p>
                <p className="mt-2">Şifre sıfırlama bağlantıları güvenlik nedeniyle 1 saat geçerlidir ve tek kullanımlıktır.</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2 text-sm text-blue-800">
                <p className="font-medium">✨ Çözüm:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Aşağıdaki butona tıklayın</li>
                  <li>E-posta adresinizi tekrar girin</li>
                  <li>Gelen kutunuzu kontrol edin</li>
                  <li>Yeni gelen linke hemen tıklayın (1 saat geçerli)</li>
                </ol>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Link href="/auth/forgot-password">
                <Button className="w-full" size="lg">
                  🔑 Yeni Şifre Sıfırlama Bağlantısı İste
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Ana Sayfaya Dön
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {status === "success" ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : status === "loading" ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Key className="w-8 h-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl sm:text-3xl">
              {status === "success" ? "Şifre Güncellendi" : "Yeni Şifre Oluştur"}
            </CardTitle>
            <CardDescription className="text-base">
              {status === "success"
                ? "Şifreniz başarıyla güncellendi"
                : "Hesabınız için yeni bir şifre belirleyin"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {status === "success" ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm text-green-800">
                    <p className="font-medium">✓ Şifreniz başarıyla güncellendi</p>
                    <p>Artık yeni şifreniz ile giriş yapabilirsiniz.</p>
                    <p className="text-xs mt-3">Ana sayfaya yönlendiriliyorsunuz...</p>
                  </div>
                </div>

                <Link href="/">
                  <Button className="w-full">Ana Sayfaya Git</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="En az 6 karakter"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setErrorMessage("")
                        setStatus("idle")
                      }}
                      disabled={status === "loading"}
                      className={errorMessage ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Yeni Şifre (Tekrar)
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Şifrenizi tekrar girin"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setErrorMessage("")
                        setStatus("idle")
                      }}
                      disabled={status === "loading"}
                      className={errorMessage ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errorMessage}
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    💡 Güçlü bir şifre oluşturmak için:
                  </p>
                  <ul className="text-xs text-blue-700 mt-1 ml-4 space-y-0.5">
                    <li>• En az 6 karakter kullanın</li>
                    <li>• Büyük ve küçük harfler kullanın</li>
                    <li>• Rakam ve özel karakterler ekleyin</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Güncelleniyor...
                    </>
                  ) : (
                    "Şifremi Güncelle"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
