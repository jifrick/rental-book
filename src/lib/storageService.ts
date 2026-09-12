import type { Customer, Tool, Rental, ShopSettings, Category, ToolStatus, Shop, MasterTool } from '../types/database';
import { INITIAL_CUSTOMERS, INITIAL_TOOLS, INITIAL_RENTALS, INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_SHOPS, INITIAL_MASTER_TOOLS, DEFAULT_SHOP_ID } from './seedData';
import { isSupabaseConfigured, supabase } from './supabase';

const STORAGE_KEYS = {
  SHOPS: 'tool_rental_shops_v2',
  MASTER_TOOLS: 'tool_rental_master_tools_v1',
  SETTINGS: 'tool_rental_settings_v2',
  CATEGORIES: 'tool_rental_categories_v1',
  CUSTOMERS: 'tool_rental_customers_v2',
  TOOLS: 'tool_rental_tools_v3',
  RENTALS: 'tool_rental_rentals_v2',
};

type StorageListener = () => void;
const listeners = new Set<StorageListener>();

export function subscribeToStore(listener: StorageListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

function getLocalItem<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultVal;
  }
}

function setLocalItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    notifyListeners();
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Global initialization
export function initializeStorage() {
  getLocalItem(STORAGE_KEYS.SHOPS, INITIAL_SHOPS);
  getLocalItem(STORAGE_KEYS.MASTER_TOOLS, INITIAL_MASTER_TOOLS);
  getLocalItem(STORAGE_KEYS.SETTINGS, [INITIAL_SETTINGS]);
  getLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  getLocalItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  getLocalItem(STORAGE_KEYS.TOOLS, INITIAL_TOOLS);
  getLocalItem(STORAGE_KEYS.RENTALS, INITIAL_RENTALS);

  if (isSupabaseConfigured) {
    // Sync shops
    Promise.resolve(supabase.from('shops').select('*')).then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setLocalItem(STORAGE_KEYS.SHOPS, data);
      }
    }).catch(console.error);

    // Sync master_tools
    Promise.resolve(supabase.from('master_tools').select('*')).then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setLocalItem(STORAGE_KEYS.MASTER_TOOLS, data);
      }
    }).catch(console.error);
  }
}

initializeStorage();

// ==========================================
// SHOPS (Admin API)
// ==========================================

export function getShops(): Shop[] {
  const rawShops = getLocalItem<Shop[]>(STORAGE_KEYS.SHOPS, INITIAL_SHOPS);
  return rawShops.map((s) => {
    const seedMatch = INITIAL_SHOPS.find((init) => init.id === s.id);
    return {
      ...s,
      email: s.email || seedMatch?.email || '',
      status: s.status || seedMatch?.status || 'ACTIVE',
    };
  });
}

export function getShopById(shopId: string): Shop | undefined {
  return getShops().find((s) => s.id === shopId);
}

export function getShopByEmail(email: string): Shop | undefined {
  if (!email) return undefined;
  const cleanEmail = email.trim().toLowerCase();
  return getShops().find((s) => (s.email || '').trim().toLowerCase() === cleanEmail);
}

export function createShop(data: {
  name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  temp_password?: string;
  use_default_tools?: boolean;
}): Shop {
  const shops = getShops();
  const cleanEmail = (data.email || '').trim().toLowerCase();
  const existingEmail = shops.find(s => (s.email || '').trim().toLowerCase() === cleanEmail);
  if (existingEmail) {
    throw new Error(`An account with email "${cleanEmail}" already exists.`);
  }

  const shopId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `55555555-${Date.now().toString().slice(-4)}-4000-8000-${Math.floor(Math.random()*1e12).toString().padStart(12, '0')}`;

  const newShop: Shop = {
    id: shopId,
    name: data.name.trim(),
    owner_name: data.owner_name.trim(),
    email: cleanEmail,
    phone: data.phone.trim(),
    address: data.address.trim(),
    status: 'ACTIVE',
    is_onboarded: false,
    is_temp_password: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updatedShops = [newShop, ...shops];
  setLocalItem(STORAGE_KEYS.SHOPS, updatedShops);

  // Initialize shop settings
  const allSettings = getLocalItem<ShopSettings[]>(STORAGE_KEYS.SETTINGS, [INITIAL_SETTINGS]);
  const newSetting: ShopSettings = {
    id: `set-${Date.now()}`,
    shop_id: newShop.id,
    shop_name: newShop.name,
    owner_name: newShop.owner_name,
    phone: newShop.phone,
    address: newShop.address,
    currency: '₹',
    timezone: 'Asia/Kolkata',
    updated_at: new Date().toISOString(),
  };
  setLocalItem(STORAGE_KEYS.SETTINGS, [newSetting, ...allSettings]);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('shops').insert([newShop])).catch(console.error);
    Promise.resolve(supabase.from('settings').insert([newSetting])).catch(console.error);
  }

  return newShop;
}

export function updateShopStatus(shopId: string, status: 'ACTIVE' | 'SUSPENDED'): Shop {
  const shops = getShops();
  const index = shops.findIndex(s => s.id === shopId);
  if (index === -1) throw new Error('Shop not found');

  const updated = { ...shops[index], status, updated_at: new Date().toISOString() };
  shops[index] = updated;
  setLocalItem(STORAGE_KEYS.SHOPS, shops);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('shops').update({ status, updated_at: updated.updated_at }).eq('id', shopId)).catch(console.error);
  }

  return updated;
}

export function markPasswordChanged(shopId: string) {
  const shops = getShops();
  const index = shops.findIndex(s => s.id === shopId);
  if (index === -1) return;

  shops[index] = { ...shops[index], is_temp_password: false, updated_at: new Date().toISOString() };
  setLocalItem(STORAGE_KEYS.SHOPS, shops);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('shops').update({ is_temp_password: false }).eq('id', shopId)).catch(console.error);
  }
}

// ==========================================
// MASTER TOOL CATALOG (Admin API)
// ==========================================

export function getMasterTools(): MasterTool[] {
  return getLocalItem<MasterTool[]>(STORAGE_KEYS.MASTER_TOOLS, INITIAL_MASTER_TOOLS);
}

export function addMasterTool(data: { name: string; category_name: string; description?: string }): MasterTool {
  const masterTools = getMasterTools();
  const existing = masterTools.find(m => m.name.trim().toLowerCase() === data.name.trim().toLowerCase());
  if (existing) {
    throw new Error(`Master tool "${data.name}" already exists in the catalog.`);
  }

  const newTool: MasterTool = {
    id: `mtool-${Date.now()}`,
    name: data.name.trim(),
    category_name: data.category_name.trim(),
    description: data.description?.trim() || '',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updated = [newTool, ...masterTools];
  setLocalItem(STORAGE_KEYS.MASTER_TOOLS, updated);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('master_tools').insert([newTool])).catch(console.error);
  }

  return newTool;
}

export function toggleMasterToolStatus(id: string, is_active: boolean): MasterTool {
  const masterTools = getMasterTools();
  const index = masterTools.findIndex(m => m.id === id);
  if (index === -1) throw new Error('Master tool not found');

  const updated = { ...masterTools[index], is_active, updated_at: new Date().toISOString() };
  masterTools[index] = updated;
  setLocalItem(STORAGE_KEYS.MASTER_TOOLS, masterTools);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('master_tools').update({ is_active, updated_at: updated.updated_at }).eq('id', id)).catch(console.error);
  }

  return updated;
}

// ==========================================
// SHOP ONBOARDING WIZARD
// ==========================================

export function onboardShop(
  shopId: string,
  selectedMasterTools: { name: string; category_name: string; machine_count: number; prefix: string }[]
) {
  const shops = getShops();
  const shopIndex = shops.findIndex(s => s.id === shopId);
  if (shopIndex === -1) throw new Error('Shop not found');

  const createdTools: Tool[] = [];
  const currentTools = getTools(shopId);

  selectedMasterTools.forEach(mt => {
    if (mt.machine_count <= 0) return;
    const prefix = mt.prefix.trim().toUpperCase();

    for (let i = 1; i <= mt.machine_count; i++) {
      const codeNum = i.toString().padStart(2, '0');
      const toolCode = `${prefix}-${codeNum}`;

      // Skip if code exists for this shop
      if (currentTools.some(t => t.tool_code === toolCode)) continue;

      const toolId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `33333333-${Date.now().toString().slice(-4)}-4000-8000-${Math.floor(Math.random()*1e12).toString().padStart(12, '0')}`;

      const newTool: Tool = {
        id: toolId,
        shop_id: shopId,
        name: mt.name,
        category_name: mt.category_name,
        tool_code: toolCode,
        condition: 'GOOD',
        status: 'AVAILABLE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      createdTools.push(newTool);
    }
  });

  // Save tools
  const allTools = getLocalItem<Tool[]>(STORAGE_KEYS.TOOLS, INITIAL_TOOLS);
  setLocalItem(STORAGE_KEYS.TOOLS, [...createdTools, ...allTools]);

  // Mark shop as onboarded
  shops[shopIndex] = { ...shops[shopIndex], is_onboarded: true, updated_at: new Date().toISOString() };
  setLocalItem(STORAGE_KEYS.SHOPS, shops);

  if (isSupabaseConfigured) {
    if (createdTools.length > 0) {
      Promise.resolve(supabase.from('tools').insert(createdTools)).catch(console.error);
    }
    Promise.resolve(supabase.from('shops').update({ is_onboarded: true }).eq('id', shopId)).catch(console.error);
  }
}

// ==========================================
// TENANT SHOP SETTINGS
// ==========================================

export function getSettings(shopId: string = DEFAULT_SHOP_ID): ShopSettings {
  const allSettings = getLocalItem<ShopSettings[]>(STORAGE_KEYS.SETTINGS, [INITIAL_SETTINGS]);
  const found = allSettings.find(s => s.shop_id === shopId);
  if (found) return found;

  const shop = getShopById(shopId);
  const fallback: ShopSettings = {
    id: `set-${shopId}`,
    shop_id: shopId,
    shop_name: shop?.name || 'My Rental Shop',
    owner_name: shop?.owner_name || 'Shop Owner',
    phone: shop?.phone || '',
    address: shop?.address || '',
    currency: '₹',
    timezone: 'Asia/Kolkata',
    updated_at: new Date().toISOString(),
  };

  setLocalItem(STORAGE_KEYS.SETTINGS, [fallback, ...allSettings]);
  return fallback;
}

export function updateSettings(updates: Partial<ShopSettings>, shopId: string = DEFAULT_SHOP_ID): ShopSettings {
  const allSettings = getLocalItem<ShopSettings[]>(STORAGE_KEYS.SETTINGS, [INITIAL_SETTINGS]);
  const index = allSettings.findIndex(s => s.shop_id === shopId);

  const current = index !== -1 ? allSettings[index] : getSettings(shopId);
  const updated: ShopSettings = { ...current, ...updates, updated_at: new Date().toISOString() };

  if (index !== -1) {
    allSettings[index] = updated;
  } else {
    allSettings.push(updated);
  }
  setLocalItem(STORAGE_KEYS.SETTINGS, allSettings);

  // Sync to Shops list as well for consistency
  const shops = getShops();
  const shopIdx = shops.findIndex(s => s.id === shopId);
  if (shopIdx !== -1) {
    if (updates.shop_name) shops[shopIdx].name = updates.shop_name;
    if (updates.owner_name) shops[shopIdx].owner_name = updates.owner_name;
    if (updates.phone) shops[shopIdx].phone = updates.phone;
    if (updates.address) shops[shopIdx].address = updates.address;
    shops[shopIdx].updated_at = new Date().toISOString();
    setLocalItem(STORAGE_KEYS.SHOPS, shops);

    if (isSupabaseConfigured) {
      Promise.resolve(supabase.from('shops').update(shops[shopIdx]).eq('id', shopId)).catch(console.error);
    }
  }

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('settings').upsert([updated])).catch(console.error);
  }

  return updated;
}

// ==========================================
// CATEGORIES
// ==========================================

export function getCategories(): Category[] {
  return getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

// ==========================================
// TENANT CUSTOMERS
// ==========================================

export function getCustomers(shopId: string = DEFAULT_SHOP_ID): Customer[] {
  const customers = getLocalItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  return customers
    .filter(c => c.shop_id === shopId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function addCustomer(
  data: Omit<Customer, 'id' | 'shop_id' | 'created_at' | 'updated_at'>,
  shopId: string = DEFAULT_SHOP_ID
): Customer {
  const shopCustomers = getCustomers(shopId);
  
  const existing = shopCustomers.find((c) => c.phone.trim() === data.phone.trim());
  if (existing) {
    throw new Error(`Customer with phone number ${data.phone} already exists (${existing.name}).`);
  }

  const newCustomer: Customer = {
    ...data,
    id: `cust-${Date.now()}`,
    shop_id: shopId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const allCustomers = getLocalItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  setLocalItem(STORAGE_KEYS.CUSTOMERS, [newCustomer, ...allCustomers]);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('customers').insert([newCustomer])).catch(console.error);
  }

  return newCustomer;
}

export function updateCustomer(id: string, data: Partial<Customer>, shopId: string = DEFAULT_SHOP_ID): Customer {
  const allCustomers = getLocalItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  const index = allCustomers.findIndex((c) => c.id === id && c.shop_id === shopId);
  if (index === -1) throw new Error('Customer not found');

  const updated: Customer = {
    ...allCustomers[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  allCustomers[index] = updated;
  setLocalItem(STORAGE_KEYS.CUSTOMERS, allCustomers);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('customers').update(updated).eq('id', id).eq('shop_id', shopId)).catch(console.error);
  }

  return updated;
}

// ==========================================
// TENANT TOOLS / PHYSICAL INVENTORY
// ==========================================

export function getTools(shopId: string = DEFAULT_SHOP_ID): Tool[] {
  const tools = getLocalItem<Tool[]>(STORAGE_KEYS.TOOLS, INITIAL_TOOLS);
  return tools
    .filter(t => t.shop_id === shopId)
    .sort((a, b) => a.tool_code.localeCompare(b.tool_code));
}

export function addTool(
  data: Omit<Tool, 'id' | 'shop_id' | 'created_at' | 'updated_at'>,
  shopId: string = DEFAULT_SHOP_ID
): Tool {
  const shopTools = getTools(shopId);

  const codeFormatted = data.tool_code.trim().toUpperCase();
  const existing = shopTools.find((t) => t.tool_code.toUpperCase() === codeFormatted);
  if (existing) {
    throw new Error(`Tool with code "${codeFormatted}" already exists in your shop (${existing.name}).`);
  }

  const toolId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `33333333-${Date.now().toString().slice(-4)}-4000-8000-${Math.floor(Math.random()*1e12).toString().padStart(12, '0')}`;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.category_id || '');
  const categoryIdToSave = isUuid ? data.category_id : null;

  const newTool: Tool = {
    ...data,
    shop_id: shopId,
    tool_code: codeFormatted,
    id: toolId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const allTools = getLocalItem<Tool[]>(STORAGE_KEYS.TOOLS, INITIAL_TOOLS);
  setLocalItem(STORAGE_KEYS.TOOLS, [newTool, ...allTools]);

  if (isSupabaseConfigured) {
    const supabasePayload = {
      id: newTool.id,
      shop_id: shopId,
      name: newTool.name,
      category_id: categoryIdToSave,
      tool_code: newTool.tool_code,
      description: newTool.description || '',
      condition: newTool.condition || 'GOOD',
      status: newTool.status || 'AVAILABLE',
      created_at: newTool.created_at,
      updated_at: newTool.updated_at,
    };

    Promise.resolve(
      supabase.from('tools').insert([supabasePayload])
    ).catch(console.error);
  }

  return newTool;
}

export function updateToolStatus(
  id: string,
  status: ToolStatus,
  condition?: Tool['condition'],
  shopId: string = DEFAULT_SHOP_ID
): Tool {
  const allTools = getLocalItem<Tool[]>(STORAGE_KEYS.TOOLS, INITIAL_TOOLS);
  const index = allTools.findIndex((t) => t.id === id && t.shop_id === shopId);
  if (index === -1) throw new Error('Tool not found');

  const updated: Tool = {
    ...allTools[index],
    status,
    ...(condition ? { condition } : {}),
    updated_at: new Date().toISOString(),
  };

  allTools[index] = updated;
  setLocalItem(STORAGE_KEYS.TOOLS, allTools);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('tools').update(updated).eq('id', id).eq('shop_id', shopId)).catch(console.error);
  }

  return updated;
}

export function updateTool(id: string, updates: Partial<Tool>, shopId: string = DEFAULT_SHOP_ID): Tool {
  const allTools = getLocalItem<Tool[]>(STORAGE_KEYS.TOOLS, INITIAL_TOOLS);
  const index = allTools.findIndex((t) => t.id === id && t.shop_id === shopId);
  if (index === -1) throw new Error('Tool not found');

  const updated: Tool = {
    ...allTools[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  allTools[index] = updated;
  setLocalItem(STORAGE_KEYS.TOOLS, allTools);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('tools').update(updated).eq('id', id).eq('shop_id', shopId)).catch(console.error);
  }

  return updated;
}

// ==========================================
// TENANT RENTALS
// ==========================================

export function getRentals(shopId: string = DEFAULT_SHOP_ID): Rental[] {
  const rentals = getLocalItem<Rental[]>(STORAGE_KEYS.RENTALS, INITIAL_RENTALS);
  return rentals
    .filter(r => r.shop_id === shopId)
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
}

export function getRentalById(id: string, shopId: string = DEFAULT_SHOP_ID): Rental | undefined {
  return getRentals(shopId).find((r) => r.id === id);
}

export function createRental(
  data: {
    customer_id: string;
    tool_id: string;
    expected_return_at?: string | null;
    deposit_amount?: number;
    notes?: string;
  },
  shopId: string = DEFAULT_SHOP_ID
): Rental {
  const shop = getShopById(shopId);
  if (shop && shop.status === 'SUSPENDED') {
    throw new Error(`Shop "${shop.name}" is currently SUSPENDED by Platform Admin. New rentals cannot be created.`);
  }

  const customers = getCustomers(shopId);
  const tools = getTools(shopId);

  const customer = customers.find((c) => c.id === data.customer_id);
  if (!customer) throw new Error('Selected customer not found');

  const tool = tools.find((t) => t.id === data.tool_id);
  if (!tool) throw new Error('Selected tool not found');

  if (tool.status === 'RENTED') {
    throw new Error(`This tool (${tool.name} ${tool.tool_code}) is already rented.`);
  }

  if (tool.status === 'MAINTENANCE') {
    throw new Error(`This tool (${tool.name} ${tool.tool_code}) is currently under maintenance.`);
  }

  const shopRentals = getRentals(shopId);
  const maxNum = shopRentals.reduce((acc, r) => {
    const num = parseInt(r.rental_code.replace(/\D/g, ''), 10);
    return isNaN(num) ? acc : Math.max(acc, num);
  }, 1000);
  const nextRentalCode = `R-${maxNum + 1}`;

  const startedAt = new Date().toISOString();

  const newRental: Rental = {
    id: `rent-${Date.now()}`,
    shop_id: shopId,
    rental_code: nextRentalCode,
    customer_id: customer.id,
    customer_name: customer.name,
    customer_phone: customer.phone,
    customer_address: customer.address,
    tool_id: tool.id,
    tool_name: tool.name,
    tool_code: tool.tool_code,
    category_name: tool.category_name,
    started_at: startedAt,
    expected_return_at: data.expected_return_at || null,
    status: 'ACTIVE',
    rental_amount: 0,
    deposit_amount: data.deposit_amount || 0,
    late_fee: 0,
    damage_fee: 0,
    other_fee: 0,
    total_amount: 0,
    notes: data.notes || '',
    created_at: startedAt,
    updated_at: startedAt,
  };

  const allRentals = getLocalItem<Rental[]>(STORAGE_KEYS.RENTALS, INITIAL_RENTALS);
  setLocalItem(STORAGE_KEYS.RENTALS, [newRental, ...allRentals]);

  // Update physical tool status to RENTED
  updateToolStatus(tool.id, 'RENTED', undefined, shopId);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('rentals').insert([newRental])).catch(console.error);
  }

  return newRental;
}

export function completeReturn(
  rentalId: string,
  data: {
    returned_at?: string;
    return_condition: Tool['condition'];
    rental_amount: number;
    late_fee?: number;
    damage_fee?: number;
    other_fee?: number;
    damage_notes?: string;
    notes?: string;
    payment_method: Rental['payment_method'];
    payment_status: Rental['payment_status'];
    amount_paid: number;
  },
  shopId: string = DEFAULT_SHOP_ID
): Rental {
  const allRentals = getLocalItem<Rental[]>(STORAGE_KEYS.RENTALS, INITIAL_RENTALS);
  const index = allRentals.findIndex((r) => r.id === rentalId && r.shop_id === shopId);
  if (index === -1) throw new Error('Rental record not found');

  const current = allRentals[index];
  if (current.status === 'RETURNED') {
    throw new Error('This rental has already been returned.');
  }

  const returnedAt = data.returned_at || new Date().toISOString();
  const rentalAmount = Math.max(0, Number(data.rental_amount) || 0);
  const lateFee = Math.max(0, Number(data.late_fee) || 0);
  const damageFee = Math.max(0, Number(data.damage_fee) || 0);
  const otherFee = Math.max(0, Number(data.other_fee) || 0);
  const totalAmount = rentalAmount + lateFee + damageFee + otherFee;

  const updatedRental: Rental = {
    ...current,
    returned_at: returnedAt,
    status: 'RETURNED',
    return_condition: data.return_condition,
    rental_amount: rentalAmount,
    late_fee: lateFee,
    damage_fee: damageFee,
    other_fee: otherFee,
    total_amount: totalAmount,
    damage_notes: data.damage_notes || '',
    notes: data.notes || current.notes,
    payment_method: data.payment_method,
    payment_status: data.payment_status,
    amount_paid: data.amount_paid,
    updated_at: new Date().toISOString(),
  };

  allRentals[index] = updatedRental;
  setLocalItem(STORAGE_KEYS.RENTALS, allRentals);

  const nextToolStatus: ToolStatus =
    data.return_condition === 'DAMAGED' || data.return_condition === 'NEEDS_MAINTENANCE'
      ? 'MAINTENANCE'
      : 'AVAILABLE';

  updateToolStatus(current.tool_id, nextToolStatus, data.return_condition, shopId);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('rentals').update(updatedRental).eq('id', rentalId).eq('shop_id', shopId)).catch(console.error);
  }

  return updatedRental;
}
