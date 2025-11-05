"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl font-bold mb-4">Kullanım Şartları</h1>
          <p className="text-muted-foreground">Son Güncelleme: 5 Ocak 2025</p>
        </div>

        <Card className="border-2">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Hizmet Tanımı ve Kabul</h2>
              <p className="text-muted-foreground leading-relaxed">
                Menumgo, restoranlar ve yiyecek-içecek işletmeleri için dijital menü oluşturma, yönetme ve
                sipariş alma platformu sağlayan bir SaaS (Software as a Service) hizmetidir. Bu platformu
                kullanarak, bu Kullanım Şartlarını kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız,
                lütfen hizmeti kullanmayın.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Hesap Oluşturma ve Güvenlik</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">2.1. Hesap Gereksinimleri</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Hizmeti kullanmak için 18 yaşında veya üzerinde olmalısınız</li>
                    <li>Doğru, güncel ve eksiksiz bilgiler sağlamalısınız</li>
                    <li>Hesap bilgilerinizi gizli tutmaktan siz sorumlusunuz</li>
                    <li>Hesabınızda gerçekleşen tüm faaliyetlerden siz sorumlusunuz</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">2.2. Hesap Güvenliği</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Hesap bilgilerinizin yetkisiz kullanımından haberdar olursanız, derhal bize bildirmelisiniz.
                    Hesabınızın güvenliğini sağlamak sizin sorumluluğunuzdadır.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Ücretsiz Deneme ve Abonelik</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>3.1. Ücretsiz Deneme:</strong> Yeni kullanıcılara 3 günlük ücretsiz deneme süresi sunulmaktadır.
                Deneme süresi boyunca tüm premium özelliklere erişebilirsiniz. Kredi kartı bilgisi gerekmez.</p>

                <p><strong>3.2. Abonelik Fiyatlandırması:</strong> Deneme süresi sonunda hizmeti kullanmaya devam etmek
                için aylık 299₺ ücret karşılığında abonelik satın alabilirsiniz.</p>

                <p><strong>3.3. Ödeme:</strong> Ödemeler aylık olarak otomatik olarak yenilenir. Fiyatlandırmada
                değişiklik olması durumunda, en az 30 gün önceden bilgilendirileceksiniz.</p>

                <p><strong>3.4. İptal:</strong> Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde,
                mevcut dönem sonuna kadar hizmete erişiminiz devam eder. Kısmi iade yapılmaz.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Kullanım Kuralları</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Hizmetimizi kullanırken aşağıdaki faaliyetleri yapmayı kabul etmezsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Yasadışı, zararlı, tehdit edici, istismarcı, taciz edici, iftira niteliğinde, kaba, müstehcen içerik paylaşmak</li>
                <li>Başka bir kişi veya kuruluşun kimliğine bürünmek</li>
                <li>Virüs, truva atı veya zararlı yazılım yüklemek veya yaymak</li>
                <li>Hizmetin güvenliğini tehlikeye atmak veya sistemlere yetkisiz erişim sağlamaya çalışmak</li>
                <li>Diğer kullanıcıların hizmetten yararlanmasını engellemek</li>
                <li>Telif hakkı, marka veya diğer fikri mülkiyet haklarını ihlal etmek</li>
                <li>Spam göndermek veya toplu e-posta dağıtımı yapmak</li>
                <li>Veri kazıma (scraping) veya otomatik veri toplama araçları kullanmak</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. İçerik ve Fikri Mülkiyet</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>5.1. Kullanıcı İçeriği:</strong> Platforma yüklediğiniz tüm içerikler (menü öğeleri,
                görseller, açıklamalar) sizin sorumluluğunuzdadır. İçeriğinizin yasal haklara sahip olduğunuzu
                garanti edersiniz.</p>

                <p><strong>5.2. İçerik Lisansı:</strong> Platform üzerinden içeriğinizi göstermek için bize
                dünya çapında, telifsiz, alt lisanslanabilir bir lisans vermiş olursunuz.</p>

                <p><strong>5.3. Platform İçeriği:</strong> Menumgo platformu, logosu, tasarımı ve yazılımı dahil
                tüm içerikler Menumgo'nun mülkiyetindedir ve telif hakkı ile korunmaktadır.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Hizmet Garantisi ve Sorumluluk</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>6.1. Hizmet Sürekliliği:</strong> Hizmetimizi kesintisiz ve hatasız sunmak için
                çaba gösteririz, ancak %100 kesintisizlik garanti edemeyiz. Bakım, güncelleme veya teknik
                sorunlar nedeniyle geçici kesintiler yaşanabilir.</p>

                <p><strong>6.2. Sorumluluk Reddi:</strong> Hizmet "OLDUĞU GİBİ" ve "MEVCUT OLDUĞU ŞEKİLDE" sunulur.
                Belirli bir amaca uygunluk, ticari değer veya kesintisiz hizmet konusunda açık veya zımni garanti vermiyoruz.</p>

                <p><strong>6.3. Sorumluluk Sınırı:</strong> Menumgo, hizmetin kullanımından kaynaklanan dolaylı,
                arızi, özel veya sonuç olarak ortaya çıkan zararlardan sorumlu tutulamaz. Toplam sorumluluk,
                son 12 ayda ödediğiniz ücretle sınırlıdır.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Veri Yedekleme</h2>
              <p className="text-muted-foreground leading-relaxed">
                Düzenli veri yedeklemeleri yapsak da, verilerinizi güvende tutmanın nihai sorumluluğu size aittir.
                Menü verilerinizin yerel kopyalarını saklamanızı öneririz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Hesap Askıya Alma ve Sonlandırma</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Aşağıdaki durumlarda hesabınızı askıya alabilir veya sonlandırabiliriz:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Bu Kullanım Şartlarını ihlal etmeniz</li>
                <li>Ödeme yapmamak veya ödeme başarısız olması</li>
                <li>Yasadışı faaliyetler veya kötüye kullanım</li>
                <li>Uzun süreli hareketsizlik (6 ay+)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Hesap sonlandırma durumunda, mevcut dönem için kısmi iade yapılmaz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Değişiklikler</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bu Kullanım Şartlarını herhangi bir zamanda değiştirme hakkını saklı tutarız. Önemli değişiklikler
                için e-posta ile bildirim gönderilir. Değişikliklerden sonra hizmeti kullanmaya devam etmeniz,
                yeni şartları kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Uygulanacak Hukuk</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bu Kullanım Şartları, Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlık durumunda İzmir
                mahkemeleri ve icra daireleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. İletişim</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Kullanım Şartları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
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
              <h2 className="text-2xl font-bold mb-4">12. Genel Hükümler</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bu Kullanım Şartları'nın herhangi bir hükmünün geçersiz veya uygulanamaz olduğuna karar verilmesi,
                diğer hükümlerin geçerliliğini etkilemez. Bu şartlar, taraflar arasındaki tam anlaşmayı temsil eder
                ve önceki tüm anlaşmaların yerine geçer.
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
