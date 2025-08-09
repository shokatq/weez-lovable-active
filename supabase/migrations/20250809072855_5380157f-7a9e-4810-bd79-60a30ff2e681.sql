-- Fix previous migration: ensure policies are recreated idempotently
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they already exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles in their teams" ON public.profiles;

-- Recreate policies
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can view profiles in their teams"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur1
    JOIN public.user_roles ur2 ON ur1.team_id = ur2.team_id
    WHERE ur1.user_id = auth.uid()
      AND ur2.user_id = profiles.id
  )
);
