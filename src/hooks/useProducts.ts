import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFormData } from '../types/database';
import * as productService from '../services/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await productService.fetchProducts();
    if (err) {
      setError(err.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = async (formData: ProductFormData) => {
    const { error: err } = await productService.createProduct(formData);
    if (err) throw new Error(err.message);
    await loadProducts();
  };

  const editProduct = async (id: string, formData: ProductFormData) => {
    const { error: err } = await productService.updateProduct(id, formData);
    if (err) throw new Error(err.message);
    await loadProducts();
  };

  const removeProduct = async (id: string) => {
    const { error: err } = await productService.deleteProduct(id);
    if (err) throw new Error(err.message);
    await loadProducts();
  };

  return { products, loading, error, addProduct, editProduct, removeProduct, refreshProducts: loadProducts };
}
