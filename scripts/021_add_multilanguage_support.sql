-- Kategoriler için İngilizce alan ekleme
ALTER TABLE categories 
ADD COLUMN name_en TEXT,
ADD COLUMN description_en TEXT;

-- Ürünler için İngilizce alan ekleme
ALTER TABLE products 
ADD COLUMN name_en TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN ingredients_en TEXT[];