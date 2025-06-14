
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
          content: "🔍 **Advanced Search Results**\n\n**Query Analyzed:** \"" + query + "\"\n\n✨ **Intelligent File Discovery Complete**\n\nI've performed a comprehensive search across your entire connected ecosystem using advanced AI algorithms:\n\n📊 **Search Performance Metrics:**\n• **Documents Scanned:** 2,847 files\n• **Platforms Searched:** Google Drive, Notion, OneDrive, Dropbox, SharePoint\n• **Processing Time:** 0.6 seconds\n• **Relevance Accuracy:** 96.8%\n• **AI Confidence Score:** 94.2%\n\n📁 **Relevant Files Discovered:**\n• Machine Learning Papers (3 files) - 97% relevance\n• Implementation Guides (2 files) - 92% relevance\n• Technical Documentation (4 files) - 89% relevance\n• Research Archives (2 files) - 85% relevance\n\n🧠 **Content Intelligence Analysis:**\n• **Primary Concepts:** Neural Networks, Deep Learning, AI Implementation\n• **File Formats:** PDF (5), DOCX (3), PPTX (3)\n• **Creation Timeline:** Last 4 months\n• **Total Size:** 47.3 MB\n• **Authors Identified:** 7 unique contributors\n\n⚡ **Quick Actions Available:**\n• Open files in native applications\n• Generate comprehensive summary\n• Create knowledge graph\n• Share with team members\n• Export search results\n\n🎯 **Recommendation:** Based on your query, I suggest starting with the most recent ResNet implementation guide. Would you like me to open it or provide a detailed summary?",
          files: [demoFiles[0], demoFiles[5]]
        };
      case 'summary':
        return {
          content: "📄 **Advanced Document Intelligence Summary**\n\n**Document Processed:** \"" + query + "\"\n\n🧠 **AI-Powered Analysis Complete**\n\nYour document has been thoroughly analyzed using state-of-the-art natural language processing and machine learning algorithms.\n\n📊 **Document Analysis Metrics:**\n• **Pages Analyzed:** 32 pages\n• **Word Count:** 12,847 words\n• **Reading Time:** ~48 minutes\n• **Complexity Level:** Advanced Professional\n• **AI Confidence:** 97.3%\n• **Language Quality Score:** 9.2/10\n\n🎯 **Executive Summary:**\n• **Key Objectives:** 5 primary goals clearly identified\n• **Critical Insights:** 12 actionable data points extracted\n• **Strategic Recommendations:** 6 high-impact suggestions\n• **Risk Assessment:** 2 potential concerns highlighted\n• **Success Metrics:** 8 measurable KPIs defined\n\n💡 **Strategic Intelligence:**\n1. **Immediate Priorities:** 4 tasks requiring attention within 7 days\n2. **Quarterly Objectives:** 7 medium-term goals for Q1 2025\n3. **Annual Vision:** Long-term strategic roadmap outlined\n4. **Resource Requirements:** Budget and staffing recommendations\n\n🔗 **Contextual Connections:**\n• Cross-referenced with 18 related documents\n• Historical trend analysis completed\n• Industry benchmark comparisons included\n• Competitive intelligence integrated\n\n**Processing Efficiency:** 1.8 seconds | **Next Steps:** Would you like me to elaborate on any specific section or create actionable task lists?",
          files: [demoFiles[1], demoFiles[4]]
        };
      case 'rag':
        return {
          content: "🧠 **Knowledge-Powered Deep Analysis**\n\n**Your Inquiry:** \"" + query + "\"\n\n✨ **Comprehensive Knowledge Synthesis Complete**\n\nI've analyzed your entire knowledge repository to provide the most accurate, contextual, and insightful response possible.\n\n📚 **Knowledge Base Analysis:**\n• **Documents Analyzed:** 23 relevant files\n• **Content Domains:** Technical specifications, research papers, implementation guides\n• **Knowledge Depth:** 3.2M words processed\n• **Cross-References:** 31 interconnected concepts\n• **Historical Context:** 18 months of documentation\n\n🎯 **Detailed Expert Explanation:**\n\n**Core Concept Overview:**\nBased on your comprehensive documentation library, this topic represents a sophisticated intersection of multiple technical domains that I've synthesized from your personal knowledge base.\n\n**Technical Implementation Details:**\n• **Primary Methodology:** As documented in your implementation guide (Technical_Architecture_Documentation.pdf)\n• **Alternative Approaches:** Secondary methods from your research collection\n• **Best Practices:** Compiled from your team's documented experiences\n• **Performance Optimization:** Strategies from your optimization guides\n• **Common Challenges:** Solutions derived from your troubleshooting documentation\n\n**Practical Applications & Use Cases:**\n• Real-world implementations from your project files\n• Performance benchmarks from your testing results\n• Optimization strategies from your research\n• Industry applications from your market analysis\n\n**Advanced Insights:**\n• **Emerging Trends:** Based on your latest research papers\n• **Future Implications:** Synthesized from your strategic documents\n• **Risk Mitigation:** Compiled from your risk assessment files\n\n🔬 **Analysis Confidence:** 98.1%\n📊 **Source Reliability:** Verified against multiple authoritative documents\n⚡ **Processing Excellence:** 2.4 seconds\n\n**Recommendation:** Your documentation suggests exploring [related advanced concepts]. Would you like me to deep-dive into specific implementation details or show you the source documents?",
          files: [demoFiles[0], demoFiles[5]]
        };
      case 'upload':
        return {
          content: "☁️ **Advanced Upload System - Mission Complete**\n\n**Upload Request:** \"" + query + "\"\n\n🚀 **Intelligent Upload Successfully Executed**\n\n✅ **Performance Excellence Metrics:**\n• **Transfer Velocity:** 12.4 MB/s (Exceptional performance)\n• **Upload Duration:** 00:01:47\n• **Data Integrity:** 100% verified with checksums\n• **Compression Applied:** 28% size reduction achieved\n• **Bandwidth Efficiency:** 94% optimal utilization\n\n🔐 **Enterprise Security Protocols:**\n• **Encryption Standard:** AES-256 military-grade encryption\n• **Security Scan:** Advanced threat detection - All clear\n• **Access Controls:** Enterprise-grade permissions configured\n• **Audit Trail:** Complete transfer history logged\n• **Compliance:** GDPR, SOC2, and ISO27001 compliant\n• **Backup Creation:** Automatic redundancy across 3 regions\n\n🎯 **Intelligent Organization System:**\n• **Auto-Classification:** Smart folder placement using AI\n• **Metadata Extraction:** 15 relevant tags automatically applied\n• **Content Indexing:** Full-text search optimization completed\n• **OCR Processing:** Text content extracted and indexed\n• **Version Control:** Automatic versioning system activated\n\n📊 **Multi-Platform Integration:**\n• **Primary Storage:** Successfully uploaded to target platform\n• **Sync Status:** Available across all connected services\n• **Collaboration Ready:** Team access permissions configured\n• **Mobile Optimization:** Optimized for all device types\n• **Offline Access:** Smart caching enabled\n\n🔗 **Smart Sharing Options Generated:**\n• **Team Collaboration Link:** Full edit access for authorized members\n• **Stakeholder View Link:** Read-only access with commenting\n• **Public Share Link:** Configurable expiration (30 days default)\n• **Download Link:** Direct access with usage analytics\n• **Embed Code:** Ready for website integration\n\n**System Status:** All systems optimal | **Next Steps:** Would you like to configure advanced sharing settings or notify specific team members?",
          files: []
        };
      case 'workspace':
        return {
          content: "🏢 **Enterprise Workspace Command Center**\n\n**Request:** \"" + query + "\"\n\n✨ **Comprehensive Workspace Intelligence Dashboard**\n\nI've compiled advanced analytics and intelligent management tools for your enterprise workspace ecosystem.\n\n📊 **Real-Time Workspace Analytics:**\n\n**Team Intelligence:**\n• **Active Team Members:** 6 professionals\n• **Administrative Users:** 2 (33% leadership ratio)\n• **Standard Users:** 4 (Recently onboarded: 2 members)\n• **Activity Score:** 92% engagement rate\n• **Peak Performance Hours:** Monday-Wednesday 10 AM - 3 PM\n• **Collaboration Index:** 8.7/10\n\n**Digital Asset Distribution:**\n• **Total Digital Assets:** 12,447 documents\n• **Storage Utilization:** 387.2 GB (77% of enterprise quota)\n• **Monthly Growth Rate:** +15.8% (1,547 new files)\n• **Most Active Platform:** Google Drive (4,921 files - 39.5%)\n• **Fastest Growing:** Notion workspace (+24% this month)\n\n**Advanced Platform Analytics:**\n• **Google Drive:** 4,921 files (39.5%) - Primary collaboration hub\n• **Notion Workspace:** 2,734 files (22.0%) - Knowledge management\n• **OneDrive Business:** 2,156 files (17.3%) - Document storage\n• **Dropbox Business:** 1,492 files (12.0%) - Creative assets\n• **SharePoint:** 847 files (6.8%) - Enterprise documents\n• **Slack Workspace:** 297 files (2.4%) - Communication assets\n\n**Intelligent File Type Distribution:**\n• **Business Documents (.pdf, .doc, .docx):** 5,734 files (46%)\n• **Presentations (.ppt, .pptx):** 2,489 files (20%)\n• **Data Analytics (.xls, .xlsx, .csv):** 1,867 files (15%)\n• **Visual Assets (.png, .jpg, .svg):** 1,244 files (10%)\n• **Technical Files (.js, .py, .json):** 623 files (5%)\n• **Archive & Others (.zip, .txt, .md):** 490 files (4%)\n\n🎯 **Intelligent Management Actions:**\n• **\"Add team member\"** - Onboard with custom role-based permissions\n• **\"View analytics dashboard\"** - Access real-time workspace insights\n• **\"Promote to admin\"** - Upgrade user privileges with audit trail\n• **\"Review security settings\"** - Comprehensive access audit\n• **\"Optimize storage\"** - AI-powered cleanup recommendations\n• **\"Generate reports\"** - Automated business intelligence\n\n**Enterprise Health Score:** 96.3% | **Security Status:** All systems secure & compliant\n**Recommendation:** Consider expanding storage quota - approaching 80% utilization threshold.\n\nWhat enterprise management task would you like me to execute?",
          files: []
        };
      default:
        return {
          content: `🤖 **Advanced AI Assistant - Ready to Serve**\n\n**Your Request:** "${query}"\n\n🚀 **Intelligent Processing System Activated**\n\nI'm leveraging cutting-edge artificial intelligence to provide you with exceptional assistance across all your professional needs.\n\n✨ **Premium AI Capabilities at Your Service:**\n\n🔍 **Intelligent Document Discovery**\n• Natural language search with 97% accuracy\n• Cross-platform content understanding\n• Smart filtering and categorization\n• Real-time results with instant preview\n• Advanced content-based matching\n\n📄 **Advanced Document Intelligence**\n• AI-powered summarization with key insights\n• Multi-language document processing\n• Contextual analysis and reasoning\n• Automated report generation\n• Smart content extraction\n\n🧠 **Knowledge-Powered Analytics**\n• Context-aware question answering\n• Multi-document information synthesis\n• Intelligent concept mapping\n• Historical data analysis\n• Predictive insights generation\n\n☁️ **Enterprise File Management**\n• Intelligent upload and organization\n• Automated tagging and categorization\n• Military-grade security protocols\n• Cross-platform synchronization\n• Advanced collaboration tools\n\n🏢 **Workspace Intelligence**\n• Real-time team analytics\n• Performance monitoring dashboard\n• Advanced permission management\n• Compliance and security auditing\n• Automated reporting systems\n\n🎯 **Suggested Power Commands:**\n• **\"Find my [topic] research files\"** - Discover relevant documents instantly\n• **\"Summarize [document name]\"** - Generate intelligent abstracts\n• **\"Explain [concept] from my knowledge base\"** - Get contextual explanations\n• **\"Show enterprise dashboard\"** - Access workspace analytics\n• **\"Upload to [platform] securely\"** - Manage file transfers\n• **\"Analyze team performance\"** - Review collaboration metrics\n\n**AI Processing Power:** Fully optimized and ready\n**Response Accuracy:** 97.3% average precision\n**Processing Speed:** Sub-second response times\n\nHow can I leverage my advanced capabilities to accelerate your productivity today?`,
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
      <div className="min-h-screen flex w-full bg-black">
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
