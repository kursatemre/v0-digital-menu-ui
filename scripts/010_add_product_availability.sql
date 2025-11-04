-- ============================================
-- Ürün Stok Yönetimi
-- ============================================
-- Ürünlere "is_available" kolonu ekle
-- Tükenen ürünler müşteriye gri gösterilecek

-- products tablosuna is_available kolonu ekle
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Mevcut tüm ürünleri available yap
UPDATE products
SET is_available = true
WHERE is_available IS NULL;

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);

-- Başarılı mesajı
DO $$
BEGIN
  RAISE NOTICE '✅ Ürün stok yönetimi eklendi!';
  RAISE NOTICE 'is_available kolonu: true = satışta, false = tükendi';
END $$;
