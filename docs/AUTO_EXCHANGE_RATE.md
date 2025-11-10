# Otomatik Döviz Kuru Güncelleme Sistemi

MenuMGO'da USD/TRY döviz kuru otomatik olarak güncellenir. Bu sistem sayesinde premium abonelik fiyatları her zaman güncel kurdan hesaplanır.

## 🚀 Nasıl Çalışır?

### 1. Otomatik Güncelleme (Günlük)
- **Zaman:** Her gün saat 09:00 (UTC)
- **API:** [ExchangeRate-API](https://www.exchangerate-api.com/)
- **Metod:** Vercel Cron Job
- **Endpoint:** `/api/cron/update-exchange-rate`

### 2. Manuel Güncelleme
Super-admin panelinden "🔄 API'den Güncelle" butonuna tıklayarak anında güncelleme yapabilirsiniz.

## 📋 Kurulum Adımları

### 1. ExchangeRate API Key Alma (Ücretsiz)
1. [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/) adresine git
2. Email ile ücretsiz kayıt ol
3. API Key'ini kopyala (günde 1,500 istek ücretsiz)

### 2. Environment Variables Ayarlama

#### Vercel Dashboard:
```bash
EXCHANGE_RATE_API_KEY=your_api_key_here
CRON_SECRET=random_secret_string_for_security
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Local Development (.env.local):
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EXCHANGE_RATE_API_KEY=your_exchangerate_api_key
CRON_SECRET=your_random_secret
```

### 3. Vercel Cron Job Aktifleştirme
`vercel.json` dosyası otomatik olarak yapılandırılmıştır:
```json
{
  "crons": [
    {
      "path": "/api/cron/update-exchange-rate",
      "schedule": "0 9 * * *"
    }
  ]
}
```

Deploy sonrası Vercel Dashboard'da **Settings → Cron Jobs** bölümünden aktif olduğunu doğrulayın.

## 🔧 API Endpoint

### GET `/api/cron/update-exchange-rate`

**Headers:**
```bash
Authorization: Bearer {CRON_SECRET}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Exchange rate updated successfully",
  "rate": 34.85,
  "timestamp": "2025-11-06T09:00:00.000Z"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 📊 Fiyat Hesaplama

Sistem otomatik olarak TL fiyatını hesaplar:

```
TL Fiyat = USD Fiyat × USD/TRY Kuru
```

**Örnek:**
- Premium Fiyat: $9.99
- Güncel Kur: 34.85
- **Hesaplanan TL:** ₺348.21

## 🛠️ Test Etme

### Manuel Test (Super Admin Panel):
1. `/super-admin` sayfasına git
2. **Fiyatlandırma** sekmesini aç
3. "🔄 API'den Güncelle" butonuna tıkla
4. Yeni kuru gör ve kaydet

### API Test (Local):
```bash
curl -X GET http://localhost:3000/api/cron/update-exchange-rate \
  -H "Authorization: Bearer your_cron_secret"
```

### Vercel Test:
```bash
curl -X GET https://your-domain.vercel.app/api/cron/update-exchange-rate \
  -H "Authorization: Bearer your_cron_secret"
```

## 📅 Cron Schedule Formatı

Current: `0 9 * * *` (Her gün saat 09:00 UTC)

Değiştirmek için `vercel.json` dosyasını düzenleyin:
- `0 */6 * * *` - Her 6 saatte bir
- `0 12 * * *` - Her gün saat 12:00 UTC
- `0 9 * * 1` - Her Pazartesi saat 09:00 UTC

## 🔐 Güvenlik

- API endpoint `CRON_SECRET` ile korunur
- Sadece yetkili istekler işlenir
- Supabase Service Role Key kullanılır (RLS bypass)
- Rate limiting: 1,500 istek/gün (API limiti)

## 🐛 Hata Ayıklama

### Logları Kontrol Et:
- **Vercel:** Functions → Runtime Logs
- **Local:** Terminal output

### Yaygın Hatalar:
1. **API Key geçersiz:** ExchangeRate API key'i kontrol et
2. **Cron çalışmıyor:** Vercel Dashboard'da aktif olduğunu doğrula
3. **Database güncellenmedi:** Service Role Key'i kontrol et
4. **Unauthorized:** CRON_SECRET doğru ayarlanmış mı?

## 📚 Alternatif API'ler

ExchangeRate-API yerine kullanılabilecek alternatifler:

### TCMB (Türkiye Cumhuriyet Merkez Bankası):
```
https://www.tcmb.gov.tr/kurlar/today.xml
```

### Fixer.io:
```
https://api.fixer.io/latest?base=USD&symbols=TRY
```

### CurrencyLayer:
```
https://api.currencylayer.com/live?access_key=KEY&currencies=TRY&source=USD
```

## 📈 İzleme

Kur güncellemelerini takip etmek için:
1. Super-admin panelinde "Son güncelleme" tarihine bak
2. Vercel Cron Jobs dashboard'u kontrol et
3. Database'de `last_rate_update` sütununa bak

## 🎯 İleride Eklenebilecekler

- [ ] Kur değişimi bildirimleri (email/SMS)
- [ ] Kur geçmişi grafiği
- [ ] Birden fazla para birimi desteği (EUR, GBP)
- [ ] Otomatik fiyat ayarlama stratejileri
- [ ] A/B testing farklı fiyatlarla
