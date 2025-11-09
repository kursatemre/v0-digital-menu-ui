-- Allow anonymous users to read their own successful payments (for success page)
create policy "Anonymous users can view successful payments by merchant_oid"
  on public.payment_transactions
  for select
  to anon
  using (payment_status = 'success');

-- Also allow authenticated users to read all their payments
drop policy if exists "Users can view own payments" on public.payment_transactions;

create policy "Authenticated users can view own payments"
  on public.payment_transactions
  for select
  to authenticated
  using (
    tenant_id in (
      select id from public.tenants where auth_user_id = auth.uid()
    )
  );
