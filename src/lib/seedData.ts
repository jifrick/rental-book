import type { Category, Customer, Tool, Rental, ShopSettings } from '../types/database';

export const INITIAL_SETTINGS: ShopSettings = {
  id: 'set-001',
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
    name: 'Afsal',
    phone: '9847123456',
    address: 'Panamaram, Wayanad',
    notes: 'Regular electrician contractor',
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cust-002',
    name: 'Riyas',
    phone: '9745987654',
    address: 'Kozhikode Town',
    notes: 'House construction client',
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cust-003',
    name: 'Nihad',
    phone: '9633112233',
    address: 'Kunnamangalam',
    notes: 'Plumber',
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cust-004',
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
  { id: 'tool-001', name: 'Driller', category_id: 'cat-drilling', category_name: 'Drilling & Chipping', tool_code: 'DR-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'tool-002', name: 'Driller', category_id: 'cat-drilling', category_name: 'Drilling & Chipping', tool_code: 'DR-02', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 2. Cutter
  { id: 'tool-003', name: 'Cutter', category_id: 'cat-cutting', category_name: 'Cutting & Grinding', tool_code: 'CUT-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'tool-004', name: 'Cutter', category_id: 'cat-cutting', category_name: 'Cutting & Grinding', tool_code: 'CUT-02', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 3. Tile Cutter
  { id: 'tool-005', name: 'Tile Cutter', category_id: 'cat-cutting', category_name: 'Cutting & Grinding', tool_code: 'TC-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 4. Tile Hammer
  { id: 'tool-006', name: 'Tile Hammer', category_id: 'cat-drilling', category_name: 'Drilling & Chipping', tool_code: 'TH-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 5. Hammer
  { id: 'tool-007', name: 'Hammer', category_id: 'cat-drilling', category_name: 'Drilling & Chipping', tool_code: 'HM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 6. Welding Set
  { id: 'tool-008', name: 'Welding Set', category_id: 'cat-welding', category_name: 'Welding & Electrical', tool_code: 'WS-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 7. Wall Polisher
  { id: 'tool-009', name: 'Wall Polisher', category_id: 'cat-cutting', category_name: 'Cutting & Grinding', tool_code: 'WPL-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 8. Belt Polisher
  { id: 'tool-010', name: 'Belt Polisher', category_id: 'cat-cutting', category_name: 'Cutting & Grinding', tool_code: 'BP-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 9. Electric Saw
  { id: 'tool-011', name: 'Electric Saw', category_id: 'cat-cutting', category_name: 'Cutting & Grinding', tool_code: 'ES-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 10. Vibrator
  { id: 'tool-012', name: 'Vibrator', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'VB-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 11. Water Pump
  { id: 'tool-013', name: 'Water Pump', category_id: 'cat-pumps', category_name: 'Pumps & Motors', tool_code: 'WP-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 12. Dewatering Pump
  { id: 'tool-014', name: 'Dewatering Pump', category_id: 'cat-pumps', category_name: 'Pumps & Motors', tool_code: 'DWP-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 13. Block Machine
  { id: 'tool-015', name: 'Block Machine', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'BM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 14. Concrete Mixer
  { id: 'tool-016', name: 'Concrete Mixer', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'CM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 15. Concrete Sheet
  { id: 'tool-017', name: 'Concrete Sheet', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'CS-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 16. Measuring Meter
  { id: 'tool-018', name: 'Measuring Meter', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'MM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 17. Ladder
  { id: 'tool-019', name: 'Ladder', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'LAD-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 18. Box
  { id: 'tool-020', name: 'Box', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'BX-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 19. Wheel Barrow
  { id: 'tool-021', name: 'Wheel Barrow', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'WB-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 20. 1 Wheel Heavy
  { id: 'tool-022', name: '1 Wheel Heavy', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: '1WH-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 21. 2 Wheel
  { id: 'tool-023', name: '2 Wheel', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: '2WH-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 22. Trolley
  { id: 'tool-024', name: 'Trolley', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'TR-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 23. Scaffold
  { id: 'tool-025', name: 'Scaffold', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'SC-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 24. Aluminium Ladder
  { id: 'tool-026', name: 'Aluminium Ladder', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'AL-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 25. Jack
  { id: 'tool-027', name: 'Jack', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'JK-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 26. Generator
  { id: 'tool-028', name: 'Generator', category_id: 'cat-welding', category_name: 'Welding & Electrical', tool_code: 'GEN-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 27. Compressor
  { id: 'tool-029', name: 'Compressor', category_id: 'cat-cleaning', category_name: 'Washing & Cleaning', tool_code: 'CMP-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 30. Fibre Kotta
  { id: 'tool-030', name: 'Fibre Kotta', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'FK-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 31. Cable Machine
  { id: 'tool-031', name: 'Cable Machine', category_id: 'cat-welding', category_name: 'Welding & Electrical', tool_code: 'CBM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 32. Spirit Level
  { id: 'tool-032', name: 'Spirit Level', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'SL-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 33. Welding Machine
  { id: 'tool-033', name: 'Welding Machine', category_id: 'cat-welding', category_name: 'Welding & Electrical', tool_code: 'WEL-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 34. Electrical Winch
  { id: 'tool-034', name: 'Electrical Winch', category_id: 'cat-welding', category_name: 'Welding & Electrical', tool_code: 'EW-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 35. Safety Shoe
  { id: 'tool-035', name: 'Safety Shoe', category_id: 'cat-construction', category_name: 'Construction & Lifting', tool_code: 'SS-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 36. LED Light
  { id: 'tool-036', name: 'LED Light', category_id: 'cat-welding', category_name: 'Welding & Electrical', tool_code: 'LED-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 37. Flood Light
  { id: 'tool-037', name: 'Flood Light', category_id: 'cat-welding', category_name: 'Welding & Electrical', tool_code: 'FL-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 38. Lawn Mower
  { id: 'tool-038', name: 'Lawn Mower', category_id: 'cat-cleaning', category_name: 'Washing & Cleaning', tool_code: 'LM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 39. Water Hose
  { id: 'tool-039', name: 'Water Hose', category_id: 'cat-pumps', category_name: 'Pumps & Motors', tool_code: 'HOSE-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 40. Cutting Machine
  { id: 'tool-040', name: 'Cutting Machine', category_id: 'cat-cutting', category_name: 'Cutting & Grinding', tool_code: 'CM-CUT-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 41. Cooler
  { id: 'tool-041', name: 'Cooler', category_id: 'cat-cleaning', category_name: 'Washing & Cleaning', tool_code: 'CLR-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 42. Soldering Iron
  { id: 'tool-042', name: 'Soldering Iron', category_id: 'cat-welding', category_name: 'Welding & Electrical', tool_code: 'SI-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 28. Grinder
  { id: 'tool-043', name: 'Grinder', category_id: 'cat-cutting', category_name: 'Cutting & Grinding', tool_code: 'GR-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'tool-044', name: 'Grinder', category_id: 'cat-cutting', category_name: 'Cutting & Grinding', tool_code: 'GR-02', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // 29. Tile Cutting Machine
  { id: 'tool-045', name: 'Tile Cutting Machine', category_id: 'cat-cutting', category_name: 'Cutting & Grinding', tool_code: 'TCM-01', condition: 'GOOD', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const nowMs = Date.now();
const threeHoursAgo = new Date(nowMs - 3 * 3600 * 1000 + 25 * 60 * 1000).toISOString(); // 03h 25m ago
const yesterdayAgo = new Date(nowMs - 22 * 3600 * 1000).toISOString(); // 22h ago

export const INITIAL_RENTALS: Rental[] = [
  {
    id: 'rent-1001',
    rental_code: 'R-1001',
    customer_id: 'cust-001',
    customer_name: 'Afsal',
    customer_phone: '9847123456',
    customer_address: 'Panamaram, Wayanad',
    tool_id: 'tool-004',
    tool_name: 'Drilling Machine',
    tool_code: 'DR-04',
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
    rental_code: 'R-1002',
    customer_id: 'cust-004',
    customer_name: 'Basheer',
    customer_phone: '9895443322',
    customer_address: 'Kalpetta',
    tool_id: 'tool-013',
    tool_name: 'Car Washer',
    tool_code: 'CW-01',
    category_name: 'Washing & Cleaning',
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
    rental_code: 'R-1000',
    customer_id: 'cust-002',
    customer_name: 'Riyas',
    customer_phone: '9745987654',
    customer_address: 'Kozhikode Town',
    tool_id: 'tool-014',
    tool_name: 'Car Washer',
    tool_code: 'CW-02',
    category_name: 'Washing & Cleaning',
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
    rental_code: 'R-0999',
    customer_id: 'cust-003',
    customer_name: 'Nihad',
    customer_phone: '9633112233',
    customer_address: 'Kunnamangalam',
    tool_id: 'tool-011',
    tool_name: 'Angle Grinder',
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
