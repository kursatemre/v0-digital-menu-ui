"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  QrCode,
  Smartphone,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Menu as MenuIcon,
  X,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Anında Güncelleme",
      description: "Fiyat ve stok değişikliklerini tek tıkla tüm müşterilerinize anlık yansıtın.",
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Otomatik QR Kod",
      description: "Restoranınıza özel, özelleştirilebilir QR kodunuzu otomatik oluşturun.",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobil Uyumlu",
      description: "Tüm telefon ve tabletlerde mükemmel görünüm. Müşterileriniz kolayca sipariş verebilir.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Kolay Yönetim",
      description: "Kod bilgisi gerektirmeden menünüzü dilediğiniz gibi düzenleyin.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Sipariş Takibi",
      description: "Gelen siparişleri anlık takip edin, garson çağrılarını yönetin.",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Profesyonel Görünüm",
      description: "Markanıza uygun renkler, logonuz ve özelleştirilebilir tasarım.",
    },
  ]

  const benefits = [
    "Sınırsız kategori ve ürün",
    "Gerçek zamanlı sipariş bildirimleri",
    "QR kod özelleştirme (logo, renk, boyut)",
    "Garson çağırma sistemi",
    "Stok yönetimi",
    "Detaylı raporlama",
    "7/24 teknik destek",
    "Ücretsiz güncellemeler",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <MenuIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Dijital Menü
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">SaaS Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#ozellikler" className="text-sm font-medium hover:text-primary transition-colors">
                Özellikler
              </a>
              <a href="#fiyatlandirma" className="text-sm font-medium hover:text-primary transition-colors">
                Fiyatlandırma
              </a>
              <a href="#iletisim" className="text-sm font-medium hover:text-primary transition-colors">
                İletişim
              </a>
              <Link href="/register">
                <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
                  Ücretsiz Başla
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <a
                href="#ozellikler"
                className="block py-2 px-4 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Özellikler
              </a>
              <a
                href="#fiyatlandirma"
                className="block py-2 px-4 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fiyatlandırma
              </a>
              <a
                href="#iletisim"
                className="block py-2 px-4 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                İletişim
              </a>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full gap-2">
                  Ücretsiz Başla
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                🎉 3 Gün Boyunca Tamamen Ücretsiz!
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block text-foreground">Kağıt Menü Derdine</span>
              <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Son Verin!
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed px-4">
              Saniyeler içinde dijital menünüzü yayımlayın. QR kod ile müşterileriniz kolayca sipariş versin.
              Kod bilgisi gerektirmez, kullanımı kolaydır!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 gap-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  3 Gün Ücretsiz Dene
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#ozellikler">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 gap-2 border-2 hover:bg-slate-50"
                >
                  Özellikleri Gör
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-8 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span>Kredi Kartı Gerektirmez</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span>Anında Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span>İstediğiniz Zaman İptal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="ozellikler" className="py-12 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Neden Dijital Menü?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Restoranınızı dijital çağa taşıyan tüm özellikler bir arada
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-primary group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 lg:py-28 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                Tüm İhtiyaçlarınız İçin Hazır
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                Profesyonel restoran yönetimi için ihtiyacınız olan her şey dahil
              </p>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square sm:aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center p-6 sm:p-8">
                  <QrCode className="w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-4 text-primary" />
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Demo QR Kod Önizlemesi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="fiyatlandirma" className="py-12 sm:py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Basit ve Şeffaf Fiyatlandırma
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              3 gün ücretsiz deneyin, beğenirseniz devam edin!
            </p>
          </div>

          <Card className="border-2 border-primary shadow-2xl">
            <CardContent className="p-6 sm:p-12">
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
                  <span className="text-sm font-semibold text-primary">EN POPÜLER</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Başlangıç Paketi</h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold">₺299</span>
                  <span className="text-lg sm:text-xl text-muted-foreground">/ay</span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  İlk 3 gün tamamen ücretsiz, kredi kartı gerektirmez
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-8">
                {[
                  "Sınırsız kategori ve ürün",
                  "QR kod özelleştirme",
                  "Gerçek zamanlı sipariş takibi",
                  "Garson çağırma sistemi",
                  "Mobil optimizasyon",
                  "7/24 teknik destek",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/register">
                <Button size="lg" className="w-full text-base sm:text-lg py-5 sm:py-6 gap-2 shadow-lg">
                  3 Gün Ücretsiz Başla
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 lg:py-28 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Hazır mısınız? Hemen Başlayın!
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90">
            Dakikalar içinde dijital menünüzü yayımlayın. Kredi kartı gerektirmez.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 gap-2 shadow-2xl hover:scale-105 transition-transform"
            >
              Ücretsiz Denemeye Başla
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="iletisim" className="bg-slate-900 text-slate-300 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Dijital Menü</h3>
              <p className="text-sm leading-relaxed">
                Restoranlar için modern dijital menü çözümü. Hızlı, kolay ve profesyonel.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#ozellikler" className="hover:text-white transition-colors">
                    Özellikler
                  </a>
                </li>
                <li>
                  <a href="#fiyatlandirma" className="hover:text-white transition-colors">
                    Fiyatlandırma
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#iletisim" className="hover:text-white transition-colors">
                    İletişim
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sıkça Sorulan Sorular
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Gizlilik Politikası
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kullanım Şartları
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Dijital Menü SaaS. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
