
export interface DemoFile {
  id: string;
  name: string;
  type: string;
  platform: string;
  size: string;
  lastModified: string;
  content: string;
  summary: string;
}

export interface DemoResponse {
  type: 'search' | 'summary' | 'rag' | 'upload';
  query: string;
  response: string;
  files?: DemoFile[];
  processingTime: string;
}

export const demoFiles: DemoFile[] = [
  {
    id: "1",
    name: "Deep_Learning_ResNet_Implementation.pdf",
    type: "PDF",
    platform: "Google Drive",
    size: "2.4 MB",
    lastModified: "2024-06-10",
    content: "Research paper on ResNet implementation with detailed architecture diagrams and performance metrics...",
    summary: "This document covers ResNet (Residual Networks) implementation, including skip connections, gradient flow optimization, and performance comparisons with traditional CNNs."
  },
  {
    id: "2", 
    name: "Q4_Financial_Report.xlsx",
    type: "Excel",
    platform: "OneDrive",
    size: "1.8 MB",
    lastModified: "2024-06-12",
    content: "Quarterly financial data with revenue breakdowns, expense analysis, and growth projections...",
    summary: "Q4 financial report showing 23% revenue growth, cost optimization strategies, and 2025 projections with detailed departmental budgets."
  },
  {
    id: "3",
    name: "Project_Roadmap_2024.docx", 
    type: "Word",
    platform: "Notion",
    size: "945 KB",
    lastModified: "2024-06-08",
    content: "Comprehensive project roadmap outlining milestones, timelines, and resource allocation...",
    summary: "2024 project roadmap with key milestones for AI feature development, user acquisition targets, and technical infrastructure improvements."
  },
  {
    id: "4",
    name: "Marketing_Strategy_Presentation.pptx",
    type: "PowerPoint",
    platform: "Google Drive",
    size: "3.2 MB", 
    lastModified: "2024-06-11",
    content: "Marketing strategy presentation with market analysis, competitor research, and campaign proposals...",
    summary: "Marketing strategy presentation outlining Q4 campaigns, target demographics, budget allocation, and projected ROI of 340%."
  },
  {
    id: "5",
    name: "Employee_Performance_Analysis.xlsx",
    type: "Excel",
    platform: "OneDrive",
    size: "876 KB",
    lastModified: "2024-06-09",
    content: "Comprehensive employee performance data with metrics, reviews, and development plans...",
    summary: "Performance analysis showing 87% employee satisfaction, identification of top performers, and recommended development programs."
  },
  {
    id: "6",
    name: "Technical_Architecture_Documentation.pdf",
    type: "PDF",
    platform: "Dropbox",
    size: "4.1 MB",
    lastModified: "2024-06-07",
    content: "Technical documentation covering system architecture, API specifications, and deployment guidelines...",
    summary: "Technical architecture documentation detailing microservices design, database schemas, security protocols, and scalability considerations."
  }
];

export const demoResponses: DemoResponse[] = [
  {
    type: 'search',
    query: "Find my deep learning files about neural networks",
    response: "I found 3 files related to deep learning and neural networks across your connected platforms:",
    files: [demoFiles[0]],
    processingTime: "0.8s"
  },
  {
    type: 'summary', 
    query: "Summarize my latest financial report",
    response: "Here's a summary of your Q4 Financial Report:\n\n• Revenue increased by 23% compared to Q3\n• Operating expenses were reduced by 8% through cost optimization\n• Key growth drivers: enterprise sales and subscription renewals\n• 2025 projections show continued growth trajectory\n• Recommended budget allocation for R&D and marketing expansion",
    files: [demoFiles[1]],
    processingTime: "1.2s"
  },
  {
    type: 'rag',
    query: "Explain me about the topic 'Implementation of ResNET' in my Deep Learning related file",
    response: "Based on your Deep Learning ResNet Implementation document:\n\n**ResNet Implementation Key Points:**\n\n1. **Skip Connections**: ResNet introduces residual connections that allow gradients to flow directly through shortcuts, solving the vanishing gradient problem\n\n2. **Architecture**: Uses bottleneck blocks with 1x1, 3x3, and 1x1 convolutions to reduce computational complexity\n\n3. **Training Benefits**: Enables training of very deep networks (50-152 layers) without degradation\n\n4. **Performance**: Achieves lower error rates on ImageNet compared to traditional CNNs\n\n5. **Implementation Details**: Batch normalization after each convolution, ReLU activation, and careful weight initialization\n\nThe document shows ResNet-50 achieving 3.57% top-5 error rate on ImageNet validation set.",
    files: [demoFiles[0]],
    processingTime: "2.1s"
  },
  {
    type: 'upload',
    query: "Upload this presentation to the company's Google Drive",
    response: "✅ Successfully uploaded 'AI_Strategy_Presentation.pptx' to Company Google Drive\n\n📁 Location: /Shared/Presentations/AI_Strategy/\n🔗 Shareable link: drive.google.com/file/d/1abc...\n👥 Permissions: Company team members (view access)\n📊 File size: 4.2 MB\n⏰ Upload completed in 3.4s",
    processingTime: "3.4s"
  }
];
