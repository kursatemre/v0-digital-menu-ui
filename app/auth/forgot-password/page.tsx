"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setErrorMessage("Lütfen e-posta adresinizi girin")
      setStatus("error")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Geçerli bir e-posta adresi girin")
      setStatus("error")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    try {
      console.log("Requesting password reset for:", email)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      console.log("Password reset response:", { error })

      if (error) {
        console.error("Password reset error:", error)

        // Check for rate limit error
        if (error.message.includes("rate limit") || error.message.includes("too many requests")) {
          setErrorMessage(
            "Çok fazla şifre sıfırlama talebi gönderildi. Lütfen 1 saat bekleyip tekrar deneyin. " +
            "Acil durumda info@menumgo.digital adresinden iletişime geçebilirsiniz."
          )
        } else if (error.message.includes("not found") || error.message.includes("User not found")) {
          setErrorMessage("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.")
        } else {
          setErrorMessage(`Şifre sıfırlama e-postası gönderilemedi: ${error.message}`)
        }
        setStatus("error")
      } else {
        console.log("Password reset email sent successfully")
        setStatus("success")
      }
    } catch (error: any) {
      console.error("Unexpected error:", error)
      setErrorMessage(`Bir hata oluştu: ${error.message || "Lütfen tekrar deneyin."}`)
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ana Sayfaya Dön
        </Link>

        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {status === "idle" && <Mail className="w-8 h-8 text-primary" />}
              {status === "loading" && <Loader2 className="w-8 h-8 text-primary animate-spin" />}
              {status === "success" && <CheckCircle2 className="w-8 h-8 text-green-600" />}
              {status === "error" && <AlertCircle className="w-8 h-8 text-red-600" />}
            </div>
            <CardTitle className="text-2xl sm:text-3xl">
              {status === "success" ? "E-posta Gönderildi" : "Şifremi Unuttum"}
            </CardTitle>
            <CardDescription className="text-base">
              {status === "success"
                ? "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi"
                : "E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {status === "success" ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm text-green-800">
                    <p className="font-medium">✓ E-posta başarıyla gönderildi</p>
                    <p>
                      E-posta kutunuzu kontrol edin. Spam/gereksiz klasörünü de kontrol etmeyi unutmayın.
                    </p>
                    <p className="text-xs mt-3">
                      E-posta adresinize gelen linke tıklayarak yeni şifrenizi oluşturabilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <Link href="/" className="text-primary hover:underline text-sm block">
                    Ana sayfaya dön
                  </Link>
                  <button
                    onClick={() => {
                      setStatus("idle")
                      setEmail("")
                    }}
                    className="text-muted-foreground hover:text-primary text-sm"
                  >
                    Tekrar gönder
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-posta Adresi
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrorMessage("")
                      setStatus("idle")
                    }}
                    disabled={status === "loading"}
                    className={errorMessage ? "border-red-500" : ""}
                  />
                  {errorMessage && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errorMessage}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Şifre Sıfırlama Bağlantısı Gönder
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Şifrenizi hatırladınız mı?{" "}
                  <Link href="/" className="text-primary hover:underline">
                    Giriş yapın
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>E-posta gelmediyse spam klasörünü kontrol edin.</p>
          <p className="mt-1">
            Sorun devam ediyorsa:{" "}
            <a href="mailto:info@menumgo.digital" className="text-primary hover:underline">
              info@menumgo.digital
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
