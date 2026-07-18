import type { Product } from '../types/database';

export function filterProducts(products: Product[], query: string): Product[] {
  // If query is empty/whitespace, return all products
  // Normalize query to lowercase, trim
  // Match against: name, price (as string), serial, car_model, year (as string)
  // Case-insensitive partial matching
  // Support multi-word queries: each word must match at least one field
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return products;
  
  const terms = trimmed.split(/\s+/);
  
  return products.filter(product => {
    const searchableText = [
      product.name,
      product.price.toString(),
      product.serial,
      product.car_model || '',
      product.year?.toString() || '',
    ].join(' ').toLowerCase();
    
    return terms.every(term => searchableText.includes(term));
  });
}
