# Kayıt Sorunları Çözüm Rehberi

Bu döküman, kayıt sırasında karşılaşılan yaygın hataları ve çözümlerini içerir.

## 🔴 Yaygın Hatalar

### 1. 409 Conflict Error - "Tenant creation error"

```
Error: 409 Conflict
Code: 23505
Message: duplicate key value violates unique constraint
```

**Sebep:** Aynı e-posta veya slug ile daha önce kayıt yapılmış.

**Çözüm A: Farklı Email/Slug Kullan**
- Farklı bir e-posta adresi deneyin
- Farklı bir restoran adı (slug) deneyin

**Çözüm B: Eski Kaydı Temizle (Development)**

Supabase Dashboard'da:

```sql
-- 1. Önce tenant ID'yi bulun
SELECT id, slug, owner_email, auth_user_id
FROM tenants
WHERE owner_email = 'test@example.com'
   OR slug = 'test-restaurant';

-- 2. İlgili kayıtları silin (tenant_id'yi yukarıdan alın)
DELETE FROM admin_users WHERE tenant_id = 'xxx-xxx-xxx';
DELETE FROM products WHERE tenant_id = 'xxx-xxx-xxx';
DELETE FROM categories WHERE tenant_id = 'xxx-xxx-xxx';
DELETE FROM tenants WHERE id = 'xxx-xxx-xxx';

-- 3. Auth user'ı silin (eğer varsa)
-- Authentication -> Users sekmesinden manuel silin
-- veya
DELETE FROM auth.users WHERE email = 'test@example.com';
```

**Çözüm C: Toplu Temizlik**

Tüm test kayıtlarını silmek için:

```sql
-- DİKKAT: Bu tüm kayıtları siler! Sadece development'ta kullanın!

-- Admin users
DELETE FROM admin_users;

-- Products
DELETE FROM products;

-- Categories
DELETE FROM categories;

-- Tenants
DELETE FROM tenants;

-- Auth users (opsiyonel)
-- Authentication -> Users -> Bulk delete
```

---

### 2. 406 Not Acceptable - Slug Check Error

```
Error: 406 Not Acceptable
Failed to load resource: qkinoffxqrthktwxzejs.supabase.co/rest/v1/tenants?select=slug&slug=eq.tester
```

**Sebep:** `.single()` kullanıldığında kayıt yoksa 406 hatası dönüyor.

**Çözüm:** ✅ Artık düzeltildi! `count` kullanıyoruz.

Kod güncellendi:
```typescript
// Eski (hatalı):
const { data } = await supabase.from("tenants").select("slug").eq("slug", slug).single()

// Yeni (doğru):
const { count } = await supabase.from("tenants").select("slug", { count: "exact", head: true }).eq("slug", slug)
```

---

### 3. Duplicate Admin User

```
Error: duplicate key value violates unique constraint "admin_users_username_key"
```

**Sebep:** `createDemoData` zaten admin user oluşturuyor, tekrar oluşturuluyordu.

**Çözüm:** ✅ Artık düzeltildi! Duplicate admin user kaldırıldı.

---

### 4. Email Confirmation Disabled

```
⚠️ UYARI: E-posta onayı Supabase'de kapalı! Hesap direkt aktif oldu.
```

**Sebep:** Supabase'de e-posta onayı kapalı.

**Çözüm:**

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. ✅ **Enable email confirmations** seçeneğini AÇ
3. **Save** butonuna tıkla

Detaylı rehber: [SUPABASE_EMAIL_CONFIRMATION.md](./SUPABASE_EMAIL_CONFIRMATION.md)

---

### 5. SMTP Not Configured

```
Error: Failed to send email
```

**Sebep:** SMTP ayarları yapılmamış.

**Çözüm:**

**Hızlı (Test için):**
- Supabase varsayılan SMTP'sini kullan (günlük 4 e-posta limit)

**Önerilen (Production):**
- Resend.com ile SMTP yapılandır
- Detaylı rehber: [RESEND_SUPABASE_INTEGRATION.md](./RESEND_SUPABASE_INTEGRATION.md)

---

## 🧪 Test Senaryoları

### Senaryo 1: İlk Kayıt

**Adımlar:**
1. http://localhost:3000/register
2. Form doldur:
   - İşletme Adı: Test Restaurant
   - Restoran URL: test-restaurant
   - E-posta: test@example.com
3. Kayıt Ol

**Beklenen Sonuç:**
- ✅ `/auth/confirm-email` sayfasına yönlendirme
- ✅ E-posta gönderilmesi
- ✅ Console'da hata olmaması

**Sorun giderme:**
- Console'da hata var mı?
- Network tab'da 409 veya 406 var mı?
- Supabase'de tenant oluştu mu?

---

### Senaryo 2: Duplicate Email

**Adımlar:**
1. Aynı e-posta ile tekrar kayıt ol

**Beklenen Sonuç:**
- ❌ Hata mesajı: "Bu e-posta adresi zaten kayıtlı."

**Sorun giderme:**
- Hata mesajı gösteriliyor mu?
- Kullanıcı bilgilendirildi mi?

---

### Senaryo 3: Duplicate Slug

**Adımlar:**
1. Farklı e-posta ama aynı slug ile kayıt ol

**Beklenen Sonuç:**
- ❌ Form slug alanında: "Bu URL kullanılıyor"
- ❌ Kayıt buton disabled

**Sorun giderme:**
- Slug availability check çalışıyor mu?
- Yeşil/kırmızı işaret görünüyor mu?

---

## 🔍 Debug Checklist

Kayıt işlemi başarısız oluyorsa:

### 1. Browser Console
```javascript
// F12 → Console
// Hata mesajlarını kontrol et
```

**Kontrol et:**
- [ ] Kırmızı error mesajları var mı?
- [ ] 406, 409, 500 gibi HTTP hataları var mı?
- [ ] Console.log çıktıları doğru mu?

### 2. Network Tab
```
F12 → Network → Fetch/XHR
```

**Kontrol et:**
- [ ] `/rest/v1/tenants` (POST) başarılı mı?
- [ ] Status code nedir? (200 OK, 409 Conflict?)
- [ ] Response body'de hata detayı var mı?

### 3. Supabase Dashboard

**Table Editor → tenants:**
- [ ] Yeni kayıt oluştu mu?
- [ ] `is_active` false mu?
- [ ] `auth_user_id` dolu mu?
- [ ] `slug` doğru mu?

**Authentication → Users:**
- [ ] Yeni user oluştu mu?
- [ ] Email confirmed_at null mu? (email onay bekliyor)
- [ ] User metadata doğru mu?

### 4. Database Logs

Supabase Dashboard → **Logs** → **Database**:
- [ ] Constraint violation var mı?
- [ ] Foreign key error var mı?
- [ ] Permission error var mı?

---

## 🛠️ Manuel Test Script

Kayıt işlemini terminal'den test etmek için:

```javascript
// Browser Console'da çalıştırın

// 1. Supabase client oluştur
const { createClient } = await import('./utils/supabase/client')
const supabase = createClient()

// 2. Kayıt dene
const { data, error } = await supabase.auth.signUp({
  email: 'test2@example.com',
  password: 'test123456',
  options: {
    emailRedirectTo: 'http://localhost:3000/auth/confirm',
    data: {
      business_name: 'Test Restaurant 2',
      owner_name: 'Test Owner',
      slug: 'test-restaurant-2'
    }
  }
})

console.log('Auth signup result:', { data, error })

// 3. Tenant oluştur
if (data.user) {
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({
      slug: 'test-restaurant-2',
      business_name: 'Test Restaurant 2',
      owner_name: 'Test Owner',
      owner_email: 'test2@example.com',
      auth_user_id: data.user.id,
      subscription_status: 'trial',
      subscription_plan: 'trial',
      is_active: false,
      trial_end_date: null
    })
    .select()
    .single()

  console.log('Tenant creation result:', { tenant, tenantError })
}
```

---

## 📊 Common Patterns

### Pattern 1: Email Already Exists

```
Supabase Auth Error: User already registered
```

**Ne yapmalı:**
- Kullanıcıya friendly mesaj göster
- "Giriş yapmayı deneyin" linki ver
- "Şifremi unuttum" seçeneği sun

### Pattern 2: Slug Already Taken

```
Database Error: duplicate key "tenants_slug_key"
```

**Ne yapmalı:**
- Alternatif slug öner: `restaurant-2`, `restaurant-3`
- Real-time availability check göster
- Auto-increment öner

### Pattern 3: Network Timeout

```
Error: Network request failed
```

**Ne yapmalı:**
- "Bağlantı sorunu" mesajı göster
- Retry butonu ekle
- Loading state göster

---

## 🚨 Production Checklist

Canlıya almadan önce:

### Email Verification
- [ ] Enable email confirmations AÇIK
- [ ] SMTP configured (Resend)
- [ ] Email templates özelleştirildi
- [ ] Test email sent and received

### Database
- [ ] RLS policies aktif
- [ ] Unique constraints doğru
- [ ] Foreign keys tanımlı
- [ ] Indexes oluşturuldu

### Error Handling
- [ ] Tüm error mesajları kullanıcı dostu
- [ ] Console errors production'da disabled
- [ ] Sentry/error tracking kuruldu
- [ ] Rate limiting var

### Security
- [ ] SQL injection koruması
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Password hashing

---

## 📞 Destek

Hala sorun yaşıyorsanız:

1. **GitHub Issues:** [Proje Issues](https://github.com/your-repo/issues)
2. **Supabase Discord:** https://discord.supabase.com
3. **Resend Support:** support@resend.com

---

**Son Güncelleme:** 2025-01-05
**Versiyon:** 1.0
