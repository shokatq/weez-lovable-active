-- Create chat_messages table for the chat interface
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  conversation_id UUID NOT NULL,
  user_id UUID NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat messages
CREATE POLICY "Team members can view chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.team_employees 
    WHERE team_employees.team_id = chat_messages.conversation_id 
    AND team_employees.user_id = auth.uid()
    AND team_employees.status = 'active'
  )
);

CREATE POLICY "Team members can insert chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.team_employees 
    WHERE team_employees.team_id = chat_messages.conversation_id 
    AND team_employees.user_id = auth.uid()
    AND team_employees.status = 'active'
  )
);

-- Create trigger for automatic timestamp updates on chat_messages
CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();