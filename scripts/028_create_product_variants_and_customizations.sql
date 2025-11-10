-- Product Variants (Beden/Size seçenekleri)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'Küçük', 'Orta', 'Büyük'
  name_en TEXT, -- 'Small', 'Medium', 'Large'
  price_modifier DECIMAL(10, 2) DEFAULT 0, -- +10₺, +20₺ vs
  display_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customization Groups (Süt Tipi, Şurup, Extra Shot gibi gruplar)
CREATE TABLE IF NOT EXISTS customization_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'Süt Tipi', 'Şurup', 'Extra Shot'
  name_en TEXT, -- 'Milk Type', 'Syrup', 'Extra Shot'
  display_order INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT false, -- Zorunlu mu?
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customization Options (Her gruptaki seçenekler)
CREATE TABLE IF NOT EXISTS customization_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES customization_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'Yulaf Sütü', 'Badem Sütü', 'Vanilya Şurup'
  name_en TEXT, -- 'Oat Milk', 'Almond Milk', 'Vanilla Syrup'
  price_modifier DECIMAL(10, 2) DEFAULT 0, -- +8₺, +10₺ vs
  display_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product ile Customization Group ilişkisi (Hangi ürüne hangi özelleştirme grupları uygulanacak)
CREATE TABLE IF NOT EXISTS product_customization_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES customization_groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, group_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_tenant_id ON product_variants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customization_groups_tenant_id ON customization_groups(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customization_options_group_id ON customization_options(group_id);
CREATE INDEX IF NOT EXISTS idx_customization_options_tenant_id ON customization_options(tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_customization_groups_product_id ON product_customization_groups(product_id);
CREATE INDEX IF NOT EXISTS idx_product_customization_groups_tenant_id ON product_customization_groups(tenant_id);

-- RLS Policies
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customization_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_customization_groups ENABLE ROW LEVEL SECURITY;

-- Product Variants Policies
CREATE POLICY "Product variants are viewable by everyone"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "Product variants are insertable by authenticated users"
  ON product_variants FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product variants are updatable by authenticated users"
  ON product_variants FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Product variants are deletable by authenticated users"
  ON product_variants FOR DELETE
  USING (auth.role() = 'authenticated');

-- Customization Groups Policies
CREATE POLICY "Customization groups are viewable by everyone"
  ON customization_groups FOR SELECT
  USING (true);

CREATE POLICY "Customization groups are insertable by authenticated users"
  ON customization_groups FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Customization groups are updatable by authenticated users"
  ON customization_groups FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Customization groups are deletable by authenticated users"
  ON customization_groups FOR DELETE
  USING (auth.role() = 'authenticated');

-- Customization Options Policies
CREATE POLICY "Customization options are viewable by everyone"
  ON customization_options FOR SELECT
  USING (true);

CREATE POLICY "Customization options are insertable by authenticated users"
  ON customization_options FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Customization options are updatable by authenticated users"
  ON customization_options FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Customization options are deletable by authenticated users"
  ON customization_options FOR DELETE
  USING (auth.role() = 'authenticated');

-- Product Customization Groups Policies
CREATE POLICY "Product customization groups are viewable by everyone"
  ON product_customization_groups FOR SELECT
  USING (true);

CREATE POLICY "Product customization groups are insertable by authenticated users"
  ON product_customization_groups FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product customization groups are updatable by authenticated users"
  ON product_customization_groups FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Product customization groups are deletable by authenticated users"
  ON product_customization_groups FOR DELETE
  USING (auth.role() = 'authenticated');
