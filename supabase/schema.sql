CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Reset tables for clean multi-tenant SaaS schema setup
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.rentals CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.master_tools CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.shop_users CASCADE;
DROP TABLE IF EXISTS public.shops CASCADE;

-- 1. SHOPS TABLE (Multi-Tenant Workspaces)
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT,
  status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED'
  is_onboarded BOOLEAN DEFAULT false,
  is_temp_password BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SHOP USERS TABLE (User -> Shop & Role Relationship)
CREATE TABLE public.shop_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'shop_owner', -- 'platform_admin', 'shop_owner', 'shop_staff'
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT shop_users_user_id_key UNIQUE (user_id)
);

-- 3. MASTER TOOLS TABLE (Central Platform Catalog)
CREATE TABLE public.master_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUSTOMERS TABLE (Scoped to Shop)
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

-- 6. TOOLS TABLE (Physical Shop Machines Scoped to Shop)
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

-- 7. RENTALS TABLE (Scoped to Shop)
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

-- 8. PAYMENTS TABLE (Scoped to Shop)
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

-- 9. SETTINGS TABLE (Scoped to Shop)
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
CREATE INDEX idx_shops_email ON public.shops(email);
CREATE INDEX idx_shop_users_user_id ON public.shop_users(user_id);
CREATE INDEX idx_shop_users_shop_id ON public.shop_users(shop_id);
CREATE INDEX idx_customers_shop_id ON public.customers(shop_id);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_tools_shop_id ON public.tools(shop_id);
CREATE INDEX idx_tools_code ON public.tools(tool_code);
CREATE INDEX idx_rentals_shop_id ON public.rentals(shop_id);
CREATE INDEX idx_rentals_status ON public.rentals(status);
CREATE INDEX idx_settings_shop_id ON public.settings(shop_id);

-- HELPER SECURITY DEFINER FUNCTIONS FOR RLS
CREATE OR REPLACE FUNCTION public.get_auth_shop_id()
RETURNS UUID AS $$
  SELECT shop_id FROM public.shop_users WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.shop_users WHERE user_id = auth.uid() AND role = 'platform_admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ROW LEVEL SECURITY POLICIES
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Shops RLS
CREATE POLICY "Shops tenant access" ON public.shops
  FOR ALL USING (id = public.get_auth_shop_id() OR public.is_platform_admin());

-- Shop Users RLS
CREATE POLICY "Shop users self & admin access" ON public.shop_users
  FOR ALL USING (user_id = auth.uid() OR public.is_platform_admin());

-- Master Tools & Categories RLS
CREATE POLICY "Master tools read" ON public.master_tools FOR SELECT USING (true);
CREATE POLICY "Master tools admin edit" ON public.master_tools FOR ALL USING (public.is_platform_admin());

CREATE POLICY "Categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories admin edit" ON public.categories FOR ALL USING (public.is_platform_admin());

-- Shop-specific Business Tables RLS
CREATE POLICY "Customers tenant isolation" ON public.customers
  FOR ALL USING (shop_id = public.get_auth_shop_id() OR public.is_platform_admin());

CREATE POLICY "Tools tenant isolation" ON public.tools
  FOR ALL USING (shop_id = public.get_auth_shop_id() OR public.is_platform_admin());

CREATE POLICY "Rentals tenant isolation" ON public.rentals
  FOR ALL USING (shop_id = public.get_auth_shop_id() OR public.is_platform_admin());

CREATE POLICY "Payments tenant isolation" ON public.payments
  FOR ALL USING (shop_id = public.get_auth_shop_id() OR public.is_platform_admin());

CREATE POLICY "Settings tenant isolation" ON public.settings
  FOR ALL USING (shop_id = public.get_auth_shop_id() OR public.is_platform_admin());
