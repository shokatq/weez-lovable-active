
export interface DemoFile {
  id: string;
  name: string;
  type: string;
  platform: string;
  size: string;
  lastModified: string;
  content: string;
  summary: string;
  tags: string[];
  embedding?: number[]; // Simulated embedding for semantic search
}

export interface DemoResponse {
  type: 'search' | 'summary' | 'rag' | 'upload' | 'delete';
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
    summary: "Comprehensive guide on ResNet (Residual Networks) implementation covering skip connections, gradient flow optimization, and performance comparisons with traditional CNNs. Includes code examples and benchmarking results.",
    tags: ["deep learning", "neural networks", "resnet", "machine learning", "AI", "computer vision"]
  },
  {
    id: "2", 
    name: "Q4_Financial_Report.xlsx",
    type: "Excel",
    platform: "OneDrive",
    size: "1.8 MB",
    lastModified: "2024-06-12",
    content: "Quarterly financial data with revenue breakdowns, expense analysis, and growth projections...",
    summary: "Q4 financial report showing 23% revenue growth, cost optimization strategies, and 2025 projections with detailed departmental budgets and ROI analysis.",
    tags: ["finance", "quarterly report", "revenue", "expenses", "budget", "growth"]
  },
  {
    id: "3",
    name: "Project_Roadmap_2024.docx", 
    type: "Word",
    platform: "Notion",
    size: "945 KB",
    lastModified: "2024-06-08",
    content: "Comprehensive project roadmap outlining milestones, timelines, and resource allocation...",
    summary: "2024 project roadmap with key milestones for AI feature development, user acquisition targets, and technical infrastructure improvements across Q1-Q4.",
    tags: ["project management", "roadmap", "planning", "milestones", "AI features"]
  },
  {
    id: "4",
    name: "Marketing_Strategy_Presentation.pptx",
    type: "PowerPoint",
    platform: "Google Drive",
    size: "3.2 MB", 
    lastModified: "2024-06-11",
    content: "Marketing strategy presentation with market analysis, competitor research, and campaign proposals...",
    summary: "Comprehensive marketing strategy presentation outlining Q4 campaigns, target demographics, budget allocation, and projected ROI of 340% across digital channels.",
    tags: ["marketing", "strategy", "campaigns", "roi", "digital marketing", "analytics"]
  },
  {
    id: "5",
    name: "New_Project_Proposal.docx",
    type: "Word",
    platform: "Dropbox",
    size: "876 KB",
    lastModified: "2024-06-14",
    content: "Detailed proposal for new AI-powered customer service platform...",
    summary: "Innovative project proposal for developing an AI-powered customer service platform with natural language processing, automated ticket routing, and sentiment analysis capabilities. Estimated development time: 8 months, budget: $2.4M.",
    tags: ["project proposal", "AI", "customer service", "nlp", "automation", "innovation"]
  },
  {
    id: "6",
    name: "Technical_Architecture_Documentation.pdf",
    type: "PDF",
    platform: "Confluence",
    size: "4.1 MB",
    lastModified: "2024-06-07",
    content: "Technical documentation covering system architecture, API specifications, and deployment guidelines...",
    summary: "Comprehensive technical architecture documentation detailing microservices design, database schemas, security protocols, and scalability considerations for enterprise applications.",
    tags: ["architecture", "technical documentation", "microservices", "api", "security", "scalability"]
  },
  {
    id: "7",
    name: "Sales_Dashboard_Data.xlsx",
    type: "Excel",
    platform: "Google Drive",
    size: "2.1 MB",
    lastModified: "2024-06-13",
    content: "Sales performance data with customer analytics, conversion rates, and revenue tracking...",
    summary: "Comprehensive sales dashboard data showing 15% increase in conversions, top performing products, customer acquisition cost analysis, and regional performance metrics.",
    tags: ["sales", "dashboard", "analytics", "conversion", "revenue", "performance"]
  },
  {
    id: "8",
    name: "Machine_Learning_Model_Training.pdf",
    type: "PDF",
    platform: "OneDrive",
    size: "3.8 MB",
    lastModified: "2024-06-05",
    content: "ML model training documentation with hyperparameter tuning, validation metrics, and deployment strategies...",
    summary: "Detailed machine learning model training guide achieving 94.2% accuracy on test data with comprehensive training procedures, hyperparameter optimization, and deployment strategies.",
    tags: ["machine learning", "model training", "hyperparameters", "validation", "deployment", "accuracy"]
  },
  {
    id: "9",
    name: "User_Research_Findings.docx",
    type: "Word",
    platform: "Notion",
    size: "1.3 MB",
    lastModified: "2024-06-14",
    content: "User research study results with survey data, interview insights, and usability testing outcomes...",
    summary: "Comprehensive user research findings revealing key pain points in current interface, 78% satisfaction rate, and actionable recommendations for UX improvements and feature prioritization.",
    tags: ["user research", "ux", "usability", "surveys", "interviews", "satisfaction"]
  },
  {
    id: "10",
    name: "Investment_Analysis_Report.xlsx",
    type: "Excel",
    platform: "Dropbox",
    size: "1.9 MB",
    lastModified: "2024-06-06",
    content: "Investment portfolio analysis with risk assessments, return calculations, and market trend analysis...",
    summary: "Detailed investment analysis showing 12.4% annual return, diversified portfolio recommendations, risk assessments, and market volatility predictions for next quarter.",
    tags: ["investment", "portfolio", "risk analysis", "returns", "market trends", "finance"]
  },
  {
    id: "11",
    name: "Employee_Handbook_2024.pdf",
    type: "PDF",
    platform: "Google Drive",
    size: "5.2 MB",
    lastModified: "2024-06-01",
    content: "Complete employee handbook with policies, procedures, and company guidelines...",
    summary: "Updated employee handbook covering company policies, remote work guidelines, benefits information, and professional development opportunities for 2024.",
    tags: ["hr", "employee handbook", "policies", "benefits", "remote work", "guidelines"]
  },
  {
    id: "12",
    name: "API_Integration_Guide.docx",
    type: "Word",
    platform: "Confluence",
    size: "1.7 MB",
    lastModified: "2024-06-09",
    content: "Step-by-step guide for integrating third-party APIs with authentication and error handling...",
    summary: "Comprehensive API integration guide covering authentication methods, rate limiting, error handling, and best practices for third-party service integration.",
    tags: ["api", "integration", "authentication", "documentation", "development", "best practices"]
  }
];

// Utility functions for file operations
export const semanticSearch = (query: string, files: DemoFile[] = demoFiles): DemoFile[] => {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(' ').filter(word => word.length > 2);
  
  return files
    .map(file => {
      let score = 0;
      
      // Direct name match gets highest score
      if (file.name.toLowerCase().includes(queryLower)) score += 10;
      
      // Tag matches
      keywords.forEach(keyword => {
        file.tags.forEach(tag => {
          if (tag.includes(keyword)) score += 5;
        });
      });
      
      // Content and summary matches
      keywords.forEach(keyword => {
        if (file.content.toLowerCase().includes(keyword)) score += 3;
        if (file.summary.toLowerCase().includes(keyword)) score += 2;
      });
      
      return { ...file, score };
    })
    .filter(file => file.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

export const findFileByDescription = (description: string): DemoFile | null => {
  const results = semanticSearch(description);
  return results.length > 0 ? results[0] : null;
};

export const extractTopicFromQuery = (query: string): string => {
  const queryLower = query.toLowerCase();
  
  // Common patterns for topic extraction
  if (queryLower.includes('about') || queryLower.includes('explain')) {
    const match = queryLower.match(/(?:about|explain|tell me about)\s+(.+?)(?:\s+in|\s+from|$)/);
    if (match) return match[1];
  }
  
  if (queryLower.includes('what is') || queryLower.includes('how does')) {
    const match = queryLower.match(/(?:what is|how does)\s+(.+?)(?:\s+work|\s+in|$)/);
    if (match) return match[1];
  }
  
  // Extract key technical terms
  const technicalTerms = ['resnet', 'deep learning', 'machine learning', 'api', 'microservices', 'roi', 'investment'];
  for (const term of technicalTerms) {
    if (queryLower.includes(term)) return term;
  }
  
  return query;
};

export const demoResponses: DemoResponse[] = [
  {
    type: 'search',
    query: "Find files about deep learning",
    response: "I found several files related to deep learning across your platforms:",
    files: [demoFiles[0], demoFiles[7]],
    processingTime: "0.8s"
  },
  {
    type: 'summary', 
    query: "Summarize financial report",
    response: "Here's a summary of your latest financial report:",
    files: [demoFiles[1]],
    processingTime: "1.2s"
  },
  {
    type: 'rag',
    query: "What is ResNet architecture?",
    response: "Based on your Deep Learning documentation:",
    files: [demoFiles[0]],
    processingTime: "2.1s"
  },
  {
    type: 'upload',
    query: "Upload presentation to Google Drive",
    response: "Successfully uploaded to Google Drive:",
    processingTime: "3.4s"
  },
  {
    type: 'delete',
    query: "Delete old financial report",
    response: "File deletion completed:",
    processingTime: "1.8s"
  }
];
