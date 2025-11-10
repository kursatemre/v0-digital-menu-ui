# E-posta Doğrulama ve Şifre Sıfırlama Kurulumu

Bu dokümantasyon, Menumgo projesi için e-posta doğrulama ve şifre sıfırlama özelliklerinin nasıl yapılandırılacağını açıklar.

## 📧 Yeni Eklenen Sayfalar

### 1. Şifremi Unuttum Sayfası
**URL:** `/auth/forgot-password`

Kullanıcıların şifrelerini sıfırlamak için e-posta talep edebilecekleri sayfa.

**Özellikler:**
- E-posta adresi girişi
- Supabase Auth `resetPasswordForEmail` fonksiyonu kullanımı
- Başarı/hata durumları
- Spam klasörü hatırlatması

### 2. Şifre Sıfırlama Sayfası
**URL:** `/auth/reset-password`

E-posta ile gelen link üzerinden yeni şifre oluşturma sayfası.

**Özellikler:**
- Token doğrulama (access_token + type=recovery)
- Yeni şifre girişi (2 kez)
- Şifre göster/gizle
- Güvenlik kontrolleri
- Otomatik ana sayfaya yönlendirme

### 3. Aktivasyon E-postası Tekrar Gönderme
**URL:** `/auth/resend-confirmation`

Kayıt sonrası aktivasyon e-postası almayan kullanıcılar için.

**Özellikler:**
- Supabase Auth `resend` fonksiyonu
- E-posta doğrulama kontrolü
- Kullanıcı bulunamadı kontrolü

### 4. Güncellenmiş Sayfalar

#### Ana Sayfa (`/page.tsx`)
Restoran giriş dialog'una eklenenler:
- "Şifremi unuttum" linki
- "E-posta onayı alamadınız mı? Tekrar gönder" linki

#### E-posta Onay Bekleme Sayfası (`/auth/confirm-email`)
- "Tekrar gönder" butonu → `/auth/resend-confirmation` linkine dönüştürüldü

---

## 🔧 Supabase Konfigürasyonu

### Gerekli Ayarlar

Supabase Dashboard'a gidin ve aşağıdaki adımları izleyin:

#### 1. E-posta Onayını Aktifleştirin

```
Supabase Dashboard → Authentication → Providers → Email
```

✅ **Enable email confirmations** seçeneğini açın

Bu ayar aktif olduğunda:
- Yeni kayıtlar otomatik aktif olmaz
- Kullanıcılara e-posta doğrulama linki gönderilir
- Link tıklanana kadar hesap aktif edilmez

#### 2. E-posta Şablonlarını Özelleştirin

```
Supabase Dashboard → Authentication → Email Templates
```

**Confirm signup** şablonu:
```html
<h2>E-postanızı Onaylayın</h2>
<p>Menumgo'ya hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın.</p>
<p><a href="{{ .ConfirmationURL }}">E-postamı Onayla</a></p>
<p>3 günlük ücretsiz deneme süreniz, e-postanızı onayladıktan sonra başlayacaktır.</p>
<p>Eğer bu kayıt talebini siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
```

**Reset password** şablonu:
```html
<h2>Şifre Sıfırlama</h2>
<p>Menumgo hesabınız için şifre sıfırlama talebi aldık.</p>
<p><a href="{{ .ConfirmationURL }}">Şifremi Sıfırla</a></p>
<p>Bu link 1 saat içinde geçerliliğini yitir academic.</p>
<p>Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
```

#### 3. Redirect URL'leri Ayarlayın

```
Supabase Dashboard → Authentication → URL Configuration
```

**Redirect URLs** listesine ekleyin:
```
http://localhost:3000/auth/confirm
http://localhost:3000/auth/reset-password
https://menumgo.digital/auth/confirm
https://menumgo.digital/auth/reset-password
```

**Site URL:**
```
https://menumgo.digital
```

(Development'ta: `http://localhost:3000`)

#### 4. SMTP Ayarları (Opsiyonel - Önerilir)

Supabase'in varsayılan SMTP servisi sınırlıdır. Production'da kendi SMTP servisinizi kullanmanız önerilir.

**Önerilen Servisler:**
- **Resend.com** (Supabase ile entegre, docs/RESEND_SUPABASE_INTEGRATION.md'ye bakın)
- SendGrid
- AWS SES
- Mailgun

```
Supabase Dashboard → Project Settings → Auth → SMTP Settings
```

Resend.com için:
```
SMTP Host: smtp.resend.com
SMTP Port: 465
SMTP User: resend
SMTP Password: [Resend API Key]
Sender Email: noreply@menumgo.digital
Sender Name: Menumgo
```

---

## 🔄 Akışlar (Flows)

### 1. Kayıt ve E-posta Onayı Akışı

```
1. Kullanıcı /register sayfasında kayıt olur
   ↓
2. Supabase Auth kullanıcı oluşturur (email_confirmed: false)
   ↓
3. Tenant kaydı oluşturulur (is_active: false, trial başlamaz)
   ↓
4. Kullanıcı /auth/confirm-email sayfasına yönlendirilir
   ↓
5. Supabase otomatik e-posta gönderir
   ↓
6. Kullanıcı e-postadaki linke tıklar
   ↓
7. /auth/confirm sayfası açılır
   ↓
8. Token doğrulanır
   ↓
9. Tenant aktif edilir (is_active: true)
   ↓
10. 3 günlük trial başlatılır (trial_end_date)
   ↓
11. Kullanıcı admin paneline yönlendirilir (/{slug}/admin)
```

### 2. Şifre Sıfırlama Akışı

```
1. Kullanıcı ana sayfada "Şifremi unuttum" tıklar
   ↓
2. /auth/forgot-password açılır
   ↓
3. E-posta adresi girilir
   ↓
4. Supabase resetPasswordForEmail çağrılır
   ↓
5. Şifre sıfırlama e-postası gönderilir
   ↓
6. Kullanıcı e-postadaki linke tıklar
   ↓
7. /auth/reset-password açılır (URL'de access_token var)
   ↓
8. Token doğrulanır
   ↓
9. Yeni şifre girilir
   ↓
10. Supabase updateUser({ password }) çağrılır
   ↓
11. Şifre güncellenir
   ↓
12. Kullanıcı ana sayfaya yönlendirilir
```

### 3. E-posta Tekrar Gönderme Akışı

```
1. Kullanıcı /auth/resend-confirmation açar
   ↓
2. Kayıt olduğu e-postayı girer
   ↓
3. Supabase resend({ type: 'signup' }) çağrılır
   ↓
4. Yeni aktivasyon e-postası gönderilir
   ↓
5. Kullanıcı e-postayı kontrol eder
   ↓
6. Normal aktivasyon akışı devam eder
```

---

## 🧪 Test Etme

### Development Ortamında Test

#### 1. E-posta Onayını Kapatarak Test (Hızlı)

Supabase'de email confirmation'ı kapatın:
```
Authentication → Providers → Email
☐ Enable email confirmations (kapalı)
```

Kayıt olunca otomatik aktif olur, 3 günlük trial başlar.

#### 2. E-posta Onayıyla Test (Production gibi)

Supabase'de email confirmation'ı açın:
```
Authentication → Providers → Email
☑ Enable email confirmations (açık)
```

**E-postaları görüntüleme:**

Supabase Dashboard:
```
Authentication → Email Templates → Preview
```

Veya Inbucket kullanın:
```bash
docker run -d -p 9000:9000 -p 2500:2500 inbucket/inbucket
```

Supabase SMTP ayarları:
```
Host: localhost
Port: 2500
```

E-postaları görmek için: `http://localhost:9000`

#### 3. Şifre Sıfırlama Testi

1. Ana sayfada "Restoran Girişi" → "Şifremi unuttum"
2. Kayıtlı e-posta girin
3. Supabase Dashboard → Authentication → Logs kontrol edin
4. E-postadaki linke tıklayın (veya manuel URL oluşturun)
5. Yeni şifre girin
6. Giriş yapmayı deneyin

#### 4. Aktivasyon E-postası Tekrar Gönderme Testi

1. `/auth/resend-confirmation` açın
2. Kayıtlı e-posta girin
3. Başarı mesajı kontrol edin
4. Supabase Logs'da e-posta gönderimini kontrol edin

---

## ⚠️ Bilinen Sorunlar ve Çözümler

### Sorun 1: E-posta Gelmiyor

**Olası Sebepler:**
- SMTP ayarları yanlış
- Supabase'de email confirmation kapalı
- Spam klasöründe
- Rate limiting (Supabase free tier: 3 e-posta/saat)

**Çözüm:**
1. Supabase Dashboard → Authentication → Logs kontrol edin
2. SMTP ayarlarını doğrulayın
3. Spam klasörünü kontrol edin
4. Resend.com gibi güvenilir SMTP kullanın

### Sorun 2: "User already registered" Hatası

Supabase Auth'da zaten kayıtlı kullanıcı.

**Çözüm:**
```
Supabase Dashboard → Authentication → Users
→ Kullanıcıyı bulun ve silin
```

Veya farklı e-posta kullanın.

### Sorun 3: "Invalid or expired link"

Reset link süresi dolmuş (1 saat).

**Çözüm:**
Yeni şifre sıfırlama talebi oluşturun.

### Sorun 4: E-posta onaylı ama trial başlamadı

Confirm sayfasında hata olmuş olabilir.

**Çözüm:**
Manuel olarak düzeltin:
```sql
UPDATE tenants
SET
  is_active = true,
  trial_end_date = NOW() + INTERVAL '3 days',
  subscription_status = 'trial'
WHERE owner_email = 'kullanici@email.com';
```

---

## 📊 Supabase Auth Tabloları

### auth.users
```sql
- id: UUID
- email: TEXT
- email_confirmed_at: TIMESTAMP (NULL = onaylanmamış)
- encrypted_password: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### auth.identities
```sql
- id: UUID
- user_id: UUID (FK auth.users)
- provider: TEXT ('email')
- last_sign_in_at: TIMESTAMP
```

### Kullanıcı E-posta Doğrulama Durumunu Kontrol

```sql
SELECT
  u.email,
  u.email_confirmed_at,
  CASE
    WHEN u.email_confirmed_at IS NULL THEN 'Onaylanmamış'
    ELSE 'Onaylı'
  END as durum,
  t.is_active as tenant_aktif,
  t.trial_end_date
FROM auth.users u
LEFT JOIN public.tenants t ON t.auth_user_id = u.id
ORDER BY u.created_at DESC;
```

---

## 🚀 Production Checklist

Canlıya almadan önce kontrol edin:

- [ ] Supabase'de email confirmation **AÇIK**
- [ ] SMTP ayarları yapılandırılmış (Resend.com önerilir)
- [ ] E-posta şablonları özelleştirilmiş
- [ ] Redirect URLs production domain'i içeriyor
- [ ] Site URL production domain
- [ ] Spam klasörüne düşmeyi engellemek için SPF/DKIM kayıtları eklendi
- [ ] E-posta gönderim logları izleniyor
- [ ] Rate limiting ayarlandı (SMTP provider)
- [ ] Test e-postaları başarıyla gönderildi
- [ ] Şifre sıfırlama akışı test edildi
- [ ] Aktivasyon e-postası tekrar gönderme test edildi

---

## 📞 Destek

E-posta sorunları için:
- Supabase Dashboard → Authentication → Logs
- SMTP provider logları (Resend.com, SendGrid, vb.)
- Browser console (network tab)

**İletişim:**
- E-posta: info@menumgo.digital
- Telefon: 0545 715 43 05

---

## 🔗 İlgili Dosyalar

- `app/auth/forgot-password/page.tsx` - Şifre sıfırlama talep sayfası
- `app/auth/reset-password/page.tsx` - Yeni şifre oluşturma sayfası
- `app/auth/resend-confirmation/page.tsx` - Aktivasyon e-postası tekrar gönder
- `app/auth/confirm/page.tsx` - E-posta doğrulama callback
- `app/auth/confirm-email/page.tsx` - E-posta onay bekleme sayfası
- `app/register/page.tsx` - Kayıt sayfası
- `app/page.tsx` - Ana sayfa (login dialog)
- `docs/RESEND_SUPABASE_INTEGRATION.md` - Resend.com entegrasyon detayları
- `docs/SUPABASE_EMAIL_CONFIRMATION.md` - Eski dokümantasyon

---

**Son Güncelleme:** 2025-11-09
**Versiyon:** 1.0
**Durum:** ✅ Tamamlandı
