-- Tool Rental Record Book - Supabase PostgreSQL Seed SQL

INSERT INTO public.categories (id, name, description) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Drilling & Chipping', 'Electric drills, hammer drills, chipping machines'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Cutting & Grinding', 'Tile cutters, concrete cutters, angle grinders'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Washing & Cleaning', 'Car washers, high pressure washers, blowers'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Pumps & Motors', 'Water pumps, submersible pumps, motor pumps'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Welding & Electrical', 'Arc welding sets, generators, extension boards'),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'Construction & Lifting', 'Mixer machines, vibrators, ladders, jacks, scaffolding')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.customers (id, name, phone, address, notes) VALUES
  ('c1c2c3c4-0001-4000-8000-000000000001', 'Afsal', '9847123456', 'Panamaram, Wayanad', 'Regular electrician contractor'),
  ('c1c2c3c4-0002-4000-8000-000000000002', 'Riyas', '9745987654', 'Kozhikode Town', 'House construction client'),
  ('c1c2c3c4-0003-4000-8000-000000000003', 'Nihad', '9633112233', 'Kunnamangalam', 'Plumber'),
  ('c1c2c3c4-0004-4000-8000-000000000004', 'Basheer', '9895443322', 'Kalpetta', 'Painter contractor')
ON CONFLICT (phone) DO NOTHING;

INSERT INTO public.tools (id, name, category_id, tool_code, condition, status) VALUES
  ('t1t2t3t4-0001-4000-8000-000000000001', 'Drilling Machine', 'a1b2c3d4-0001-4000-8000-000000000001', 'DR-01', 'GOOD', 'AVAILABLE'),
  ('t1t2t3t4-0002-4000-8000-000000000002', 'Drilling Machine', 'a1b2c3d4-0001-4000-8000-000000000001', 'DR-02', 'GOOD', 'AVAILABLE'),
  ('t1t2t3t4-0003-4000-8000-000000000003', 'Drilling Machine', 'a1b2c3d4-0001-4000-8000-000000000001', 'DR-03', 'GOOD', 'AVAILABLE'),
  ('t1t2t3t4-0004-4000-8000-000000000004', 'Drilling Machine', 'a1b2c3d4-0001-4000-8000-000000000001', 'DR-04', 'GOOD', 'RENTED'),
  ('t1t2t3t4-0005-4000-8000-000000000005', 'Cutter', 'a1b2c3d4-0002-4000-8000-000000000002', 'CUT-01', 'GOOD', 'AVAILABLE'),
  ('t1t2t3t4-0006-4000-8000-000000000006', 'Car Washer', 'a1b2c3d4-0003-4000-8000-000000000003', 'CW-01', 'GOOD', 'RENTED'),
  ('t1t2t3t4-0007-4000-8000-000000000007', 'Car Washer', 'a1b2c3d4-0003-4000-8000-000000000003', 'CW-02', 'GOOD', 'AVAILABLE')
ON CONFLICT (tool_code) DO NOTHING;
