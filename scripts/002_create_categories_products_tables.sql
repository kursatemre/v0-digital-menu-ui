-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public to read categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public to create categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public to update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public to delete categories" ON public.categories;

DROP POLICY IF EXISTS "Allow public to read products" ON public.products;
DROP POLICY IF EXISTS "Allow public to create products" ON public.products;
DROP POLICY IF EXISTS "Allow public to update products" ON public.products;
DROP POLICY IF EXISTS "Allow public to delete products" ON public.products;

-- Create RLS policies for categories
CREATE POLICY "Allow public to read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public to create categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Allow public to delete categories" ON public.categories FOR DELETE USING (true);

-- Create RLS policies for products
CREATE POLICY "Allow public to read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public to create products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public to delete products" ON public.products FOR DELETE USING (true);

-- Insert seed data - categories
INSERT INTO public.categories (id, name, image, display_order) VALUES
  ('c3a0330e-21af-4ea0-9856-bfca2c984c3e', 'Günün Menüsü', '', 1),
  ('4ca3431f-5082-4215-8260-c756269364ff', 'Kahvaltılıklar', 'https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/sicak-kahvalti-tabagi-8348.jpg', 2),
  ('13ac044f-28cd-42c7-a2a0-67f5670a20c6', 'Makarnalar', '', 3),
  ('ba64a7e8-ea3a-4748-b40a-1d4a157c0836', 'Köfteler', '', 3),
  ('701c9fb5-b2f8-4d14-a29b-78d07353400a', 'Tavuk Izgara Çeşitleri', '', 4),
  ('98d5ca18-0687-4943-88fe-e4d6da07ef84', 'Salatalar', '', 5),
  ('6ddc7415-3f9d-4ded-a7a3-4139a84422ff', 'İçecekler', '', 6),
  ('52db0bb2-a3fa-4775-92d1-095f37f5c205', 'Hamburger & Patates', '', 4)
ON CONFLICT DO NOTHING;

-- Insert seed data - products (first batch)
INSERT INTO public.products (id, name, description, price, category_id, image, display_order) VALUES
  ('abfd2344-930c-47b0-adf9-cb2c8caad7a6', 'Etli Nohut, Pilav, Yoğurt veya Salata', '', 250, 'c3a0330e-21af-4ea0-9856-bfca2c984c3e', 'https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/images%20%282%29-cLDhPhUNd4oFL0yrPxaISk6YyChV7N.jfif', 0),
  ('237e466a-913c-4df8-8464-e22a7c2ffd12', 'Kahvaltı Tabağı', 'Haşlanmış yumurta, Peynir, zeytin, domates, salatalık, reçel, tereyağ, bal, Sınırsız Çay', 200, '4ca3431f-5082-4215-8260-c756269364ff', 'https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/kahvalti_tabagi-SU9m006Cn3a0nI1uUi9Nb0LhEOI2Fd.jpg', 0),
  ('3c4a2bad-55bf-45fa-b64e-dc057effa0d9', 'Sigara Böreği', '4 adet', 75, '4ca3431f-5082-4215-8260-c756269364ff', 'https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/hafif_sigara_boregi-62d641dd-3b62-47e2-b0e2-96870bc31cf3-FBl8kqZhoQoZK0qP6WD9aBAiChX06j.jpg', 1),
  ('59e9539f-8108-4847-acd1-ccb665db1564', 'Menemen', '', 130, '4ca3431f-5082-4215-8260-c756269364ff', 'https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/images%20%283%29-43iffNQQwgG3ZQqr7QfHxW8EQOYEf1.jfif', 2),
  ('6f17251c-2115-41e8-a768-2f4779c9c507', 'Ayvalık Tostu', '', 150, '4ca3431f-5082-4215-8260-c756269364ff', 'https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/1200x675-ayvalik-tostu-1725955639211-FsrNcS3ky6D78f1JjNSW9QVA2kNJLX.jpg', 3),
  ('7232932c-cfbb-4e10-9dbb-05a1fa052663', 'Kumru Tost', '', 150, '4ca3431f-5082-4215-8260-c756269364ff', 'https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/1743207130332_1000x750-u3Fe0h7lX0Jvogc9gwSHFUxQtbPZ4T.webp', 4),
  ('f884ed41-a6fd-4c56-980b-3bffce7f4d10', 'Omlet', '', 120, '4ca3431f-5082-4215-8260-c756269364ff', 'https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/Tezza-1983-scaled-e1683895911694-sJBL9UO3snuMhKPQrm1sWxwLmUs7f0.jpg', 5)
ON CONFLICT DO NOTHING;
