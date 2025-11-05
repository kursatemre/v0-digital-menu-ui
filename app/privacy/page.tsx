"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function PrivacyPolicyPage() {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-muted-foreground">Son Güncelleme: 5 Ocak 2025</p>
        </div>

        <Card className="border-2">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Giriş</h2>
              <p className="text-muted-foreground leading-relaxed">
                Menumgo olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası,
                hizmetlerimizi kullanırken kişisel bilgilerinizin nasıl toplandığını, kullanıldığını ve
                korunduğunu açıklamaktadır. Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu
                (KVKK) ve ilgili mevzuata uygun olarak hazırlanmıştır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Toplanan Bilgiler</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">2.1. Kişisel Bilgiler</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Hizmetlerimizi kullanırken aşağıdaki kişisel bilgileri toplayabiliriz:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Ad, soyad</li>
                    <li>E-posta adresi</li>
                    <li>Telefon numarası</li>
                    <li>Restoran bilgileri (işletme adı, adresi)</li>
                    <li>Ödeme bilgileri (kredi kartı bilgileri güvenli ödeme sağlayıcıları üzerinden işlenir)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">2.2. Kullanım Bilgileri</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Hizmetlerimizi geliştirmek için aşağıdaki kullanım bilgilerini otomatik olarak toplarız:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>IP adresi</li>
                    <li>Tarayıcı türü ve versiyonu</li>
                    <li>Sayfa görüntüleme istatistikleri</li>
                    <li>Giriş-çıkış saatleri</li>
                    <li>Cihaz bilgileri</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Bilgilerin Kullanımı</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Toplanan bilgiler aşağıdaki amaçlarla kullanılır:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Hizmetlerimizi sağlamak ve yönetmek</li>
                <li>Kullanıcı hesaplarını oluşturmak ve yönetmek</li>
                <li>Müşteri destek hizmetleri sunmak</li>
                <li>Ödeme işlemlerini gerçekleştirmek</li>
                <li>Hizmet güncellemeleri ve önemli bildirimler göndermek</li>
                <li>Hizmetlerimizi geliştirmek ve özelleştirmek</li>
                <li>Yasal yükümlülükleri yerine getirmek</li>
                <li>Güvenlik ve dolandırıcılık önleme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Bilgilerin Paylaşımı</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Kişisel bilgileriniz aşağıdaki durumlarda üçüncü taraflarla paylaşılabilir:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Hizmet Sağlayıcılar:</strong> Ödeme işleme, hosting, e-posta gönderimi gibi hizmetler için</li>
                <li><strong>Yasal Zorunluluklar:</strong> Yasal süreçler, mahkeme kararları veya resmi talepler durumunda</li>
                <li><strong>İş Transferleri:</strong> Birleşme, satın alma veya varlık satışı durumunda</li>
                <li><strong>Açık Rızanız:</strong> Sizin açık onayınız ile</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Bilgileriniz kesinlikle üçüncü taraflara pazarlama amaçlı satılmaz veya kiralanmaz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Veri Güvenliği</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kişisel bilgilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri kullanıyoruz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-2">
                <li>SSL/TLS şifreleme ile güvenli veri iletimi</li>
                <li>Güvenli sunucu altyapısı</li>
                <li>Düzenli güvenlik güncellemeleri</li>
                <li>Erişim kontrolü ve yetkilendirme</li>
                <li>Veri yedekleme sistemleri</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Çerezler (Cookies)</h2>
              <p className="text-muted-foreground leading-relaxed">
                Web sitemiz, kullanıcı deneyimini iyileştirmek ve hizmetlerimizi optimize etmek için çerezler
                kullanır. Çerezleri tarayıcı ayarlarınızdan yönetebilir veya devre dışı bırakabilirsiniz.
                Ancak bu durumda bazı özellikler düzgün çalışmayabilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Kullanıcı Hakları (KVKK)</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
                <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                <li>Kişisel verilerin silinmesini veya yok edilmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Veri Saklama Süresi</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve yasal saklama yükümlülükleri
                çerçevesinde saklanır. Hesabınızı kapatmanız durumunda, yasal yükümlülükler haricinde
                verileriniz sistemimizden silinir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Üçüncü Taraf Bağlantılar</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hizmetimiz, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu sitelerin gizlilik
                uygulamaları üzerinde kontrolümüz yoktur ve sorumlu değiliz. Bu siteleri ziyaret etmeden
                önce gizlilik politikalarını incelemenizi öneririz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Çocukların Gizliliği</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hizmetlerimiz 18 yaş altındaki bireylere yönelik değildir. Bilerek 18 yaş altındaki
                bireylerden kişisel bilgi toplamıyoruz. Bir ebeveyn veya vasi, çocuğunun bize kişisel
                bilgi verdiğini fark ederse, lütfen bizimle iletişime geçin.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Politika Değişiklikleri</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Önemli değişiklikler olması
                durumunda, web sitemizde veya e-posta yoluyla bildirimde bulunacağız. Değişikliklerin
                yürürlüğe girdiği tarih, sayfanın üst kısmında belirtilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. İletişim</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Gizlilik politikamız veya kişisel verilerinizin işlenmesi hakkında sorularınız için
                bizimle iletişime geçebilirsiniz:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg space-y-1 text-sm">
                <p><strong>Menumgo</strong></p>
                <p>Reis Mahallesi Ulu Önder Caddesi No: 34/1</p>
                <p>Karabağlar / İzmir</p>
                <p>E-posta: info@menumgo.digital</p>
                <p>Telefon: 0545 715 43 05</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-4">
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
