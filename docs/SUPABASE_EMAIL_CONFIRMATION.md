# Supabase E-posta Onay Ayarları

Bu döküman, Supabase'de e-posta onayının nasıl aktif edileceğini açıklar.

## Sorun

Şu anda e-posta onayı kapalı olduğu için:
- ❌ Kullanıcı kayıt olduğunda e-posta gönderilmiyor
- ❌ Hesap direkt aktif oluyor
- ❌ 3 günlük deneme direkt başlıyor
- ❌ E-posta doğrulama akışı çalışmıyor

## Çözüm: E-posta Onayını Aktif Etme

### 1. Supabase Dashboard'a Giriş Yapın

https://supabase.com/dashboard adresine gidin ve projenizi seçin.

### 2. Authentication Ayarlarını Açın

Sol menüden **Authentication** → **Providers** → **Email** sekmesine gidin.

### 3. E-posta Onayını Aktif Edin

Aşağıdaki ayarları yapın:

#### a) Confirm Email Ayarı
- ✅ **Enable email confirmations** seçeneğini **AÇIN (enabled)**
- Bu ayar sayesinde kullanıcı kayıt olduğunda e-posta onaylaması gerekir

#### b) Email Template Ayarları
**Authentication** → **Email Templates** → **Confirm signup** sayfasına gidin:

**Konu (Subject):**
```
Menumgo E-posta Doğrulama
```

**Mesaj (Message) - HTML:**
```html
<h2>Menumgo'ya Hoş Geldiniz!</h2>

<p>Merhaba,</p>

<p>Menumgo hesabınızı oluşturduğunuz için teşekkür ederiz. Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın:</p>

<table width="100%" cellspacing="0" cellpadding="0">
  <tr>
    <td>
      <table cellspacing="0" cellpadding="0">
        <tr>
          <td style="border-radius: 6px; background-color: #2563eb;">
            <a href="{{ .ConfirmationURL }}"
               target="_blank"
               style="display: inline-block; padding: 16px 36px; font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
              E-postamı Onayla
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<p>Veya bu linki kopyalayıp tarayıcınıza yapıştırın:</p>
<p style="word-break: break-all; color: #2563eb;">{{ .ConfirmationURL }}</p>

<p><strong>Bu doğrulamadan sonra 3 günlük ücretsiz deneme süreniz başlayacak!</strong></p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

<p style="font-size: 12px; color: #6b7280;">
  Bu e-postayı siz istemediyseniz, güvenle silebilirsiniz.
</p>

<p style="font-size: 12px; color: #6b7280;">
  İyi günler,<br>
  <strong>Menumgo Ekibi</strong><br>
  <a href="https://menumgo.digital" style="color: #2563eb;">menumgo.digital</a>
</p>
```

### 4. URL Configuration (Redirect URLs)

**Authentication** → **URL Configuration** sayfasına gidin:

#### Site URL
```
http://localhost:3000
```
(Production'da: `https://menumgo.digital`)

#### Redirect URLs
Aşağıdaki URL'leri ekleyin:
```
http://localhost:3000/auth/confirm
http://localhost:3000/auth/confirm-email
http://localhost:3000/**
```

(Production'da:)
```
https://menumgo.digital/auth/confirm
https://menumgo.digital/auth/confirm-email
https://menumgo.digital/**
```

### 5. SMTP Ayarları (Opsiyonel ama Önerilen)

Varsayılan Supabase e-posta servisi günde sınırlı sayıda e-posta gönderir. Production için özel SMTP ayarı yapmanız önerilir.

[EMAIL_SETUP.md](./EMAIL_SETUP.md) dosyasındaki adımları izleyerek Resend.com ile SMTP kurulumu yapın.

## Test Etme

### 1. Değişiklikleri Kaydedin
Tüm ayarları yaptıktan sonra **Save** butonuna tıklayın.

### 2. Yeni Kayıt Oluşturun
- `http://localhost:3000/register` sayfasına gidin
- **Gerçek bir e-posta adresi** ile kayıt olun
- Kayıt sonrası `/auth/confirm-email` sayfasını göreceksiniz

### 3. E-postanızı Kontrol Edin
- Gelen kutunuzu kontrol edin
- Spam klasörüne de bakın
- "Menumgo E-posta Doğrulama" konulu e-postayı bulun
- "E-postamı Onayla" butonuna tıklayın

### 4. Doğrulama Sayfasını Kontrol Edin
- `/auth/confirm` sayfası açılacak
- "E-posta doğrulandı!" mesajını göreceksiniz
- 3 günlük deneme başlatılacak
- Admin paneline yönlendirileceksiniz

## Kontrol Listesi

E-posta onayının düzgün çalıştığından emin olmak için:

- [ ] **Enable email confirmations** aktif mi?
- [ ] E-posta template'i özelleştirildi mi?
- [ ] Site URL doğru mu?
- [ ] Redirect URLs eklendi mi?
- [ ] SMTP ayarları yapıldı mı? (production için)
- [ ] Test kaydı oluşturuldu mu?
- [ ] E-posta geldi mi?
- [ ] Doğrulama linki çalışıyor mu?
- [ ] Hesap aktif oldu mu?
- [ ] 3 günlük deneme başladı mı?

## Sorun Giderme

### E-posta Gelmiyor
1. **Spam klasörünü kontrol edin**
2. **Supabase Auth Logs'u kontrol edin:** Dashboard → Logs → Auth Logs
3. **SMTP ayarlarını kontrol edin:** Resend.com dashboard'da logs var mı?
4. **Rate limiting:** Supabase free tier günde 4 e-posta gönderir, limit aşıldı mı?

### "Invalid confirmation link" Hatası
1. **Redirect URLs:** `auth/confirm` URL'si eklendi mi?
2. **Site URL:** Doğru domain kullanılıyor mu?
3. **Token expiry:** Link 24 saat içinde tıklanmalı

### E-posta Onaylandı ama Hesap Aktif Değil
1. **Migration:** `018_add_auth_user_id_to_tenants.sql` çalıştırıldı mı?
2. **Database:** `tenants` tablosunda `auth_user_id` kolonu var mı?
3. **Console Logs:** Browser console'da hata var mı?

## Production Checklist

Production'a almadan önce:

- [ ] **Enable email confirmations** aktif
- [ ] SMTP (Resend.com) yapılandırıldı
- [ ] Domain verified (Resend'de)
- [ ] Site URL production domain'e ayarlandı
- [ ] Redirect URLs production domain'e güncellendi
- [ ] E-posta template'i test edildi
- [ ] Rate limits uygun plan ile artırıldı

## Önemli Notlar

⚠️ **Geliştirme ortamında** e-posta onayı kapalıysa:
- Sistem otomatik olarak hesabı aktif eder
- Console'da uyarı mesajı gösterir
- Bu **sadece development** için kabul edilebilir

⚠️ **Production'da** e-posta onayı **MUTLAKA** açık olmalı:
- Güvenlik için gerekli
- Spam hesapları önler
- E-posta adreslerinin geçerliliğini doğrular

## Daha Fazla Bilgi

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SMTP Configuration](./EMAIL_SETUP.md)
