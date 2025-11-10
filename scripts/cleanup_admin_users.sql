-- Admin kullanıcılarını temizleme scripti
-- Tenant'lar ve diğer datalar korunacak, sadece admin users silinecek

-- Önce mevcut admin kullanıcılarını görelim
SELECT 'Current Admin Users:' as info;
SELECT 
  au.id,
  au.username,
  au.email,
  au.role,
  au.auth_user_id,
  t.business_name as tenant,
  t.slug as tenant_slug,
  au.created_at
FROM admin_users au
LEFT JOIN tenants t ON au.tenant_id = t.id
ORDER BY au.created_at DESC;

-- Auth users'ları da görelim (Supabase Authentication)
SELECT 'Current Auth Users:' as info;
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- ✅ Emin olduğunuzda aşağıdaki satırların başındaki -- işaretini kaldırın

-- Adım 1: admin_users tablosundaki tüm kayıtları sil
-- DELETE FROM admin_users;

-- Adım 2: Supabase Auth users'ları sil (giriş yapan kullanıcılar)
-- ⚠️ DİKKAT: Bu kullanıcıların auth session'ları da silinecek
-- DELETE FROM auth.users;

-- Adım 3: Kontrol
-- SELECT 'After cleanup:' as info;
-- SELECT 'Admin Users:' as table_name, COUNT(*) as count FROM admin_users;
-- SELECT 'Auth Users:' as table_name, COUNT(*) as count FROM auth.users;

-- ℹ️ NOT: Tenant'lar, products, categories, orders, payment_transactions korunacak
-- Sadece admin kullanıcıları silinecek
