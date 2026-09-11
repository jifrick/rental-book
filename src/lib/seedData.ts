import type { Category, Customer, Tool, Rental, ShopSettings, Shop, MasterTool } from '../types/database';

export const DEFAULT_SHOP_ID = '55555555-0001-4000-8000-000000000001'; // CK TOOLS

export const INITIAL_SHOPS: Shop[] = [
  {
    id: '55555555-0001-4000-8000-000000000001',
    name: 'CK TOOLS',
    owner_name: 'JAMAL CK',
    phone: '9946052379',
    address: 'Main Road, Koolimadu, Kozhikode Kerala',
    user_id_code: 'CKTOOLS001',
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
    phone: '9895000111',
    address: 'Station Road, Calicut',
    user_id_code: 'ABC001',
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

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    shop_id: DEFAULT_SHOP_ID,
    name: 'Afsal',
    phone: '9847123456',
    address: 'Panamaram, Wayanad',
    notes: 'Regular electrician contractor',
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cust-002',
    shop_id: DEFAULT_SHOP_ID,
    name: 'Riyas',
    phone: '9745987654',
    address: 'Kozhikode Town',
    notes: 'House construction client',
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cust-003',
    shop_id: DEFAULT_SHOP_ID,
    name: 'Nihad',
    phone: '9633112233',
    address: 'Kunnamangalam',
    notes: 'Plumber',
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cust-004',
    shop_id: DEFAULT_SHOP_ID,
    name: 'Basheer',
    phone: '9895443322',
    address: 'Kalpetta',
    notes: 'Painter contractor',
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_TOOLS: Tool[] = [
  // 1. Driller
  { id: '33333333-0001-4000-8000-000000000001', shop_id: DEFAULT_SHOP_ID, name: 'Driller', category_id: '11111111-0001-4000-8000-000000000001', category_name: 'Drilling & Chipping', tool_code: 'DR-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '33333333-0001-4000-8000-000000000002', shop_id: DEFAULT_SHOP_ID, name: 'Driller', category_id: '11111111-0001-4000-8000-000000000001', category_name: 'Drilling & Chipping', tool_code: 'DR-02', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 2. Cutter
  { id: '33333333-0001-4000-8000-000000000003', shop_id: DEFAULT_SHOP_ID, name: 'Cutter', category_id: '11111111-0002-4000-8000-000000000002', category_name: 'Cutting & Grinding', tool_code: 'CUT-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '33333333-0001-4000-8000-000000000004', shop_id: DEFAULT_SHOP_ID, name: 'Cutter', category_id: '11111111-0002-4000-8000-000000000002', category_name: 'Cutting & Grinding', tool_code: 'CUT-02', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 3. Tile Cutter
  { id: '33333333-0001-4000-8000-000000000005', shop_id: DEFAULT_SHOP_ID, name: 'Tile Cutter', category_id: '11111111-0002-4000-8000-000000000002', category_name: 'Cutting & Grinding', tool_code: 'TC-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 4. Tile Hammer
  { id: '33333333-0001-4000-8000-000000000006', shop_id: DEFAULT_SHOP_ID, name: 'Tile Hammer', category_id: '11111111-0001-4000-8000-000000000001', category_name: 'Drilling & Chipping', tool_code: 'TH-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 5. Hammer
  { id: '33333333-0001-4000-8000-000000000007', shop_id: DEFAULT_SHOP_ID, name: 'Hammer', category_id: '11111111-0001-4000-8000-000000000001', category_name: 'Drilling & Chipping', tool_code: 'HM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 6. Welding Set
  { id: '33333333-0001-4000-8000-000000000008', shop_id: DEFAULT_SHOP_ID, name: 'Welding Set', category_id: '11111111-0005-4000-8000-000000000005', category_name: 'Welding & Electrical', tool_code: 'WS-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 7. Wall Polisher
  { id: '33333333-0001-4000-8000-000000000009', shop_id: DEFAULT_SHOP_ID, name: 'Wall Polisher', category_id: '11111111-0002-4000-8000-000000000002', category_name: 'Cutting & Grinding', tool_code: 'WPL-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 8. Belt Polisher
  { id: '33333333-0001-4000-8000-000000000010', shop_id: DEFAULT_SHOP_ID, name: 'Belt Polisher', category_id: '11111111-0002-4000-8000-000000000002', category_name: 'Cutting & Grinding', tool_code: 'BP-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 9. Electric Saw
  { id: '33333333-0001-4000-8000-000000000011', shop_id: DEFAULT_SHOP_ID, name: 'Electric Saw', category_id: '11111111-0002-4000-8000-000000000002', category_name: 'Cutting & Grinding', tool_code: 'ES-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 10. Vibrator
  { id: '33333333-0001-4000-8000-000000000012', shop_id: DEFAULT_SHOP_ID, name: 'Vibrator', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'VB-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 11. Water Pump
  { id: '33333333-0001-4000-8000-000000000013', shop_id: DEFAULT_SHOP_ID, name: 'Water Pump', category_id: '11111111-0004-4000-8000-000000000004', category_name: 'Pumps & Motors', tool_code: 'WP-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 12. Dewatering Pump
  { id: '33333333-0001-4000-8000-000000000014', shop_id: DEFAULT_SHOP_ID, name: 'Dewatering Pump', category_id: '11111111-0004-4000-8000-000000000004', category_name: 'Pumps & Motors', tool_code: 'DWP-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 13. Block Machine
  { id: '33333333-0001-4000-8000-000000000015', shop_id: DEFAULT_SHOP_ID, name: 'Block Machine', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'BM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 14. Concrete Mixer
  { id: '33333333-0001-4000-8000-000000000016', shop_id: DEFAULT_SHOP_ID, name: 'Concrete Mixer', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'CM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 15. Concrete Sheet
  { id: '33333333-0001-4000-8000-000000000017', shop_id: DEFAULT_SHOP_ID, name: 'Concrete Sheet', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'CS-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 16. Measuring Meter
  { id: '33333333-0001-4000-8000-000000000018', shop_id: DEFAULT_SHOP_ID, name: 'Measuring Meter', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'MM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 17. Ladder
  { id: '33333333-0001-4000-8000-000000000019', shop_id: DEFAULT_SHOP_ID, name: 'Ladder', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'LAD-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 18. Box
  { id: '33333333-0001-4000-8000-000000000020', shop_id: DEFAULT_SHOP_ID, name: 'Box', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'BX-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 19. Wheel Barrow
  { id: '33333333-0001-4000-8000-000000000021', shop_id: DEFAULT_SHOP_ID, name: 'Wheel Barrow', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'WB-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 20. 1 Wheel Heavy
  { id: '33333333-0001-4000-8000-000000000022', shop_id: DEFAULT_SHOP_ID, name: '1 Wheel Heavy', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: '1WH-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 21. 2 Wheel
  { id: '33333333-0001-4000-8000-000000000023', shop_id: DEFAULT_SHOP_ID, name: '2 Wheel', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: '2WH-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 22. Trolley
  { id: '33333333-0001-4000-8000-000000000024', shop_id: DEFAULT_SHOP_ID, name: 'Trolley', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'TR-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 23. Scaffold
  { id: '33333333-0001-4000-8000-000000000025', shop_id: DEFAULT_SHOP_ID, name: 'Scaffold', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'SC-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 24. Aluminium Ladder
  { id: '33333333-0001-4000-8000-000000000026', shop_id: DEFAULT_SHOP_ID, name: 'Aluminium Ladder', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'AL-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 25. Jack
  { id: '33333333-0001-4000-8000-000000000027', shop_id: DEFAULT_SHOP_ID, name: 'Jack', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'JK-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 26. Generator
  { id: '33333333-0001-4000-8000-000000000028', shop_id: DEFAULT_SHOP_ID, name: 'Generator', category_id: '11111111-0005-4000-8000-000000000005', category_name: 'Welding & Electrical', tool_code: 'GEN-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 27. Compressor
  { id: '33333333-0001-4000-8000-000000000029', shop_id: DEFAULT_SHOP_ID, name: 'Compressor', category_id: '11111111-0003-4000-8000-000000000003', category_name: 'Washing & Cleaning', tool_code: 'CMP-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 30. Fibre Kotta
  { id: '33333333-0001-4000-8000-000000000030', shop_id: DEFAULT_SHOP_ID, name: 'Fibre Kotta', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'FK-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 31. Cable Machine
  { id: '33333333-0001-4000-8000-000000000031', shop_id: DEFAULT_SHOP_ID, name: 'Cable Machine', category_id: '11111111-0005-4000-8000-000000000005', category_name: 'Welding & Electrical', tool_code: 'CBM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 32. Spirit Level
  { id: '33333333-0001-4000-8000-000000000032', shop_id: DEFAULT_SHOP_ID, name: 'Spirit Level', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'SL-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 33. Welding Machine
  { id: '33333333-0001-4000-8000-000000000033', shop_id: DEFAULT_SHOP_ID, name: 'Welding Machine', category_id: '11111111-0005-4000-8000-000000000005', category_name: 'Welding & Electrical', tool_code: 'WEL-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 34. Electrical Winch
  { id: '33333333-0001-4000-8000-000000000034', shop_id: DEFAULT_SHOP_ID, name: 'Electrical Winch', category_id: '11111111-0005-4000-8000-000000000005', category_name: 'Welding & Electrical', tool_code: 'EW-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 35. Safety Shoe
  { id: '33333333-0001-4000-8000-000000000035', shop_id: DEFAULT_SHOP_ID, name: 'Safety Shoe', category_id: '11111111-0006-4000-8000-000000000006', category_name: 'Construction & Lifting', tool_code: 'SS-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 36. LED Light
  { id: '33333333-0001-4000-8000-000000000036', shop_id: DEFAULT_SHOP_ID, name: 'LED Light', category_id: '11111111-0005-4000-8000-000000000005', category_name: 'Welding & Electrical', tool_code: 'LED-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 37. Flood Light
  { id: '33333333-0001-4000-8000-000000000037', shop_id: DEFAULT_SHOP_ID, name: 'Flood Light', category_id: '11111111-0005-4000-8000-000000000005', category_name: 'Welding & Electrical', tool_code: 'FL-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 38. Lawn Mower
  { id: '33333333-0001-4000-8000-000000000038', shop_id: DEFAULT_SHOP_ID, name: 'Lawn Mower', category_id: '11111111-0003-4000-8000-000000000003', category_name: 'Washing & Cleaning', tool_code: 'LM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 39. Water Hose
  { id: '33333333-0001-4000-8000-000000000039', shop_id: DEFAULT_SHOP_ID, name: 'Water Hose', category_id: '11111111-0004-4000-8000-000000000004', category_name: 'Pumps & Motors', tool_code: 'HOSE-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 40. Cutting Machine
  { id: '33333333-0001-4000-8000-000000000040', shop_id: DEFAULT_SHOP_ID, name: 'Cutting Machine', category_id: '11111111-0002-4000-8000-000000000002', category_name: 'Cutting & Grinding', tool_code: 'CM-CUT-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 41. Cooler
  { id: '33333333-0001-4000-8000-000000000041', shop_id: DEFAULT_SHOP_ID, name: 'Cooler', category_id: '11111111-0003-4000-8000-000000000003', category_name: 'Washing & Cleaning', tool_code: 'CLR-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 42. Soldering Iron
  { id: '33333333-0001-4000-8000-000000000042', shop_id: DEFAULT_SHOP_ID, name: 'Soldering Iron', category_id: '11111111-0005-4000-8000-000000000005', category_name: 'Welding & Electrical', tool_code: 'SI-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 28. Grinder
  { id: '33333333-0001-4000-8000-000000000043', shop_id: DEFAULT_SHOP_ID, name: 'Grinder', category_id: '11111111-0002-4000-8000-000000000002', category_name: 'Cutting & Grinding', tool_code: 'GR-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '33333333-0001-4000-8000-000000000044', shop_id: DEFAULT_SHOP_ID, name: 'Grinder', category_id: '11111111-0002-4000-8000-000000000002', category_name: 'Cutting & Grinding', tool_code: 'GR-02', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 29. Tile Cutting Machine
  { id: '33333333-0001-4000-8000-000000000045', shop_id: DEFAULT_SHOP_ID, name: 'Tile Cutting Machine', category_id: '11111111-0002-4000-8000-000000000002', category_name: 'Cutting & Grinding', tool_code: 'TCM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const nowMs = Date.now();
const threeHoursAgo = new Date(nowMs - 3 * 3600 * 1000 + 25 * 60 * 1000).toISOString(); // 03h 25m ago
const yesterdayAgo = new Date(nowMs - 22 * 3600 * 1000).toISOString(); // 22h ago

export const INITIAL_RENTALS: Rental[] = [
  {
    id: 'rent-1001',
    shop_id: DEFAULT_SHOP_ID,
    rental_code: 'R-1001',
    customer_id: 'cust-001',
    customer_name: 'Afsal',
    customer_phone: '9847123456',
    customer_address: 'Panamaram, Wayanad',
    tool_id: '33333333-0001-4000-8000-000000000002',
    tool_name: 'Driller',
    tool_code: 'DR-02',
    category_name: 'Drilling & Chipping',
    started_at: threeHoursAgo,
    expected_return_at: new Date(nowMs + 5 * 3600 * 1000).toISOString(),
    status: 'ACTIVE',
    rental_amount: 0,
    deposit_amount: 0,
    late_fee: 0,
    damage_fee: 0,
    other_fee: 0,
    total_amount: 0,
    created_at: threeHoursAgo,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rent-1002',
    shop_id: DEFAULT_SHOP_ID,
    rental_code: 'R-1002',
    customer_id: 'cust-004',
    customer_name: 'Basheer',
    customer_phone: '9895443322',
    customer_address: 'Kalpetta',
    tool_id: '33333333-0001-4000-8000-000000000003',
    tool_name: 'Cutter',
    tool_code: 'CUT-01',
    category_name: 'Cutting & Grinding',
    started_at: yesterdayAgo,
    expected_return_at: new Date(nowMs - 2 * 3600 * 1000).toISOString(), // Overdue by 2 hours
    status: 'ACTIVE',
    rental_amount: 0,
    deposit_amount: 500,
    late_fee: 0,
    damage_fee: 0,
    other_fee: 0,
    total_amount: 0,
    created_at: yesterdayAgo,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rent-1000',
    shop_id: DEFAULT_SHOP_ID,
    rental_code: 'R-1000',
    customer_id: 'cust-002',
    customer_name: 'Riyas',
    customer_phone: '9745987654',
    customer_address: 'Kozhikode Town',
    tool_id: '33333333-0001-4000-8000-000000000004',
    tool_name: 'Cutter',
    tool_code: 'CUT-02',
    category_name: 'Cutting & Grinding',
    started_at: new Date(nowMs - 45 * 3600 * 1000).toISOString(),
    returned_at: new Date(nowMs - 27 * 3600 * 1000).toISOString(), // 17h 45m duration
    status: 'RETURNED',
    rental_amount: 700,
    deposit_amount: 0,
    late_fee: 0,
    damage_fee: 0,
    other_fee: 0,
    total_amount: 700,
    return_condition: 'GOOD',
    payment_status: 'PAID',
    payment_method: 'CASH',
    amount_paid: 700,
    created_at: new Date(nowMs - 45 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rent-0999',
    shop_id: DEFAULT_SHOP_ID,
    rental_code: 'R-0999',
    customer_id: 'cust-003',
    customer_name: 'Nihad',
    customer_phone: '9633112233',
    customer_address: 'Kunnamangalam',
    tool_id: '33333333-0001-4000-8000-000000000043',
    tool_name: 'Grinder',
    tool_code: 'GR-01',
    category_name: 'Cutting & Grinding',
    started_at: new Date(nowMs - 72 * 3600 * 1000).toISOString(),
    returned_at: new Date(nowMs - 48 * 3600 * 1000).toISOString(),
    status: 'RETURNED',
    rental_amount: 300,
    deposit_amount: 0,
    late_fee: 0,
    damage_fee: 0,
    other_fee: 0,
    total_amount: 300,
    return_condition: 'GOOD',
    payment_status: 'PAID',
    payment_method: 'UPI',
    amount_paid: 300,
    created_at: new Date(nowMs - 72 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];
