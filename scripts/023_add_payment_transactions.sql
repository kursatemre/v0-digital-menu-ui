-- Ödeme işlemlerini kaydetmek için transactions tablosu
create table public.payment_transactions (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  
  -- Ödeme bilgileri
  merchant_oid varchar(64) unique not null, -- Sipariş ID (benzersiz)
  payment_amount numeric(10, 2) not null,
  payment_type varchar(20) not null, -- 'card', 'eft' vb
  
  -- PayTR bilgileri
  paytr_token text, -- iframe token
  payment_status varchar(20) default 'pending', -- pending, success, failed, cancelled
  paytr_payment_id varchar(100), -- PayTR'den dönen işlem ID
  
  -- Müşteri bilgileri
  user_name varchar(100) not null,
  user_email varchar(255) not null,
  user_phone varchar(20) not null,
  user_address text not null,
  
  -- Sipariş detayları
  order_details jsonb not null, -- Ürün bilgileri, fiyat detayları
  
  -- Callback bilgileri
  callback_data jsonb, -- PayTR'den gelen tüm data
  callback_received_at timestamptz,
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz
);

-- Indexes
create index idx_payment_transactions_tenant_id on public.payment_transactions(tenant_id);
create index idx_payment_transactions_merchant_oid on public.payment_transactions(merchant_oid);
create index idx_payment_transactions_status on public.payment_transactions(payment_status);
create index idx_payment_transactions_created_at on public.payment_transactions(created_at desc);

-- RLS Policies
alter table public.payment_transactions enable row level security;

-- Kullanıcılar kendi ödemelerini görebilir
create policy "Users can view own payments"
  on public.payment_transactions
  for select
  to authenticated
  using (
    tenant_id in (
      select id from public.tenants where auth_user_id = auth.uid()
    )
  );

-- Sistem (service role) tüm ödemelere erişebilir
create policy "Service role has full access to payments"
  on public.payment_transactions
  for all
  to service_role
  using (true)
  with check (true);

-- Anonim kullanıcılar ödeme oluşturabilir (insert only)
create policy "Anonymous users can create payments"
  on public.payment_transactions
  for insert
  to anon
  with check (true);

-- Trigger: updated_at otomatik güncelleme
create or replace function update_payment_transactions_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  if new.payment_status = 'success' and old.payment_status != 'success' then
    new.completed_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger payment_transactions_updated_at
  before update on public.payment_transactions
  for each row
  execute function update_payment_transactions_timestamp();

-- Başarılı ödeme sonrası tenant'ı premium'a yükselt
create or replace function activate_premium_on_payment()
returns trigger as $$
begin
  if new.payment_status = 'success' and old.payment_status != 'success' then
    -- Tenant'ı premium yap
    update public.tenants
    set 
      subscription_plan = 'premium',
      subscription_status = 'active',
      subscription_end_date = now() + interval '30 days',
      updated_at = now()
    where id = new.tenant_id;
    
    raise notice 'Tenant % upgraded to premium', new.tenant_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger activate_premium_after_payment
  after update on public.payment_transactions
  for each row
  when (new.payment_status = 'success')
  execute function activate_premium_on_payment();

-- View: Ödeme istatistikleri
create or replace view public.payment_stats as
select 
  date_trunc('day', created_at) as payment_date,
  count(*) as total_payments,
  count(*) filter (where payment_status = 'success') as successful_payments,
  count(*) filter (where payment_status = 'failed') as failed_payments,
  sum(payment_amount) filter (where payment_status = 'success') as total_revenue
from public.payment_transactions
group by date_trunc('day', created_at)
order by payment_date desc;

-- Grant permissions
grant select on public.payment_stats to authenticated, service_role;
