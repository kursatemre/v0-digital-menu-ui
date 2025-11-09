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
      // Try both hash and query params (Supabase can use either)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const queryParams = new URLSearchParams(window.location.search)

      const accessToken = hashParams.get("access_token") || queryParams.get("access_token")
      const type = hashParams.get("type") || queryParams.get("type")
      const error_code = hashParams.get("error_code") || queryParams.get("error_code")
      const error_description = hashParams.get("error_description") || queryParams.get("error_description")

      // Check for errors first
      if (error_code || error_description) {
        setIsValidToken(false)
        setErrorMessage(error_description || "Bir hata oluştu")
        setCheckingToken(false)
        return
      }

      if (!accessToken || type !== "recovery") {
        setIsValidToken(false)
        setCheckingToken(false)
        return
      }

      // Verify the token is valid
      const { data: { user }, error } = await supabase.auth.getUser(accessToken)

      if (error || !user) {
        setIsValidToken(false)
        setErrorMessage("Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı")
      } else {
        setIsValidToken(true)
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
        setStatus("success")
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push("/")
        }, 3000)
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
                <p>Aşağıdaki adımları deneyebilirsiniz:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Yeni bir şifre sıfırlama bağlantısı isteyin</li>
                  <li>E-postanızdaki en son gelen linki kullanın</li>
                  <li>Destek ekibi ile iletişime geçin</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/auth/forgot-password">
                <Button className="w-full">Yeni Bağlantı İste</Button>
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
