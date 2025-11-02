-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number TEXT,
  customer_name TEXT NOT NULL,
  phone_number TEXT,
  is_delivery BOOLEAN DEFAULT FALSE,
  items JSONB NOT NULL,
  notes TEXT,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read orders (no auth required for menu)
CREATE POLICY "Allow public to read orders"
  ON public.orders FOR SELECT
  USING (TRUE);

-- Create policy to allow anyone to create orders
CREATE POLICY "Allow public to create orders"
  ON public.orders FOR INSERT
  WITH CHECK (TRUE);

-- Create policy to allow updates to orders
CREATE POLICY "Allow public to update orders"
  ON public.orders FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

-- Create policy to allow deletion of orders
CREATE POLICY "Allow public to delete orders"
  ON public.orders FOR DELETE
  USING (TRUE);

-- Create index for faster queries
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
