-- ⚠️⚠️⚠️ SÜPER DİKKAT: Bu script TÜM kullanıcıları ve dataları silecek! ⚠️⚠️⚠️
-- Sadece development ortamında kullanın!
-- Production'da ASLA çalıştırmayın!

-- Önce mevcut dataları görelim
SELECT 'Current state:' as info;
SELECT 'Tenants:' as table_name, COUNT(*) as count FROM tenants;
SELECT 'Admin Users:' as table_name, COUNT(*) as count FROM admin_users;
SELECT 'Auth Users:' as table_name, COUNT(*) as count FROM auth.users;
SELECT 'Payment Transactions:' as table_name, COUNT(*) as count FROM payment_transactions;

-- Emin misiniz? (Bu satırı uncomment edin silmek için)
-- Adım 1: Foreign key bağımlılıkları olan tabloları temizle
-- DELETE FROM payment_transactions;
-- DELETE FROM orders;
-- DELETE FROM waiter_calls;
-- DELETE FROM products;
-- DELETE FROM categories;
-- DELETE FROM settings;
-- DELETE FROM admin_users;

-- Adım 2: Tenant'ları sil
-- DELETE FROM tenants;

-- Adım 3: Auth users sil (DİKKAT: Bu geri alınamaz!)
-- NOT: auth.users tablosu CASCADE delete yapacak, admin_users'daki auth_user_id foreign key'i de temizlenecek
-- DELETE FROM auth.users;

-- Adım 4: Kontrol
-- SELECT 'After cleanup:' as info;
-- SELECT 'Tenants:' as table_name, COUNT(*) as count FROM tenants;
-- SELECT 'Admin Users:' as table_name, COUNT(*) as count FROM admin_users;
-- SELECT 'Auth Users:' as table_name, COUNT(*) as count FROM auth.users;

-- ℹ️ Kullanım:
-- 1. Önce bu script'i olduğu gibi çalıştırın (sadece SELECT'ler çalışacak)
-- 2. Mevcut dataları kontrol edin
-- 3. Emin olduğunuzda, DELETE satırlarının başındaki -- işaretini kaldırın
-- 4. Script'i tekrar çalıştırın
