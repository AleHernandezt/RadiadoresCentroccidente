import { describe, it, expect } from 'vitest';
import { filterProducts } from '../src/utils/search';
import { Product } from '../src/types/database';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Radiador Toyota Corolla',
    price: 150.00,
    serial: 'RAD-001',
    image_url: 'https://example.com/img1.jpg',
    car_model: 'Corolla',
    year: 2020,
    stock: 5,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Radiador Chevrolet Aveo',
    price: 120.50,
    serial: 'RAD-002',
    image_url: 'https://example.com/img2.jpg',
    car_model: 'Aveo',
    year: 2018,
    stock: 0,
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Condensador Ford Fiesta',
    price: 200.00,
    serial: 'CON-003',
    image_url: 'https://example.com/img3.jpg',
    car_model: 'Fiesta',
    year: 2015,
    stock: 12,
    created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Radiador Universal Grande',
    price: 95.00,
    serial: 'RAD-004',
    image_url: 'https://example.com/img4.jpg',
    car_model: null,
    year: null,
    stock: 3,
    created_at: '2024-01-04T00:00:00Z',
  },
];

describe('filterProducts', () => {
  it('returns all products when query is empty', () => {
    expect(filterProducts(mockProducts, '')).toEqual(mockProducts);
  });

  it('returns all products when query is only whitespace', () => {
    expect(filterProducts(mockProducts, '   ')).toEqual(mockProducts);
  });

  it('filters by product name (case-insensitive)', () => {
    const result = filterProducts(mockProducts, 'radiador');
    expect(result).toHaveLength(3);
    expect(result.map(p => p.id)).toEqual(['1', '2', '4']);
  });

  it('filters by product name (partial match)', () => {
    const result = filterProducts(mockProducts, 'toyota');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Radiador Toyota Corolla');
  });

  it('filters by serial number', () => {
    const result = filterProducts(mockProducts, 'CON-003');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Condensador Ford Fiesta');
  });

  it('filters by serial number (case-insensitive)', () => {
    const result = filterProducts(mockProducts, 'rad-001');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by car model', () => {
    const result = filterProducts(mockProducts, 'corolla');
    expect(result).toHaveLength(1);
    expect(result[0].car_model).toBe('Corolla');
  });

  it('filters by year', () => {
    const result = filterProducts(mockProducts, '2018');
    expect(result).toHaveLength(1);
    expect(result[0].year).toBe(2018);
  });

  it('filters by price', () => {
    const result = filterProducts(mockProducts, '120.5');
    expect(result).toHaveLength(1);
    expect(result[0].price).toBe(120.50);
  });

  it('returns empty array for no matches', () => {
    const result = filterProducts(mockProducts, 'xyznonexistent');
    expect(result).toHaveLength(0);
  });

  it('handles multi-word queries (all terms must match)', () => {
    const result = filterProducts(mockProducts, 'radiador 2020');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Radiador Toyota Corolla');
  });

  it('handles products with null car_model and year', () => {
    const result = filterProducts(mockProducts, 'universal');
    expect(result).toHaveLength(1);
    expect(result[0].car_model).toBeNull();
  });

  it('handles empty products array', () => {
    expect(filterProducts([], 'anything')).toEqual([]);
  });
});
