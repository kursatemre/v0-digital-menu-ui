"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  ChevronDown,
  HelpCircle,
  Languages,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { SupportChatButton } from "@/components/support-chat-button"
import { SupportChatWidget } from "@/components/support-chat-widget"

export default function LandingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [restaurantLoginOpen, setRestaurantLoginOpen] = useState(false)
  const [restaurantSlug, setRestaurantSlug] = useState("")
  const [chatOpen, setChatOpen] = useState(false)
  const [heroContent, setHeroContent] = useState({
    title: "Kağıt Menü Derdine Son Verin!",
    subtitle: "Saniyeler içinde dijital menünüzü yayımlayın. QR kod ile müşterileriniz kolayca sipariş versin. Kod bilgisi gerektirmez, kullanımı kolaydır!",
    logoUrl: "",
    backgroundImage: "",
    badgeText: "🎉 3 Gün Boyunca Tamamen Ücretsiz!",
    buttonText: "3 Gün Ücretsiz Dene",
    buttonLink: "/register"
  })
  const [loading, setLoading] = useState(true)
  const [premiumPriceTry, setPremiumPriceTry] = useState<number>(299)

  useEffect(() => {
    loadHeroContent()
    loadPricing()
    
    // Check for password reset token in URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const type = hashParams.get("type")
    
    if (type === "recovery") {
      console.log("Password recovery token detected, redirecting to reset password page")
      // Preserve the hash and redirect to reset password page
      router.push(`/auth/reset-password${window.location.hash}`)
    }
  }, [])

  const loadPricing = async () => {
    try {
      const { data, error } = await supabase
        .from("pricing_view")
        .select("premium_price_try")
        .single()

      if (error) throw error
      if (data?.premium_price_try) {
        setPremiumPriceTry(Math.round(data.premium_price_try))
      }
    } catch (error) {
      console.error("Error loading pricing:", error)
      // Keep default 299₺ on error
    }
  }

  const loadHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from("landing_page_content")
        .select("content")
        .eq("section_key", "hero")
        .single()

      if (error) throw error

      if (data?.content) {
        console.log('Hero content from DB:', data.content) // Debug log
        setHeroContent({
          title: data.content.title || "Kağıt Menü Derdine Son Verin!",
          subtitle: data.content.subtitle || "Saniyeler içinde dijital menünüzü yayımlayın. QR kod ile müşterileriniz kolayca sipariş versin. Kod bilgisi gerektirmez, kullanımı kolaydır!",
          logoUrl: data.content.logoUrl || "",
          backgroundImage: data.content.backgroundImage || "",
          badgeText: data.content.badgeText || "🎉 3 Gün Boyunca Tamamen Ücretsiz!",
          buttonText: data.content.buttonText || "3 Gün Ücretsiz Dene",
          buttonLink: data.content.buttonLink || "/register"
        })
      }
    } catch (error) {
      console.error("Error loading hero content:", error)
      // Keep default content on error
    } finally {
      setLoading(false)
    }
  }

  const handleRestaurantLogin = async () => {
    if (!restaurantSlug.trim()) {
      alert("Lütfen restoran adınızı girin")
      return
    }

    // Slug'ı küçük harfe çevir ve boşlukları kaldır
    const cleanSlug = restaurantSlug.trim().toLowerCase().replace(/\s+/g, '-')

    // Restoran var mı kontrol et
    const { data, error } = await supabase
      .from("tenants")
      .select("slug, is_active")
      .eq("slug", cleanSlug)
      .single()

    if (error || !data) {
      alert("Bu isimde bir restoran bulunamadı. Lütfen restoran adınızı kontrol edin.")
      return
    }

    if (!data.is_active) {
      alert("Bu restoran hesabı aktif değil. Lütfen destek ekibi ile iletişime geçin.")
      return
    }

    // Restoran admin sayfasına yönlendir
    router.push(`/${cleanSlug}/admin`)
  }

  const features = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "QR Menü Oluşturma",
      description: "Saniyeler içinde dijital menünüzü oluşturun. QR kod ile müşterileriniz temassız sipariş versin. Basılı menü masraflarına son!",
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: "Çoklu Dil Desteği",
      description: "Türkçe ve İngilizce dillerinde menü gösterimi. Yabancı müşterileriniz kendi dillerinde sipariş versin, global işletmeniz olsun!",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Anında Güncelleme",
      description: "Fiyat ve stok değişikliklerini gerçek zamanlı güncelleyin. Tüm müşterileriniz en güncel menüyü görsün.",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Temassız Sipariş",
      description: "Müşterileriniz QR kod okutarak doğrudan menüden sipariş versin. Hijyenik ve hızlı!",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Mobil Uyumlu",
      description: "Tüm cihazlarda mükemmel görünüm. Telefon, tablet, her yerden kolay erişim ve sipariş.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Sipariş Yönetimi",
      description: "Gelen siparişleri anlık takip edin. E-posta bildirimleri ile hiçbir siparişi kaçırmayın.",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Özel Tasarım",
      description: "Markanıza özel renk, logo ve tasarım. Profesyonel görünümle müşterilerinizi etkileyin.",
    },
  ]

  const benefits = [
    "Sınırsız kategori ve ürün ekleme",
    "QR kod özelleştirme (logo, renk, boyut)",
    "Gerçek zamanlı sipariş bildirimleri",
    "E-posta ile sipariş takibi",
    "Garson çağırma butonu",
    "Detaylı raporlama ve analizler",
    "Stok takibi ve yönetimi",
    "Ürün rozet sistemi (Yeni, Popüler)",
    "Mobil uyumlu responsive tasarım",
    "Özel renk ve tema ayarları",
    "Güvenli ödeme entegrasyonu",
    "7/24 teknik destek",
  ]

  const faqs = [
    {
      question: "QR menü nedir ve nasıl çalışır?",
      answer: "QR menü, restoranlar ve kafeler için hazırlanan dijital menü sistemidir. Müşterileriniz masadaki QR kodu telefonlarıyla okutarak menünüze anında erişebilir, ürünleri görüntüleyebilir ve sipariş verebilir. Temassız, hijyenik ve modern bir çözümdür."
    },
    {
      question: "QR menü oluşturmak ne kadar sürer?",
      answer: "Menumgo ile dijital menünüzü 5-10 dakika içinde oluşturabilirsiniz. Kayıt olduktan sonra kategorilerinizi ve ürünlerinizi ekleyin, QR kodunuzu indirin ve kullanmaya başlayın. Teknik bilgi gerektirmez, tamamen kullanıcı dostudur."
    },
    {
      question: "Ücretsiz deneme süresi var mı?",
      answer: `Evet! Menumgo'yu 3 gün boyunca tamamen ücretsiz deneyebilirsiniz. Tüm premium özelliklere erişim sağlarsınız ve kredi kartı bilgisi gerektirmez. Beğenirseniz aylık ${premiumPriceTry}₺ ile devam edebilirsiniz.`
    },
    {
      question: "Fiyat ve ürün güncellemeleri nasıl yapılır?",
      answer: "Yönetim panelinizden istediğiniz zaman kolayca güncelleme yapabilirsiniz. Değişiklikler anında tüm müşterilere yansır. Toplu fiyat güncelleme özelliği ile tüm ürünlerinizi tek seferde güncelleyebilirsiniz."
    },
    {
      question: "Sipariş bildirimleri nasıl alırım?",
      answer: "Gelen siparişleri yönetim panelinizden ve e-posta ile anında alabilirsiniz. Hiçbir siparişi kaçırmaz, müşterilerinize hızlı hizmet verebilirsiniz."
    },
    {
      question: "QR kodumu özelleştirebilir miyim?",
      answer: "Evet! QR kodunuza logonuzu ekleyebilir, renk ve boyut ayarlarını yapabilirsiniz. Markanıza özel, profesyonel görünümlü QR kodlar oluşturabilirsiniz."
    },
    {
      question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
      answer: "Kredi kartı ve banka kartı ile güvenli ödeme alabilirsiniz. Tüm ödemeler SSL sertifikası ile şifrelenir ve güvenli bir şekilde işlenir."
    },
    {
      question: "Teknik destek sağlanıyor mu?",
      answer: "Elbette! 7/24 teknik destek ekibimiz her zaman yanınızda. E-posta veya canlı destek ile sorularınızı sorabilir, sorunlarınıza hızlı çözüm bulabilirsiniz."
    },
    {
      question: "İptal etmek istersem ne olur?",
      answer: "Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Herhangi bir sözleşme veya bağlayıcılık yoktur. İptal ettiğinizde mevcut dönem sonuna kadar sistemi kullanmaya devam edebilirsiniz."
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50/30 to-blue-100/50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-300/10 to-cyan-300/10 rounded-full blur-3xl animate-spin-slow" />
      </div>
      
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-blue-200/50 shadow-lg shadow-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              {heroContent.logoUrl ? (
                <img
                  src={heroContent.logoUrl}
                  alt="MenuMGO Logo"
                  className="h-10 sm:h-12 w-auto max-w-[200px] object-contain"
                  onError={(e) => {
                    console.error('Logo yükleme hatası:', heroContent.logoUrl)
                    e.currentTarget.style.display = 'none'
                  }}
                  onLoad={() => console.log('Logo başarıyla yüklendi:', heroContent.logoUrl)}
                />
              ) : null}
              {(!heroContent.logoUrl || !heroContent.logoUrl.trim()) && (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <MenuIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Menumgo
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">menumgo.digital</p>
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
              <a href="#sss" className="text-sm font-medium hover:text-primary transition-colors">
                SSS
              </a>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setRestaurantLoginOpen(true)}
              >
                Restoran Girişi
              </Button>
              <Link href="/register">
                <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
                  Hemen Başla
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
                href="#sss"
                className="block py-2 px-4 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                SSS
              </a>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setRestaurantLoginOpen(true)
                }}
              >
                Restoran Girişi
              </Button>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full gap-2">
                  Hemen Başla
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Ultra Modern */}
      <section className="relative overflow-hidden">
        {heroContent.backgroundImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroContent.backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-cyan-900/50 to-blue-900/60 backdrop-blur-sm" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-400/10 to-blue-600/15" />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center space-y-6 sm:space-y-10">
            {/* Badge - Glassmorphism style */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-xl rounded-full shadow-2xl shadow-blue-500/20 border border-blue-200/50 ring-1 ring-blue-400/10 hover:scale-105 transition-transform duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 shadow-lg shadow-blue-500/50"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {heroContent.badgeText || "🎉 3 Gün Boyunca Tamamen Ücretsiz!"}
              </span>
            </div>

            {/* Main Heading - Modern gradient */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              <span className={`block ${heroContent.backgroundImage ? "text-white drop-shadow-2xl" : "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent animate-gradient-x"}`}>
                {loading ? "Yükleniyor..." : heroContent.title}
              </span>
            </h1>

            {/* Subtitle - Enhanced */}
            <p className={`max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed px-4 font-medium ${heroContent.backgroundImage ? "text-white/95 drop-shadow-lg" : "text-slate-600"}`}>
              {loading ? "Lütfen bekleyin..." : heroContent.subtitle}
            </p>

            {/* CTA Buttons - Modern glass effect */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href={heroContent.buttonLink || "/register"}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 gap-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 transition-all hover:scale-105 border border-blue-400/20 rounded-xl font-bold"
                >
                  {heroContent.buttonText || "3 Gün Ücretsiz Dene"}
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                </Button>
              </Link>
              <a href="#ozellikler">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 gap-3 border-2 border-blue-300/50 bg-white/60 backdrop-blur-xl hover:bg-blue-50/80 hover:border-blue-400/70 text-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
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
      <section id="ozellikler" className="py-16 sm:py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              Neden Dijital Menü?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Restoranınızı dijital çağa taşıyan tüm özellikler bir arada
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card border-2 border-blue-200/50 hover:border-blue-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 group hover:-translate-y-2"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-2xl flex items-center justify-center mb-5 sm:mb-7 text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Modern Blue */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-blue-50/80 via-cyan-50/50 to-blue-100/70 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                Tüm İhtiyaçlarınız İçin Hazır
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 font-medium">
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
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold">₺{premiumPriceTry}</span>
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

      {/* FAQ Section */}
      <section id="sss" className="py-12 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Sıkça Sorulan Sorular</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Aklınıza Takılanlar
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Menumgo hakkında merak ettikleriniz
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-base sm:text-lg flex-1">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                        openFaqIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {openFaqIndex === index && (
                    <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-200">
                      {faq.answer}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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

      {/* Restaurant Login Dialog */}
      <Dialog open={restaurantLoginOpen} onOpenChange={setRestaurantLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restoran Girişi</DialogTitle>
            <DialogDescription>
              Restoranınızın adını girerek yönetim panelinize erişin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant-slug">Restoran Adı</Label>
              <Input
                id="restaurant-slug"
                placeholder="ornek: lezzet-duragi"
                value={restaurantSlug}
                onChange={(e) => setRestaurantSlug(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRestaurantLogin()
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Kayıt olurken belirlediğiniz restoran adınızı girin
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setRestaurantLoginOpen(false)}
              className="w-full sm:w-auto"
            >
              İptal
            </Button>
            <Button onClick={handleRestaurantLogin} className="w-full sm:flex-1">
              Giriş Yap
            </Button>
          </div>
          <div className="border-t pt-4 space-y-2 text-center text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-primary hover:underline inline-block"
              onClick={() => setRestaurantLoginOpen(false)}
            >
              Şifremi unuttum
            </Link>
            <div className="text-muted-foreground">
              E-posta onayı alamadınız mı?{" "}
              <Link
                href="/auth/resend-confirmation"
                className="text-primary hover:underline"
                onClick={() => setRestaurantLoginOpen(false)}
              >
                Tekrar gönder
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Chat */}
      <SupportChatButton onClick={() => setChatOpen(!chatOpen)} isOpen={chatOpen} />
      {chatOpen && <SupportChatWidget />}

      {/* Footer */}
      <footer id="iletisim" className="bg-slate-900 text-slate-300 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Menumgo</h3>
              <p className="text-sm leading-relaxed mb-4">
                Restoranlar için modern dijital menü çözümü. Hızlı, kolay ve profesyonel.
              </p>
              <p className="text-xs text-slate-400">menumgo.digital</p>
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
                <li>
                  <a href="#sss" className="hover:text-white transition-colors">
                    Sıkça Sorulan Sorular
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Kayıt Ol
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="hover:text-white transition-colors">
                    Dokümantasyon
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/kvkk" className="hover:text-white transition-colors">
                    KVKK
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Menumgo. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
