-- Seed data for COM-PSU-Rizal
-- This file will be run after migrations during db reset

-- Insert some test users (these will be created through the auth system)
-- Note: Actual user creation should be done through Supabase Auth API

-- Insert some sample classes
INSERT INTO public.classes (name, description, faculty_id) VALUES
('Computer Science 101', 'Introduction to Computer Science', '00000000-0000-0000-0000-000000000000'),
('Mathematics 201', 'Advanced Calculus', '00000000-0000-0000-0000-000000000000'),
('Physics 301', 'Quantum Physics', '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;

-- Insert some sample assignments
INSERT INTO public.assignments (class_id, title, description, due_date, max_points) VALUES
((SELECT id FROM public.classes WHERE name = 'Computer Science 101' LIMIT 1), 'Hello World Program', 'Write a simple Hello World program in Python', NOW() + INTERVAL '7 days', 100),
((SELECT id FROM public.classes WHERE name = 'Mathematics 201' LIMIT 1), 'Calculus Problem Set', 'Complete problems 1-20 from chapter 5', NOW() + INTERVAL '5 days', 50),
((SELECT id FROM public.classes WHERE name = 'Physics 301' LIMIT 1), 'Quantum Mechanics Essay', 'Write a 1000-word essay on quantum entanglement', NOW() + INTERVAL '14 days', 200)
ON CONFLICT DO NOTHING;