# Resend + Supabase Entegrasyonu

Bu rehber, Resend.com'u Supabase ile nasıl entegre edeceğinizi adım adım gösterir.

## 📋 İçindekiler

1. [Neden Resend?](#neden-resend)
2. [Resend Hesabı Oluşturma](#1-resend-hesabı-oluşturma)
3. [Domain Doğrulama](#2-domain-doğrulama)
4. [API Key Alma](#3-api-key-alma)
5. [Supabase SMTP Ayarları](#4-supabase-smtp-ayarları)
6. [E-posta Şablonlarını Özelleştirme](#5-e-posta-şablonlarını-özelleştirme)
7. [Test Etme](#6-test-etme)
8. [Sorun Giderme](#sorun-giderme)

---

## Neden Resend?

Supabase varsayılan olarak kendi e-posta servisini kullanır ancak sınırlamaları vardır:

❌ **Supabase Varsayılan E-posta:**
- Günlük 4 e-posta limiti (free tier)
- Spam klasörüne düşme riski yüksek
- Özelleştirme seçenekleri kısıtlı
- Production için uygun değil

✅ **Resend Avantajları:**
- Günlük 100 e-posta (free tier)
- Aylık 3,000 e-posta
- Yüksek deliverability (teslim oranı)
- Detaylı analytics ve logs
- Kolay kurulum
- Developer-friendly API

---

## 1. Resend Hesabı Oluşturma

### Adım 1.1: Kayıt Ol

1. https://resend.com adresine gidin
2. **Sign Up** butonuna tıklayın
3. GitHub veya e-posta ile kayıt olun
4. E-postanızı doğrulayın

### Adım 1.2: İlk Projeyi Oluştur

Kayıt olduktan sonra otomatik olarak bir proje oluşturulur. İsterseniz:
- **Settings** → **General** → Project adını değiştirin
- Örnek: "Menumgo Production"

---

## 2. Domain Doğrulama

### Seçenek A: Kendi Domain'inizi Kullanma (Önerilen - Production)

#### Adım 2.1: Domain Ekle

1. Resend Dashboard'da **Domains** sekmesine gidin
2. **Add Domain** butonuna tıklayın
3. Domain adınızı girin: `menumgo.digital`
4. **Add Domain** butonuna tıklayın

#### Adım 2.2: DNS Kayıtlarını Ekle

Resend size 3 DNS kaydı verecek:

**1. SPF Kaydı (TXT):**
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
TTL: 3600
```

**2. DKIM Kayıtları (TXT):**
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
TTL: 3600
```

**3. DMARC Kaydı (TXT):**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none
TTL: 3600
```

#### Adım 2.3: DNS Kayıtlarını Domain Sağlayıcınıza Ekleyin

Domain'inizi nereden aldıysanız (GoDaddy, Namecheap, CloudFlare, vb.):

**GoDaddy Örneği:**
1. GoDaddy'ye giriş yapın
2. **My Products** → **Domains** → Domain'inizi seçin
3. **DNS** → **Manage Zones** → **Add** butonuna tıklayın
4. Yukarıdaki 3 kaydı tek tek ekleyin

**Cloudflare Örneği:**
1. Cloudflare dashboard'a gidin
2. Domain'inizi seçin
3. **DNS** → **Records** → **Add record**
4. Her 3 kaydı ekleyin

#### Adım 2.4: Doğrulama Bekle

- DNS değişikliklerinin yayılması **5-30 dakika** sürer
- Resend otomatik olarak doğrulama yapar
- **Status: Verified** yazısını görene kadar bekleyin
- Doğrulandıktan sonra yeşil ✓ işareti görünecek

### Seçenek B: Test Domain (Development)

Hızlı test için Resend'in test domain'ini kullanabilirsiniz:

- **Domain:** `onboarding@resend.dev`
- DNS ayarı gerekmez
- Hemen kullanıma hazır
- ⚠️ Sadece development için!

---

## 3. API Key Alma

### Adım 3.1: API Key Oluştur

1. Resend Dashboard → **API Keys** sekmesine gidin
2. **Create API Key** butonuna tıklayın
3. Ayarlar:
   - **Name:** `Supabase SMTP`
   - **Permission:** `Sending access` (varsayılan)
4. **Add** butonuna tıklayın

### Adım 3.2: API Key'i Kaydet

⚠️ **ÇOK ÖNEMLİ:** API key sadece bir kez gösterilir!

```
re_123456789abcdefghijklmnopqrstuv
```

Bu key'i güvenli bir yere kaydedin:
- Password manager (1Password, LastPass, vb.)
- Güvenli bir not defteri
- `.env` dosyası (asla git'e commit etmeyin!)

---

## 4. Supabase SMTP Ayarları

### Adım 4.1: Supabase Dashboard'a Git

1. https://supabase.com/dashboard adresine gidin
2. Projenizi seçin
3. **Settings** (sol alt köşe) → **Auth** sekmesine gidin

### Adım 4.2: E-posta Onayını Aç

Sayfayı aşağı kaydırın ve bulun:

**Email Confirmation:**
- ✅ **Enable email confirmations** seçeneğini **AÇIN**
- Bu olmadan e-posta doğrulama çalışmaz!

### Adım 4.3: SMTP Ayarlarını Yapılandır

**"SMTP Settings"** bölümüne gidin ve **Enable Custom SMTP** seçeneğini işaretleyin:

#### SMTP Configuration:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Enable Custom SMTP:  ✅ (AÇIK)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Host:           smtp.resend.com
Port:           587
Username:       resend
Password:       re_123456789abcdefghijklmnopqrstuv
                (Resend API Key'iniz)

Sender email:   noreply@menumgo.digital
                (veya onboarding@resend.dev test için)

Sender name:    Menumgo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Önemli Notlar:**
- ✅ **Username:** Her zaman `resend` olmalı
- ✅ **Password:** Resend API Key'iniz
- ✅ **Port:** 587 (TLS) veya 465 (SSL) kullanılabilir
- ✅ **Host:** `smtp.resend.com` sabit kalmalı
- ✅ **Sender email:** Doğrulanmış domain'inizden olmalı

### Adım 4.4: Kaydet ve Test Et

1. **Save** butonuna tıklayın
2. Sayfanın üstünde yeşil "Settings updated" mesajını görmelisiniz

---

## 5. E-posta Şablonlarını Özelleştirme

### Adım 5.1: Email Templates'e Git

Supabase Dashboard:
- **Authentication** → **Email Templates** sekmesine gidin

### Adım 5.2: Confirm Signup Şablonunu Düzenle

**"Confirm signup"** şablonunu seçin ve özelleştirin:

#### Subject (Konu):
```
Menumgo E-posta Doğrulama
```

#### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-posta Doğrulama</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 12px 24px; border-radius: 8px; font-size: 24px; font-weight: bold;">
                Menumgo
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <h1 style="color: #1f2937; font-size: 28px; margin: 0 0 20px; text-align: center;">
                Hoş Geldiniz! 👋
              </h1>

              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Merhaba,
              </p>

              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Menumgo hesabınızı oluşturduğunuz için teşekkür ederiz! Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın:
              </p>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}"
                       style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.25);">
                      E-postamı Onayla
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                Veya bu linki kopyalayıp tarayıcınıza yapıştırın:
              </p>

              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; word-break: break-all;">
                <a href="{{ .ConfirmationURL }}" style="color: #2563eb; text-decoration: none; font-size: 12px;">
                  {{ .ConfirmationURL }}
                </a>
              </div>

              <!-- Features Box -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <p style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 10px;">
                  🎉 E-posta doğrulandıktan sonra:
                </p>
                <ul style="color: #1e40af; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li>3 günlük ücretsiz deneme süreniz başlayacak</li>
                  <li>Tüm premium özelliklere erişim sağlayacaksınız</li>
                  <li>Hemen dijital menünüzü oluşturabileceksiniz</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 0 0 10px;">
                Bu e-postayı siz istemediyseniz, güvenle silebilirsiniz.
              </p>

              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                İyi günler,<br>
                <strong style="color: #1f2937;">Menumgo Ekibi</strong><br>
                <a href="https://menumgo.digital" style="color: #2563eb; text-decoration: none;">menumgo.digital</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Adım 5.3: Diğer Şablonları Düzenle (Opsiyonel)

Aynı şekilde diğer e-posta şablonlarını da özelleştirebilirsiniz:

- **Magic Link:** Şifresiz giriş
- **Change Email Address:** E-posta değiştirme
- **Reset Password:** Şifre sıfırlama

---

## 6. Test Etme

### Adım 6.1: Uygulamayı Çalıştır

```bash
npm run dev
```

### Adım 6.2: Yeni Kayıt Oluştur

1. http://localhost:3000/register adresine gidin
2. **Gerçek bir e-posta adresi** ile kayıt olun
3. Form'u doldurup **"Ücretsiz Denemeyi Başlat"** butonuna tıklayın

### Adım 6.3: E-postayı Kontrol Et

1. **Gelen kutunuzu** açın (kayıt olduğunuz e-posta)
2. **Spam klasörünü** de kontrol edin
3. **"Menumgo E-posta Doğrulama"** konulu e-postayı bulun

E-posta şöyle görünmeli:
```
Gönderen: Menumgo <noreply@menumgo.digital>
Konu: Menumgo E-posta Doğrulama
İçerik: [Güzel HTML şablon]
Buton: "E-postamı Onayla"
```

### Adım 6.4: Doğrulama Linkine Tıkla

1. E-postadaki **"E-postamı Onayla"** butonuna tıklayın
2. Tarayıcı `/auth/confirm` sayfasını açacak
3. Şu mesajları göreceksiniz:
   - ✓ Hesabınız aktifleştirildi
   - ✓ 3 günlük ücretsiz deneme başladı
   - ✓ Yönetim paneline yönlendiriliyorsunuz...
4. 3 saniye sonra admin paneline yönlendirileceksiniz

### Adım 6.5: Veritabanını Kontrol Et (Opsiyonel)

Supabase Dashboard → **Table Editor** → `tenants`:
- `is_active` = `true` olmalı ✓
- `trial_end_date` şu andan 3 gün sonrası olmalı ✓
- `auth_user_id` dolu olmalı ✓

---

## Sorun Giderme

### 🔴 E-posta Gelmiyor

#### Kontrol 1: Resend Logs
1. Resend Dashboard → **Logs** → **Emails**
2. E-posta gönderildi mi?
3. Status: **Delivered**, **Bounced**, veya **Failed**?

#### Kontrol 2: Spam Klasörü
- Gmail, Outlook spam klasörlerini kontrol edin
- "Not spam" olarak işaretleyin

#### Kontrol 3: Supabase Auth Logs
1. Supabase Dashboard → **Logs** → **Auth Logs**
2. `email.signup` eventi var mı?
3. Hata mesajı var mı?

#### Kontrol 4: SMTP Ayarları
- Username: `resend` olmalı
- Password: API key doğru mu?
- Port: 587 veya 465
- Sender email: Doğrulanmış domain'den mi?

### 🔴 "Invalid credentials" Hatası

```
Error: Invalid credentials
```

**Çözüm:**
1. Resend API key'i yeniden kopyalayın
2. Supabase SMTP password'ü güncelleyin
3. Boşluk veya özel karakter olmadığından emin olun
4. Yeni API key oluşturun ve tekrar deneyin

### 🔴 "Domain not verified" Hatası

```
Error: Domain not verified
```

**Çözüm:**
1. Resend → **Domains** → Domain status kontrol edin
2. DNS kayıtlarının doğru eklendiğinden emin olun
3. DNS propagation bekleyin (5-30 dakika)
4. Test domain kullanın: `onboarding@resend.dev`

### 🔴 E-posta Spam'e Düşüyor

**Sebep:** SPF, DKIM, DMARC kayıtları eksik veya yanlış

**Çözüm:**
1. Tüm DNS kayıtlarını kontrol edin
2. https://mxtoolbox.com/spf.aspx ile SPF'yi test edin
3. https://mxtoolbox.com/dkim.aspx ile DKIM'i test edin
4. DMARC policy'yi `p=none` yerine `p=quarantine` yapın

### 🔴 "Rate limit exceeded"

```
Error: Rate limit exceeded
```

**Sebep:** Resend free tier limitleri:
- 100 e-posta/gün
- 3,000 e-posta/ay

**Çözüm:**
1. 24 saat bekleyin
2. Resend Pro'ya upgrade edin ($20/ay)
3. Farklı e-posta servisi deneyin (SendGrid, Mailgun)

---

## 📊 Resend Dashboard

### E-posta Logları Görme

1. **Logs** → **Emails** sekmesi
2. Her e-posta için:
   - ✉️ **To:** Alıcı e-posta
   - 📅 **Sent at:** Gönderim zamanı
   - ✅ **Status:** Delivered / Bounced / Failed
   - 👁️ **Opens:** Kaç kez açıldı
   - 🖱️ **Clicks:** Link tıklama sayısı

### Webhook'lar (İleri Seviye)

Resend, e-posta olayları için webhook desteği sunar:
- `email.delivered` - E-posta teslim edildi
- `email.opened` - E-posta açıldı
- `email.clicked` - Link tıklandı
- `email.bounced` - E-posta geri döndü

---

## 🎯 Production Checklist

Canlıya almadan önce kontrol edin:

- [ ] Resend hesabı oluşturuldu
- [ ] Domain doğrulandı (Verified ✓)
- [ ] SPF, DKIM, DMARC kayıtları eklendi
- [ ] API key oluşturuldu ve güvenli yerde
- [ ] Supabase SMTP ayarları yapıldı
- [ ] E-posta onayı aktif (Enable email confirmations ✓)
- [ ] E-posta şablonları özelleştirildi
- [ ] Test e-postası gönderildi ve alındı
- [ ] Spam klasörüne düşmediği kontrol edildi
- [ ] Rate limit planlaması yapıldı
- [ ] Monitoring ve alertler kuruldu

---

## 💰 Maliyet Planlaması

### Resend Free Tier
```
✅ 100 e-posta/gün
✅ 3,000 e-posta/ay
✅ Tüm özellikler
✅ Sınırsız domain
❌ Sadece 1 API key
```

**Yeterli mi?**
- 10 kayıt/gün → ✅ Yeterli (30 e-posta/gün)
- 50 kayıt/gün → ❌ Yetersiz (150 e-posta/gün)

### Resend Pro ($20/ay)
```
✅ 50,000 e-posta/ay
✅ Sınırsız API key
✅ Detaylı analytics
✅ Priority support
✅ Webhook'lar
```

### Ne Zaman Upgrade Etmeli?

Günde **30+ kayıt** aldığınızda Pro'ya geçin.

Hesaplama:
- Kayıt e-postası: 1 e-posta
- Şifre sıfırlama: 1 e-posta
- Sipariş bildirimi: 1-5 e-posta
- **Ortalama:** 3 e-posta/kullanıcı

100 kullanıcı = 300 e-posta/gün → Free tier yetersiz

---

## 🔗 Faydalı Linkler

- [Resend Docs](https://resend.com/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [SPF Test Tool](https://mxtoolbox.com/spf.aspx)
- [DKIM Test Tool](https://mxtoolbox.com/dkim.aspx)
- [Email Spam Test](https://www.mail-tester.com)

---

## 🆘 Destek

Sorun yaşıyorsanız:

1. **Resend Support:** support@resend.com
2. **Supabase Discord:** https://discord.supabase.com
3. **Bu proje:** [GitHub Issues](https://github.com/your-repo/issues)

---

**Hazırladı:** Menumgo Development Team
**Güncelleme:** 2025-01-05
**Versiyon:** 1.0
