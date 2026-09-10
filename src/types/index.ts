export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  category?: string | null;
  available?: boolean;
}

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  wilaya: string | null;
  commune: string | null;
  address: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  note: string | null;
  status: OrderStatus;
  seen: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderInput {
  customer_name: string;
  phone: string;
  wilaya?: string | null;
  commune?: string | null;
  address: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  note?: string | null;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Nouvelle',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-orange-100 text-orange-800 border-orange-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const ORDER_STATUS_DOT: Record<OrderStatus, string> = {
  new: 'bg-amber-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-purple-500',
  shipped: 'bg-orange-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};
