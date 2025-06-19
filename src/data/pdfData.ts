
export interface PDFFile {
  id: string;
  name: string;
  platform: string;
  size: string;
  lastModified: string;
  uploadDate: string;
  summary: string;
  tags: string[];
  type: string;
  author?: string;
  shared?: boolean;
}

export const demoPDFs: PDFFile[] = [
  // Google Drive PDFs
  {
    id: 'pdf-drive-1',
    name: 'Q4_Marketing_Strategy.pdf',
    platform: 'Google Drive',
    size: '2.4 MB',
    lastModified: '2024-03-15',
    uploadDate: '2024-03-15',
    summary: 'Comprehensive marketing strategy document outlining Q4 campaigns, budget allocation, and performance metrics for digital marketing initiatives.',
    tags: ['marketing', 'strategy', 'Q4', 'campaigns'],
    type: 'business',
    author: 'Marketing Team',
    shared: true
  },
  {
    id: 'pdf-drive-2',
    name: 'Financial_Report_2024.pdf',
    platform: 'Google Drive',
    size: '5.2 MB',
    lastModified: '2024-03-10',
    uploadDate: '2024-03-10',
    summary: 'Annual financial report covering revenue, expenses, profit margins, and growth projections for fiscal year 2024.',
    tags: ['finance', 'annual report', '2024', 'revenue'],
    type: 'financial',
    author: 'Finance Department',
    shared: false
  },
  {
    id: 'pdf-drive-3',
    name: 'Product_Roadmap_2024.pdf',
    platform: 'Google Drive',
    size: '3.1 MB',
    lastModified: '2024-03-08',
    uploadDate: '2024-03-08',
    summary: 'Product development roadmap featuring upcoming features, release timelines, and technical specifications.',
    tags: ['product', 'roadmap', 'development', 'features'],
    type: 'technical',
    author: 'Product Team'
  },
  
  // Slack PDFs
  {
    id: 'pdf-slack-1',
    name: 'Meeting_Minutes_March.pdf',
    platform: 'Slack',
    size: '850 KB',
    lastModified: '2024-03-12',
    uploadDate: '2024-03-12',
    summary: 'Detailed meeting minutes from March team meetings covering project updates, decisions made, and action items.',
    tags: ['meetings', 'minutes', 'march', 'team'],
    type: 'meeting',
    author: 'Team Lead',
    shared: true
  },
  {
    id: 'pdf-slack-2',
    name: 'Client_Proposal_TechCorp.pdf',
    platform: 'Slack',
    size: '4.7 MB',
    lastModified: '2024-03-05',
    uploadDate: '2024-03-05',
    summary: 'Comprehensive proposal for TechCorp client including project scope, timeline, deliverables, and pricing structure.',
    tags: ['proposal', 'client', 'techcorp', 'pricing'],
    type: 'business',
    author: 'Sales Team'
  },
  {
    id: 'pdf-slack-3',
    name: 'Invoice_February_2024.pdf',
    platform: 'Slack',
    size: '320 KB',
    lastModified: '2024-02-28',
    uploadDate: '2024-02-28',
    summary: 'Monthly invoice for February 2024 services including detailed breakdown of billable hours and expenses.',
    tags: ['invoice', 'february', 'billing', 'expenses'],
    type: 'financial',
    author: 'Accounting'
  },

  // Dropbox PDFs
  {
    id: 'pdf-dropbox-1',
    name: 'Employee_Handbook_2024.pdf',
    platform: 'Dropbox',
    size: '6.8 MB',
    lastModified: '2024-02-20',
    uploadDate: '2024-02-20',
    summary: 'Updated employee handbook covering company policies, benefits, procedures, and workplace guidelines.',
    tags: ['hr', 'handbook', 'policies', 'benefits'],
    type: 'hr',
    author: 'HR Department'
  },
  {
    id: 'pdf-dropbox-2',
    name: 'Technical_Documentation.pdf',
    platform: 'Dropbox',
    size: '8.3 MB',
    lastModified: '2024-02-15',
    uploadDate: '2024-02-15',
    summary: 'Comprehensive technical documentation for API integration, system architecture, and development guidelines.',
    tags: ['technical', 'api', 'documentation', 'architecture'],
    type: 'technical',
    author: 'Engineering Team'
  },
  {
    id: 'pdf-dropbox-3',
    name: 'Training_Materials_Q1.pdf',
    platform: 'Dropbox',
    size: '4.5 MB',
    lastModified: '2024-01-25',
    uploadDate: '2024-01-25',
    summary: 'Q1 training materials covering new software tools, processes, and professional development resources.',
    tags: ['training', 'Q1', 'development', 'tools'],
    type: 'training',
    author: 'Training Department'
  },

  // OneDrive PDFs
  {
    id: 'pdf-onedrive-1',
    name: 'Contract_Agreement_ABC.pdf',
    platform: 'OneDrive',
    size: '1.2 MB',
    lastModified: '2024-03-01',
    uploadDate: '2024-03-01',
    summary: 'Legal contract agreement with ABC Company covering terms, conditions, deliverables, and payment schedules.',
    tags: ['contract', 'legal', 'abc company', 'agreement'],
    type: 'legal',
    author: 'Legal Team'
  },
  {
    id: 'pdf-onedrive-2',
    name: 'Project_Timeline_Alpha.pdf',
    platform: 'OneDrive',
    size: '900 KB',
    lastModified: '2024-02-22',
    uploadDate: '2024-02-22',
    summary: 'Detailed project timeline for Project Alpha including milestones, dependencies, and resource allocation.',
    tags: ['project', 'timeline', 'alpha', 'milestones'],
    type: 'project',
    author: 'Project Manager'
  },

  // Notion PDFs
  {
    id: 'pdf-notion-1',
    name: 'Research_Report_AI_Trends.pdf',
    platform: 'Notion',
    size: '7.1 MB',
    lastModified: '2024-03-18',
    uploadDate: '2024-03-18',
    summary: 'In-depth research report on current AI trends, market analysis, and future predictions for the technology sector.',
    tags: ['research', 'ai', 'trends', 'market analysis'],
    type: 'research',
    author: 'Research Team'
  },
  {
    id: 'pdf-notion-2',
    name: 'User_Guide_Platform.pdf',
    platform: 'Notion',
    size: '2.8 MB',
    lastModified: '2024-02-10',
    uploadDate: '2024-02-10',
    summary: 'Comprehensive user guide for the platform including setup instructions, features overview, and troubleshooting.',
    tags: ['user guide', 'platform', 'instructions', 'troubleshooting'],
    type: 'documentation',
    author: 'Product Team'
  },
  {
    id: 'pdf-notion-3',
    name: 'Compliance_Guidelines.pdf',
    platform: 'Notion',
    size: '3.4 MB',
    lastModified: '2024-01-30',
    uploadDate: '2024-01-30',
    summary: 'Updated compliance guidelines covering regulatory requirements, data protection, and security protocols.',
    tags: ['compliance', 'regulations', 'security', 'data protection'],
    type: 'compliance',
    author: 'Compliance Team'
  }
];

export const searchPDFs = (query: string): PDFFile[] => {
  const lowerQuery = query.toLowerCase();
  
  return demopdfs.filter(pdf => 
    pdf.name.toLowerCase().includes(lowerQuery) ||
    pdf.summary.toLowerCase().includes(lowerQuery) ||
    pdf.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    pdf.platform.toLowerCase().includes(lowerQuery) ||
    pdf.type.toLowerCase().includes(lowerQuery)
  );
};

export const getPDFsByPlatform = (platforms: string[]): PDFFile[] => {
  const normalizedPlatforms = platforms.map(p => p.toLowerCase());
  
  return demopdfs.filter(pdf => 
    normalizedPlatforms.some(platform => 
      pdf.platform.toLowerCase().includes(platform)
    )
  );
};

export const getAllPDFs = (): PDFFile[] => {
  return demopdfs;
};

export const getRecentPDFs = (days: number = 30): PDFFile[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return demopdfs.filter(pdf => {
    const uploadDate = new Date(pdf.uploadDate);
    return uploadDate >= cutoffDate;
  }).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
};
