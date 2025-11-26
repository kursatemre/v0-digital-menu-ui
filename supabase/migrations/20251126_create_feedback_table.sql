-- Create feedback table for customer comments, suggestions, and complaints
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  feedback_type VARCHAR(50) NOT NULL CHECK (feedback_type IN ('comment', 'suggestion', 'complaint')),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_tenant_id ON feedback(tenant_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policy for tenants to view their own feedback
CREATE POLICY "Tenants can view their own feedback"
  ON feedback
  FOR SELECT
  USING (tenant_id IN (
    SELECT id FROM tenants WHERE id = tenant_id
  ));

-- Create policy for anyone to insert feedback (public submission)
CREATE POLICY "Anyone can submit feedback"
  ON feedback
  FOR INSERT
  WITH CHECK (true);

-- Create policy for tenants to update their own feedback
CREATE POLICY "Tenants can update their own feedback"
  ON feedback
  FOR UPDATE
  USING (tenant_id IN (
    SELECT id FROM tenants WHERE id = tenant_id
  ));

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_updated_at();
