-- Add basic customization fields to hero section
-- Keeps it simple with just URL inputs for images and links

-- Add logo URL, background image, and other hero fields
UPDATE landing_page_content
SET content = content || jsonb_build_object(
  'logoUrl', '',
  'backgroundImage', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
  'buttonText', '3 Gün Ücretsiz Dene',
  'buttonLink', '/register',
  'badgeText', '🎉 3 Gün Boyunca Tamamen Ücretsiz!'
)
WHERE section_key = 'hero';

COMMENT ON TABLE landing_page_content IS 'Landing page sections with customizable content including logo, images, and text';
