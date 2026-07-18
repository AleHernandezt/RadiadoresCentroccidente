import { useState, useEffect, useMemo } from 'react';
import type { Product } from '../types/database';
import { filterProducts } from '../utils/search';

export function useSearch(products: Product[], debounceMs = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const filteredProducts = useMemo(
    () => filterProducts(products, debouncedQuery),
    [products, debouncedQuery]
  );

  return { query, setQuery, filteredProducts };
}
