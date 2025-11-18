# 📋 Standart Paket Test Rehberi

Bu rehber, standart paket kısıtlamalarını test etmek için adım adım talimatlar içerir.

## 🗄️ 1. Database Migration (Gerekli)

### Adım 1.1: Migration Script'i Çalıştır

Supabase Dashboard → SQL Editor'e gidin ve aşağıdaki script'i çalıştırın:

```sql
-- 030_add_standard_subscription_plan.sql içeriği
ALTER TABLE tenants
DROP CONSTRAINT IF EXISTS check_subscription_plan;

ALTER TABLE tenants
ADD CONSTRAINT check_subscription_plan
CHECK (subscription_plan IN ('trial', 'standard', 'premium'));

COMMENT ON COLUMN tenants.subscription_plan IS 'Subscription plan type: trial, standard, or premium. Always set, never NULL.';
```

✅ **Beklenen Sonuç**: Migration başarıyla çalışmalı, hata vermemeli.

---

## 👤 2. Test Kullanıcısı Oluşturma

### Seçenek A: Yeni Kayıt ile Test (Önerilen)

1. **Kayıt Sayfasına Git**: `/register`
2. **Yeni Bir Restoran Kaydı Oluştur**:
   - Business Name: "Standart Test Restaurant"
   - Slug: "standard-test"
   - Email: "standard-test@example.com"
   - Password: "Test123456"
3. **Email Doğrulama**: Email'i doğrulayın
4. **Standart Plana Geç**:

```sql
-- Supabase SQL Editor'de çalıştırın
UPDATE tenants
SET
  subscription_plan = 'standard',
  subscription_status = 'active',
  subscription_end_date = NOW() + INTERVAL '30 days'
WHERE slug = 'standard-test';
```

### Seçenek B: Mevcut Kullanıcıyı Standart Plana Çevir

```sql
-- Supabase SQL Editor'de çalıştırın
-- YOUR_TENANT_ID yerine gerçek tenant ID'yi yazın
UPDATE tenants
SET
  subscription_plan = 'standard',
  subscription_status = 'active'
WHERE id = 'YOUR_TENANT_ID';
```

---

## 🧪 3. Test Senaryoları

### Test 1: Admin Panele Giriş ✅

**Adımlar**:
1. `/admin` sayfasına git
2. Standart paketli kullanıcı ile giriş yap

**Beklenen Sonuç**:
- ✅ Giriş başarılı olmalı
- ✅ Admin panel açılmalı
- ✅ Default olarak "Ürünler" sekmesi aktif olmalı (eskiden "Siparişler" idi)

---

### Test 2: Kısıtlı Sekmelerde Kilit İkonu 🔒

**Adımlar**:
1. Admin panelin sol menüsüne bak
2. Aşağıdaki sekmeleri kontrol et:
   - Siparişler
   - Garson Çağrıları
   - QR Kod

**Beklenen Sonuç**:
- ✅ Bu 3 sekmede 🔒 kilit ikonu görünmeli
- ✅ Sekmeler soluk (disabled) görünümlü olmalı
- ✅ Diğer sekmeler normal görünmeli

---

### Test 3: Sipariş Sekmesine Tıklama ❌

**Adımlar**:
1. Sol menüden "Siparişler" sekmesine tıkla

**Beklenen Sonuç**:
- ✅ Sekme açılMAMALI
- ✅ Upgrade dialog'u görünmeli
- ✅ Dialog içeriği:
  - Başlık: "Sipariş Yönetimi Özelliği Kilitli"
  - Açıklama: "Bu özellik Standart paketinizde bulunmamaktadır"
  - Premium paket avantajları listesi
  - "Premium'a Yükselt" butonu
  - "Daha Sonra" butonu

---

### Test 4: Garson Çağırma Sekmesine Tıklama ❌

**Adımlar**:
1. Sol menüden "Garson Çağrıları" sekmesine tıkla

**Beklenen Sonuç**:
- ✅ Sekme açılMAMALI
- ✅ Upgrade dialog'u görünmeli
- ✅ Başlık: "Garson Çağırma Özelliği Kilitli"

---

### Test 5: QR Kod Sekmesine Tıklama ❌

**Adımlar**:
1. Sol menüden "QR Kod" sekmesine tıkla

**Beklenen Sonuç**:
- ✅ Sekme açılMAMALI
- ✅ Upgrade dialog'u görünmeli
- ✅ Başlık: "QR Kod Oluşturma Özelliği Kilitli"

---

### Test 6: İzin Verilen Sekmelere Erişim ✅

**Adımlar**:
1. Aşağıdaki sekmelere sırayla tıkla:
   - Ürünler
   - Kategoriler
   - Görünüm
   - Ayarlar

**Beklenen Sonuç**:
- ✅ TÜM sekmeler normal açılmalı
- ✅ Hiçbir kısıtlama olmamalı
- ✅ İçerik düzenleme yapılabilmeli

---

### Test 7: Ürün Ekleme/Düzenleme ✅

**Adımlar**:
1. "Ürünler" sekmesine git
2. "Yeni Ürün" butonuna tıkla
3. Ürün bilgilerini doldur ve kaydet

**Beklenen Sonuç**:
- ✅ Ürün başarıyla eklenmeli
- ✅ Hiçbir kısıtlama olmamalı

---

### Test 8: Tema Özelleştirme ✅

**Adımlar**:
1. "Görünüm" sekmesine git
2. Renk ayarlarını değiştir
3. Kaydet

**Beklenen Sonuç**:
- ✅ Tema başarıyla değişmeli
- ✅ Hiçbir kısıtlama olmamalı

---

### Test 9: Premium'a Yükselt Butonu 🔄

**Adımlar**:
1. Kısıtlı bir sekmeye tıkla (örn: Siparişler)
2. Upgrade dialog'unda "Premium'a Yükselt" butonuna tıkla

**Beklenen Sonuç**:
- ✅ Payment sayfasına yönlendirilmeli: `/[slug]/payment`
- ✅ Sayfa açılmalı

---

### Test 10: Payment Sayfası - 3 Plan Seçeneği 💳

**Adımlar**:
1. Payment sayfasına git: `/standard-test/payment`
2. Plan seçeneklerini kontrol et

**Beklenen Sonuç**:
- ✅ 3 plan kartı görünmeli:
  1. **Standart Plan**
     - Fiyat: Premium'un %50'si
     - ✓ Sınırsız ürün ve kategori
     - ✓ Tema özelleştirme
     - ✗ Sipariş yönetimi
     - ✗ Garson çağırma
     - ✗ QR kod oluşturma

  2. **Premium Aylık**
     - İlk ay %50 indirim
     - Tüm özellikler dahil

  3. **Premium Yıllık**
     - "EN AVANTAJLI" badge'i
     - 2 ay bedava

---

### Test 11: Standart Plan Seçimi ve Ödeme 💳

**Adımlar**:
1. Payment sayfasında "Standart Plan" seç
2. Fatura bilgilerini doldur
3. Ödeme ekranının yüklenmesini bekle

**Beklenen Sonuç**:
- ✅ Ödeme özeti:
  - "Seçilen Plan: Standart"
  - Toplam tutar doğru hesaplanmış olmalı
- ✅ PayTR iframe yüklenmeli
- ✅ Test ödeme yapılabilmeli

---

### Test 12: Premium Aylık Plan Seçimi 💳

**Adımlar**:
1. Payment sayfasında "Premium Aylık" seç
2. Ödeme özetini kontrol et

**Beklenen Sonuç**:
- ✅ Ödeme özeti:
  - "Seçilen Plan: Premium Aylık"
  - İndirim: -%50 (İlk Ay)
  - Toplam tutar doğru

---

### Test 13: Premium Yıllık Plan Seçimi 💳

**Adımlar**:
1. Payment sayfasında "Premium Yıllık" seç
2. Ödeme özetini kontrol et

**Beklenen Sonuç**:
- ✅ Ödeme özeti:
  - "Seçilen Plan: Premium Yıllık"
  - Tasarruf: ₺XXX (2 Ay Bedava)
  - Toplam tutar doğru

---

### Test 14: Standart Plan Ödeme Sonrası 🎉

**Adımlar**:
1. Standart plan için test ödemesi yap
2. Ödeme başarılı olsun
3. Admin panele geri dön

**Beklenen Sonuç**:
- ✅ Tenant `subscription_plan` = 'standard' olmalı
- ✅ Admin panelde hala kısıtlamalar olmalı
- ✅ Sipariş, Garson, QR sekmeleri hala kilitli

---

### Test 15: Premium Ödeme Sonrası 🎉

**Adımlar**:
1. Premium plan için ödeme yap
2. Ödeme başarılı olsun
3. Admin panele geri dön

**Beklenen Sonuç**:
- ✅ Tenant `subscription_plan` = 'premium' olmalı
- ✅ Admin panelde hiçbir kısıtlama OLMAMALI
- ✅ TÜM sekmeler açılabilir olmalı
- ✅ Kilit ikonları kaybolmalı

---

## 🔍 Test Sorguları (SQL)

### Tenant Durumunu Kontrol Et

```sql
SELECT
  slug,
  business_name,
  subscription_plan,
  subscription_status,
  subscription_end_date
FROM tenants
WHERE slug = 'standard-test';
```

### Tüm Planları Gör

```sql
SELECT
  subscription_plan,
  COUNT(*) as count
FROM tenants
GROUP BY subscription_plan
ORDER BY subscription_plan;
```

### Ödeme İşlemlerini Kontrol Et

```sql
SELECT
  merchant_oid,
  payment_status,
  payment_amount,
  order_details->>'subscription_plan' as plan,
  created_at
FROM payment_transactions
WHERE tenant_id = 'YOUR_TENANT_ID'
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🐛 Bilinen Sorunlar / Notlar

1. **Migration Gerekli**: Database'de migration çalıştırılmazsa constraint hatası alınır
2. **Cache**: Bazen browser cache temizlemek gerekebilir
3. **Auth**: Supabase auth kullanıcısı ile tenant'ı eşleştirmeyi unutmayın

---

## ✅ Test Checklist

- [ ] Database migration çalıştırıldı
- [ ] Test kullanıcısı oluşturuldu
- [ ] Admin panel girişi yapıldı
- [ ] Kısıtlı sekmelerde kilit ikonu görüldü
- [ ] Upgrade dialog'u test edildi
- [ ] İzin verilen sekmeler çalışıyor
- [ ] Payment sayfasında 3 plan görüldü
- [ ] Standart plan seçimi çalışıyor
- [ ] Premium plan seçimi çalışıyor
- [ ] Ödeme sonrası plan aktivasyonu çalışıyor

---

## 📞 Sorun mu var?

Sorun yaşarsanız:
1. Browser console'u kontrol edin (F12)
2. Supabase logs'u kontrol edin
3. Network tab'inde API çağrılarını inceleyin

---

**Test Tarihi**: _____________________

**Test Eden**: _____________________

**Sonuç**: ⭐️ Başarılı / ❌ Başarısız / ⚠️ Kısmi
