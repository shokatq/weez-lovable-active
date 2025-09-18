-- Create space messages table for proper chat functionality
CREATE TABLE IF NOT EXISTS public.space_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  reply_to UUID REFERENCES public.space_messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.space_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for space messages
CREATE POLICY "Space members can view messages"
ON public.space_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.space_members sm 
    WHERE sm.space_id = space_messages.space_id 
    AND sm.user_id = auth.uid()
    AND (sm.status = 'active' OR sm.status IS NULL)
  )
);

CREATE POLICY "Space members can create messages"
ON public.space_messages FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.space_members sm 
    WHERE sm.space_id = space_messages.space_id 
    AND sm.user_id = auth.uid()
    AND (sm.status = 'active' OR sm.status IS NULL)
  )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER space_messages_updated_at
  BEFORE UPDATE ON public.space_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for space messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.space_messages;

-- Create function to get space members with profiles
CREATE OR REPLACE FUNCTION public.get_space_members_with_profiles(space_id_param UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  email TEXT,
  role app_role,
  status TEXT,
  added_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is a member of the space
  IF NOT EXISTS (
    SELECT 1 FROM public.space_members sm
    WHERE sm.space_id = space_id_param 
    AND sm.user_id = auth.uid()
    AND (sm.status = 'active' OR sm.status IS NULL)
  ) THEN
    RAISE EXCEPTION 'Access denied: Not a member of this space';
  END IF;

  RETURN QUERY
  SELECT 
    sm.id,
    sm.user_id,
    p.first_name,
    p.last_name,
    p.avatar_url,
    p.email,
    sm.role,
    sm.status,
    sm.added_at
  FROM public.space_members sm
  JOIN public.profiles p ON p.id = sm.user_id
  WHERE sm.space_id = space_id_param
  AND (sm.status = 'active' OR sm.status IS NULL)
  ORDER BY sm.added_at ASC;
END;
$$;