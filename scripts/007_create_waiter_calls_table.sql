-- Create waiter_calls table for managing waiter call requests from customers
CREATE TABLE IF NOT EXISTS waiter_calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_number TEXT NOT NULL,
  customer_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_waiter_calls_status ON waiter_calls(status);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_waiter_calls_created_at ON waiter_calls(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE waiter_calls ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (since we're using service role key)
CREATE POLICY "Enable all operations for waiter_calls" ON waiter_calls
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_waiter_calls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_waiter_calls_updated_at
  BEFORE UPDATE ON waiter_calls
  FOR EACH ROW
  EXECUTE FUNCTION update_waiter_calls_updated_at();
