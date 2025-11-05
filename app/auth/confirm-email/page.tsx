"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const autoConfirmed = searchParams.get("auto_confirmed") === "true"
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    setResending(true)
    // TODO: Implement resend email logic
    setTimeout(() => {
      setResending(false)
      setResent(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">E-posta Adresinizi Onaylayın</CardTitle>
          <CardDescription className="text-base">
            Hesabınızı aktif etmek için e-posta adresinizi doğrulamanız gerekiyor
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {autoConfirmed && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-yellow-900">
                ⚠️ Geliştirici Uyarısı
              </p>
              <p className="text-xs text-yellow-800">
                E-posta onayı Supabase'de kapalı olduğu için hesabınız otomatik aktif edildi.
                Üretim ortamında <strong>Authentication → Email Auth → Enable email confirmations</strong> ayarını aktif edin!
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-blue-900">
                  Onay e-postası gönderildi!
                </p>
                <p className="text-sm text-blue-700">
                  <strong className="font-semibold">{email}</strong> adresine bir onay linki gönderdik.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Sonraki adımlar:</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>E-posta gelen kutunuzu kontrol edin</li>
              <li>Menumgo'dan gelen onay e-postasını açın</li>
              <li>"E-postamı Onayla" butonuna tıklayın</li>
              <li>Otomatik olarak yönlendirileceksiniz</li>
            </ol>
          </div>

          <div className="border-t pt-4 space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              E-posta gelmedi mi?
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={resending || resent}
            >
              {resending ? "Gönderiliyor..." : resent ? "✓ Gönderildi" : "Tekrar Gönder"}
            </Button>
          </div>

          <div className="text-center pt-4">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              Ana Sayfaya Dön
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
