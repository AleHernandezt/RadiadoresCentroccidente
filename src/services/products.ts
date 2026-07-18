import { supabase } from './supabase';
import type { ProductFormData } from '../types/database';

export async function fetchProducts() {
  return await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function createProduct(data: ProductFormData) {
  const year = data.year.trim() === '' ? null : parseInt(data.year, 10);
  return await supabase
    .from('products')
    .insert([{ ...data, year }]);
}

export async function updateProduct(id: string, data: ProductFormData) {
  const year = data.year.trim() === '' ? null : parseInt(data.year, 10);
  return await supabase
    .from('products')
    .update({ ...data, year })
    .eq('id', id);
}

export async function deleteProduct(id: string) {
  return await supabase
    .from('products')
    .delete()
    .eq('id', id);
}

export async function sellProduct(id: string) {
  return await supabase.rpc('sell_product', { p_id: id });
}
