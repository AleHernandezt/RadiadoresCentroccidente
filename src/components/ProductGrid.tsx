import type { Product } from '../types/database';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onSell: (id: string) => void;
  onEdit: (product: Product) => void;
  sellingId: string | null;
  loading: boolean;
}

export default function ProductGrid({ products, onSell, onEdit, sellingId, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-[#dbeafe] rounded-xl h-64"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-4xl mb-4">📦</div>
        <p className="text-[#0f2042] text-lg font-medium">No se encontraron productos</p>
        <p className="text-gray-500 text-sm mt-1">Intenta con otra búsqueda o agrega un nuevo producto.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onSell={onSell}
          onEdit={onEdit}
          isSelling={sellingId === product.id}
        />
      ))}
    </div>
  );
}
