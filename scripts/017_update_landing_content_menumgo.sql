-- Update landing page content for Menumgo branding
-- This migration updates hero section with Menumgo brand and sales-focused messaging

-- Update hero section with Menumgo branding and stronger value propositions
UPDATE landing_page_content
SET content = jsonb_build_object(
  'title', 'Restoranınızı Dijital Çağa Taşıyın',
  'subtitle', 'QR kod ile temassız sipariş alın, müşteri memnuniyetini artırın. Basılı menü masraflarına son verin. 3 gün ücretsiz deneyin!',
  'logoUrl', '',
  'backgroundImage', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
  'buttonText', '3 Gün Ücretsiz Dene',
  'buttonLink', '/register',
  'badgeText', '✨ 3 Gün Ücretsiz Deneme - Kredi Kartı Gerektirmez'
),
updated_at = NOW()
WHERE section_key = 'hero';

-- Update pricing section with competitive pricing
UPDATE landing_page_content
SET content = jsonb_build_object(
  'plans', jsonb_build_array(
    jsonb_build_object(
      'name', '3 Günlük Deneme',
      'price', '0₺',
      'period', '3 gün',
      'description', 'Tüm özellikleri ücretsiz deneyin',
      'features', jsonb_build_array(
        'Sınırsız kategori ve ürün',
        'QR kod özelleştirme',
        'Gerçek zamanlı siparişler',
        'Mobil uyumlu tasarım',
        'Garson çağırma',
        'Detaylı raporlama'
      ),
      'buttonText', 'Hemen Başla',
      'highlighted', false
    ),
    jsonb_build_object(
      'name', 'Premium',
      'price', '299₺',
      'period', '/ay',
      'description', 'Profesyonel restoranlar için',
      'features', jsonb_build_array(
        'Sınırsız kategori ve ürün',
        'QR kod özelleştirme',
        'E-posta bildirimleri',
        'Garson çağırma butonu',
        'Detaylı raporlama',
        'Stok yönetimi',
        'Toplu fiyat güncelleme',
        'Özel renk ve tema',
        'Mobil uyumlu tasarım',
        '7/24 teknik destek'
      ),
      'buttonText', 'Premium Başlat',
      'highlighted', true
    )
  )
),
updated_at = NOW()
WHERE section_key = 'pricing';

COMMENT ON TABLE landing_page_content IS 'Landing page content for Menumgo - updated with brand identity and sales-focused messaging';
