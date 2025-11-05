"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold">Menumgo</span>
            </Link>
            <Link href="/">
              <Button variant="outline">Ana Sayfa</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-lg text-muted-foreground">
            Sorularınız için bize ulaşın. Size yardımcı olmaktan mutluluk duyarız.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Cards */}
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Adres</h3>
                  <p className="text-muted-foreground">
                    Reis Mahallesi Ulu Önder Caddesi<br />
                    No: 34/1<br />
                    Karabağlar / İzmir
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">E-posta</h3>
                  <a
                    href="mailto:info@menumgo.digital"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    info@menumgo.digital
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    7/24 size dönüş yapıyoruz
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Telefon</h3>
                  <a
                    href="tel:05457154305"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    0545 715 43 05
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Mesai saatleri: 09:00 - 18:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">WhatsApp Destek</h3>
                  <a
                    href="https://wa.me/905457154305"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-green-600 transition-colors"
                  >
                    0545 715 43 05
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Anında destek için WhatsApp
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Hızlı Başlangıç</h2>
            <p className="text-white/90 mb-6">
              3 gün ücretsiz deneme ile hemen başlayın. Kredi kartı gerektirmez.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Ücretsiz Dene
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">&copy; 2025 Menumgo. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
