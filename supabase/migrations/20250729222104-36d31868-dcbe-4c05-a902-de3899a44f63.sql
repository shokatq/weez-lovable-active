-- Add departments table for predefined departments
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add team_employees table with extended details
CREATE TABLE public.team_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  custom_role text,
  custom_department text,
  joined_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'removed')),
  invited_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, team_id)
);

-- Enable RLS on new tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_employees ENABLE ROW LEVEL SECURITY;

-- RLS policies for departments
CREATE POLICY "Users can view departments in their teams" 
ON public.departments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.team_id = departments.team_id 
    AND user_roles.user_id = auth.uid()
  )
);

CREATE POLICY "Team admins can manage departments" 
ON public.departments 
FOR ALL 
USING (is_team_admin(auth.uid(), team_id));

-- RLS policies for team_employees
CREATE POLICY "Users can view employees in their teams" 
ON public.team_employees 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.team_id = team_employees.team_id 
    AND user_roles.user_id = auth.uid()
  )
);

CREATE POLICY "Team admins can manage team employees" 
ON public.team_employees 
FOR ALL 
USING (is_team_admin(auth.uid(), team_id));

-- Create triggers for updated_at
CREATE TRIGGER update_departments_updated_at
BEFORE UPDATE ON public.departments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_employees_updated_at
BEFORE UPDATE ON public.team_employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();