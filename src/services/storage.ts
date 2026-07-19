import { supabase } from './supabase';

const BUCKET_NAME = 'product-images';

/**
 * Upload an image file to Supabase Storage and return the public URL.
 */
export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  // Generate a unique filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl, error: null };
}
