"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  QrCode,
  Smartphone,
  Settings,
  Plus,
  Image,
  Bell,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function DocumentationPage() {
  const steps = [
    {
      icon: <Plus className="w-6 h-6" />,
      title: "1. Hesap Oluşturun",
      description: "3 gün ücretsiz deneme ile hemen başlayın. Kayıt formunu doldurun ve restoran bilgilerinizi girin.",
      details: [
        "Restoran adınızı ve iletişim bilgilerinizi girin",
        "Benzersiz bir restoran slug'ı seçin (örn: lezzet-duragi)",
        "E-posta doğrulaması yapın",
        "Hemen kullanmaya başlayın, kredi kartı gerektirmez"
      ]
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "2. Menünüzü Oluşturun",
      description: "Kategoriler oluşturun ve ürünlerinizi ekleyin. Fotoğraf ve açıklamalarla menünüzü zenginleştirin.",
      details: [
        "Kategori ekleyin (Ana Yemekler, İçecekler, Tatlılar vb.)",
        "Her kategoriye ürün ekleyin",
        "Ürün fotoğrafları yükleyin",
        "Fiyat, açıklama ve alerjenleri belirtin",
        "Yeni veya popüler rozetleri ekleyin"
      ]
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "3. Özelleştirin",
      description: "Markanıza özel logo, renk ve tema ayarlarını yapın. QR kodunuzu kişiselleştirin.",
      details: [
        "Logo ve marka renginizi yükleyin",
        "Tema renklerini ayarlayın",
        "QR kod tasarımını özelleştirin",
        "Restoran açıklama ve iletişim bilgilerini düzenleyin",
        "Çalışma saatlerini belirleyin"
      ]
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "4. QR Kod İndirin",
      description: "Özelleştirilmiş QR kodunuzu indirin ve masalarınıza yerleştirin.",
      details: [
        "QR kodu yüksek çözünürlükte indirin",
        "Farklı boyutlarda QR kod seçenekleri",
        "Yazdırılabilir formatta kaydedin",
        "Masalarınıza, vitrininize veya broşürlerinize yerleştirin"
      ]
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "5. Siparişleri Yönetin",
      description: "Gelen siparişleri anlık takip edin. E-posta bildirimleri ile hiçbir siparişi kaçırmayın.",
      details: [
        "Anlık sipariş bildirimlerini alın",
        "E-posta ile sipariş detaylarını görüntüleyin",
        "Sipariş durumunu takip edin",
        "Garson çağırma taleplerini görün",
        "İstatistikleri ve raporları inceleyin"
      ]
    }
  ]

  const features = [
    {
      category: "Menü Yönetimi",
      items: [
        "Sınırsız kategori ve ürün ekleme",
        "Ürün fotoğrafları ve açıklamalar",
        "Fiyat ve stok takibi",
        "Alerjen bilgileri",
        "Yeni/Popüler/İndirimli rozetleri",
        "Toplu fiyat güncelleme",
        "Ürün sıralama ve düzenleme"
      ]
    },
    {
      category: "QR Kod Özellikleri",
      items: [
        "Özelleştirilebilir QR kod tasarımı",
        "Logo ekleme",
        "Renk ve boyut ayarları",
        "Yüksek çözünürlük indirme",
        "Masa bazlı QR kodlar (opsiyonel)"
      ]
    },
    {
      category: "Sipariş Sistemi",
      items: [
        "Temassız dijital sipariş",
        "Anlık sipariş bildirimleri",
        "E-posta ile sipariş detayları",
        "Sipariş geçmişi",
        "Garson çağırma butonu",
        "Not ekleme özelliği"
      ]
    },
    {
      category: "Özelleştirme",
      items: [
        "Özel logo yükleme",
        "Marka renkleri",
        "Tema seçenekleri",
        "Özel alan adı (yakında)",
        "Çoklu dil desteği (yakında)"
      ]
    },
    {
      category: "Raporlama",
      items: [
        "Sipariş istatistikleri",
        "Popüler ürünler analizi",
        "Gelir raporları",
        "Müşteri davranış analizi",
        "Zaman bazlı raporlar"
      ]
    }
  ]

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

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Kullanım Kılavuzu</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Dokümantasyon</h1>
          <p className="text-lg text-muted-foreground">
            Menumgo'yu kullanmaya başlamak için adım adım rehber
          </p>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Hızlı Başlangıç Rehberi</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Özellikler</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{feature.category}</h3>
                  <ul className="space-y-2">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Sık Sorulan Sorular</h2>
          <div className="space-y-4">
            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">QR kodu nasıl indiririm?</h3>
                <p className="text-muted-foreground text-sm">
                  Admin panelinizden "QR Kod" sekmesine gidin. Buradan QR kodunuzu özelleştirebilir
                  ve farklı boyutlarda indirebilirsiniz. İndirilen QR kodu yüksek çözünürlüktedir
                  ve yazdırılmaya hazırdır.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Menü güncelleme ne kadar sürer?</h3>
                <p className="text-muted-foreground text-sm">
                  Yaptığınız değişiklikler anında yayınlanır. Fiyat, ürün açıklaması veya görsellerde
                  yapacağınız güncellemeler tüm müşterilere gerçek zamanlı olarak yansır.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Sipariş bildirimlerini nasıl alırım?</h3>
                <p className="text-muted-foreground text-sm">
                  Siparişler otomatik olarak kayıtlı e-posta adresinize gönderilir. Admin panelinizden
                  de siparişleri anlık olarak görüntüleyebilirsiniz. Ayrıca bildirim tercihlerinizi
                  ayarlardan özelleştirebilirsiniz.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Birden fazla restoran ekleyebilir miyim?</h3>
                <p className="text-muted-foreground text-sm">
                  Her hesap için bir restoran tanımlanır. Birden fazla restoran için her biri için
                  ayrı hesap oluşturmanız gerekmektedir. Çoklu restoran yönetimi özelliği yakında
                  gelecektir.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Ödeme entegrasyonu var mı?</h3>
                <p className="text-muted-foreground text-sm">
                  Evet, güvenli ödeme altyapısı ile kredi kartı ödemesi alabilirsiniz. Müşterileriniz
                  sipariş verirken online ödeme yapabilir veya kapıda ödeme seçeneğini tercih edebilir.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Section */}
        <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0">
          <CardContent className="p-8 text-center">
            <Smartphone className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Yardıma mı İhtiyacınız Var?</h2>
            <p className="text-white/90 mb-6">
              Dokümantasyonda bulamadığınız bir şey mi var? 7/24 destek ekibimiz size yardımcı olmak için hazır!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="gap-2">
                  İletişime Geç
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="https://wa.me/905457154305" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                  WhatsApp Destek
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">Hemen Başlamaya Hazır mısınız?</h3>
          <p className="text-muted-foreground mb-6">
            3 gün ücretsiz deneme ile tüm özellikleri keşfedin
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Ücretsiz Deneyin
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-4">
            <Link href="/documentation" className="hover:text-white transition-colors">
              Dokümantasyon
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Kullanım Şartları
            </Link>
            <Link href="/kvkk" className="hover:text-white transition-colors">
              KVKK
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              İletişim
            </Link>
          </div>
          <p className="text-center text-sm">&copy; 2025 Menumgo. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
