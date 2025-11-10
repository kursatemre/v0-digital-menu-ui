-- ⚠️ DİKKAT: Bu script tüm test verilerini silecek!
-- Production'da çalıştırmadan önce mutlaka yedek alın!

-- 1. Payment transactions temizle (önce foreign key bağımlılığı olan tablo)
DELETE FROM payment_transactions WHERE tenant_id IN (
  SELECT id FROM tenants WHERE slug LIKE 'test%'
);

-- 2. Orders temizle (eğer varsa)
DELETE FROM orders WHERE tenant_id IN (
  SELECT id FROM tenants WHERE slug LIKE 'test%'
);

-- 3. Waiter calls temizle (eğer varsa)
DELETE FROM waiter_calls WHERE tenant_id IN (
  SELECT id FROM tenants WHERE slug LIKE 'test%'
);

-- 4. Products temizle
DELETE FROM products WHERE tenant_id IN (
  SELECT id FROM tenants WHERE slug LIKE 'test%'
);

-- 5. Categories temizle
DELETE FROM categories WHERE tenant_id IN (
  SELECT id FROM tenants WHERE slug LIKE 'test%'
);

-- 6. Settings temizle
DELETE FROM settings WHERE tenant_id IN (
  SELECT id FROM tenants WHERE slug LIKE 'test%'
);

-- 7. Admin users temizle (test tenant'lara ait)
DELETE FROM admin_users WHERE tenant_id IN (
  SELECT id FROM tenants WHERE slug LIKE 'test%'
);

-- 8. Test tenant'ları sil
DELETE FROM tenants WHERE slug LIKE 'test%';

-- 9. Supabase Auth users temizle (DİKKAT: Bu kullanıcıların email adreslerini listeleyin önce!)
-- İsterseniz manuel olarak Supabase Dashboard'dan silin
-- veya aşağıdaki query'yi uncomment edin:

-- DELETE FROM auth.users WHERE email LIKE '%test%';
-- veya specific email:
-- DELETE FROM auth.users WHERE email = 'test@example.com';

-- 10. Verify cleanup
SELECT 'Remaining tenants:' as info, COUNT(*) as count FROM tenants;
SELECT 'Remaining admin_users:' as info, COUNT(*) as count FROM admin_users;
SELECT 'Remaining payment_transactions:' as info, COUNT(*) as count FROM payment_transactions;

-- 11. Liste tüm mevcut tenants (kontrol için)
SELECT id, slug, business_name, subscription_plan, created_at 
FROM tenants 
ORDER BY created_at DESC;
