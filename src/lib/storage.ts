import { supabase } from './supabase';

const BUCKET = 'product-images';

export async function uploadProductImage(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${fileName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) return null;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/');
    const filePath = parts[parts.length - 1];
    if (filePath) {
      await supabase.storage.from(BUCKET).remove([filePath]);
    }
  } catch {
    // ignore — external URLs can't be deleted from storage
  }
}
