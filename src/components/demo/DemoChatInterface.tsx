import { useState } from 'react';
import { Send, MessageSquare, Plus, Search, Bot, User, FileText, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { demoConversations, demoChatMessages, DemoUser, demoRFPOutput } from '@/data/comprehensiveDemoData';

interface DemoChatInterfaceProps {
  currentUser: DemoUser;
}

const DemoChatInterface = ({ currentUser }: DemoChatInterfaceProps) => {
  const [selectedConversation, setSelectedConversation] = useState(demoConversations[0]);
  const [messages, setMessages] = useState(selectedConversation.messages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      
      if (content.toLowerCase().includes('rfp') || content.toLowerCase().includes('proposal')) {
        aiResponse = `I'll help you generate an RFP! Based on your requirements, here's a comprehensive proposal:\n\n**${demoRFPOutput.title}**\n\n${demoRFPOutput.sections.slice(0, 2).map(s => `**${s.heading}**: ${s.content.substring(0, 200)}...`).join('\n\n')}\n\nWould you like me to expand on any specific section?`;
      } else if (content.toLowerCase().includes('search') || content.toLowerCase().includes('find')) {
        aiResponse = `I found several relevant documents for you:\n\n• **ProjectPlan.docx** (OneDrive) - Q4 planning document\n• **TechnicalSpecs.md** (GitHub) - System architecture specs\n• **SecurityPolicy.docx** (Google Drive) - Corporate security policies\n\nWould you like me to open any of these files or search for something more specific?`;
      } else if (content.toLowerCase().includes('help') || content.toLowerCase().includes('how')) {
        aiResponse = `I'm here to help! I can assist you with:\n\n🔍 **Finding documents** - Search across all connected platforms\n📝 **Generating RFPs** - Create proposals based on your documents\n💬 **Answering questions** - Get help with your work\n📊 **Project insights** - Analyze your workspace data\n\nWhat would you like to work on today?`;
      } else {
        aiResponse = `Thanks for your message! I understand you're asking about "${content}". I can help you with document searches, RFP generation, and answering questions about your workspace. Would you like me to search for relevant documents or help you with something specific?`;
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Conversations</h2>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {demoConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation);
                  setMessages(conversation.messages);
                }}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedConversation.id === conversation.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conversation.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">{selectedConversation.title}</h2>
                <p className="text-sm text-muted-foreground">AI Assistant • Always available</p>
              </div>
            </div>
            <Badge variant="secondary">Demo Mode</Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser ? 'bg-primary' : 'bg-muted'
                }`}>
                  {message.isUser ? (
                    <User className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                
                <div className={`flex-1 max-w-[70%] ${message.isUser ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-4 rounded-lg ${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your workspace..."
                  className="pr-12"
                  disabled={isTyping}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage('Help me find project documents')}
                disabled={isTyping}
              >
                <FileText className="w-4 h-4 mr-2" />
                Find Documents
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage('Generate an RFP for cloud migration')}
                disabled={isTyping}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Generate RFP
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage('How can you help me?')}
                disabled={isTyping}
              >
                <Bot className="w-4 h-4 mr-2" />
                Get Help
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoChatInterface;