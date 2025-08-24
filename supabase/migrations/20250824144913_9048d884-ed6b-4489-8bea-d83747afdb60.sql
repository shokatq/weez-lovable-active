-- Create chat conversations table
CREATE TABLE public.chat_conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  team_id uuid,
  title text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  is_user boolean NOT NULL DEFAULT true,
  files jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create spaces table for team workspace organization
CREATE TABLE public.spaces (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create space members table
CREATE TABLE public.space_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id uuid NOT NULL,
  user_id uuid NOT NULL,
  added_by uuid NOT NULL,
  added_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(space_id, user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_conversations
CREATE POLICY "Users can view their own conversations" 
ON public.chat_conversations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" 
ON public.chat_conversations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
ON public.chat_conversations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" 
ON public.chat_conversations FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for chat_messages
CREATE POLICY "Users can view messages in their conversations" 
ON public.chat_messages FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.chat_conversations cc 
  WHERE cc.id = chat_messages.conversation_id AND cc.user_id = auth.uid()
));

CREATE POLICY "Users can create messages in their conversations" 
ON public.chat_messages FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.chat_conversations cc 
  WHERE cc.id = chat_messages.conversation_id AND cc.user_id = auth.uid()
));

-- RLS policies for spaces
CREATE POLICY "Team members can view spaces" 
ON public.spaces FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() AND ur.team_id = spaces.team_id
));

CREATE POLICY "Team admins can manage spaces" 
ON public.spaces FOR ALL 
USING (is_team_admin(auth.uid(), team_id));

-- RLS policies for space_members
CREATE POLICY "Space members can view space membership" 
ON public.space_members FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.spaces s 
  JOIN public.user_roles ur ON ur.team_id = s.team_id
  WHERE s.id = space_members.space_id AND ur.user_id = auth.uid()
));

CREATE POLICY "Team admins can manage space membership" 
ON public.space_members FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.spaces s 
  WHERE s.id = space_members.space_id AND is_team_admin(auth.uid(), s.team_id)
));

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON public.spaces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();