-- Create enums for task status and priority
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'done', 'blocked');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
    CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
  END IF;
END $$;

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  assigned_to uuid,
  title text NOT NULL,
  description text,
  status public.task_status NOT NULL DEFAULT 'todo',
  priority public.task_priority,
  due_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Employee-visible shared files table
CREATE TABLE IF NOT EXISTS public.shared_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  platform text,
  shared_with_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_files ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_team_assignee ON public.tasks (team_id, assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks (due_date);
CREATE INDEX IF NOT EXISTS idx_shared_files_team ON public.shared_files (team_id);
CREATE INDEX IF NOT EXISTS idx_shared_files_user ON public.shared_files (shared_with_user_id);

-- RLS Policies for tasks
DROP POLICY IF EXISTS "Employees can view their tasks" ON public.tasks;
CREATE POLICY "Employees can view their tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (assigned_to = auth.uid());

DROP POLICY IF EXISTS "Team admins can view all team tasks" ON public.tasks;
CREATE POLICY "Team admins can view all team tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = tasks.team_id
      AND ur.role IN ('admin','team_lead')
  )
);

DROP POLICY IF EXISTS "Team admins can create tasks" ON public.tasks;
CREATE POLICY "Team admins can create tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = tasks.team_id
      AND ur.role IN ('admin','team_lead')
  )
);

DROP POLICY IF EXISTS "Team admins can update tasks" ON public.tasks;
CREATE POLICY "Team admins can update tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = tasks.team_id
      AND ur.role IN ('admin','team_lead')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = tasks.team_id
      AND ur.role IN ('admin','team_lead')
  )
);

DROP POLICY IF EXISTS "Team admins can delete tasks" ON public.tasks;
CREATE POLICY "Team admins can delete tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = tasks.team_id
      AND ur.role IN ('admin','team_lead')
  )
);

-- RLS Policies for shared_files
DROP POLICY IF EXISTS "Employees can view shared files" ON public.shared_files;
CREATE POLICY "Employees can view shared files"
ON public.shared_files
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = shared_files.team_id
  )
  AND (shared_with_user_id IS NULL OR shared_with_user_id = auth.uid())
);

DROP POLICY IF EXISTS "Team admins can create shared files" ON public.shared_files;
CREATE POLICY "Team admins can create shared files"
ON public.shared_files
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = shared_files.team_id
      AND ur.role IN ('admin','team_lead')
  )
);

DROP POLICY IF EXISTS "Team admins can update shared files" ON public.shared_files;
CREATE POLICY "Team admins can update shared files"
ON public.shared_files
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = shared_files.team_id
      AND ur.role IN ('admin','team_lead')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = shared_files.team_id
      AND ur.role IN ('admin','team_lead')
  )
);

DROP POLICY IF EXISTS "Team admins can delete shared files" ON public.shared_files;
CREATE POLICY "Team admins can delete shared files"
ON public.shared_files
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = shared_files.team_id
      AND ur.role IN ('admin','team_lead')
  )
);
