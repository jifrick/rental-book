-- Tool Rental Record Book - Supabase PostgreSQL Schema Definition

-- Enable gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TOOLS TABLE (Individual Physical Machines)
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tool_code TEXT NOT NULL UNIQUE, -- e.g. DR-01, DR-02, CW-01
  description TEXT,
  condition TEXT DEFAULT 'GOOD', -- GOOD, MINOR_DAMAGE, DAMAGED, NEEDS_MAINTENANCE
  status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, RENTED, MAINTENANCE
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RENTALS TABLE
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_code TEXT NOT NULL UNIQUE, -- e.g. R-1001
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expected_return_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, RETURNED, OVERDUE, CANCELLED
  rental_amount DECIMAL(10,2) DEFAULT 0,
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  late_fee DECIMAL(10,2) DEFAULT 0,
  damage_fee DECIMAL(10,2) DEFAULT 0,
  other_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  return_condition TEXT,
  damage_notes TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RENTAL ITEMS (For potential multi-item expansion)
CREATE TABLE IF NOT EXISTS public.rental_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL, -- CASH, UPI, OTHER
  payment_status TEXT NOT NULL, -- PAID, PARTIAL, PENDING
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name TEXT DEFAULT 'CK TOOLS',
  owner_name TEXT DEFAULT 'JAMAL CK',
  phone TEXT DEFAULT '9946052379',
  address TEXT DEFAULT 'Main Road, Koolimadu, Kozhikode Kerala',
  currency TEXT DEFAULT '₹',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(name);
CREATE INDEX IF NOT EXISTS idx_tools_code ON public.tools(tool_code);
CREATE INDEX IF NOT EXISTS idx_tools_name ON public.tools(name);
CREATE INDEX IF NOT EXISTS idx_tools_status ON public.tools(status);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON public.rentals(status);
CREATE INDEX IF NOT EXISTS idx_rentals_started_at ON public.rentals(started_at);
CREATE INDEX IF NOT EXISTS idx_rentals_returned_at ON public.rentals(returned_at);

-- ROW LEVEL SECURITY POLICIES (AUTHENTICATED ACCESS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read/write on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated read/write on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated read/write on tools" ON public.tools;
DROP POLICY IF EXISTS "Allow authenticated read/write on rentals" ON public.rentals;
DROP POLICY IF EXISTS "Allow authenticated read/write on rental_items" ON public.rental_items;
DROP POLICY IF EXISTS "Allow authenticated read/write on payments" ON public.payments;
DROP POLICY IF EXISTS "Allow authenticated read/write on settings" ON public.settings;

CREATE POLICY "Allow authenticated read/write on categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on tools" ON public.tools FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on rentals" ON public.rentals FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on rental_items" ON public.rental_items FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on settings" ON public.settings FOR ALL USING (true);
