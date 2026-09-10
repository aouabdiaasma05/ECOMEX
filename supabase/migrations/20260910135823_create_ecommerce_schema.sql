/*
# Create e-commerce schema for small online boutique

1. New Tables
   - `products`
     - `id` (uuid, primary key)
     - `name` (text, not null)
     - `description` (text)
     - `price` (numeric, not null) — price in DA (Algerian Dinar)
     - `image_url` (text) — URL to product image (Supabase Storage or external)
     - `category` (text)
     - `available` (boolean, default true) — whether the product is in stock
     - `created_at` (timestamptz, default now())
     - `updated_at` (timestamptz, default now())
   - `orders`
     - `id` (uuid, primary key)
     - `order_number` (text, unique, not null) — human-readable order number
     - `customer_name` (text, not null)
     - `phone` (text, not null)
     - `wilaya` (text)
     - `commune` (text)
     - `address` (text, not null)
     - `product_id` (uuid, references products)
     - `product_name` (text, not null) — snapshot of product name at order time
     - `quantity` (integer, not null, default 1)
     - `unit_price` (numeric, not null) — snapshot of price at order time
     - `total_price` (numeric, not null) — unit_price * quantity
     - `note` (text) — optional customer remark
     - `status` (text, not null, default 'new') — new|confirmed|preparing|shipped|delivered|cancelled
     - `seen` (boolean, default false) — whether admin has marked the order as seen
     - `created_at` (timestamptz, default now())
     - `updated_at` (timestamptz, default now())

2. Indexes
   - `idx_products_category` on products(category)
   - `idx_products_created_at` on products(created_at desc)
   - `idx_orders_status` on orders(status)
   - `idx_orders_created_at` on orders(created_at desc)
   - `idx_orders_seen` on orders(seen)

3. Security (RLS)
   - products: SELECT is public (anon + authenticated). INSERT/UPDATE/DELETE are authenticated-only (admin).
   - orders: SELECT is authenticated-only (admin). INSERT is public (anon + authenticated) so visitors can place orders. UPDATE/DELETE are authenticated-only (admin).

4. Notes
   - Products are visible to all visitors (public read).
   - Only authenticated admin can manage products and view/update orders.
   - Visitors (anon) can create orders but cannot view them.
   - An order_number is generated automatically via a trigger.
*/

-- ============ PRODUCTS TABLE ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  category text,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
  ON products FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- ============ ORDERS TABLE ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  wilaya text,
  commune text,
  address text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'new',
  seen boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_orders" ON orders;
CREATE POLICY "admin_select_orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_seen ON orders(seen);

-- ============ UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============ ORDER NUMBER GENERATION ============
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  next_seq integer;
BEGIN
  SELECT nextval('order_number_seq') INTO next_seq;
  NEW.order_number = 'CMD-' || LPAD(next_seq::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

DROP TRIGGER IF EXISTS orders_generate_number ON orders;
CREATE TRIGGER orders_generate_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();