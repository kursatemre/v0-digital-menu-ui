# 🚀 Hızlı Test - 5 Dakikada Standart Paket

## 1️⃣ Database Migration (Supabase SQL Editor)

```sql
-- Kopyala yapıştır ve çalıştır:

ALTER TABLE tenants
DROP CONSTRAINT IF EXISTS check_subscription_plan;

ALTER TABLE tenants
ADD CONSTRAINT check_subscription_plan
CHECK (subscription_plan IN ('trial', 'standard', 'premium'));
```

✅ **Başarılı mesajı görmeli**: `ALTER TABLE`

---

## 2️⃣ Mevcut Bir Kullanıcıyı Standart Plana Çevir

```sql
-- SLUG_HERE yerine kendi slug'ınızı yazın
UPDATE tenants
SET
  subscription_plan = 'standard',
  subscription_status = 'active',
  subscription_end_date = NOW() + INTERVAL '30 days'
WHERE slug = 'SLUG_HERE';
```

**Hangi slug'ı kullanacağım?**
```sql
-- Mevcut tenant'ları listele:
SELECT slug, business_name, subscription_plan FROM tenants;
```

---

## 3️⃣ Admin Panele Giriş Yap

1. Tarayıcıda `/admin` sayfasına git
2. Az önce standart plana çevirdiğin kullanıcı ile giriş yap

---

## 4️⃣ Test Et! (30 saniye)

### ❌ Kısıtlı Sekmeler (Dialog açmalı):
- [ ] **Siparişler** sekmesine tıkla → 🔒 Dialog görmeli
- [ ] **Garson Çağrıları** sekmesine tıkla → 🔒 Dialog görmeli
- [ ] **QR Kod** sekmesine tıkla → 🔒 Dialog görmeli

### ✅ Açık Sekmeler (Normal çalışmalı):
- [ ] **Ürünler** sekmesi açılmalı
- [ ] **Kategoriler** sekmesi açılmalı
- [ ] **Görünüm** sekmesi açılmalı
- [ ] **Ayarlar** sekmesi açılmalı

---

## 5️⃣ Payment Sayfasını Test Et

1. Browser'da `/{slug}/payment` sayfasına git
2. **3 plan kartı görmelisin**:
   - 📦 Standart Plan
   - 💎 Premium Aylık
   - 👑 Premium Yıllık

---

## ✅ Hepsi Tamam mı?

**EVET** ise → Tebrikler! Standart paket kısıtlamaları çalışıyor 🎉

**HAYIR** ise → Console (F12) ve Supabase logs'a bak, hata varsa raporla

---

## 🔄 Geri Almak İstersen (Premium'a Çevir)

```sql
UPDATE tenants
SET subscription_plan = 'premium'
WHERE slug = 'SLUG_HERE';
```

Sayfayı yenile (F5) → Tüm sekmeler açılmalı!
