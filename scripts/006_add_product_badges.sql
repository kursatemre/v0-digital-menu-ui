-- Add badge column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS badge TEXT;

-- Badge can be: 'gunun_urunu', 'sefin_onerisi', 'yeni', 'populer', etc.
-- Or null for no badge

COMMENT ON COLUMN products.badge IS 'Product badge type: gunun_urunu, sefin_onerisi, yeni, populer';
