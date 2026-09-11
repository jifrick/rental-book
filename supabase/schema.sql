CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Reset tables for clean multi-tenant SaaS schema setup
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.rentals CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.master_tools CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.shops CASCADE;

-- 1. SHOPS TABLE (Multi-Tenant Workspaces)
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  user_id_code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'ACTIVE',
  is_onboarded BOOLEAN DEFAULT false,
  is_temp_password BOOLEAN DEFAULT true,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MASTER TOOLS TABLE (Central Platform Catalog)
CREATE TABLE public.master_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMERS TABLE (Scoped to Shop)
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT customers_shop_phone_key UNIQUE (shop_id, phone)
);

-- 5. TOOLS TABLE (Physical Shop Machines Scoped to Shop)
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  master_tool_id UUID REFERENCES public.master_tools(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT,
  tool_code TEXT NOT NULL,
  description TEXT,
  condition TEXT DEFAULT 'GOOD',
  status TEXT DEFAULT 'AVAILABLE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT tools_shop_code_key UNIQUE (shop_id, tool_code)
);

-- 6. RENTALS TABLE (Scoped to Shop)
CREATE TABLE public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  rental_code TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expected_return_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  rental_amount DECIMAL(10,2) DEFAULT 0,
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  late_fee DECIMAL(10,2) DEFAULT 0,
  damage_fee DECIMAL(10,2) DEFAULT 0,
  other_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  return_condition TEXT,
  damage_notes TEXT,
  notes TEXT,
  payment_status TEXT DEFAULT 'PENDING',
  payment_method TEXT DEFAULT 'CASH',
  amount_paid DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT rentals_shop_code_key UNIQUE (shop_id, rental_code)
);

-- 7. PAYMENTS TABLE (Scoped to Shop)
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  rental_id UUID NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SETTINGS TABLE (Scoped to Shop)
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE UNIQUE,
  shop_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  currency TEXT DEFAULT '₹',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_customers_shop_id ON public.customers(shop_id);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_tools_shop_id ON public.tools(shop_id);
CREATE INDEX idx_tools_code ON public.tools(tool_code);
CREATE INDEX idx_rentals_shop_id ON public.rentals(shop_id);
CREATE INDEX idx_rentals_status ON public.rentals(status);
CREATE INDEX idx_settings_shop_id ON public.settings(shop_id);

-- ROW LEVEL SECURITY POLICIES
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read/write on shops" ON public.shops FOR ALL USING (true);
CREATE POLICY "Allow read/write on master_tools" ON public.master_tools FOR ALL USING (true);
CREATE POLICY "Allow read/write on categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow read/write on customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow read/write on tools" ON public.tools FOR ALL USING (true);
CREATE POLICY "Allow read/write on rentals" ON public.rentals FOR ALL USING (true);
CREATE POLICY "Allow read/write on payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow read/write on settings" ON public.settings FOR ALL USING (true);
