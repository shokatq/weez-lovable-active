import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Users, Smile } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getTeamMemberProfile } from '@/services/secureProfileService';

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

const dynamicMessages = [
  "💡 Ask me anything about your team's productivity...",
  "🚀 Let's boost your workflow together!",
  "📊 Need insights about your workspace? I'm here to help!",
  "🎯 What would you like to accomplish today?",
  "⚡ Ready to supercharge your team collaboration?",
  "🌟 How can I assist your team's success today?",
  "💪 Let's tackle your business challenges together!",
  "🔍 Exploring new possibilities for your workspace...",
];

const TeamChatInterface = () => {
  const { user } = useAuth();
  const { userRole } = useUserRole();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentDynamicMessage, setCurrentDynamicMessage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatChannel = useRef<any>(null);

  // Rotate dynamic messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDynamicMessage((prev) => (prev + 1) % dynamicMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Setup real-time chat
  useEffect(() => {
    if (!userRole?.teamId) return;

    // Join team chat channel
    chatChannel.current = supabase.channel(`team_chat_${userRole.teamId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${userRole.teamId}`
      }, (payload) => {
        const newMessage = payload.new as ChatMessage;
        setMessages(prev => [...prev, newMessage]);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = chatChannel.current.presenceState();
        setOnlineUsers(Object.keys(state));
      })
      .subscribe();

    // Track presence
    chatChannel.current.track({ user_id: user?.id, email: user?.email });

    // Load existing messages
    loadMessages();

    return () => {
      if (chatChannel.current) {
        supabase.removeChannel(chatChannel.current);
      }
    };
  }, [userRole?.teamId, user?.id]);

  const loadMessages = async () => {
    if (!userRole?.teamId) return;

    try {
      // Get messages first
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', userRole.teamId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      // Get secure profile data for message authors (names and avatars only, no emails)
      const userIds = [...new Set(data?.map(msg => msg.user_id).filter(Boolean) || [])];
      const profilePromises = userIds.map(async (userId) => {
        try {
          return await getTeamMemberProfile(userId);
        } catch {
          return { id: userId, first_name: 'Unknown', last_name: 'User', avatar_url: null };
        }
      });
      
      const profiles = await Promise.all(profilePromises);

      // Combine messages with secure profile data
      const messagesWithProfiles = data?.map(msg => ({
        ...msg,
        profiles: profiles?.find(p => p?.id === msg.user_id) || null
      })) || [];

      setMessages(messagesWithProfiles || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !userRole?.teamId) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: message,
          conversation_id: userRole.teamId,
          user_id: user?.id,
          is_user: true
        });

      if (error) throw error;
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[80vh] bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Team Chat</h2>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300">
            {onlineUsers.length} online
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {userRole?.teamName || 'Team Workspace'}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Welcome to Team Chat</h3>
              <p className="text-muted-foreground max-w-md">
                {dynamicMessages[currentDynamicMessage]}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.profiles?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {msg.profiles?.first_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {msg.profiles?.first_name} {msg.profiles?.last_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-foreground bg-muted/30 rounded-lg px-3 py-2 max-w-xl">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card/30">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="pr-12 bg-background border-border"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            onClick={sendMessage}
            disabled={!message.trim()}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamChatInterface;