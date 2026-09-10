/*
# Create product images storage bucket

1. Storage
   - Create a public bucket `product-images` for storing product photos.
   - Allow public read access to all images.
   - Allow authenticated users (admin) to upload, update, and delete images.

2. Policies
   - SELECT (read): public (anon + authenticated) — anyone can view product images.
   - INSERT (upload): authenticated only — admin uploads product images.
   - UPDATE: authenticated only.
   - DELETE: authenticated only.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_upload_product_images" ON storage.objects;
CREATE POLICY "admin_upload_product_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_update_product_images" ON storage.objects;
CREATE POLICY "admin_update_product_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_delete_product_images" ON storage.objects;
CREATE POLICY "admin_delete_product_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');