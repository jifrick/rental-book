import type { Customer, Tool, Rental, ShopSettings, Category, ToolStatus } from '../types/database';
import { INITIAL_CUSTOMERS, INITIAL_TOOLS, INITIAL_RENTALS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from './seedData';
import { isSupabaseConfigured, supabase } from './supabase';

const STORAGE_KEYS = {
  SETTINGS: 'tool_rental_settings_v1',
  CATEGORIES: 'tool_rental_categories_v1',
  CUSTOMERS: 'tool_rental_customers_v1',
  TOOLS: 'tool_rental_tools_v1',
  RENTALS: 'tool_rental_rentals_v1',
};

// Event listener system for reactive UI updates across components
type StorageListener = () => void;
const listeners = new Set<StorageListener>();

export function subscribeToStore(listener: StorageListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

// Local Storage Helper
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

// Seed initialization
export function initializeStorage() {
  getLocalItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  getLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  getLocalItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  getLocalItem(STORAGE_KEYS.TOOLS, INITIAL_TOOLS);
  getLocalItem(STORAGE_KEYS.RENTALS, INITIAL_RENTALS);
}

// Ensure init
initializeStorage();

// SETTINGS
export function getSettings(): ShopSettings {
  return getLocalItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function updateSettings(updates: Partial<ShopSettings>): ShopSettings {
  const current = getSettings();
  const updated: ShopSettings = { ...current, ...updates, updated_at: new Date().toISOString() };
  setLocalItem(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

// CATEGORIES
export function getCategories(): Category[] {
  return getLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

// CUSTOMERS
export function getCustomers(): Customer[] {
  const customers = getLocalItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  return [...customers].sort((a, b) => a.name.localeCompare(b.name));
}

export function addCustomer(data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Customer {
  const customers = getCustomers();
  
  // Duplicate check by phone
  const existing = customers.find((c) => c.phone.trim() === data.phone.trim());
  if (existing) {
    throw new Error(`Customer with phone number ${data.phone} already exists (${existing.name}).`);
  }

  const newCustomer: Customer = {
    ...data,
    id: `cust-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updatedList = [newCustomer, ...customers];
  setLocalItem(STORAGE_KEYS.CUSTOMERS, updatedList);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('customers').insert([newCustomer])).catch(console.error);
  }

  return newCustomer;
}

export function updateCustomer(id: string, data: Partial<Customer>): Customer {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Customer not found');

  const updated: Customer = {
    ...customers[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  customers[index] = updated;
  setLocalItem(STORAGE_KEYS.CUSTOMERS, customers);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('customers').update(updated).eq('id', id)).catch(console.error);
  }

  return updated;
}

// TOOLS
export function getTools(): Tool[] {
  const tools = getLocalItem<Tool[]>(STORAGE_KEYS.TOOLS, INITIAL_TOOLS);
  return [...tools].sort((a, b) => a.tool_code.localeCompare(b.tool_code));
}

export function addTool(data: Omit<Tool, 'id' | 'created_at' | 'updated_at'>): Tool {
  const tools = getTools();

  // Duplicate code check
  const codeFormatted = data.tool_code.trim().toUpperCase();
  const existing = tools.find((t) => t.tool_code.toUpperCase() === codeFormatted);
  if (existing) {
    throw new Error(`Tool with code "${codeFormatted}" already exists (${existing.name}).`);
  }

  const newTool: Tool = {
    ...data,
    tool_code: codeFormatted,
    id: `tool-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updatedList = [newTool, ...tools];
  setLocalItem(STORAGE_KEYS.TOOLS, updatedList);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('tools').insert([newTool])).catch(console.error);
  }

  return newTool;
}

export function updateToolStatus(id: string, status: ToolStatus, condition?: Tool['condition']): Tool {
  const tools = getTools();
  const index = tools.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Tool not found');

  const updated: Tool = {
    ...tools[index],
    status,
    ...(condition ? { condition } : {}),
    updated_at: new Date().toISOString(),
  };

  tools[index] = updated;
  setLocalItem(STORAGE_KEYS.TOOLS, tools);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('tools').update(updated).eq('id', id)).catch(console.error);
  }

  return updated;
}

export function updateTool(id: string, updates: Partial<Tool>): Tool {
  const tools = getTools();
  const index = tools.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Tool not found');

  const updated: Tool = {
    ...tools[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  tools[index] = updated;
  setLocalItem(STORAGE_KEYS.TOOLS, tools);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('tools').update(updated).eq('id', id)).catch(console.error);
  }

  return updated;
}

// RENTALS
export function getRentals(): Rental[] {
  const rentals = getLocalItem<Rental[]>(STORAGE_KEYS.RENTALS, INITIAL_RENTALS);
  return [...rentals].sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
}

export function getRentalById(id: string): Rental | undefined {
  return getRentals().find((r) => r.id === id);
}

export function createRental(data: {
  customer_id: string;
  tool_id: string;
  expected_return_at?: string | null;
  deposit_amount?: number;
  notes?: string;
}): Rental {
  const customers = getCustomers();
  const tools = getTools();

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

  // Generate simple sequential code e.g. R-1003
  const rentals = getRentals();
  const maxNum = rentals.reduce((acc, r) => {
    const num = parseInt(r.rental_code.replace(/\D/g, ''), 10);
    return isNaN(num) ? acc : Math.max(acc, num);
  }, 1000);
  const nextRentalCode = `R-${maxNum + 1}`;

  const startedAt = new Date().toISOString();

  const newRental: Rental = {
    id: `rent-${Date.now()}`,
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

  // Save rental
  const updatedRentals = [newRental, ...rentals];
  setLocalItem(STORAGE_KEYS.RENTALS, updatedRentals);

  // Update tool status to RENTED
  updateToolStatus(tool.id, 'RENTED');

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
  }
): Rental {
  const rentals = getRentals();
  const index = rentals.findIndex((r) => r.id === rentalId);
  if (index === -1) throw new Error('Rental record not found');

  const current = rentals[index];
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

  rentals[index] = updatedRental;
  setLocalItem(STORAGE_KEYS.RENTALS, rentals);

  // Update physical tool status based on return condition
  const nextToolStatus: ToolStatus =
    data.return_condition === 'DAMAGED' || data.return_condition === 'NEEDS_MAINTENANCE'
      ? 'MAINTENANCE'
      : 'AVAILABLE';

  updateToolStatus(current.tool_id, nextToolStatus, data.return_condition);

  if (isSupabaseConfigured) {
    Promise.resolve(supabase.from('rentals').update(updatedRental).eq('id', rentalId)).catch(console.error);
  }

  return updatedRental;
}
