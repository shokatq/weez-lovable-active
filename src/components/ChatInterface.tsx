
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
          content: "🎉 **Welcome to Weezy!** \n\nI'm your advanced AI assistant designed to revolutionize how you work with your files and data. Here's what I can do for you:\n\n🔍 **Smart Search & Discovery**\n• Find files across all your platforms using natural language\n• Content-based search that understands context\n• Cross-platform file discovery with instant results\n\n📄 **Intelligent Document Analysis**\n• Generate comprehensive summaries of any document\n• Extract key insights and actionable information\n• Multi-format support (PDF, Word, Excel, PowerPoint)\n\n🧠 **Knowledge-Powered Q&A**\n• Answer questions about your document content\n• Cross-reference information from multiple sources\n• Provide contextual explanations and insights\n\n☁️ **Seamless File Management**\n• Upload files to any connected platform\n• Automated organization and tagging\n• Secure, encrypted file transfers\n\n🏢 **Enterprise Workspace**\n• Team collaboration and management\n• Advanced analytics and reporting\n• Permission controls and admin features\n\n✨ **Getting Started Tips:**\n• Try asking: \"Find my project files from last month\"\n• Or: \"Summarize my latest quarterly report\"\n• Or: \"Show me the workspace dashboard\"\n\nWhat would you like to explore first?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingType, setThinkingType] = useState<'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general'>('general');

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  const detectIntent = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('find') || lowerQuery.includes('search') || lowerQuery.includes('look for') || lowerQuery.includes('locate')) {
      return 'search';
    }
    
    if (lowerQuery.includes('summarize') || lowerQuery.includes('summary') || lowerQuery.includes('summarise') || lowerQuery.includes('key points')) {
      return 'summary';
    }
    
    if (lowerQuery.includes('explain') || lowerQuery.includes('about') || lowerQuery.includes('what is') || lowerQuery.includes('tell me about') || lowerQuery.includes('how does')) {
      return 'rag';
    }
    
    if (lowerQuery.includes('upload') || lowerQuery.includes('save to') || lowerQuery.includes('add to') || lowerQuery.includes('transfer')) {
      return 'upload';
    }

    if (lowerQuery.includes('workspace') || lowerQuery.includes('dashboard') || lowerQuery.includes('employees') || lowerQuery.includes('team') || lowerQuery.includes('stats') || lowerQuery.includes('analytics')) {
      return 'workspace';
    }
    
    return 'general';
  };

  const getAdvancedResponse = (intent: string, query: string) => {
    const demoResponse = demoResponses.find(response => response.type === intent);
    
    if (demoResponse) {
      return {
        content: demoResponse.response,
        files: demoResponse.files || []
      };
    }
    
    switch (intent) {
      case 'search':
        return {
          content: "🔍 **Advanced Search Results**\n\n**Search Query Processed:** \"" + query + "\"\n\n✨ **Smart Discovery Complete**\n\nI've performed an intelligent search across your entire connected ecosystem:\n\n📊 **Search Statistics:**\n• **Files Scanned:** 1,247 documents\n• **Platforms Searched:** Google Drive, Notion, OneDrive, Dropbox, SharePoint\n• **Search Time:** 0.8 seconds\n• **Relevance Score:** 94%\n\n📁 **Top Results Found:**\n• Deep Learning Research Papers (2 files) - 98% match\n• Implementation Guides (1 file) - 94% match\n• Related Documentation (3 files) - 87% match\n• Project Archives (2 files) - 82% match\n\n🎯 **Content Analysis:**\n• **Primary Topics:** Machine Learning, Neural Networks, Implementation\n• **File Types:** PDF (4), DOCX (2), PPTX (2)\n• **Date Range:** Last 6 months\n• **Size Range:** 2.4MB - 15.7MB\n\n⚡ **Quick Actions:**\n• Open specific file\n• Download all results\n• Create summary of findings\n• Share with team members\n\nWould you like me to open any specific file or refine the search further?",
          files: [demoFiles[0], demoFiles[1]]
        };
      case 'summary':
        return {
          content: "📄 **Advanced Document Analysis Complete**\n\n**Document:** \"" + query + "\"\n\n🧠 **AI-Powered Summary Generated**\n\n**Executive Overview:**\nYour document has been thoroughly analyzed using advanced natural language processing and machine learning algorithms.\n\n📊 **Analysis Metrics:**\n• **Pages Processed:** 24 pages\n• **Word Count:** 8,247 words\n• **Reading Time:** ~32 minutes\n• **Complexity Score:** Advanced (PhD level)\n• **Confidence Level:** 96%\n\n🎯 **Key Findings:**\n• **Primary Objectives:** Clearly identified and categorized\n• **Critical Data Points:** 17 key metrics extracted\n• **Actionable Insights:** 8 specific recommendations\n• **Risk Factors:** 3 potential concerns highlighted\n• **Success Indicators:** 5 measurable outcomes defined\n\n💡 **Strategic Recommendations:**\n1. **Immediate Actions:** 3 tasks requiring attention this week\n2. **Short-term Goals:** 5 objectives for next quarter\n3. **Long-term Vision:** Strategic roadmap outlined\n\n🔗 **Related Context:**\n• Cross-referenced with 12 related documents\n• Historical data trends analyzed\n• Industry benchmarks compared\n\n**Processing Time:** 2.3 seconds\n**Next Steps:** Would you like a detailed breakdown of any specific section?",
          files: [demoFiles[1]]
        };
      case 'rag':
        return {
          content: "🧠 **Knowledge-Powered Analysis**\n\n**Your Question:** \"" + query + "\"\n\n✨ **Comprehensive Answer Generated**\n\nI've analyzed your entire knowledge base to provide you with the most accurate and contextual response.\n\n📚 **Knowledge Sources Analyzed:**\n• **Documents Reviewed:** 15 relevant files\n• **Content Domains:** Technical documentation, research papers, implementation guides\n• **Total Knowledge Base:** 2.1M words processed\n• **Cross-References Found:** 23 related concepts\n\n🎯 **Detailed Explanation:**\n\n**Core Concept:**\nBased on your documents, this topic involves multiple interconnected principles that I've synthesized from your personal knowledge base.\n\n**Technical Implementation:**\n• **Method 1:** As detailed in your implementation guide (Doc_AI_Implementation.pdf)\n• **Method 2:** Alternative approach from your research notes\n• **Best Practices:** Compiled from your team's documentation\n• **Common Pitfalls:** Identified from your troubleshooting logs\n\n**Practical Applications:**\n• Real-world examples from your project files\n• Performance metrics from your test results\n• Optimization strategies from your research\n\n**Related Concepts:**\nYour documents also contain information about [5 related topics] that might interest you.\n\n🔬 **Analysis Confidence:** 97%\n📊 **Source Reliability:** Verified against multiple documents\n⚡ **Processing Time:** 2.8 seconds\n\nWould you like me to dive deeper into any specific aspect or show you the source documents?",
          files: [demoFiles[0]]
        };
      case 'upload':
        return {
          content: "☁️ **Advanced Upload System Activated**\n\n**Upload Request:** \"" + query + "\"\n\n🚀 **Smart Upload Complete!**\n\n✅ **Upload Success Metrics:**\n• **Transfer Speed:** 8.7 MB/s (Above average)\n• **Upload Time:** 00:02:34\n• **Data Integrity:** 100% verified\n• **Compression Ratio:** 23% size reduction applied\n\n🔐 **Security Features Applied:**\n• **Encryption:** AES-256 end-to-end encryption\n• **Virus Scan:** Clean - No threats detected\n• **Access Control:** Team permissions configured\n• **Backup Creation:** Automatic redundancy enabled\n• **Version Control:** Full history tracking activated\n\n🎯 **Smart Organization:**\n• **Auto-Categorization:** Placed in appropriate folder structure\n• **Tagging:** 7 relevant tags automatically applied\n• **Metadata:** Complete file information extracted\n• **OCR Processing:** Text content indexed for search\n\n📊 **Platform Integration:**\n• **Primary Storage:** Successfully uploaded to target platform\n• **Cross-Platform Sync:** Available across all connected services\n• **Sharing Options:** Configurable team access enabled\n• **Mobile Access:** Available on all devices\n\n🔗 **Shareable Links Generated:**\n• **Team Link:** Full collaboration access\n• **View-Only Link:** Read access for stakeholders\n• **Download Link:** Direct file access (expires in 30 days)\n\n**Next Steps:** Would you like to notify team members or configure additional sharing settings?",
          files: []
        };
      case 'workspace':
        return {
          content: "🏢 **Enterprise Workspace Dashboard**\n\n**Request:** \"" + query + "\"\n\n✨ **Comprehensive Workspace Overview**\n\nI've compiled detailed analytics and management tools for your enterprise workspace.\n\n📊 **Real-Time Analytics:**\n\n**Team Statistics:**\n• **Total Employees:** 4 active members\n• **Admin Users:** 2 (50% admin ratio)\n• **Employee Users:** 2 (Recently promoted: 1)\n• **Last Activity:** 4 actions in the last 6 hours\n• **Peak Usage:** Monday 2-4 PM\n\n**File Distribution Analytics:**\n• **Total Files:** 7,774 documents\n• **Storage Used:** 247.3 GB (62% of quota)\n• **Monthly Growth:** +12.4% (987 new files)\n• **Most Active Platform:** Google Drive (3,214 files)\n\n**Platform Breakdown:**\n• **Google Drive:** 3,214 files (41.4%)\n• **Notion:** 1,892 files (24.3%)\n• **OneDrive:** 1,567 files (20.1%)\n• **Dropbox:** 823 files (10.6%)\n• **SharePoint:** 278 files (3.6%)\n\n**File Type Analysis:**\n• **Documents (.pdf, .doc, .docx):** 3,889 files (50%)\n• **Presentations (.ppt, .pptx):** 1,555 files (20%)\n• **Spreadsheets (.xls, .xlsx):** 1,167 files (15%)\n• **Images & Media:** 778 files (10%)\n• **Other Formats:** 385 files (5%)\n\n🎯 **Quick Management Actions:**\n• **\"Add new employee\"** - Invite team member with custom permissions\n• **\"View detailed analytics\"** - Access comprehensive dashboard\n• **\"Promote user to admin\"** - Modify user permissions\n• **\"Review file access\"** - Audit security settings\n\n**System Health:** 99.7% uptime | **Security Status:** All systems secure\n\nWhat workspace management task would you like to perform?",
          files: []
        };
      default:
        return {
          content: `💭 **Advanced AI Analysis**\n\n**Your Request:** "${query}"\n\n🚀 **Intelligent Response System Activated**\n\nI'm processing your request using state-of-the-art AI capabilities designed for maximum efficiency and accuracy.\n\n✨ **Available AI Capabilities:**\n\n🔍 **Smart File Discovery**\n• Natural language search across all platforms\n• Content-based intelligent matching\n• Advanced filtering and categorization\n• Real-time search with instant results\n• Cross-platform file discovery\n\n📄 **Document Intelligence**\n• AI-powered summarization engine\n• Key insight extraction and analysis\n• Multi-format document processing\n• Contextual understanding and reasoning\n• Automated report generation\n\n🧠 **Knowledge Processing**\n• Advanced Q&A using your content\n• Cross-document information synthesis\n• Contextual explanations and tutorials\n• Concept mapping and relationship analysis\n• Intelligent content recommendations\n\n☁️ **Seamless Integration**\n• Multi-platform file management\n• Automated organization and tagging\n• Secure encrypted transfers\n• Team collaboration features\n• Real-time synchronization\n\n🏢 **Enterprise Features**\n• Advanced workspace analytics\n• Team management and permissions\n• Comprehensive reporting dashboard\n• Security monitoring and compliance\n• Scalable infrastructure\n\n🎯 **Suggested Actions:**\n• **\"Find my [topic] files\"** - Discover relevant documents\n• **\"Summarize [document name]\"** - Generate intelligent summaries\n• **\"Explain [concept] from my files\"** - Get contextual answers\n• **\"Show workspace dashboard\"** - Access enterprise features\n• **\"Upload to [platform]\"** - Manage file transfers\n\n**AI Processing Power:** Ready to assist with any request\n**Response Time:** Optimized for speed and accuracy\n\nHow can I help you accomplish your goals today?`,
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

    const intent = detectIntent(content);
    setThinkingType(intent);
    setIsThinking(true);

    setTimeout(() => {
      const response = getAdvancedResponse(intent, content);
      
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
    }, 4000);
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-black via-gray-900 to-black">
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
