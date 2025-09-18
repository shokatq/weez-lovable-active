-- Create a test space for development
INSERT INTO public.spaces (id, name, description, team_id, created_by) 
VALUES (
  '29c42e28-4046-41d7-a3b2-8c363b8efdff',
  'Development Space',  
  'A space for testing the new interface',
  'a09dc1ce-c404-45d1-b171-4be00a9f8e7e',
  '225c73ce-8048-45bf-8c6d-b33ee4f64ea7'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Add space member for testing
INSERT INTO public.space_members (space_id, user_id, added_by, role, email, status)
VALUES (
  '29c42e28-4046-41d7-a3b2-8c363b8efdff',
  '225c73ce-8048-45bf-8c6d-b33ee4f64ea7', 
  '225c73ce-8048-45bf-8c6d-b33ee4f64ea7',
  'admin',
  'test@example.com',
  'active'
) ON CONFLICT (space_id, user_id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status;