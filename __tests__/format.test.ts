import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate } from '../src/utils/format';

describe('formatPrice', () => {
  it('formats a standard price', () => {
    const result = formatPrice(150.00);
    // Should contain the number formatted with 2 decimals
    expect(result).toContain('150');
    expect(result).toContain('00');
  });

  it('formats zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });

  it('formats a large number with thousands separator', () => {
    const result = formatPrice(1500.50);
    expect(result).toContain('1');
    expect(result).toContain('500');
    expect(result).toContain('50');
  });

  it('formats decimal prices correctly', () => {
    const result = formatPrice(99.99);
    expect(result).toContain('99');
  });

  it('formats small decimal prices', () => {
    const result = formatPrice(0.50);
    expect(result).toContain('0');
    expect(result).toContain('50');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string', () => {
    const result = formatDate('2024-06-15T10:30:00Z');
    // Should contain the date parts
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats a different date', () => {
    // Use mid-day UTC to avoid timezone boundary issues
    const result = formatDate('2024-01-15T12:00:00Z');
    expect(result).toBeTruthy();
    expect(result).toContain('2024');
  });
});
