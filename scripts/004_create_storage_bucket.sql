-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow public access
CREATE POLICY "Public Access for Images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Allow Upload for Images" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Allow Update for Images" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'menu-images');

CREATE POLICY "Allow Delete for Images" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'menu-images');
