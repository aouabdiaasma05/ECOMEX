import { supabase } from './supabase';
import type { Product, ProductInput, Order, OrderInput, OrderStatus } from '@/types';

// ===== Products =====

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ===== Orders =====

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createOrder(input: OrderInput): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function markOrderSeen(id: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ seen: true })
    .eq('id', id);
  if (error) throw error;
}

// ===== Realtime =====

export function subscribeToOrders(callback: (order: Order) => void): () => void {
  const channel = supabase
    .channel('orders-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        callback(payload.new as Order);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
