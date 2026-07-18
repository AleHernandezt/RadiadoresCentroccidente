import { useState } from 'react';
import { sellProduct } from '../services/products';

export function useSellProduct(onSuccess: () => void) {
  const [sellingId, setSellingId] = useState<string | null>(null);

  const sell = async (productId: string) => {
    setSellingId(productId);
    try {
      const { error } = await sellProduct(productId);
      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Error al descontar stock');
    } finally {
      setSellingId(null);
    }
  };

  return { sell, sellingId };
}
