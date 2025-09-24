// Comprehensive demo data for the entire product experience

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee' | 'manager';
  avatar: string;
  department: string;
}

export interface DemoMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: DemoFile[];
}

export interface DemoConversation {
  id: string;
  title: string;
  messages: DemoMessage[];
  lastMessage: string;
  timestamp: Date;
  participants: string[];
}

export interface DemoFile {
  id: string;
  name: string;
  type: string;
  platform: string;
  description: string;
  lastModified: string;
  size: string;
  url?: string;
  content?: string;
}

export interface DemoSpace {
  id: string;
  name: string;
  description: string;
  members: DemoUser[];
  files: DemoFile[];
  conversations: DemoConversation[];
  createdAt: Date;
  isActive: boolean;
}

export interface DemoWorkspace {
  id: string;
  name: string;
  description: string;
  members: DemoUser[];
  spaces: DemoSpace[];
  createdAt: Date;
}

export interface DemoTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'in-progress';
  assignedTo: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DemoActivity {
  id: string;
  type: 'message' | 'file_upload' | 'task_completed' | 'space_created';
  description: string;
  timestamp: Date;
  user: DemoUser;
}

// Demo Users
export const demoUsers: DemoUser[] = [
  {
    id: '1',
    email: 'john.smith@company.com',
    name: 'John Smith',
    role: 'admin',
    avatar: 'JS',
    department: 'IT'
  },
  {
    id: '2',
    email: 'sarah.johnson@company.com', 
    name: 'Sarah Johnson',
    role: 'manager',
    avatar: 'SJ',
    department: 'Marketing'
  },
  {
    id: '3',
    email: 'demo.user@company.com',
    name: 'Demo User',
    role: 'employee',
    avatar: 'DU',
    department: 'Sales'
  },
  {
    id: '4',
    email: 'mike.chen@company.com',
    name: 'Mike Chen',
    role: 'employee',
    avatar: 'MC',
    department: 'Engineering'
  },
  {
    id: '5',
    email: 'emily.davis@company.com',
    name: 'Emily Davis',
    role: 'employee',
    avatar: 'ED',
    department: 'Design'
  }
];

// Demo Files (expanded)
export const demoFiles: DemoFile[] = [
  {
    id: "1",
    name: "JavaBasics.pdf",
    type: "PDF",
    platform: "Google Drive",
    description: "Comprehensive guide to Java fundamentals and object-oriented programming concepts",
    lastModified: "2 hours ago",
    size: "2.4 MB",
    content: "Complete Java programming guide covering variables, classes, inheritance, and more..."
  },
  {
    id: "2", 
    name: "ProjectPlan.docx",
    type: "DOCX",
    platform: "OneDrive",
    description: "Q4 project planning document with timelines and resource allocation",
    lastModified: "1 day ago",
    size: "1.8 MB",
    content: "Project timeline: Phase 1 (Oct 1-15), Phase 2 (Oct 16-30), Phase 3 (Nov 1-15)..."
  },
  {
    id: "3",
    name: "TeamNotes.txt", 
    type: "TXT",
    platform: "Slack",
    description: "Weekly team meeting notes discussing project milestones and deliverables",
    lastModified: "3 days ago",
    size: "12 KB",
    content: "Meeting agenda: 1. Project updates 2. Resource allocation 3. Next steps..."
  },
  {
    id: "4",
    name: "TechnicalSpecs.md",
    type: "MD", 
    platform: "GitHub",
    description: "Technical specification document outlining system architecture and requirements",
    lastModified: "5 days ago",
    size: "45 KB",
    content: "# System Architecture\n\n## Backend Services\n- API Gateway\n- Microservices..."
  },
  {
    id: "5",
    name: "UserManual.pdf",
    type: "PDF",
    platform: "SharePoint", 
    description: "Complete user manual with step-by-step instructions and troubleshooting guide",
    lastModified: "1 week ago",
    size: "5.2 MB",
    content: "Chapter 1: Getting Started\nChapter 2: Basic Operations\nChapter 3: Advanced Features..."
  },
  {
    id: "6",
    name: "APIDocumentation.pdf",
    type: "PDF",
    platform: "Confluence",
    description: "REST API documentation with authentication, endpoints, and code examples",
    lastModified: "2 days ago",
    size: "3.1 MB",
    content: "API Endpoints:\nGET /api/users\nPOST /api/auth/login\nPUT /api/profile..."
  },
  {
    id: "7",
    name: "SecurityPolicy.docx",
    type: "DOCX",
    platform: "Google Drive",
    description: "Corporate security policies and data protection guidelines",
    lastModified: "1 week ago",
    size: "892 KB",
    content: "Security Policy v2.1\n1. Access Control\n2. Data Classification\n3. Incident Response..."
  },
  {
    id: "8",
    name: "DatabaseDesign.xlsx",
    type: "XLSX",
    platform: "OneDrive",
    description: "Database schema design with entity relationships",
    lastModified: "4 days ago",
    size: "765 KB",
    content: "Tables: Users, Projects, Tasks, Files\nRelationships: Many-to-many, Foreign keys..."
  }
];

// Demo Messages for different contexts
export const demoChatMessages: DemoMessage[] = [
  {
    id: '1',
    content: 'Hello! Can you help me find the latest project documentation?',
    isUser: true,
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: '2',
    content: 'I found several project documents for you! Here are the most recent ones:\n\n• **ProjectPlan.docx** (OneDrive) - Q4 planning document updated 1 day ago\n• **TechnicalSpecs.md** (GitHub) - System architecture updated 5 days ago\n• **APIDocumentation.pdf** (Confluence) - REST API docs updated 2 days ago\n\nWould you like me to open any specific document or search for something more specific?',
    isUser: false,
    timestamp: new Date(Date.now() - 3580000)
  },
  {
    id: '3',
    content: 'Can you generate an RFP based on the technical specifications?',
    isUser: true,
    timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
  },
  {
    id: '4',
    content: 'I\'ll generate an RFP based on your technical specifications. Let me analyze the documents and create a comprehensive request for proposal...\n\n**Generated RFP: Cloud Migration & Modernization Project**\n\n✅ **Project Overview**: Migration of legacy systems to cloud infrastructure\n✅ **Technical Requirements**: AWS/Azure support, containerization, microservices\n✅ **Timeline**: 6-month implementation with phased approach\n✅ **Budget Range**: $250K - $400K\n\nWould you like me to expand on any specific section?',
    isUser: false,
    timestamp: new Date(Date.now() - 1770000)
  }
];

// Demo Conversations
export const demoConversations: DemoConversation[] = [
  {
    id: 'conv-1',
    title: 'Project Documentation Search',
    messages: demoChatMessages,
    lastMessage: 'Generated RFP based on technical specifications',
    timestamp: new Date(Date.now() - 1800000),
    participants: ['demo-user', 'ai-assistant']
  },
  {
    id: 'conv-2',
    title: 'Security Policy Review',
    messages: [
      {
        id: 'm1',
        content: 'I need to review our security policies for the audit',
        isUser: true,
        timestamp: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: 'm2',
        content: 'I found your security policy document! Here\'s a summary:\n\n**Security Policy v2.1** highlights:\n• Multi-factor authentication required\n• Data encryption at rest and in transit\n• Regular security audits quarterly\n• Incident response procedures updated\n\nWould you like me to create an audit checklist based on these policies?',
        isUser: false,
        timestamp: new Date(Date.now() - 86380000)
      }
    ],
    lastMessage: 'Security policy analysis completed',
    timestamp: new Date(Date.now() - 86400000),
    participants: ['demo-user', 'ai-assistant']
  },
  {
    id: 'conv-3',
    title: 'API Integration Help',
    messages: [
      {
        id: 'm3',
        content: 'How do I integrate with our user management API?',
        isUser: true,
        timestamp: new Date(Date.now() - 172800000) // 2 days ago
      },
      {
        id: 'm4',
        content: 'Based on your API documentation, here\'s how to integrate:\n\n```javascript\n// Authentication\nconst token = await fetch(\'/api/auth/login\', {\n  method: \'POST\',\n  body: JSON.stringify({ email, password })\n});\n\n// Get users\nconst users = await fetch(\'/api/users\', {\n  headers: { \'Authorization\': `Bearer ${token}` }\n});\n```\n\nThe API supports JWT authentication and returns paginated results.',
        isUser: false,
        timestamp: new Date(Date.now() - 172780000)
      }
    ],
    lastMessage: 'API integration code examples provided',
    timestamp: new Date(Date.now() - 172800000),
    participants: ['demo-user', 'ai-assistant']
  }
];

// Demo Spaces
export const demoSpaces: DemoSpace[] = [
  {
    id: 'space-1',
    name: 'Project Alpha',
    description: 'Main development workspace for Project Alpha initiative',
    members: [demoUsers[0], demoUsers[2], demoUsers[3]],
    files: demoFiles.slice(0, 4),
    conversations: [demoConversations[0]],
    createdAt: new Date(Date.now() - 604800000), // 1 week ago
    isActive: true
  },
  {
    id: 'space-2',
    name: 'Marketing Campaign',
    description: 'Q4 marketing campaign planning and execution',
    members: [demoUsers[1], demoUsers[4]],
    files: demoFiles.slice(4, 6),
    conversations: [demoConversations[1]],
    createdAt: new Date(Date.now() - 432000000), // 5 days ago
    isActive: true
  },
  {
    id: 'space-3',
    name: 'Security Audit',
    description: 'Annual security audit documentation and compliance',
    members: [demoUsers[0], demoUsers[1]],
    files: [demoFiles[6], demoFiles[7]],
    conversations: [demoConversations[2]],
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    isActive: true
  }
];

// Demo Workspaces
export const demoWorkspaces: DemoWorkspace[] = [
  {
    id: 'workspace-1',
    name: 'Engineering Team',
    description: 'Main workspace for engineering projects and development',
    members: [demoUsers[0], demoUsers[2], demoUsers[3]],
    spaces: [demoSpaces[0], demoSpaces[2]],
    createdAt: new Date(Date.now() - 2592000000) // 30 days ago
  },
  {
    id: 'workspace-2',
    name: 'Marketing Department',
    description: 'Marketing campaigns, content, and strategy workspace',
    members: [demoUsers[1], demoUsers[4]],
    spaces: [demoSpaces[1]],
    createdAt: new Date(Date.now() - 1728000000) // 20 days ago
  }
];

// Demo Tasks
export const demoTasks: DemoTask[] = [
  {
    id: 'task-1',
    title: 'Review API Documentation',
    description: 'Review and update the REST API documentation with new endpoints',
    status: 'completed',
    assignedTo: 'demo.user@company.com',
    dueDate: 'Today',
    priority: 'high'
  },
  {
    id: 'task-2',
    title: 'Security Policy Update',
    description: 'Update security policies for Q4 compliance requirements',
    status: 'in-progress',
    assignedTo: 'demo.user@company.com',
    dueDate: 'Tomorrow',
    priority: 'medium'
  },
  {
    id: 'task-3',
    title: 'Project Planning Meeting',
    description: 'Attend weekly project planning meeting and provide updates',
    status: 'pending',
    assignedTo: 'demo.user@company.com',
    dueDate: 'Oct 30, 2024',
    priority: 'low'
  },
  {
    id: 'task-4',
    title: 'Database Schema Review',
    description: 'Review proposed changes to database schema',
    status: 'pending',
    assignedTo: 'demo.user@company.com',
    dueDate: 'Nov 2, 2024',
    priority: 'high'
  }
];

// Demo Activity Feed
export const demoActivities: DemoActivity[] = [
  {
    id: 'activity-1',
    type: 'message',
    description: 'Started new conversation about API integration',
    timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    user: demoUsers[2]
  },
  {
    id: 'activity-2',
    type: 'task_completed',
    description: 'Completed task: Review API Documentation',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    user: demoUsers[2]
  },
  {
    id: 'activity-3',
    type: 'file_upload',
    description: 'Uploaded SecurityPolicy.docx to Security Audit space',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    user: demoUsers[0]
  },
  {
    id: 'activity-4',
    type: 'space_created',
    description: 'Created new space: Security Audit',
    timestamp: new Date(Date.now() - 259200000), // 3 days ago
    user: demoUsers[1]
  }
];

// Demo RFP Output
export const demoRFPOutput = {
  title: "RFP - Cloud Migration & Modernization Project",
  sections: [
    {
      heading: "Executive Summary",
      content: "Our organization seeks a qualified partner to lead the migration of our legacy systems to a modern, scalable cloud infrastructure. This initiative aims to improve operational efficiency, reduce costs, and enhance system reliability through cloud-native architecture and best practices."
    },
    {
      heading: "Technical Requirements", 
      content: "• Cloud Platform Support: AWS, Azure, Google Cloud with multi-cloud capabilities\n• Containerization: Docker and Kubernetes orchestration\n• Architecture: Microservices-based design with API Gateway\n• Security: End-to-end encryption, IAM, and compliance with SOC 2, GDPR\n• Monitoring: Comprehensive logging, metrics, and alerting systems\n• CI/CD: Automated deployment pipelines with testing integration"
    },
    {
      heading: "Project Scope & Timeline",
      content: "**Phase 1: Assessment & Planning** (4 weeks)\n- Current system analysis and migration strategy\n- Risk assessment and mitigation planning\n\n**Phase 2: Infrastructure Setup** (8 weeks)\n- Cloud environment provisioning\n- Security implementation and testing\n\n**Phase 3: Migration Execution** (12 weeks)\n- Phased application migration\n- Data migration and validation\n\n**Phase 4: Optimization & Handover** (4 weeks)\n- Performance tuning and monitoring setup\n- Knowledge transfer and documentation"
    },
    {
      heading: "Budget & Investment",
      content: "**Total Project Investment:** $250,000 - $400,000\n\n**Resource Requirements:**\n• Project Manager (1 FTE)\n• Cloud Architects (2 FTE)\n• DevOps Engineers (2 FTE)\n• Security Specialists (1 FTE)\n• QA Engineers (1 FTE)\n\n**Additional Costs:**\n• Cloud infrastructure costs (estimated $5,000/month)\n• Third-party tools and licenses\n• 24/7 support during migration phase"
    },
    {
      heading: "Vendor Qualifications",
      content: "**Required Experience:**\n• Minimum 5 years cloud migration experience\n• 10+ successful enterprise migrations\n• Certified cloud architects (AWS/Azure/GCP)\n• ISO 27001 and SOC 2 compliance experience\n\n**Preferred Qualifications:**\n• Healthcare/Financial services experience\n• DevOps automation expertise\n• Previous work with similar technology stack\n• 24/7 support capabilities\n• References from Fortune 500 clients"
    },
    {
      heading: "Evaluation Criteria",
      content: "**Technical Expertise (40%)**\n- Cloud architecture design quality\n- Security and compliance approach\n- Migration methodology and tools\n\n**Cost Effectiveness (25%)**\n- Competitive pricing structure\n- Value-added services included\n- Long-term cost optimization\n\n**Timeline & Project Management (20%)**\n- Realistic timeline estimates\n- Risk mitigation strategies\n- Project management methodology\n\n**Support & Maintenance (15%)**\n- Post-migration support offerings\n- SLA commitments\n- Training and knowledge transfer"
    }
  ]
};

// Search functionality helpers
export const searchDemoFiles = (query: string): DemoFile[] => {
  if (!query.trim()) return demoFiles;
  
  const lowercaseQuery = query.toLowerCase();
  return demoFiles.filter(file => 
    file.name.toLowerCase().includes(lowercaseQuery) ||
    file.description.toLowerCase().includes(lowercaseQuery) ||
    file.platform.toLowerCase().includes(lowercaseQuery) ||
    file.type.toLowerCase().includes(lowercaseQuery)
  );
};

export const getDemoStats = () => ({
  totalFiles: demoFiles.length,
  totalConversations: demoConversations.length,
  totalSpaces: demoSpaces.length,
  totalTasks: demoTasks.length,
  completedTasks: demoTasks.filter(task => task.status === 'completed').length,
  activeTasks: demoTasks.filter(task => task.status !== 'completed').length,
  recentActivities: demoActivities.slice(0, 5)
});