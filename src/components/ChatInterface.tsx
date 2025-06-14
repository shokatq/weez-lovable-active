import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SuggestionBubbles from "./SuggestionBubbles";
import { demoFiles, demoResponses } from "@/data/demoData";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isThinking?: boolean;
  files?: any[];
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const ChatInterface = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Welcome to Weezy",
      lastMessage: "Hello! I'm Weezy, your AI assistant.",
      timestamp: new Date(),
      messages: [
        {
          id: "1",
          content: "Hello! I'm Weezy, your intelligent AI assistant. I can help you search files, summarize documents, answer questions about your content, and upload files to various platforms. Just ask me naturally!",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingType, setThinkingType] = useState<'search' | 'summary' | 'rag' | 'upload' | 'general'>('general');

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  const detectIntent = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Search intent
    if (lowerQuery.includes('find') || lowerQuery.includes('search') || lowerQuery.includes('look for')) {
      return 'search';
    }
    
    // Summarize intent
    if (lowerQuery.includes('summarize') || lowerQuery.includes('summary') || lowerQuery.includes('summarise')) {
      return 'summary';
    }
    
    // RAG intent
    if (lowerQuery.includes('explain') || lowerQuery.includes('about') || lowerQuery.includes('what is') || lowerQuery.includes('tell me about')) {
      return 'rag';
    }
    
    // Upload intent
    if (lowerQuery.includes('upload') || lowerQuery.includes('save to') || lowerQuery.includes('add to')) {
      return 'upload';
    }

    // Workspace intent
    if (lowerQuery.includes('workspace') || lowerQuery.includes('dashboard') || lowerQuery.includes('employees') || lowerQuery.includes('team') || lowerQuery.includes('stats')) {
      return 'workspace';
    }
    
    return 'general';
  };

  const getResponseForIntent = (intent: string, query: string) => {
    const demoResponse = demoResponses.find(response => response.type === intent);
    
    if (demoResponse) {
      return {
        content: demoResponse.response,
        files: demoResponse.files || []
      };
    }
    
    // Enhanced fallback responses with more detail
    switch (intent) {
      case 'search':
        return {
          content: "🔍 **Search Results**\n\nI found several files matching your criteria across your connected platforms:\n\n**Files Found:**\n• Deep Learning Research Papers (2 files)\n• Implementation Guides (1 file)\n• Related Documentation (3 files)\n\n**Search took 0.8 seconds** - Scanned 1,247 files across Google Drive, Notion, and OneDrive\n\nWould you like me to refine the search or open any specific file?",
          files: [demoFiles[0], demoFiles[1]]
        };
      case 'summary':
        return {
          content: "📄 **Document Summary Generated**\n\n**Executive Summary:**\nYour requested document has been analyzed and summarized with key insights extracted.\n\n**Key Highlights:**\n• Main objectives and findings clearly identified\n• Critical data points and metrics highlighted\n• Actionable recommendations provided\n• Supporting evidence and references included\n\n**Analysis Depth:** Comprehensive (95% content coverage)\n**Processing Time:** 1.2 seconds\n**Confidence Score:** 94%\n\nWould you like me to dive deeper into any specific section?",
          files: [demoFiles[1]]
        };
      case 'rag':
        return {
          content: "🧠 **Knowledge Analysis Complete**\n\n**Topic Analysis:** Based on your document collection\n\nI've analyzed your files and extracted relevant information about your query:\n\n**Key Insights:**\n• Comprehensive explanation based on your documents\n• Cross-referenced information from multiple sources\n• Technical details and implementation specifics\n• Best practices and recommendations\n• Related concepts you might find interesting\n\n**Sources Analyzed:** 3 documents\n**Relevance Score:** 96%\n**Processing Time:** 2.1 seconds\n\nWould you like me to explore any related topics or provide more specific details?",
          files: [demoFiles[0]]
        };
      case 'upload':
        return {
          content: "☁️ **Upload Successful!**\n\n✅ **File Upload Completed**\n\n**Upload Details:**\n📁 Destination: Company Cloud Storage\n🔗 Shareable link generated\n👥 Permissions: Team access configured\n📊 File integrity verified\n⚡ Upload speed: 4.2 MB/s\n\n**Security Features:**\n• End-to-end encryption applied\n• Virus scan completed (Clean)\n• Backup copy created\n• Version history enabled\n\n**Next Steps:**\nYour file is now accessible to authorized team members. Would you like me to notify specific people or create a sharing link?",
          files: []
        };
      case 'workspace':
        return {
          content: "🏢 **Workspace Management**\n\n**Enterprise Dashboard Access**\n\nI can help you with workspace management:\n\n**Available Actions:**\n📊 **Dashboard Overview** - View file statistics and analytics\n👥 **Employee Management** - Add, remove, or promote team members\n📈 **Platform Analytics** - See file distribution across platforms\n🔒 **Permission Control** - Manage admin and employee roles\n\n**Current Workspace Status:**\n• Total Employees: 4 (2 Admins, 2 Employees)\n• Total Files: 7,774 across 5 platforms\n• Recent Activity: 4 actions in the last 6 hours\n\n**Quick Actions:**\n• \"Show me the dashboard\" - Access full analytics\n• \"Add new employee\" - Invite team member\n• \"View file statistics\" - See detailed breakdowns\n\nWould you like me to open the workspace dashboard or help with specific employee management tasks?",
          files: []
        };
      default:
        return {
          content: `💭 **Understanding Your Request**\n\nI'm analyzing your query: "${query}"\n\n**Available Capabilities:**\n\n🔍 **Smart Search** - Find files across all platforms\n• Natural language search\n• Content-based discovery\n• Multi-platform scanning\n\n📄 **Intelligent Summaries** - Extract key insights\n• Automatic content analysis\n• Key points extraction\n• Executive summaries\n\n🧠 **Knowledge Q&A** - Answer questions about your content\n• Document-based responses\n• Cross-referencing information\n• Contextual explanations\n\n☁️ **Seamless Uploads** - Save files anywhere\n• Multi-platform support\n• Automated organization\n• Team collaboration\n\n🏢 **Workspace Management** - Enterprise features\n• Employee management\n• Analytics dashboard\n• Permission controls\n• File statistics\n\n**Try asking:** "Find my project files", "Summarize my latest report", "Show workspace dashboard", or "Add new employee"`,
          files: []
        };
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversation || content.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              lastMessage: content,
              timestamp: new Date(),
            }
          : conv
      )
    );

    // Detect intent and set thinking type
    const intent = detectIntent(content);
    setThinkingType(intent);
    setIsThinking(true);

    // Generate response with longer delay for more realistic feel
    setTimeout(() => {
      const response = getResponseForIntent(intent, content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
        files: response.files,
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                lastMessage: aiMessage.content,
                timestamp: new Date(),
              }
            : conv
        )
      );

      setIsThinking(false);
    }, 3000); // Increased delay for more realistic demonstration
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      lastMessage: "Start a new conversation...",
      timestamp: new Date(),
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-weezy-dark">
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={setCurrentConversationId}
          onNewConversation={createNewConversation}
        />
        
        <main className="flex-1 flex flex-col relative">
          <ChatHeader />
          
          <div className="flex-1 flex flex-col relative">
            <ChatMessages 
              messages={currentConversation?.messages || []} 
              isThinking={isThinking}
              thinkingType={thinkingType}
            />
            
            <div className="relative">
              <SuggestionBubbles />
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ChatInterface;
