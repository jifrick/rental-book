-- Multi-Tenant SaaS Seed SQL for Rental Book

-- 1. SEED SHOPS
INSERT INTO public.shops (id, name, owner_name, phone, address, user_id_code, status, is_onboarded, is_temp_password) VALUES
  ('55555555-0001-4000-8000-000000000001', 'CK TOOLS', 'JAMAL CK', '9946052379', 'Main Road, Koolimadu, Kozhikode Kerala', 'CKTOOLS001', 'ACTIVE', true, false),
  ('55555555-0002-4000-8000-000000000002', 'ABC TOOLS', 'RAHUL SHARMA', '9895000111', 'Station Road, Calicut', 'ABC001', 'ACTIVE', true, false)
ON CONFLICT (user_id_code) DO NOTHING;

-- 2. SEED SHOP SETTINGS
INSERT INTO public.settings (id, shop_id, shop_name, owner_name, phone, address) VALUES
  ('66666666-0001-4000-8000-000000000001', '55555555-0001-4000-8000-000000000001', 'CK TOOLS', 'JAMAL CK', '9946052379', 'Main Road, Koolimadu, Kozhikode Kerala'),
  ('66666666-0002-4000-8000-000000000002', '55555555-0002-4000-8000-000000000002', 'ABC TOOLS', 'RAHUL SHARMA', '9895000111', 'Station Road, Calicut')
ON CONFLICT (shop_id) DO NOTHING;

-- 3. SEED CATEGORIES
INSERT INTO public.categories (id, name, description) VALUES
  ('11111111-0001-4000-8000-000000000001', 'Drilling & Chipping', 'Electric drills, hammer drills, chipping machines'),
  ('11111111-0002-4000-8000-000000000002', 'Cutting & Grinding', 'Tile cutters, concrete cutters, angle grinders'),
  ('11111111-0003-4000-8000-000000000003', 'Washing & Cleaning', 'Car washers, high pressure washers, blowers'),
  ('11111111-0004-4000-8000-000000000004', 'Pumps & Motors', 'Water pumps, submersible pumps, motor pumps'),
  ('11111111-0005-4000-8000-000000000005', 'Welding & Electrical', 'Arc welding sets, generators, extension boards'),
  ('11111111-0006-4000-8000-000000000006', 'Construction & Lifting', 'Mixer machines, vibrators, ladders, jacks, scaffolding')
ON CONFLICT (name) DO NOTHING;

-- 4. SEED MASTER TOOLS (Platform Master Catalog)
INSERT INTO public.master_tools (name, category_name, description) VALUES
  ('Driller', 'Drilling & Chipping', 'Heavy duty electric drilling machine'),
  ('Cutter', 'Cutting & Grinding', 'Concrete & wood cutter'),
  ('Tile Cutter', 'Cutting & Grinding', 'Manual and electric tile cutter'),
  ('Tile Hammer', 'Drilling & Chipping', 'Chipping tile hammer'),
  ('Hammer', 'Drilling & Chipping', 'Standard hammer drill'),
  ('Welding Set', 'Welding & Electrical', 'Portable arc welding set'),
  ('Wall Polisher', 'Cutting & Grinding', 'Drywall wall sander & polisher'),
  ('Belt Polisher', 'Cutting & Grinding', 'Belt sander polisher'),
  ('Electric Saw', 'Cutting & Grinding', 'Circular electric saw'),
  ('Vibrator', 'Construction & Lifting', 'Concrete needle vibrator'),
  ('Water Pump', 'Pumps & Motors', 'High flow water pump'),
  ('Dewatering Pump', 'Pumps & Motors', 'Submersible dewatering pump'),
  ('Block Machine', 'Construction & Lifting', 'Concrete block making machine'),
  ('Concrete Mixer', 'Construction & Lifting', 'Drum concrete mixer'),
  ('Concrete Sheet', 'Construction & Lifting', 'Slab leveling concrete sheet'),
  ('Measuring Meter', 'Construction & Lifting', 'Laser distance meter'),
  ('Ladder', 'Construction & Lifting', 'Step ladder'),
  ('Box', 'Construction & Lifting', 'Equipment carry box'),
  ('Wheel Barrow', 'Construction & Lifting', 'Heavy duty wheelbarrow'),
  ('1 Wheel Heavy', 'Construction & Lifting', '1 Wheel heavy trolley'),
  ('2 Wheel', 'Construction & Lifting', '2 Wheel hand truck'),
  ('Trolley', 'Construction & Lifting', 'Material transport trolley'),
  ('Scaffold', 'Construction & Lifting', 'Steel scaffolding frame set'),
  ('Aluminium Ladder', 'Construction & Lifting', 'Extension aluminium ladder'),
  ('Jack', 'Construction & Lifting', 'Hydraulic bottle jack'),
  ('Generator', 'Welding & Electrical', 'Diesel / petrol power generator'),
  ('Compressor', 'Washing & Cleaning', 'Air compressor unit'),
  ('Grinder', 'Cutting & Grinding', 'Angle grinder'),
  ('Tile Cutting Machine', 'Cutting & Grinding', 'Wet tile table cutter'),
  ('Fibre Kotta', 'Construction & Lifting', 'Fibre pan basket'),
  ('Cable Machine', 'Welding & Electrical', 'Cable pulling machine'),
  ('Spirit Level', 'Construction & Lifting', 'Precision spirit level'),
  ('Welding Machine', 'Welding & Electrical', 'Inverter welding machine'),
  ('Electrical Winch', 'Welding & Electrical', 'Electric power winch hoist'),
  ('Safety Shoe', 'Construction & Lifting', 'Steel toe safety shoes'),
  ('LED Light', 'Welding & Electrical', 'Portable LED work light'),
  ('Flood Light', 'Welding & Electrical', 'High power halogen flood light'),
  ('Lawn Mower', 'Washing & Cleaning', 'Grass cutting lawn mower'),
  ('Water Hose', 'Pumps & Motors', 'Heavy duty water hose'),
  ('Cutting Machine', 'Cutting & Grinding', 'Heavy industrial metal cutting machine'),
  ('Cooler', 'Washing & Cleaning', 'Industrial air cooler'),
  ('Soldering Iron', 'Welding & Electrical', 'Electric soldering station')
ON CONFLICT (name) DO NOTHING;

-- 5. SEED CK TOOLS CUSTOMERS
INSERT INTO public.customers (id, shop_id, name, phone, address, notes) VALUES
  ('22222222-0001-4000-8000-000000000001', '55555555-0001-4000-8000-000000000001', 'Afsal', '9847123456', 'Panamaram, Wayanad', 'Regular electrician contractor'),
  ('22222222-0002-4000-8000-000000000002', '55555555-0001-4000-8000-000000000001', 'Riyas', '9745987654', 'Kozhikode Town', 'House construction client')
ON CONFLICT (shop_id, phone) DO NOTHING;

-- 6. SEED ABC TOOLS CUSTOMERS
INSERT INTO public.customers (id, shop_id, name, phone, address, notes) VALUES
  ('22222222-0003-4000-8000-000000000003', '55555555-0002-4000-8000-000000000002', 'Vikram Kumar', '9112233445', 'Mavoor Road, Calicut', 'Plumbing contractor')
ON CONFLICT (shop_id, phone) DO NOTHING;

-- 7. SEED CK TOOLS PHYSICAL MACHINES
INSERT INTO public.tools (id, shop_id, name, category_id, tool_code, condition, status) VALUES
  ('33333333-0001-4000-8000-000000000001', '55555555-0001-4000-8000-000000000001', 'Driller', '11111111-0001-4000-8000-000000000001', 'DR-01', 'GOOD', 'AVAILABLE'),
  ('33333333-0002-4000-8000-000000000002', '55555555-0001-4000-8000-000000000001', 'Driller', '11111111-0001-4000-8000-000000000001', 'DR-02', 'GOOD', 'AVAILABLE'),
  ('33333333-0003-4000-8000-000000000003', '55555555-0001-4000-8000-000000000001', 'Cutter', '11111111-0002-4000-8000-000000000002', 'CUT-01', 'GOOD', 'AVAILABLE')
ON CONFLICT (shop_id, tool_code) DO NOTHING;

-- 8. SEED ABC TOOLS PHYSICAL MACHINES
INSERT INTO public.tools (id, shop_id, name, category_id, tool_code, condition, status) VALUES
  ('33333333-0004-4000-8000-000000000004', '55555555-0002-4000-8000-000000000002', 'Drilling Machine', '11111111-0001-4000-8000-000000000001', 'DM-01', 'GOOD', 'AVAILABLE'),
  ('33333333-0005-4000-8000-000000000005', '55555555-0002-4000-8000-000000000002', 'Water Pump', '11111111-0004-4000-8000-000000000004', 'WP-ABC-1', 'GOOD', 'AVAILABLE')
ON CONFLICT (shop_id, tool_code) DO NOTHING;
