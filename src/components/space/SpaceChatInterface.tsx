import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SpaceMember {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string;
  role: string;
  status: string;
}

interface SpaceMessage {
  id: string;
  space_id: string;
  user_id: string;
  content: string;
  message_type: string;
  created_at: string;
  user?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

interface SpaceChatInterfaceProps {
  spaceId: string;
  members: SpaceMember[];
}

export const SpaceChatInterface: React.FC<SpaceChatInterfaceProps> = ({
  spaceId,
  members
}) => {
  const [messages, setMessages] = useState<SpaceMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      // Load messages with user profiles using explicit join
      const { data: messagesData, error: messagesError } = await supabase
        .from('space_messages')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Get unique user IDs from messages
      const userIds = [...new Set(messagesData?.map(msg => msg.user_id) || [])];
      
      // Load profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.warn('Error loading profiles:', profilesError);
      }

      // Create profiles map for quick lookup
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Format messages with user data
      const formattedMessages = messagesData?.map(msg => ({
        ...msg,
        user: profilesMap.get(msg.user_id) || {
          first_name: 'Unknown',
          last_name: 'User',
          avatar_url: null
        }
      })) || [];
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('space_messages')
        .insert({
          space_id: spaceId,
          user_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (spaceId) {
      loadMessages();
    }
  }, [spaceId]);

  useEffect(() => {
    if (!spaceId) return;

    const messagesChannel = supabase
      .channel(`space-messages-${spaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'space_messages',
          filter: `space_id=eq.${spaceId}`
        },
        async (payload) => {
          const newMsg = payload.new as SpaceMessage;
          
          // Get user profile for the new message
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('id', newMsg.user_id)
            .single();

          if (error) {
            console.warn('Error loading profile for new message:', error);
          }

          setMessages(prev => [...prev, {
            ...newMsg,
            user: profile || {
              first_name: 'Unknown',
              last_name: 'User', 
              avatar_url: null
            }
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [spaceId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-background">
          <h3 className="font-semibold text-foreground"># General Chat</h3>
          <p className="text-sm text-muted-foreground">{members.length} members</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.user?.avatar_url || undefined} />
                    <AvatarFallback>
                      {message.user?.first_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {message.user?.first_name || 'Unknown'} {message.user?.last_name || ''}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1"
            />
            <Button size="icon" variant="ghost">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Members Sidebar */}
      <Card className="w-64 border-l border-r-0 border-t-0 border-b-0 rounded-none">
        <div className="p-4 border-b">
          <h4 className="font-medium text-sm">Members ({members.length})</h4>
        </div>
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-2 space-y-1">
            {members.map((member) => (
              <div key={member.user_id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {member.first_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {member.first_name} {member.last_name}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {member.role}
                  </Badge>
                </div>
                <div className="h-2 w-2 bg-green-500 rounded-full" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};