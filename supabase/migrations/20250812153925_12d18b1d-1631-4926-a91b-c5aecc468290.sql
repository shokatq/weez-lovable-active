
-- 1) Enums for task status/priority (safe creation)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE public.task_status AS ENUM ('todo','in_progress','done','blocked');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
    CREATE TYPE public.task_priority AS ENUM ('low','medium','high','urgent');
  END IF;
END$$;

-- 2) Tasks table (team-scoped, assigned to a user)
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status public.task_status NOT NULL DEFAULT 'todo',
  priority public.task_priority DEFAULT 'medium',
  due_date timestamptz,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Update trigger for tasks.updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON public.tasks;
CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4) RLS for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- View: admin or team_lead can see all team tasks
DROP POLICY IF EXISTS "Admins/Leads can view team tasks" ON public.tasks;
CREATE POLICY "Admins/Leads can view team tasks"
ON public.tasks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = tasks.team_id
      AND ur.role IN ('admin','team_lead')
  )
);

-- View: assignee can see own tasks
DROP POLICY IF EXISTS "Assignee can view own tasks" ON public.tasks;
CREATE POLICY "Assignee can view own tasks"
ON public.tasks
FOR SELECT
USING (assigned_to = auth.uid());

-- Insert: only admins/leads in the team
DROP POLICY IF EXISTS "Admins/Leads can create team tasks" ON public.tasks;
CREATE POLICY "Admins/Leads can create team tasks"
ON public.tasks
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = team_id
      AND ur.role IN ('admin','team_lead')
  )
);

-- Update: admins/leads or the assignee (to update status/progress)
DROP POLICY IF EXISTS "Admins/Leads/Assignee can update tasks" ON public.tasks;
CREATE POLICY "Admins/Leads/Assignee can update tasks"
ON public.tasks
FOR UPDATE
USING (
  assigned_to = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = tasks.team_id
      AND ur.role IN ('admin','team_lead')
  )
)
WITH CHECK (
  assigned_to = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = tasks.team_id
      AND ur.role IN ('admin','team_lead')
  )
);

-- Delete: only admins/leads
DROP POLICY IF EXISTS "Admins/Leads can delete tasks" ON public.tasks;
CREATE POLICY "Admins/Leads can delete tasks"
ON public.tasks
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = tasks.team_id
      AND ur.role IN ('admin','team_lead')
  )
);

-- Indexes for tasks
CREATE INDEX IF NOT EXISTS idx_tasks_team_id ON public.tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- Realtime for tasks
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- 5) Shared files table (team-wide or per-user shares)
CREATE TABLE IF NOT EXISTS public.shared_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  platform text, -- e.g., 'gdrive','dropbox','onedrive','slack','confluence','internal'
  shared_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shared_with_user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL means visible to the whole team
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_files ENABLE ROW LEVEL SECURITY;

-- View: team members can see team shares; user can see own user-specific shares
DROP POLICY IF EXISTS "Team members can view shared files" ON public.shared_files;
CREATE POLICY "Team members can view shared files"
ON public.shared_files
FOR SELECT
USING (
  (
    -- Team-wide share
    shared_with_user_id IS NULL
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.team_id = shared_files.team_id
    )
  )
  OR
  (
    -- Direct share to specific user
    shared_with_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur2
      WHERE ur2.user_id = auth.uid()
        AND ur2.team_id = shared_files.team_id
    )
  )
);

-- Insert: admins/leads in the team
DROP POLICY IF EXISTS "Admins/Leads can create shared files" ON public.shared_files;
CREATE POLICY "Admins/Leads can create shared files"
ON public.shared_files
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = team_id
      AND ur.role IN ('admin','team_lead')
  )
);

-- Update/Delete: admins/leads in the team
DROP POLICY IF EXISTS "Admins/Leads can modify shared files" ON public.shared_files;
CREATE POLICY "Admins/Leads can modify shared files"
ON public.shared_files
FOR UPDATE
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

DROP POLICY IF EXISTS "Admins/Leads can delete shared files" ON public.shared_files;
CREATE POLICY "Admins/Leads can delete shared files"
ON public.shared_files
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.team_id = shared_files.team_id
      AND ur.role IN ('admin','team_lead')
  )
);

-- Indexes for shared_files
CREATE INDEX IF NOT EXISTS idx_shared_files_team_id ON public.shared_files(team_id);
CREATE INDEX IF NOT EXISTS idx_shared_files_shared_with ON public.shared_files(shared_with_user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_files;
