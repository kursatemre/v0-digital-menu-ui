# Dijital Menü UI için Yapay Zeka Asistan Talimatları

## Proje Genel Bakış
Bu proje, Next.js, Supabase ve TailwindCSS ile geliştirilmiş bir SaaS dijital menü uygulamasıdır. Restoranların benzersiz URL'ler üzerinden (örn. `/lezzetkulesi`) erişilebilen dijital menüler oluşturmasını sağlar.

## Temel Mimari Bileşenler

### Çok Kiracılı (Multi-tenant) Mimari
- Her restoran, `tenants` tablosunda benzersiz bir slug'a sahip bir kiracıdır
- Veri erişimi Row Level Security (RLS) politikaları ile kontrol edilir
- Şema detayları için `scripts/008_create_saas_architecture.sql` dosyasına bakınız

### Frontend Yapısı
- `app/[slug]/page.tsx`: Dinamik restoran menü sayfaları
- `app/[slug]/admin/page.tsx`: Restoran yönetici paneli
- `app/[slug]/payment/page.tsx`: Ödeme işlemleri
- Bileşenler `components/` dizininde atomik tasarım prensibini takip eder:
  - Temel menü bileşenleri: `menu-content.tsx`, `menu-header.tsx`
  - UI bileşenleri: `ui/` dizininde Radix UI primitive'leri kullanılır

## Geliştirme İş Akışı

### Kurulum ve Çalıştırma
```bash
pnpm install
pnpm dev   # Geliştirme sunucusunu başlat
pnpm build # Prodüksiyon derlemesi
```

### Veritabanı Değişiklikleri
- Tüm şema değişiklikleri `scripts/` dizinindeki migrasyon dosyaları üzerinden yapılmalıdır
- Migrasyonlar sıralı olarak numaralandırılır (örn. `001_create_orders_table.sql`)
- Kimlik doğrulama ve veri depolama Supabase tarafından yönetilir
  - API istemcileri için `lib/supabase/{client,server}.ts` dosyalarına bakınız

## Temel Kalıplar ve Kurallar

### Durum Yönetimi
- React'in yerleşik hook'ları ile durum yönetimi yapılır
- Sepet durumu `components/cart-button.tsx` içinde istemci tarafında yönetilir
- Tema tercihleri `components/theme-provider.tsx` ile yönetilir

### Bileşen Yapısı
- Etkileşimli elementler için mutlaka client-side bileşenler kullanılmalıdır
- Client bileşenleri `"use client"` direktifi ile işaretlenmelidir
- İş mantığı sayfa bileşenlerinde, UI mantığı alt bileşenlerde tutulmalıdır

### Entegrasyon Noktaları
- Supabase Kimlik Doğrulama: `lib/supabase/server.ts`
- Ödeme İşlemleri: `app/[slug]/payment/page.tsx`
- Analitik: Vercel Analytics entegrasyonu

## Sık Yapılan İşlemler

### Yeni Menü Özelliklerinin Eklenmesi
1. Gerekirse veritabanı migrasyonu ekleyin (`scripts/`)
2. İlgili bileşenleri güncelleyin (`components/`)
3. Gerekirse `app/` dizininde yeni rotalar ekleyin
4. Tip tanımlarını ve yardımcı fonksiyonları güncelleyin (`lib/`)

### Stil Düzenlemeleri
- Tailwind CSS utility sınıflarını kullanın
- `ui/` dizinindeki mevcut bileşen kalıplarını takip edin
- Tema özelleştirmeleri `components.json` üzerinden yapılır

### Bilinen Sınırlamalar
- Ücretsiz paket 3 günlük deneme süresi içerir
- Görsel depolama Supabase bucket kapasitesi ile sınırlıdır
- Menü kategorileri şu anda `menu-content.tsx` içinde sabit kodludur