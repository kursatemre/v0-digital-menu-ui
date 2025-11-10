# Ürün Varyantları ve Özelleştirmeler

Modern Takeaway teması için ürün varyantları (Küçük/Orta/Büyük) ve özelleştirme seçenekleri (Süt Tipi, Şurup, Extra Shot) sistemi.

## 🚀 Kurulum

### 1. Veritabanı Migration

Supabase Dashboard'a gidin ve SQL Editor'de aşağıdaki script'i çalıştırın:

```bash
scripts/028_create_product_variants_and_customizations.sql
```

Bu script 4 yeni tablo oluşturur:
- **product_variants**: Ürün varyantları (K/O/B)
- **customization_groups**: Özelleştirme grupları (Süt Tipi, Şurup)
- **customization_options**: Grup seçenekleri (Yulaf Sütü, Vanilya Şurup)
- **product_customization_groups**: Ürün-Grup ilişkileri

### 2. Admin Panelden Kullanım

1. Admin panele girin: `/{slug}/admin`
2. Sol menüden "Özelleştirmeler" sekmesine tıklayın
3. Adım adım yönergeleri takip edin

## 📋 Kullanım Senaryosu

### Örnek: Kahve Dükkanı

#### Adım 1: Özelleştirme Grupları Oluştur
```sql
-- Süt Tipi grubu
INSERT INTO customization_groups (tenant_id, name, name_en, display_order)
VALUES ('YOUR_TENANT_ID', 'Süt Tipi', 'Milk Type', 1);

-- Şurup grubu  
INSERT INTO customization_groups (tenant_id, name, name_en, display_order)
VALUES ('YOUR_TENANT_ID', 'Şurup', 'Syrup', 2);

-- Extra Shot grubu
INSERT INTO customization_groups (tenant_id, name, name_en, display_order, is_required)
VALUES ('YOUR_TENANT_ID', 'Extra Shot', 'Extra Shot', 3, false);
```

#### Adım 2: Grup Seçeneklerini Ekle
```sql
-- Süt Tipi seçenekleri
INSERT INTO customization_options (tenant_id, group_id, name, name_en, price_modifier, display_order, is_default)
VALUES 
  ('YOUR_TENANT_ID', 'MILK_GROUP_ID', 'Normal Süt', 'Regular Milk', 0, 1, true),
  ('YOUR_TENANT_ID', 'MILK_GROUP_ID', 'Yulaf Sütü', 'Oat Milk', 8, 2, false),
  ('YOUR_TENANT_ID', 'MILK_GROUP_ID', 'Badem Sütü', 'Almond Milk', 10, 3, false),
  ('YOUR_TENANT_ID', 'MILK_GROUP_ID', 'Soya Sütü', 'Soy Milk', 8, 4, false);

-- Şurup seçenekleri
INSERT INTO customization_options (tenant_id, group_id, name, name_en, price_modifier, display_order, is_default)
VALUES 
  ('YOUR_TENANT_ID', 'SYRUP_GROUP_ID', 'Şurupsuz', 'No Syrup', 0, 1, true),
  ('YOUR_TENANT_ID', 'SYRUP_GROUP_ID', 'Vanilya', 'Vanilla', 5, 2, false),
  ('YOUR_TENANT_ID', 'SYRUP_GROUP_ID', 'Karamel', 'Caramel', 5, 3, false),
  ('YOUR_TENANT_ID', 'SYRUP_GROUP_ID', 'Fındık', 'Hazelnut', 5, 4, false);

-- Extra Shot seçenekleri
INSERT INTO customization_options (tenant_id, group_id, name, name_en, price_modifier, display_order, is_default)
VALUES 
  ('YOUR_TENANT_ID', 'EXTRA_SHOT_GROUP_ID', 'İstemiyorum', 'No Extra', 0, 1, true),
  ('YOUR_TENANT_ID', 'EXTRA_SHOT_GROUP_ID', '+1 Shot', '+1 Shot', 10, 2, false),
  ('YOUR_TENANT_ID', 'EXTRA_SHOT_GROUP_ID', '+2 Shot', '+2 Shot', 18, 3, false);
```

#### Adım 3: Ürüne Varyant Ekle
```sql
-- Latte için varyantlar
INSERT INTO product_variants (tenant_id, product_id, name, name_en, price_modifier, display_order, is_default)
VALUES 
  ('YOUR_TENANT_ID', 'LATTE_PRODUCT_ID', 'Küçük', 'Small', 0, 1, true),
  ('YOUR_TENANT_ID', 'LATTE_PRODUCT_ID', 'Orta', 'Medium', 10, 2, false),
  ('YOUR_TENANT_ID', 'LATTE_PRODUCT_ID', 'Büyük', 'Large', 20, 3, false);
```

#### Adım 4: Ürüne Özelleştirme Gruplarını Ata
```sql
-- Latte'ye süt tipi, şurup ve extra shot gruplarını bağla
INSERT INTO product_customization_groups (tenant_id, product_id, group_id)
VALUES 
  ('YOUR_TENANT_ID', 'LATTE_PRODUCT_ID', 'MILK_GROUP_ID'),
  ('YOUR_TENANT_ID', 'LATTE_PRODUCT_ID', 'SYRUP_GROUP_ID'),
  ('YOUR_TENANT_ID', 'LATTE_PRODUCT_ID', 'EXTRA_SHOT_GROUP_ID');
```

## 🎨 Tema Desteği

Bu özellik **Modern Takeaway** temasında tamamen desteklenmektedir:

- Varyant seçimi (pill button'lar ile)
- Özelleştirme modalı (⚙️ buton ile açılır)
- Dinamik fiyat hesaplama
- Sepete ekleme

### Tema Aktivasyonu

1. Admin Panel → Görünüm → Aktif Tema
2. "Modern Takeaway (Kahve Dükkanı)" seçin
3. Kaydet

## 🔄 Frontend Entegrasyonu

Modern Takeaway teması bu verileri otomatik olarak kullanır:

```tsx
// components/themes/modern-takeaway/menu-item.tsx

// Varyantları çek
const { data: variants } = await supabase
  .from('product_variants')
  .select('*')
  .eq('product_id', product.id)
  .order('display_order')

// Özelleştirme gruplarını çek
const { data: groups } = await supabase
  .from('product_customization_groups')
  .select(`
    *,
    customization_groups (
      *,
      customization_options (*)
    )
  `)
  .eq('product_id', product.id)
```

## 📊 Veritabanı Şeması

### product_variants
- `id`: UUID
- `tenant_id`: UUID (Foreign Key → tenants)
- `product_id`: UUID (Foreign Key → products)
- `name`: TEXT (TR)
- `name_en`: TEXT (EN)
- `price_modifier`: DECIMAL (Fiyat farkı)
- `display_order`: INTEGER
- `is_default`: BOOLEAN

### customization_groups
- `id`: UUID
- `tenant_id`: UUID
- `name`: TEXT (TR - "Süt Tipi")
- `name_en`: TEXT (EN - "Milk Type")
- `display_order`: INTEGER
- `is_required`: BOOLEAN (Zorunlu mu?)

### customization_options
- `id`: UUID
- `tenant_id`: UUID
- `group_id`: UUID (Foreign Key → customization_groups)
- `name`: TEXT (TR - "Yulaf Sütü")
- `name_en`: TEXT (EN - "Oat Milk")
- `price_modifier`: DECIMAL (+8₺)
- `display_order`: INTEGER
- `is_default`: BOOLEAN

### product_customization_groups
- `id`: UUID
- `tenant_id`: UUID
- `product_id`: UUID (Foreign Key → products)
- `group_id`: UUID (Foreign Key → customization_groups)

## 🛡️ Güvenlik

Tüm tablolar Row Level Security (RLS) ile korumalıdır:
- Okuma: Herkes (müşteriler menüyü görebilir)
- Yazma: Sadece authenticated kullanıcılar (admin)

## 🎯 Roadmap

- [x] Veritabanı şeması
- [x] Modern Takeaway tema entegrasyonu
- [x] Admin panel UI tasarımı
- [ ] CRUD operasyonları (Grup ekleme/düzenleme)
- [ ] CRUD operasyonları (Seçenek ekleme/düzenleme)
- [ ] CRUD operasyonları (Varyant ekleme/düzenleme)
- [ ] Drag & drop sıralama
- [ ] Toplu import (CSV/Excel)

## 💡 Öneriler

- Varyantlar her ürün için isteğe bağlıdır
- Özelleştirme grupları tenant-wide, tüm ürünlerde kullanılabilir
- Default seçenekleri mutlaka belirleyin (kullanıcı deneyimi için)
- Fiyat farkları (`price_modifier`) negatif olabilir (indirim)

## 🐛 Bilinen Sorunlar

- Admin CRUD arayüzü henüz geliştirilmedi (manuel SQL gerekli)
- Çoklu dil desteği sadece TR/EN (genişletilebilir)

## 📞 Destek

Sorularınız için: [GitHub Issues](https://github.com/kursatemre/v0-digital-menu-ui/issues)
