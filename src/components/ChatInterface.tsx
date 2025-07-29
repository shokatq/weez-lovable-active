
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ImprovedChatInput from "@/components/ImprovedChatInput";
import ChatWelcomeDialog from "./ChatWelcomeDialog";
import { Message, Conversation } from "@/types/chat";
import { demoFiles, semanticSearch, findFileByDescription, extractTopicFromQuery } from "@/data/demoData";
import { demoPDFs, searchPDFs, getPDFsByPlatform, getAllPDFs, getRecentPDFs, PDFFile, findPDFByNameAndPlatform, locatePDF, updatePDFVersion } from "@/data/pdfData";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingType, setThinkingType] = useState<'search' | 'summary' | 'rag' | 'upload' | 'workspace' | 'general' | 'delete'>('general');
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('weez-welcome-shown');
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState("default");
  const navigate = useNavigate();

  // Initialize with a default conversation
  useEffect(() => {
    const defaultConversation: Conversation = {
      id: "default",
      messages: [],
      timestamp: new Date()
    };
    setConversations([defaultConversation]);
  }, []);

  const analyzeUserIntent = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Deep learning files summary pattern - NEW SPECIFIC PROMPT! 🤖
    if (lowerMessage.match(/(summarise|summarize)\s+my\s+deep\s+learning\s+files/i)) {
      return 'deep-learning-summary';
    }
    
    // Platform-specific summary patterns - NEW ENHANCEMENT! ✨
    if (lowerMessage.match(/(summarize|summary|give me.+summary|insights from|show me summaries).+(from|in|on).+(google drive|drive|dropbox|slack|notion|onedrive)/i) ||
        lowerMessage.match(/(google drive|drive|dropbox|slack|notion|onedrive).+(summarize|summary|summaries|insights)/i)) {
      return 'platform-summary';
    }
    
    // Summarization patterns
    if (lowerMessage.match(/(summarize|summarise|summary|give me.+summary|explain.+detail|overview).+(file|document|pdf)/i) ||
        lowerMessage.match(/(summarize|summarise).+(.pdf|document|file)/i)) {
      return 'file-summary';
    }
    
    // Location/Locate patterns
    if (lowerMessage.match(/(locate|find location|where is|find.+location|locate.+file)/i)) {
      return 'locate';
    }
    
    // Update patterns
    if (lowerMessage.match(/(update|modify|change|edit).+(file|document|pdf)/i)) {
      return 'update';
    }
    
    // PDF-specific patterns
    if (lowerMessage.match(/(pdf|pdfs).*(from|in|across|stored|all|show|find|list|fetch|display|pull|where|get|give|search)/i) ||
        lowerMessage.match(/(show|find|list|fetch|display|pull|get|give).*(pdf|pdfs)/i)) {
      return 'pdf-search';
    }
    
    // Weez knowledge management patterns
    if (lowerMessage.match(/(why weez|weez.*better|weez.*competitive|weez.*differentiates|weez.*scalable|weez.*intelligent|knowledge management|km platform)/i)) {
      return 'rag';
    }
    
    // Search patterns
    if (lowerMessage.match(/(find|search|look for|locate|show me).+file/i) ||
        lowerMessage.match(/files? (about|related to|containing)/i)) {
      return 'search';
    }
    
    // Summary patterns
    if (lowerMessage.match(/(summarize|summary|give me.+summary|explain.+detail|overview)/i)) {
      return 'summary';
    }
    
    // Advanced RAG patterns for specific technical queries
    if (lowerMessage.match(/(explain the implementation of|how to implement|best practices for|compare and contrast|detailed analysis of)/i)) {
      return 'advanced-rag';
    }
    
    // RAG/Question patterns
    if (lowerMessage.match(/(what is|how does|explain|tell me about|can you help.+understand)/i)) {
      return 'rag';
    }
    
    // Upload patterns
    if (lowerMessage.match(/(upload|save|send|share).+(to|on|in).+(drive|dropbox|onedrive|slack|teams)/i) ||
        lowerMessage.match(/(upload|save).+file/i)) {
      return 'upload';
    }
    
    // Delete patterns
    if (lowerMessage.match(/(delete|remove|get rid of).+file/i) ||
        lowerMessage.match(/(delete|remove).+(from|in).+(drive|dropbox|platform)/i)) {
      return 'delete';
    }
    
    return 'general';
  };

  const handleWeezKnowledgeManagement = async () => {
    return `# 🚀 Why Weez is Better Than Any Other Knowledge Management Platform

## 📌 The Big Problem with Existing Tools:
• Enterprise knowledge is scattered across Drive, Notion, Slack, emails, and more.
• Employees spend **25% of their time** just looking for internal files.
• Traditional tools offer basic keyword search, not true understanding.
• No unified access or smart insights — just links.

⸻

## 🧠 Why Weez.AI Is a Game Changer

| Feature | Weez.AI | Traditional Tools |
|---------|---------|-------------------|
| **AI-Powered Search (RAG)** | ✅ Uses Retrieval-Augmented Generation for deep context understanding | ❌ Basic keyword/indexed search |
| **Natural Language Interface** | ✅ Ask anything like you chat with a teammate | ❌ Rigid commands and filters |
| **Unified File Access** | ✅ Works across Google Drive, Slack, Notion, OneDrive, Dropbox, etc. | ❌ Locked within single platforms |
| **Smart Summarization & Q&A** | ✅ Instant document insights without opening them | ❌ Manual reading & copy-paste |
| **Contextual Memory** | ✅ Remembers past queries for better answers | ❌ Each search is isolated |
| **ChatGPT-like UI for Files** | ✅ Intuitive and familiar | ❌ Outdated interfaces |
| **Enterprise-Grade Intelligence** | ✅ Tailored for security, scalability, and integration | ❌ Limited customization |

⸻

## 🌟 Where Others Fail — and Weez Wins
• **❌ Others:** No deep understanding. Just keyword matching.
• **❌ Others:** Work in silos. No cross-platform capabilities.
• **❌ Others:** No conversation interface. No memory. No RAG.
• **✅ Weez:** Brings AI superpowers to your files. Finds, summarizes, and answers — instantly.

⸻

## 🔥 Why Now?
• Over **80% of enterprise data** is unstructured — growing daily.
• Enterprises are embracing GenAI tools rapidly.
• Expectations have shifted — teams want **answers, not just files**.
• Weez delivers the **AI Knowledge Agent** modern teams demand.

⸻

## 🏁 Final Verdict:

**Weez isn't just a search tool — it's your AI teammate.**

From instant document answers to deep enterprise-wide intelligence, Weez solves the knowledge chaos that other tools overlook.`;
  };

  const handleSearchOperation = async (message: string) => {
    const searchResults = semanticSearch(message);
    
    if (searchResults.length === 0) {
      return "I couldn't find any files matching your search criteria. Please try a different search term or check if the file exists in your connected platforms.";
    }
    
    const resultText = searchResults.map((file, index) => 
      `${index + 1}. **${file.name}** (${file.platform} - ${file.size})\n   📄 ${file.summary.substring(0, 100)}...`
    ).join('\n\n');
    
    return `I found ${searchResults.length} file(s) matching your search:\n\n${resultText}`;
  };

  const handleSummaryOperation = async (message: string) => {
    const file = findFileByDescription(message);
    
    if (!file) {
      return "I couldn't find the specific file you're referring to. Could you provide more details about the file name or content?";
    }
    
    const summaryLevel = message.toLowerCase().includes('detail') ? 'detailed' : 'short';
    
    if (summaryLevel === 'detailed') {
      return `## Detailed Summary: ${file.name}\n\n**Platform:** ${file.platform}\n**Size:** ${file.size}\n**Last Modified:** ${file.lastModified}\n\n**Content Overview:**\n${file.summary}\n\n**Key Topics:** ${file.tags.join(', ')}\n\n**File Type:** ${file.type} document containing comprehensive information suitable for ${file.tags[0]} purposes.`;
    } else {
      return `## Quick Summary: ${file.name}\n\n${file.summary.split('.')[0]}.\n\n**Key highlights:** ${file.tags.slice(0, 3).join(', ')}`;
    }
  };

  const handleDeepLearningSummary = async () => {
    return `## 🤖 Deep Learning Files Summary

📊 **Your Deep Learning Collection Overview**

I've analyzed your deep learning related files across all platforms. Here's a comprehensive summary:

### 🧠 **Core Deep Learning Documents:**

**1. Deep Learning Architecture Guide**
📅 Last Modified: Jan 15, 2024 | 📊 Size: 3.2 MB | 👤 Author: Dr. Sarah Chen
📋 **Summary:** Comprehensive guide covering neural network architectures including CNNs, RNNs, and Transformers. Includes implementation examples and best practices for model design.
🏷️ **Key Topics:** Neural Networks, CNN, RNN, Transformer, Architecture Design
📂 **Platform:** Google Drive

**2. ResNet Implementation Tutorial**
📅 Last Modified: Jan 12, 2024 | 📊 Size: 2.8 MB | 👤 Author: Michael Rodriguez
📋 **Summary:** Step-by-step implementation of ResNet architecture with skip connections. Covers vanishing gradient problem solutions and performance optimization techniques.
🏷️ **Key Topics:** ResNet, Skip Connections, Gradient Flow, Image Classification
📂 **Platform:** Slack

**3. Computer Vision with Deep Learning**
📅 Last Modified: Jan 10, 2024 | 📊 Size: 4.1 MB | 👤 Author: AI Research Team
📋 **Summary:** Advanced computer vision techniques using deep learning. Covers object detection, image segmentation, and feature extraction methods.
🏷️ **Key Topics:** Computer Vision, Object Detection, Image Segmentation, Feature Extraction
📂 **Platform:** Dropbox

### 🧠 **AI Insights:**
• **Total Files:** 6 deep learning documents
• **Combined Size:** 15.7 MB
• **Most Recent:** Deep Learning Architecture Guide (Jan 15, 2024)
• **Primary Focus Areas:** Neural Networks, Computer Vision, Model Architecture
• **Platforms Distribution:** 3 Google Drive, 2 Slack, 1 Dropbox

### 📈 **Key Concepts Covered:**
• Neural Network Fundamentals
• Convolutional Neural Networks (CNNs)
• Recurrent Neural Networks (RNNs)
• Transformer Architecture
• ResNet and Skip Connections
• Computer Vision Applications
• Model Optimization Techniques

**💡 Ready to dive deeper? Ask me specific questions about any architecture or concept!**`;
  };

  const handleAdvancedRAGOperation = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    const topic = extractTopicFromQuery(message);
    const relevantFiles = semanticSearch(topic);
    
    if (relevantFiles.length === 0) {
      return `I don't have specific technical information about "${topic}" in your current files. Would you like me to search for related technical documents or implementation guides?`;
    }
    
    const primaryFile = relevantFiles[0];
    const secondaryFile = relevantFiles[1];
    
    // Advanced technical responses with implementation details
    const advancedAnswers = {
      'resnet implementation': `## 🛠️ ResNet Implementation Guide

**Architecture Overview:**
ResNet solves the vanishing gradient problem through identity shortcut connections that skip one or more layers.

### 🔧 **Implementation Steps:**

1. **Basic Building Block:**
\`\`\`python
def residual_block(x, filters, stride=1):
    shortcut = x
    
    # First conv layer
    x = Conv2D(filters, 3, strides=stride, padding='same')(x)
    x = BatchNormalization()(x)
    x = ReLU()(x)
    
    # Second conv layer
    x = Conv2D(filters, 3, padding='same')(x)
    x = BatchNormalization()(x)
    
    # Adjust shortcut if needed
    if stride != 1 or shortcut.shape[-1] != filters:
        shortcut = Conv2D(filters, 1, strides=stride)(shortcut)
        shortcut = BatchNormalization()(shortcut)
    
    # Add shortcut (skip connection)
    x = Add()([x, shortcut])
    x = ReLU()(x)
    return x
\`\`\`

2. **Best Practices:**
• Use batch normalization after each convolutional layer
• Initialize weights with He initialization
• Apply data augmentation for better generalization
• Use learning rate scheduling

**📈 Performance Optimization:**
• Bottleneck design for deeper networks (ResNet-50+)
• Pre-activation variant for improved gradient flow
• Proper weight decay regularization

*Implementation details from: ${primaryFile.name}*
*Additional context: ${secondaryFile ? secondaryFile.name : 'Related documentation'}*`,

      'transformer architecture': `## 🧠 Transformer Architecture Deep Dive

**Core Innovation:** Self-attention mechanism that processes all positions simultaneously.

### 🔧 **Implementation Components:**

1. **Multi-Head Attention:**
\`\`\`python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def forward(self, query, key, value, mask=None):
        # Implementation details...
        return output, attention_weights
\`\`\`

2. **Key Design Principles:**
• Positional encoding for sequence order
• Layer normalization for stable training
• Residual connections around each sub-layer
• Feed-forward networks with ReLU activation

**🚀 Optimization Strategies:**
• Gradient clipping to prevent explosion
• Warmup learning rate schedule
• Label smoothing for regularization
• Mixed precision training for efficiency

*Technical reference: ${primaryFile.name}*`,

      'cnn best practices': `## 📸 CNN Implementation Best Practices

**Architecture Design Principles:**

### 🏗️ **Layer Configuration:**
1. **Convolutional Layers:**
   • Start with smaller filters (3x3, 5x5)
   • Increase depth gradually
   • Use padding to maintain spatial dimensions
   
2. **Pooling Strategy:**
   • Max pooling for feature selection
   • Average pooling for global features
   • Adaptive pooling for variable input sizes

### 🎯 **Implementation Guidelines:**

\`\`\`python
# Modern CNN Block
def conv_block(x, filters, kernel_size=3, stride=1):
    x = Conv2D(filters, kernel_size, strides=stride, 
               padding='same', use_bias=False)(x)
    x = BatchNormalization()(x)
    x = ReLU()(x)
    x = Dropout(0.1)(x)  # Light regularization
    return x
\`\`\`

**🔧 Optimization Techniques:**
• Data augmentation: rotation, scaling, flipping
• Transfer learning from pre-trained models
• Progressive resizing during training
• Test-time augmentation for inference

*Practical guide from: ${primaryFile.name}*`
    };
    
    // Check for specific advanced topics
    if (lowerMessage.includes('implementation') && lowerMessage.includes('resnet')) {
      return advancedAnswers['resnet implementation'];
    } else if (lowerMessage.includes('transformer') && lowerMessage.includes('architecture')) {
      return advancedAnswers['transformer architecture'];
    } else if (lowerMessage.includes('best practices') && lowerMessage.includes('cnn')) {
      return advancedAnswers['cnn best practices'];
    }
    
    // Generic advanced response
    return `## 🔬 Advanced Technical Analysis: ${topic}

Based on your files, here's a comprehensive technical breakdown:

### 📋 **Implementation Details:**
${primaryFile.summary}

### 🛠️ **Technical Specifications:**
• **Platform:** ${primaryFile.platform}
• **Document Type:** ${primaryFile.type}
• **Key Technologies:** ${primaryFile.tags.join(', ')}

### 🚀 **Best Practices & Optimization:**
${secondaryFile ? `Additional insights from ${secondaryFile.name}: ${secondaryFile.summary.substring(0, 150)}...` : 'Refer to implementation guidelines in the primary document.'}

### 💡 **Recommended Next Steps:**
• Review the implementation code examples
• Test with your specific use case
• Consider performance benchmarking
• Implement monitoring and logging

*Technical analysis based on: ${primaryFile.name}${secondaryFile ? ` and ${secondaryFile.name}` : ''}*`;
  };

  const handleRAGOperation = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Check if it's a Weez knowledge management question
    if (lowerMessage.match(/(why weez|weez.*better|weez.*competitive|weez.*differentiates|weez.*scalable|weez.*intelligent|knowledge management|km platform)/i)) {
      const response = await handleWeezKnowledgeManagement();
      return response;
    }
    
    const topic = extractTopicFromQuery(message);
    const relevantFiles = semanticSearch(topic);
    
    if (relevantFiles.length === 0) {
      return `I don't have specific information about "${topic}" in your current files. Would you like me to search for related documents or help you with something else?`;
    }
    
    const primaryFile = relevantFiles[0];
    
    // Generate contextual answer based on the topic and file content
    const answers = {
      'resnet': `**ResNet (Residual Networks)** is a deep learning architecture that solves the vanishing gradient problem through skip connections.\n\n**Key Features:**\n• Skip connections allow gradients to flow directly\n• Enables training of very deep networks (50-152 layers)\n• Uses bottleneck blocks for computational efficiency\n• Achieves superior performance on image classification\n\n*Source: ${primaryFile.name}*`,
      
      'deep learning': `**Deep Learning** is a subset of machine learning using artificial neural networks with multiple layers.\n\n**Core Concepts:**\n• Multiple hidden layers for feature extraction\n• Backpropagation for training\n• Various architectures (CNN, RNN, Transformer)\n• Applications in computer vision, NLP, and more\n\n*Based on: ${primaryFile.name}*`,
      
      'api': `**API (Application Programming Interface)** defines how software components communicate.\n\n**Integration Best Practices:**\n• Authentication and security protocols\n• Rate limiting and error handling\n• Documentation and testing\n• Version management\n\n*Reference: ${primaryFile.name}*`,
      
      'investment': `**Investment Analysis** involves evaluating financial opportunities for optimal returns.\n\n**Key Metrics:**\n• Risk assessment and diversification\n• Return on investment (ROI) calculations\n• Market trend analysis\n• Portfolio optimization\n\n*Data from: ${primaryFile.name}*`
    };
    
    return answers[topic.toLowerCase()] || 
           `Based on your **${primaryFile.name}** document:\n\n${primaryFile.summary}\n\n**This information relates to:** ${primaryFile.tags.join(', ')}\n\nWould you like me to elaborate on any specific aspect?`;
  };

  const handleUploadOperation = async (message: string) => {
    const platforms = ['google drive', 'dropbox', 'onedrive', 'slack', 'teams', 'confluence'];
    const targetPlatform = platforms.find(platform => message.toLowerCase().includes(platform)) || 'central repository';
    
    const file = findFileByDescription(message) || demoFiles[Math.floor(Math.random() * demoFiles.length)];
    
    if (message.toLowerCase().includes('central repo')) {
      return `✅ **File uploaded to Central Repository**\n\n📁 **File:** ${file.name}\n📊 **Size:** ${file.size}\n🏢 **Status:** Available to all team members\n🔗 **Access:** Centralized file management system\n⏰ **Upload completed in:** 2.3s\n\n*File is now searchable across all enterprise tools.*`;
    }
    
    return `✅ **Upload Successful to ${targetPlatform.toUpperCase()}!**\n\n📁 **File:** ${file.name}\n📊 **Size:** ${file.size}\n🔗 **Location:** /${targetPlatform.replace(' ', '_')}/uploads/\n👥 **Permissions:** Team access granted\n⏰ **Upload completed in:** 3.1s\n\n*Also backed up to central repository.*`;
  };

  const handleDeleteOperation = async (message: string) => {
    const file = findFileByDescription(message) || demoFiles[Math.floor(Math.random() * demoFiles.length)];
    const platforms = ['google drive', 'dropbox', 'onedrive', 'platform'];
    const targetPlatform = platforms.find(platform => message.toLowerCase().includes(platform));
    
    if (message.toLowerCase().includes('only') && targetPlatform) {
      return `✅ **Selective Deletion Completed**\n\n📁 **File:** ${file.name}\n🗑️ **Removed from:** ${targetPlatform.toUpperCase()}\n💾 **Status:** Still available in central repository\n⚠️ **Note:** File remains accessible through other platforms\n⏰ **Operation completed in:** 1.4s`;
    }
    
    if (targetPlatform) {
      return `✅ **File Deleted Successfully**\n\n📁 **File:** ${file.name}\n🗑️ **Removed from:** ${targetPlatform.toUpperCase()} and Central Repository\n⚠️ **Status:** Permanently deleted from all locations\n🔄 **Backup:** Available in trash for 30 days\n⏰ **Operation completed in:** 2.1s`;
    }
    
    return `✅ **Complete File Removal**\n\n📁 **File:** ${file.name}\n🗑️ **Removed from:** All connected platforms and central repository\n⚠️ **Status:** Permanently deleted\n🔄 **Recovery:** Available in system backup for 7 days\n⏰ **Operation completed in:** 1.8s`;
  };

  const handlePDFSearchOperation = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    let pdfs: PDFFile[] = [];
    let responseText = "";

    // Check for platform-specific requests
    const platforms = ['dropbox', 'slack', 'google drive', 'drive', 'onedrive', 'notion'];
    const mentionedPlatforms = platforms.filter(platform => 
      lowerMessage.includes(platform.toLowerCase())
    );

    // Check for "all platforms" or "across platforms" requests
    if (lowerMessage.match(/(all|across|every|from all|pull up|compile|external integrations|cloud tools|workspaces|sources)/i)) {
      pdfs = getAllPDFs();
      responseText = `## 📄 All PDFs Across Your Connected Platforms

I've compiled all PDF documents from your connected cloud services:

**📊 Summary:**
• **Google Drive:** ${pdfs.filter(p => p.platform === 'Google Drive').length} PDFs
• **Slack:** ${pdfs.filter(p => p.platform === 'Slack').length} PDFs  
• **Dropbox:** ${pdfs.filter(p => p.platform === 'Dropbox').length} PDFs
• **OneDrive:** ${pdfs.filter(p => p.platform === 'OneDrive').length} PDFs
• **Notion:** ${pdfs.filter(p => p.platform === 'Notion').length} PDFs

**🗂️ Recent Documents:**
${pdfs.slice(0, 8).map((pdf, index) => 
  `${index + 1}. **${pdf.name}** (${pdf.platform} - ${pdf.size})\n   📅 ${pdf.lastModified} | 📋 ${pdf.summary.substring(0, 80)}...`
).join('\n\n')}

${pdfs.length > 8 ? `\n*...and ${pdfs.length - 8} more documents available.*` : ''}

**💡 Next Steps:** Would you like me to filter these by date, platform, or content type?`;

    } else if (lowerMessage.match(/recent/i)) {
      pdfs = getRecentPDFs(30);
      responseText = `## 📅 Recently Uploaded/Modified PDFs

Here are your most recent PDF documents from the past 30 days:

${pdfs.map((pdf, index) => 
  `${index + 1}. **${pdf.name}** (${pdf.platform})\n   📅 ${pdf.lastModified} | 📊 ${pdf.size} | 👤 ${pdf.author || 'Unknown'}\n   📝 ${pdf.summary.substring(0, 100)}...`
).join('\n\n')}

**📈 Activity Summary:** ${pdfs.length} PDFs uploaded or modified in the last 30 days across all platforms.`;

    } else if (mentionedPlatforms.length > 0) {
      // Platform-specific search
      pdfs = getPDFsByPlatform(mentionedPlatforms);
      const platformNames = mentionedPlatforms.map(p => 
        p === 'drive' ? 'Google Drive' : p.charAt(0).toUpperCase() + p.slice(1)
      ).join(', ');
      
      responseText = `## 🔍 PDFs from ${platformNames}

Found ${pdfs.length} PDF document(s) in your specified platform(s):

${pdfs.map((pdf, index) => 
  `${index + 1}. **${pdf.name}** (${pdf.platform} - ${pdf.size})\n   📅 Last modified: ${pdf.lastModified}\n   📄 ${pdf.summary.substring(0, 120)}...\n   🏷️ Tags: ${pdf.tags.slice(0, 3).join(', ')}`
).join('\n\n')}

**💼 Document Types:** ${[...new Set(pdfs.map(p => p.type))].join(', ')}`;

    } else if (lowerMessage.match(/(onedrive|notion).*only/i)) {
      // Specific platform query
      const platform = lowerMessage.includes('onedrive') ? 'OneDrive' : 'Notion';
      pdfs = demoPDFs.filter(pdf => pdf.platform === platform);
      
      responseText = `## 📂 PDFs in ${platform}

${pdfs.length > 0 ? 
        `Found ${pdfs.length} PDF document(s) in your ${platform}:

${pdfs.map((pdf, index) => 
  `${index + 1}. **${pdf.name}** (${pdf.size})\n   📅 ${pdf.lastModified} | 👤 ${pdf.author || 'Unknown'}\n   📄 ${pdf.summary.substring(0, 100)}...`
).join('\n\n')}` 
        : 
        `No PDF documents found in your ${platform} at this time.`
      }`;

    } else {
      // General PDF search
      pdfs = getAllPDFs().slice(0, 10);
      responseText = `## 📋 PDF Document Search Results

Here are the PDF documents I found across your connected platforms:

${pdfs.map((pdf, index) => 
  `${index + 1}. **${pdf.name}** (${pdf.platform})\n   📊 ${pdf.size} | 📅 ${pdf.lastModified}\n   📄 ${pdf.summary.substring(0, 100)}...`
).join('\n\n')}

**🔧 Available Actions:** View, download, summarize, or share any of these documents.`;
    }

    return { text: responseText, files: pdfs };
  };

  const handleFileSummaryOperation = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Extract file name and platform from the message
    const fileNameMatch = message.match(/(?:summarize|summarise)(?:\s+the)?\s+(.+?)(?:\s+from\s+(.+?))?(?:\s+file|\s+document|\s+pdf|$)/i);
    
    if (!fileNameMatch) {
      return "Please specify the file name you'd like me to summarize. For example: 'Summarize the Q4 Marketing Strategy from Google Drive'";
    }
    
    const fileName = fileNameMatch[1].trim();
    const platform = fileNameMatch[2]?.trim();
    
    const file = findPDFByNameAndPlatform(fileName, platform);
    
    if (!file) {
      return `I couldn't find a file named "${fileName}"${platform ? ` in ${platform}` : ' in any of your connected platforms'}. Please check the file name and try again.`;
    }
    
    const isDetailed = lowerMessage.includes('detail') || lowerMessage.includes('comprehensive') || lowerMessage.includes('full');
    
    if (isDetailed && file.detailedContent) {
      return `## 📄 Detailed Summary: ${file.name}

**📍 Platform:** ${file.platform}  
**📊 Size:** ${file.size}  
**📅 Last Modified:** ${file.lastModified}  
**👤 Author:** ${file.author || 'Unknown'}  
**📂 Location:** ${file.location}  
**🔢 Version:** ${file.version}

### 📋 Comprehensive Content Analysis:

${file.detailedContent}

### 🏷️ Key Topics & Tags:
${file.tags.map(tag => `• ${tag.charAt(0).toUpperCase() + tag.slice(1)}`).join('\n')}

### 📈 Document Insights:
• **Document Type:** ${file.type.charAt(0).toUpperCase() + file.type.slice(1)} document
• **Sharing Status:** ${file.shared ? 'Shared with team' : 'Private access only'}
• **Last Updated:** ${file.lastUpdated ? new Date(file.lastUpdated).toLocaleString() : 'Not available'}

**💡 This summary was generated from the actual document content stored in ${file.platform}.**`;
    } else {
      return `## 📄 Quick Summary: ${file.name}

**📍 Platform:** ${file.platform} | **📊 Size:** ${file.size} | **👤 Author:** ${file.author || 'Unknown'}

### 📋 Overview:
${file.summary}

### 🏷️ Key Topics:
${file.tags.slice(0, 4).map(tag => `• ${tag.charAt(0).toUpperCase() + tag.slice(1)}`).join('\n')}

### 📂 File Details:
• **Location:** ${file.location}
• **Version:** ${file.version}
• **Last Modified:** ${file.lastModified}

*For a more detailed summary, ask: "Give me a detailed summary of ${file.name}"*`;
    }
  };

  const handleLocateOperation = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Extract file name and platform from the message
    const fileNameMatch = message.match(/(?:locate|find|where is)(?:\s+the)?\s+(.+?)(?:\s+from\s+(.+?))?(?:\s+file|\s+document|\s+pdf|$)/i);
    
    if (!fileNameMatch) {
      return "Please specify the file name you'd like me to locate. For example: 'Locate the Employee Handbook from Dropbox'";
    }
    
    const fileName = fileNameMatch[1].trim();
    const platform = fileNameMatch[2]?.trim();
    
    const result = locatePDF(fileName, platform);
    
    if (!result) {
      return `I couldn't locate a file named "${fileName}"${platform ? ` in ${platform}` : ' in any of your connected platforms'}. Please check the file name and try again.`;
    }
    
    const { file, location } = result;
    
    return `## 📍 File Location Found

**📄 File:** ${file.name}  
**📂 Full Path:** \`${location}\`  
**☁️ Platform:** ${file.platform}  
**📊 Size:** ${file.size}  
**👤 Owner:** ${file.author || 'Unknown'}

### 📋 Quick Details:
• **Version:** ${file.version}
• **Last Modified:** ${file.lastModified}
• **Last Updated:** ${file.lastUpdated ? new Date(file.lastUpdated).toLocaleString() : 'Not available'}
• **Sharing Status:** ${file.shared ? '🔓 Shared with team' : '🔒 Private access'}

### 🏷️ File Tags:
${file.tags.map(tag => `\`${tag}\``).join(' • ')}

**💡 You can now access this file directly at the location above in your ${file.platform} workspace.**`;
  };

  const handleUpdateOperation = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Extract file name and platform from the message
    const fileNameMatch = message.match(/(?:update|modify|change|edit)(?:\s+the)?\s+(.+?)(?:\s+from\s+(.+?))?(?:\s+file|\s+document|\s+pdf|$)/i);
    
    if (!fileNameMatch) {
      return "Please specify the file name you'd like me to update. For example: 'Update the Project Timeline from OneDrive'";
    }
    
    const fileName = fileNameMatch[1].trim();
    const platform = fileNameMatch[2]?.trim();
    
    const updatedFile = updatePDFVersion(fileName, platform);
    
    if (!updatedFile) {
      return `I couldn't find a file named "${fileName}"${platform ? ` in ${platform}` : ' in any of your connected platforms'}. Please check the file name and try again.`;
    }
    
    return `## ✅ File Updated Successfully

**📄 File:** ${updatedFile.name}  
**☁️ Platform:** ${updatedFile.platform}  
**📂 Location:** ${updatedFile.location}

### 🔄 Update Details:
• **New Version:** ${updatedFile.version} ⬆️
• **Updated At:** ${new Date(updatedFile.lastUpdated!).toLocaleString()}
• **Size:** ${updatedFile.size}
• **Status:** Successfully synchronized across platform

### 📋 File Information:
• **Type:** ${updatedFile.type.charAt(0).toUpperCase() + updatedFile.type.slice(1)} document
• **Author:** ${updatedFile.author || 'Unknown'}
• **Tags:** ${updatedFile.tags.map(tag => `\`${tag}\``).join(' • ')}

### 🔄 Next Steps:
• All team members with access will see the updated version
• Previous version is archived and available in version history
• Change notifications have been sent to relevant stakeholders

**💡 The file has been successfully updated and is ready for use in your ${updatedFile.platform} workspace.**`;
  };

  const handlePlatformSummaryOperation = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Extract platform from message
    const platforms = ['google drive', 'drive', 'dropbox', 'slack', 'notion', 'onedrive'];
    const targetPlatform = platforms.find(platform => lowerMessage.includes(platform));
    
    if (!targetPlatform) {
      return "Please specify which platform you'd like me to summarize files from (Google Drive, Dropbox, Slack, Notion, or OneDrive).";
    }
    
    // Normalize platform name
    const normalizedPlatform = targetPlatform === 'drive' ? 'Google Drive' : 
                              targetPlatform.charAt(0).toUpperCase() + targetPlatform.slice(1);
    
    // Get files from the specific platform
    const platformFiles = demoPDFs.filter(pdf => 
      pdf.platform.toLowerCase() === normalizedPlatform.toLowerCase()
    );
    
    if (platformFiles.length === 0) {
      return `No files found in your ${normalizedPlatform}. Please check your connection or try another platform.`;
    }
    
    // Generate beautiful platform-specific summary
    return `## ✨ ${normalizedPlatform} Files Summary

📊 **Platform Overview:** Found ${platformFiles.length} documents in your ${normalizedPlatform}

### 📄 Document Summaries:

${platformFiles.map((file, index) => 
  `**${index + 1}. ${file.name}**
📅 Last Modified: ${file.lastModified} | 📊 Size: ${file.size} | 👤 Author: ${file.author || 'Unknown'}
📋 **Summary:** ${file.summary}
🏷️ **Tags:** ${file.tags.join(', ')}
📂 **Location:** ${file.location}

---`
).join('\n')}

### 🧠 **AI Insights:**
• **Document Types:** ${[...new Set(platformFiles.map(f => f.type))].join(', ')}
• **Most Recent:** ${platformFiles.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())[0].name}
• **Total Storage:** ${platformFiles.reduce((total, file) => {
  const size = parseFloat(file.size.replace(/[^\d.]/g, ''));
  return total + size;
}, 0).toFixed(1)} MB

**💡 Quick Actions:** Ask me to locate, update, or get detailed summaries of any specific file!`;
  };

  const simulateAIResponse = async (userMessage: string) => {
    const intent = analyzeUserIntent(userMessage);
    let response = "";
    let files: any[] = [];
    let thinkingTime = 2000;

    console.log('Detected intent:', intent, 'for message:', userMessage);

    setThinkingType(intent as any);

    try {
      switch (intent) {
        case 'deep-learning-summary':
          thinkingTime = 3500;
          response = await handleDeepLearningSummary();
          // Attach sample deep learning files
          files = [
            { id: 'dl-1', name: 'Deep_Learning_Architecture_Guide.pdf', platform: 'Google Drive', size: '3.2 MB' },
            { id: 'dl-2', name: 'ResNet_Implementation_Tutorial.pdf', platform: 'Slack', size: '2.8 MB' },
            { id: 'dl-3', name: 'Computer_Vision_Deep_Learning.pdf', platform: 'Dropbox', size: '4.1 MB' }
          ];
          break;
          
        case 'platform-summary':
          thinkingTime = 2800;
          response = await handlePlatformSummaryOperation(userMessage);
          // Get files from the mentioned platform for attachment
          const platformLowerMessage = userMessage.toLowerCase();
          const platforms = ['google drive', 'drive', 'dropbox', 'slack', 'notion', 'onedrive'];
          const targetPlatform = platforms.find(platform => platformLowerMessage.includes(platform));
          if (targetPlatform) {
            const normalizedPlatform = targetPlatform === 'drive' ? 'Google Drive' : 
                                    targetPlatform.charAt(0).toUpperCase() + targetPlatform.slice(1);
            files = demoPDFs.filter(pdf => 
              pdf.platform.toLowerCase() === normalizedPlatform.toLowerCase()
            );
          }
          break;
          
        case 'search':
          thinkingTime = 1500;
          response = await handleSearchOperation(userMessage);
          files = semanticSearch(userMessage).slice(0, 3);
          break;
          
        case 'summary':
          thinkingTime = 2500;
          response = await handleSummaryOperation(userMessage);
          const regularSummaryFile = findFileByDescription(userMessage);
          if (regularSummaryFile) files = [regularSummaryFile];
          break;
          
        case 'advanced-rag':
          thinkingTime = 3500;
          response = await handleAdvancedRAGOperation(userMessage);
          const advancedTopic = extractTopicFromQuery(userMessage);
          files = semanticSearch(advancedTopic).slice(0, 3);
          break;
          
        case 'rag':
          thinkingTime = 2800;
          response = await handleRAGOperation(userMessage);
          const ragLowerMessage = userMessage.toLowerCase();
          
          // If it's a Weez knowledge management question, attach a company document from Google Drive
          if (ragLowerMessage.match(/(why weez|weez.*better|weez.*competitive|weez.*differentiates|weez.*scalable|weez.*intelligent|knowledge management|km platform)/i)) {
            files = [{
              id: 'weez-company-info',
              name: 'Company_Overview_Weez.pdf',
              platform: 'Google Drive',
              size: '2.4 MB'
            }];
          } else {
            const topic = extractTopicFromQuery(userMessage);
            files = semanticSearch(topic).slice(0, 2);
          }
          break;
          
        case 'pdf-search':
          thinkingTime = 2200;
          const pdfResult = await handlePDFSearchOperation(userMessage);
          response = pdfResult.text;
          files = pdfResult.files.slice(0, 5).map(pdf => ({
            id: pdf.id,
            name: pdf.name,
            platform: pdf.platform,
            size: pdf.size
          }));
          break;
          
        case 'file-summary':
          thinkingTime = 2800;
          response = await handleFileSummaryOperation(userMessage);
          const pdfSummaryFile = findPDFByNameAndPlatform(userMessage);
          if (pdfSummaryFile) files = [pdfSummaryFile];
          break;
          
        case 'locate':
          thinkingTime = 1800;
          response = await handleLocateOperation(userMessage);
          const locateResult = locatePDF(userMessage);
          if (locateResult) files = [locateResult.file];
          break;
          
        case 'update':
          thinkingTime = 2500;
          response = await handleUpdateOperation(userMessage);
          const updateFile = findPDFByNameAndPlatform(userMessage);
          if (updateFile) files = [updateFile];
          break;
          
        case 'upload':
          thinkingTime = 3200;
          response = await handleUploadOperation(userMessage);
          break;
          
        case 'delete':
          thinkingTime = 2200;
          response = await handleDeleteOperation(userMessage);
          break;
          
        default:
          thinkingTime = 1800;
          response = "I'm here to help you with file operations! You can ask me to:\n\n• **Search** for files: 'Find my deep learning papers'\n• **Find PDFs**: 'Show me all PDFs from Google Drive and Slack'\n• **Summarize** documents: 'Give me a summary of the project proposal'\n• **Platform summaries**: 'Summarize my files from Dropbox'\n• **Answer questions** about your files: 'What is ResNet architecture?'\n• **Upload** files: 'Save this to Google Drive'\n• **Delete** files: 'Remove the old report from Dropbox'\n\nWhat would you like to do?";
      }
    } catch (error) {
      console.error('Error in AI response:', error);
      response = "I encountered an issue processing your request. Please try again or rephrase your question.";
    }

    // Show thinking animation
    setIsThinking(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    // Add AI response
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: response,
      isUser: false,
      timestamp: new Date(),
      files: files.map(f => ({
        id: f.id,
        name: f.name,
        platform: f.platform,
        size: f.size
      }))
    };

    setMessages(prevMessages => [...prevMessages, aiMessage]);
    setIsThinking(false);

    // Update current conversation
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, aiMessage] }
        : conv
    ));
  };

  const handleSendMessage = async (newMessage: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Update current conversation with user message
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, userMessage] }
        : conv
    ));

    // Simulate AI response
    await simulateAIResponse(newMessage);
  };

  const handleFileAction = (file: any) => {
    console.log("File action triggered:", file);
  };

  const handleConversationSelect = (id: string) => {
    setCurrentConversationId(id);
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setMessages(conversation.messages);
    }
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      messages: [],
      timestamp: new Date()
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
  };

  const handleNavigateToWorkspace = () => {
    navigate("/workspace");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onNavigateToWorkspace={handleNavigateToWorkspace}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <ChatHeader />
          
          <div className="flex-1 flex flex-col min-h-0">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-3">
                    How can I help you today?
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Ask me anything about your marketing files, campaigns, or strategy. I'm here to help you find insights and create content.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("Summarize my latest marketing campaign files")}
                    >
                      <div>
                        <p className="font-medium">Campaign Analysis</p>
                        <p className="text-sm text-muted-foreground">Summarize my latest marketing files</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("Help me create content for social media")}
                    >
                      <div>
                        <p className="font-medium">Content Creation</p>
                        <p className="text-sm text-muted-foreground">Generate social media content</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("Find files about our brand guidelines")}
                    >
                      <div>
                        <p className="font-medium">Brand Assets</p>
                        <p className="text-sm text-muted-foreground">Locate brand guidelines and assets</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-left h-auto p-4 justify-start"
                      onClick={() => handleSendMessage("Analyze our competitor research")}
                    >
                      <div>
                        <p className="font-medium">Market Research</p>
                        <p className="text-sm text-muted-foreground">Review competitor analysis</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <ChatMessages 
                messages={messages} 
                isThinking={isThinking}
                thinkingType={thinkingType}
                onSendMessage={handleSendMessage}
              />
            )}
            
            <div className="border-t border-border bg-background p-4">
              <div className="max-w-4xl mx-auto">
                <ImprovedChatInput onSendMessage={handleSendMessage} disabled={isThinking} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showWelcome && (
        <ChatWelcomeDialog
          open={showWelcome}
          onOpenChange={(open) => {
            setShowWelcome(open);
            if (!open) {
              localStorage.setItem('weez-welcome-shown', 'true');
            }
          }}
        />
      )}
    </SidebarProvider>
  );
};

export default ChatInterface;
