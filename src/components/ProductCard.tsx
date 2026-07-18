import { useState } from 'react';
import type { Product } from '../types/database';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onSell: (id: string) => void;
  onEdit: (product: Product) => void;
  isSelling: boolean;
}

export default function ProductCard({ product, onSell, onEdit, isSelling }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const stockBadgeClass = () => {
    if (product.stock === 0) return 'bg-red-100 text-red-700';
    if (product.stock <= 5) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  const getCarModelInfo = () => {
    if (product.car_model && product.year) return `${product.car_model} • ${product.year}`;
    if (product.car_model) return product.car_model;
    if (product.year) return String(product.year);
    return null;
  };

  const modelInfo = getCarModelInfo();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden hover:scale-[1.02] transition-all duration-200 flex flex-col h-full border border-gray-100">
      <div className="aspect-[4/3] bg-[#dbeafe] relative overflow-hidden flex-shrink-0">
        {!imageError && product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#2563eb]/40">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-semibold text-[#0f2042] text-sm leading-tight line-clamp-2" title={product.name}>
          {product.name}
        </h3>

        <p className="text-[#2563eb] font-bold text-base mt-1">
          {formatPrice(product.price)}
        </p>

        {modelInfo && (
          <p className="text-gray-500 text-xs mt-1 truncate" title={modelInfo}>
            {modelInfo}
          </p>
        )}

        <p className="text-gray-400 text-xs font-mono mt-1 truncate" title={product.serial}>
          {product.serial}
        </p>

        <div className="mt-2 mb-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${stockBadgeClass()}`}>
            Stock: {product.stock}
          </span>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 text-gray-400 hover:text-[#0f2042] hover:bg-gray-100 rounded-lg transition-colors"
            title="Editar producto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => onSell(product.id)}
            disabled={product.stock === 0 || isSelling}
            className="bg-[#143264] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#1a4580] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[80px]"
          >
            {isSelling ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Descontar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
