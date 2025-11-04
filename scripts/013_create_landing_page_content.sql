-- Create landing_page_content table for managing landing page sections
CREATE TABLE IF NOT EXISTS landing_page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_landing_page_section ON landing_page_content(section_key);

-- Insert default landing page content
INSERT INTO landing_page_content (section_key, content) VALUES
('hero', '{
  "title": "Dijital Menü Sisteminiz, Bir Tık Uzağınızda",
  "subtitle": "QR kod ile müşterilerinize hızlı ve modern menü deneyimi sunun. Hiçbir uygulama indirmeye gerek yok!",
  "buttonText": "Ücretsiz Deneyin",
  "buttonLink": "/register",
  "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  "features": [
    "7 gün ücretsiz deneme",
    "Kredi kartı gerektirmez",
    "Anında kurulum"
  ]
}'::jsonb),
('features', '{
  "title": "Neden Menumgo?",
  "subtitle": "Restoranınızı dijital çağa taşıyın",
  "items": [
    {
      "icon": "qrcode",
      "title": "QR Kod Menü",
      "description": "Müşterileriniz masadaki QR kodu okutarak menünüze anında erişebilir"
    },
    {
      "icon": "smartphone",
      "title": "Mobil Uyumlu",
      "description": "Tüm cihazlarda mükemmel görünüm ve hızlı yükleme"
    },
    {
      "icon": "edit",
      "title": "Kolay Yönetim",
      "description": "Ürünlerinizi, kategorilerinizi ve fiyatlarınızı dakikalar içinde güncelleyin"
    },
    {
      "icon": "cart",
      "title": "Online Sipariş",
      "description": "Müşteriler masadan veya paket servis için sipariş verebilir"
    },
    {
      "icon": "palette",
      "title": "Özel Tasarım",
      "description": "Markanıza uygun renk, logo ve tema düzenlemeleri"
    },
    {
      "icon": "chart",
      "title": "Raporlama",
      "description": "Satışlarınızı ve performansınızı detaylı raporlarla takip edin"
    }
  ]
}'::jsonb),
('pricing', '{
  "title": "Size Uygun Planı Seçin",
  "subtitle": "Tüm planlar 7 gün ücretsiz deneme ile başlar",
  "plans": [
    {
      "name": "Trial",
      "price": "0",
      "duration": "7 gün",
      "description": "Başlamak için ideal",
      "features": [
        "Sınırsız ürün",
        "Sınırsız kategori",
        "QR kod menü",
        "Temel raporlama",
        "7 gün kullanım"
      ],
      "buttonText": "Ücretsiz Başla",
      "highlighted": false
    },
    {
      "name": "Premium",
      "price": "499",
      "duration": "ay",
      "description": "Profesyonel işletmeler için",
      "features": [
        "Trial özellikleri",
        "Online sipariş",
        "Garson çağırma",
        "Özel tasarım",
        "Öncelikli destek",
        "Detaylı raporlama"
      ],
      "buttonText": "Premium Başlat",
      "highlighted": true
    }
  ]
}'::jsonb),
('footer', '{
  "companyName": "Menumgo",
  "description": "Modern restoranlar için dijital menü çözümü",
  "copyright": "© 2024 Menumgo. Tüm hakları saklıdır.",
  "links": [
    {
      "title": "Ürün",
      "items": [
        {"label": "Özellikler", "url": "#features"},
        {"label": "Fiyatlandırma", "url": "#pricing"},
        {"label": "Demo", "url": "/demo"}
      ]
    },
    {
      "title": "Şirket",
      "items": [
        {"label": "Hakkımızda", "url": "/about"},
        {"label": "İletişim", "url": "/contact"},
        {"label": "Blog", "url": "/blog"}
      ]
    },
    {
      "title": "Yasal",
      "items": [
        {"label": "Gizlilik Politikası", "url": "/privacy"},
        {"label": "Kullanım Şartları", "url": "/terms"},
        {"label": "KVKK", "url": "/kvkk"}
      ]
    }
  ],
  "social": [
    {"platform": "twitter", "url": "https://twitter.com/menumgo"},
    {"platform": "instagram", "url": "https://instagram.com/menumgo"},
    {"platform": "linkedin", "url": "https://linkedin.com/company/menumgo"}
  ]
}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

COMMENT ON TABLE landing_page_content IS 'Stores editable content for the landing page sections';
