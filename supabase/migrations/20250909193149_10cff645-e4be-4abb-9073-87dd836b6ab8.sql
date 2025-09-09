-- Create files table for space management
CREATE TABLE public.files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on files table
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger for files
CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for files table based on user roles

-- Admin: Full access to all files
CREATE POLICY "Admins have full access to all files"
  ON public.files
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Team Leaders: Can view, insert, update files in their team's spaces
CREATE POLICY "Team leaders can manage files in their team spaces"
  ON public.files
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.spaces s ON s.team_id = ur.team_id
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'team_lead'
      AND s.id = files.space_id
    )
  );

CREATE POLICY "Team leaders can insert files in their team spaces"
  ON public.files
  FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.spaces s ON s.team_id = ur.team_id
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'team_lead'
      AND s.id = files.space_id
    )
  );

CREATE POLICY "Team leaders can update files in their team spaces"
  ON public.files
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.spaces s ON s.team_id = ur.team_id
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'team_lead'
      AND s.id = files.space_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.spaces s ON s.team_id = ur.team_id
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'team_lead'
      AND s.id = files.space_id
    )
  );

-- Employees: Can view and insert files in their team spaces
CREATE POLICY "Employees can view files in their team spaces"
  ON public.files
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.spaces s ON s.team_id = ur.team_id
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'employee'
      AND s.id = files.space_id
    )
  );

CREATE POLICY "Employees can upload files in their team spaces"
  ON public.files
  FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.spaces s ON s.team_id = ur.team_id
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'employee'
      AND s.id = files.space_id
    )
  );

-- Viewers: Can only view files in their team spaces
CREATE POLICY "Viewers can only view files in their team spaces"
  ON public.files
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.spaces s ON s.team_id = ur.team_id
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'viewer'
      AND s.id = files.space_id
    )
  );

-- Create function to get user role in team
CREATE OR REPLACE FUNCTION public.get_user_role_for_space(space_id_param UUID)
RETURNS app_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  SELECT ur.role INTO user_role
  FROM public.user_roles ur
  JOIN public.spaces s ON s.team_id = ur.team_id
  WHERE ur.user_id = auth.uid() 
  AND s.id = space_id_param;
  
  RETURN user_role;
END;
$$;