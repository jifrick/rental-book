import type { Category, Customer, Tool, Rental, ShopSettings, Shop, MasterTool } from '../types/database';

export const DEFAULT_SHOP_ID = '55555555-0001-4000-8000-000000000001'; // CK TOOLS

export const INITIAL_SHOPS: Shop[] = [
  {
    id: '55555555-0001-4000-8000-000000000001',
    name: 'CK TOOLS',
    owner_name: 'JAMAL CK',
    email: 'cktools@example.com',
    phone: '9946052379',
    address: 'Main Road, Koolimadu, Kozhikode Kerala',
    status: 'ACTIVE',
    is_onboarded: true,
    is_temp_password: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '55555555-0002-4000-8000-000000000002',
    name: 'ABC TOOLS',
    owner_name: 'RAHUL SHARMA',
    email: 'abctools@example.com',
    phone: '9895000111',
    address: 'Station Road, Calicut',
    status: 'ACTIVE',
    is_onboarded: true,
    is_temp_password: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_MASTER_TOOLS: MasterTool[] = [
  { id: 'mtool-001', name: 'Driller', category_name: 'Drilling & Chipping', description: 'Heavy duty electric drilling machine', is_active: true },
  { id: 'mtool-002', name: 'Cutter', category_name: 'Cutting & Grinding', description: 'Concrete & wood cutter', is_active: true },
  { id: 'mtool-003', name: 'Tile Cutter', category_name: 'Cutting & Grinding', description: 'Manual and electric tile cutter', is_active: true },
  { id: 'mtool-004', name: 'Tile Hammer', category_name: 'Drilling & Chipping', description: 'Chipping tile hammer', is_active: true },
  { id: 'mtool-005', name: 'Hammer', category_name: 'Drilling & Chipping', description: 'Standard hammer drill', is_active: true },
  { id: 'mtool-006', name: 'Welding Set', category_name: 'Welding & Electrical', description: 'Portable arc welding set', is_active: true },
  { id: 'mtool-007', name: 'Wall Polisher', category_name: 'Cutting & Grinding', description: 'Drywall wall sander & polisher', is_active: true },
  { id: 'mtool-008', name: 'Belt Polisher', category_name: 'Cutting & Grinding', description: 'Belt sander polisher', is_active: true },
  { id: 'mtool-009', name: 'Electric Saw', category_name: 'Cutting & Grinding', description: 'Circular electric saw', is_active: true },
  { id: 'mtool-010', name: 'Vibrator', category_name: 'Construction & Lifting', description: 'Concrete needle vibrator', is_active: true },
  { id: 'mtool-011', name: 'Water Pump', category_name: 'Pumps & Motors', description: 'High flow water pump', is_active: true },
  { id: 'mtool-012', name: 'Dewatering Pump', category_name: 'Pumps & Motors', description: 'Submersible dewatering pump', is_active: true },
  { id: 'mtool-013', name: 'Block Machine', category_name: 'Construction & Lifting', description: 'Concrete block making machine', is_active: true },
  { id: 'mtool-014', name: 'Concrete Mixer', category_name: 'Construction & Lifting', description: 'Drum concrete mixer', is_active: true },
  { id: 'mtool-015', name: 'Concrete Sheet', category_name: 'Construction & Lifting', description: 'Slab leveling concrete sheet', is_active: true },
  { id: 'mtool-016', name: 'Measuring Meter', category_name: 'Construction & Lifting', description: 'Laser distance meter', is_active: true },
  { id: 'mtool-017', name: 'Ladder', category_name: 'Construction & Lifting', description: 'Step ladder', is_active: true },
  { id: 'mtool-018', name: 'Box', category_name: 'Construction & Lifting', description: 'Equipment carry box', is_active: true },
  { id: 'mtool-019', name: 'Wheel Barrow', category_name: 'Construction & Lifting', description: 'Heavy duty wheelbarrow', is_active: true },
  { id: 'mtool-020', name: '1 Wheel Heavy', category_name: 'Construction & Lifting', description: '1 Wheel heavy trolley', is_active: true },
  { id: 'mtool-021', name: '2 Wheel', category_name: 'Construction & Lifting', description: '2 Wheel hand truck', is_active: true },
  { id: 'mtool-022', name: 'Trolley', category_name: 'Construction & Lifting', description: 'Material transport trolley', is_active: true },
  { id: 'mtool-023', name: 'Scaffold', category_name: 'Construction & Lifting', description: 'Steel scaffolding frame set', is_active: true },
  { id: 'mtool-024', name: 'Aluminium Ladder', category_name: 'Construction & Lifting', description: 'Extension aluminium ladder', is_active: true },
  { id: 'mtool-025', name: 'Jack', category_name: 'Construction & Lifting', description: 'Hydraulic bottle jack', is_active: true },
  { id: 'mtool-026', name: 'Generator', category_name: 'Welding & Electrical', description: 'Diesel / petrol power generator', is_active: true },
  { id: 'mtool-027', name: 'Compressor', category_name: 'Washing & Cleaning', description: 'Air compressor unit', is_active: true },
  { id: 'mtool-028', name: 'Grinder', category_name: 'Cutting & Grinding', description: 'Angle grinder', is_active: true },
  { id: 'mtool-029', name: 'Tile Cutting Machine', category_name: 'Cutting & Grinding', description: 'Wet tile table cutter', is_active: true },
  { id: 'mtool-030', name: 'Fibre Kotta', category_name: 'Construction & Lifting', description: 'Fibre pan basket', is_active: true },
  { id: 'mtool-031', name: 'Cable Machine', category_name: 'Welding & Electrical', description: 'Cable pulling machine', is_active: true },
  { id: 'mtool-032', name: 'Spirit Level', category_name: 'Construction & Lifting', description: 'Precision spirit level', is_active: true },
  { id: 'mtool-033', name: 'Welding Machine', category_name: 'Welding & Electrical', description: 'Inverter welding machine', is_active: true },
  { id: 'mtool-034', name: 'Electrical Winch', category_name: 'Welding & Electrical', description: 'Electric power winch hoist', is_active: true },
  { id: 'mtool-035', name: 'Safety Shoe', category_name: 'Construction & Lifting', description: 'Steel toe safety shoes', is_active: true },
  { id: 'mtool-036', name: 'LED Light', category_name: 'Welding & Electrical', description: 'Portable LED work light', is_active: true },
  { id: 'mtool-037', name: 'Flood Light', category_name: 'Welding & Electrical', description: 'High power halogen flood light', is_active: true },
  { id: 'mtool-038', name: 'Lawn Mower', category_name: 'Washing & Cleaning', description: 'Grass cutting lawn mower', is_active: true },
  { id: 'mtool-039', name: 'Water Hose', category_name: 'Pumps & Motors', description: 'Heavy duty water hose', is_active: true },
  { id: 'mtool-040', name: 'Cutting Machine', category_name: 'Cutting & Grinding', description: 'Heavy industrial metal cutting machine', is_active: true },
  { id: 'mtool-041', name: 'Cooler', category_name: 'Washing & Cleaning', description: 'Industrial air cooler', is_active: true },
  { id: 'mtool-042', name: 'Soldering Iron', category_name: 'Welding & Electrical', description: 'Electric soldering station', is_active: true },
];

export const INITIAL_SETTINGS: ShopSettings = {
  id: 'set-001',
  shop_id: DEFAULT_SHOP_ID,
  shop_name: 'CK TOOLS',
  owner_name: 'JAMAL CK',
  phone: '9946052379',
  address: 'Main Road, Koolimadu, Kozhikode Kerala',
  currency: '₹',
  timezone: 'Asia/Kolkata',
  updated_at: new Date().toISOString(),
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: '11111111-0001-4000-8000-000000000001', name: 'Drilling & Chipping', description: 'Electric drills, hammer drills, chipping machines', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '11111111-0002-4000-8000-000000000002', name: 'Cutting & Grinding', description: 'Tile cutters, concrete cutters, angle grinders', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '11111111-0003-4000-8000-000000000003', name: 'Washing & Cleaning', description: 'Car washers, high pressure washers, blowers', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '11111111-0004-4000-8000-000000000004', name: 'Pumps & Motors', description: 'Water pumps, submersible pumps, motor pumps', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '11111111-0005-4000-8000-000000000005', name: 'Welding & Electrical', description: 'Arc welding sets, generators, extension boards', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '11111111-0006-4000-8000-000000000006', name: 'Construction & Lifting', description: 'Mixer machines, vibrators, ladders, jacks, scaffolding', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_TOOLS: Tool[] = [];

export const INITIAL_RENTALS: Rental[] = [];
