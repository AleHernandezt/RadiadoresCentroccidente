import { describe, it, expect, vi } from 'vitest';

// Mock the supabase module
vi.mock('../src/services/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

import { supabase } from '../src/services/supabase';
import { sellProduct } from '../src/services/products';

describe('sellProduct', () => {
  it('calls the sell_product RPC with correct product id', async () => {
    const mockRpc = vi.mocked(supabase.rpc);
    mockRpc.mockResolvedValueOnce({ data: { new_stock: 4 }, error: null } as any);

    await sellProduct('test-uuid-123');

    expect(mockRpc).toHaveBeenCalledWith('sell_product', { p_id: 'test-uuid-123' });
  });

  it('returns data on successful sell', async () => {
    const mockRpc = vi.mocked(supabase.rpc);
    mockRpc.mockResolvedValueOnce({ data: { new_stock: 4 }, error: null } as any);

    const result = await sellProduct('test-uuid-123');

    expect(result.data).toEqual({ new_stock: 4 });
    expect(result.error).toBeNull();
  });

  it('returns error when product is out of stock', async () => {
    const mockRpc = vi.mocked(supabase.rpc);
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: 'Out of stock', details: '', hint: '', code: '' },
    } as any);

    const result = await sellProduct('test-uuid-456');

    expect(result.error).toBeTruthy();
    expect(result.error!.message).toBe('Out of stock');
  });

  it('returns error when product is not found', async () => {
    const mockRpc = vi.mocked(supabase.rpc);
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: 'Product not found', details: '', hint: '', code: '' },
    } as any);

    const result = await sellProduct('nonexistent-uuid');

    expect(result.error).toBeTruthy();
    expect(result.error!.message).toBe('Product not found');
  });
});
