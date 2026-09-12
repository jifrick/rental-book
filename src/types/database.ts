export type ToolCondition = 'GOOD' | 'MINOR_DAMAGE' | 'DAMAGED' | 'NEEDS_MAINTENANCE';
export type ToolStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
export type RentalStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'UPI' | 'OTHER';
export type PaymentStatus = 'PAID' | 'PARTIAL' | 'PENDING';
export type UserRole = 'platform_admin' | 'shop_owner' | 'shop_staff';
export type ShopStatus = 'ACTIVE' | 'SUSPENDED';

export interface Shop {
  id: string;
  name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  status: ShopStatus;
  is_onboarded: boolean;
  is_temp_password?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopUser {
  id: string;
  user_id: string;
  shop_id?: string;
  role: UserRole;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface MasterTool {
  id: string;
  name: string;
  category_name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  shop_id: string;
  name: string;
  phone: string;
  address: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: string;
  shop_id: string;
  master_tool_id?: string;
  name: string;
  category_id?: string;
  category_name?: string;
  tool_code: string;
  description?: string;
  condition: ToolCondition;
  status: ToolStatus;
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: string;
  shop_id: string;
  rental_code: string;
  customer_id: string;
  tool_id: string;
  
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  tool_name?: string;
  tool_code?: string;
  category_name?: string;

  started_at: string;
  expected_return_at?: string | null;
  returned_at?: string | null;
  status: RentalStatus;
  
  rental_amount: number;
  deposit_amount: number;
  late_fee: number;
  damage_fee: number;
  other_fee: number;
  total_amount: number;
  
  return_condition?: ToolCondition;
  damage_notes?: string;
  notes?: string;
  
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  amount_paid?: number;

  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  shop_id: string;
  rental_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  paid_at: string;
  created_at: string;
}

export interface ShopSettings {
  id: string;
  shop_id: string;
  shop_name: string;
  owner_name: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  updated_at: string;
}
