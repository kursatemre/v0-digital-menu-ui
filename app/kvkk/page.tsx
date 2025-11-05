"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function KVKKPage() {
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
          <h1 className="text-4xl font-bold mb-4">KVKK Aydınlatma Metni</h1>
          <p className="text-muted-foreground">
            Kişisel Verilerin Korunması Kanunu Aydınlatma Metni
          </p>
          <p className="text-muted-foreground">Son Güncelleme: 5 Ocak 2025</p>
        </div>

        <Card className="border-2">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Veri Sorumlusu</h2>
              <div className="bg-slate-50 p-4 rounded-lg space-y-1 text-sm mb-4">
                <p><strong>Menumgo</strong></p>
                <p>Reis Mahallesi Ulu Önder Caddesi No: 34/1</p>
                <p>Karabağlar / İzmir</p>
                <p>E-posta: info@menumgo.digital</p>
                <p>Telefon: 0545 715 43 05</p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz,
                veri sorumlusu sıfatıyla Menumgo tarafından aşağıda açıklanan kapsamda işlenecektir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">1. İşlenen Kişisel Veriler</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Hizmetlerimizi kullanırken aşağıdaki kişisel verileriniz işlenmektedir:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Kimlik Bilgileri</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Ad, soyad</li>
                    <li>T.C. kimlik numarası (ticari müşteriler için gerektiğinde)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">İletişim Bilgileri</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>E-posta adresi</li>
                    <li>Telefon numarası</li>
                    <li>Adres bilgileri</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Müşteri İşlem Bilgileri</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Hesap bilgileri ve kullanıcı adı</li>
                    <li>Restoran/işletme bilgileri</li>
                    <li>İşlem geçmişi</li>
                    <li>Sipariş bilgileri</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Finansal Bilgiler</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Ödeme bilgileri (kredi kartı bilgileri güvenli ödeme sağlayıcıları tarafından işlenir)</li>
                    <li>Fatura bilgileri</li>
                    <li>Banka hesap bilgileri (gerektiğinde)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">İşlem Güvenliği Bilgileri</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>IP adresi</li>
                    <li>Çerez kayıtları</li>
                    <li>Giriş çıkış bilgileri</li>
                    <li>Cihaz bilgileri</li>
                    <li>Konum bilgileri</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Pazarlama Bilgileri</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Çerez kayıtları</li>
                    <li>Alışveriş geçmişi</li>
                    <li>İlgi alanları ve tercihler</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Görsel ve İşitsel Kayıtlar</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Profil fotoğrafları</li>
                    <li>Ürün görselleri</li>
                    <li>Logo ve marka görselleri</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Kişisel Verilerin İşlenme Amaçları</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Hizmet sözleşmesinin kurulması ve ifası</li>
                <li>Dijital menü platformu hizmetlerinin sunulması</li>
                <li>Kullanıcı hesabı oluşturma ve yönetimi</li>
                <li>Sipariş işlemlerinin gerçekleştirilmesi ve takibi</li>
                <li>Ödeme ve faturalandırma işlemlerinin yürütülmesi</li>
                <li>Müşteri ilişkileri yönetimi ve destek hizmetleri</li>
                <li>İletişim faaliyetlerinin yürütülmesi</li>
                <li>Hizmet kalitesinin ölçülmesi ve iyileştirilmesi</li>
                <li>Kullanıcı deneyiminin geliştirilmesi</li>
                <li>Bilgi güvenliğinin sağlanması</li>
                <li>Yetkisiz erişim ve dolandırıcılık önleme</li>
                <li>İstatistiksel analiz ve raporlama</li>
                <li>Pazarlama ve tanıtım faaliyetleri (açık rızanız ile)</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>Yetkili kurum ve kuruluşlara bilgi verilmesi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Kişisel Verilerin Toplanma Yöntemi</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Kişisel verileriniz aşağıdaki yöntemlerle toplanmaktadır:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Web sitesi ve mobil uygulama üzerinden online formlar</li>
                <li>E-posta, telefon veya WhatsApp ile iletişim</li>
                <li>Hesap oluşturma ve kayıt süreçleri</li>
                <li>Hizmet kullanımı sırasında otomatik toplama (çerezler, log kayıtları)</li>
                <li>Ödeme işlemleri sırasında</li>
                <li>Müşteri destek talepleri</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Kişisel Verilerin Aktarımı</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Kişisel verileriniz, KVKK'nın 8. ve 9. maddelerinde belirtilen ilkeler çerçevesinde
                aşağıdaki taraflara aktarılabilir:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Yurt İçi Aktarım</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>İş ortaklarımıza (ödeme kuruluşları, hosting sağlayıcılar)</li>
                    <li>Hukuk ve vergi danışmanlarımıza</li>
                    <li>Denetim ve muhasebe firmalarına</li>
                    <li>Yetkili kamu kurum ve kuruluşlarına (yasal zorunluluk halinde)</li>
                    <li>Mahkeme ve icra müdürlüklerine (yasal zorunluluk halinde)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Yurt Dışı Aktarım</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Kişisel verileriniz, sunucu hizmetleri ve bulut altyapı hizmetleri kapsamında
                    yurt dışına aktarılabilir. Yurt dışı aktarımlar KVKK'nın 9. maddesi uyarınca
                    gerçekleştirilir ve veri güvenliği sağlanır.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Kişisel Veri Toplamanın Hukuki Sebepleri</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Kişisel verileriniz KVKK'nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere
                dayanılarak işlenmektedir:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Açık rızanızın bulunması</li>
                <li>Sözleşmenin kurulması veya ifası için gerekli olması</li>
                <li>Yasal yükümlülüğün yerine getirilmesi</li>
                <li>İlgili kişinin kendisi tarafından alenileştirilmiş olması</li>
                <li>Bir hakkın tesisi, kullanılması veya korunması için zorunlu olması</li>
                <li>Meşru menfaatimiz için veri işlemenin zorunlu olması</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Kişisel Veri Sahibinin Hakları</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                KVKK'nın 11. maddesi uyarınca kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
                <li>Kişisel verilerin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
                <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</li>
                <li>Düzeltme, silme ve yok edilme işlemlerinin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Başvuru Yöntemi</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Yukarıda belirtilen haklarınızı kullanmak için başvurunuzu aşağıdaki yöntemlerle iletebilirsiniz:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Yazılı Başvuru</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Kimliğinizi tespit edici belgeler ile birlikte aşağıdaki adrese yazılı olarak başvurabilirsiniz:
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg text-sm mt-2">
                    <p>Menumgo</p>
                    <p>Reis Mahallesi Ulu Önder Caddesi No: 34/1</p>
                    <p>Karabağlar / İzmir</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Elektronik Başvuru</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da
                    Menumgo sistemine kayıtlı olan e-posta adresinizi kullanarak:
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg text-sm mt-2">
                    <p>E-posta: info@menumgo.digital</p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mt-4">
                  Başvurularınız, talebin niteliğine göre en kısa sürede ve en geç 30 (otuz) gün içinde
                  ücretsiz olarak sonuçlandırılacaktır. İşlemin ayrıca bir maliyeti gerektirmesi halinde,
                  Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret alınabilir.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Veri Güvenliği</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kişisel verilerinizin güvenliğini sağlamak için KVKK ve ilgili mevzuatta öngörülen
                idari ve teknik tedbirleri almaktayız. Kişisel verilerinizin hukuka aykırı işlenmesini,
                verilere hukuka aykırı erişilmesini ve verilerin hukuka aykırı ifşasını önlemek için
                gerekli tüm teknik ve idari tedbirleri alıyoruz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. İletişim</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                KVKK Aydınlatma Metni ile ilgili sorularınız için:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg space-y-1 text-sm">
                <p><strong>Menumgo</strong></p>
                <p>Reis Mahallesi Ulu Önder Caddesi No: 34/1</p>
                <p>Karabağlar / İzmir</p>
                <p>E-posta: info@menumgo.digital</p>
                <p>Telefon: 0545 715 43 05</p>
              </div>
            </section>

            <section>
              <p className="text-sm text-muted-foreground italic">
                Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili mevzuat
                hükümlerine uygun olarak hazırlanmıştır. Aydınlatma metni, yasal düzenlemelerdeki
                değişiklikler doğrultusunda güncellenebilir.
              </p>
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
