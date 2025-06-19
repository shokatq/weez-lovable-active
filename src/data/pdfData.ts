
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
  detailedContent?: string;
  location?: string;
  version?: string;
  lastUpdated?: string;
}

export const demoPDFs: PDFFile[] = [
  // Google Drive PDFs (3 consistent files)
  {
    id: 'pdf-drive-1',
    name: 'Q4_Marketing_Strategy.pdf',
    platform: 'Google Drive',
    size: '2.4 MB',
    lastModified: '2024-03-15',
    uploadDate: '2024-03-15',
    summary: 'Comprehensive marketing strategy document outlining Q4 campaigns, budget allocation, and performance metrics for digital marketing initiatives.',
    detailedContent: 'This document contains a detailed Q4 marketing strategy with the following key sections: Executive Summary highlighting $2.5M budget allocation, Target Audience Analysis covering 18-35 demographic, Digital Campaign Planning including social media, PPC, and content marketing strategies, Performance KPIs with conversion rate targets of 4.2%, Budget Distribution across channels (40% social media, 30% PPC, 20% content, 10% analytics), Timeline with weekly milestones from October to December, Risk Assessment and mitigation strategies, and ROI projections showing expected 180% return on marketing investment.',
    tags: ['marketing', 'strategy', 'Q4', 'campaigns'],
    type: 'business',
    author: 'Marketing Team',
    shared: true,
    location: '/Marketing/Strategies/2024/',
    version: '3.2',
    lastUpdated: '2024-03-15T14:30:00Z'
  },
  {
    id: 'pdf-drive-2',
    name: 'Financial_Report_2024.pdf',
    platform: 'Google Drive',
    size: '5.2 MB',
    lastModified: '2024-03-10',
    uploadDate: '2024-03-10',
    summary: 'Annual financial report covering revenue, expenses, profit margins, and growth projections for fiscal year 2024.',
    detailedContent: 'Comprehensive financial analysis including: Revenue Growth of 34% YoY reaching $12.8M, Expense Breakdown showing operational costs at $8.2M, Profit Margins improved to 36% from previous 28%, Cash Flow Analysis with positive $3.1M operating cash flow, Investment Portfolio performance showing 12% returns, Quarterly Performance with Q4 being strongest at $4.2M revenue, Future Projections targeting $16M revenue for 2025, Risk Factors including market volatility and supply chain concerns, and Recommendations for cost optimization and revenue diversification.',
    tags: ['finance', 'annual report', '2024', 'revenue'],
    type: 'financial',
    author: 'Finance Department',
    shared: false,
    location: '/Finance/Annual_Reports/',
    version: '2.1',
    lastUpdated: '2024-03-10T09:15:00Z'
  },
  {
    id: 'pdf-drive-3',
    name: 'Product_Roadmap_2024.pdf',
    platform: 'Google Drive',
    size: '3.1 MB',
    lastModified: '2024-03-08',
    uploadDate: '2024-03-08',
    summary: 'Product development roadmap featuring upcoming features, release timelines, and technical specifications.',
    detailedContent: 'Product roadmap containing: Phase 1 (Q1-Q2) featuring AI integration, mobile app redesign, and API v3.0 release, Phase 2 (Q3-Q4) including advanced analytics dashboard, multi-language support, and enterprise security features, Technical Specifications with React 18 migration, TypeScript adoption, and microservices architecture, Resource Allocation requiring 15 developers and $800K budget, Market Research insights showing 67% user demand for mobile improvements, Competitive Analysis comparing features with top 3 competitors, User Experience improvements based on 2,400 survey responses, and Success Metrics targeting 40% user engagement increase.',
    tags: ['product', 'roadmap', 'development', 'features'],
    type: 'technical',
    author: 'Product Team',
    location: '/Product/Roadmaps/',
    version: '1.8',
    lastUpdated: '2024-03-08T16:45:00Z'
  },
  
  // Slack PDFs (3 consistent files)
  {
    id: 'pdf-slack-1',
    name: 'Meeting_Minutes_March.pdf',
    platform: 'Slack',
    size: '850 KB',
    lastModified: '2024-03-12',
    uploadDate: '2024-03-12',
    summary: 'Detailed meeting minutes from March team meetings covering project updates, decisions made, and action items.',
    detailedContent: 'March meeting minutes include: Weekly Standup Notes from 4 team meetings, Project Alpha Status showing 78% completion ahead of schedule, Budget Review with $45K remaining from Q1 allocation, Team Performance Metrics indicating 95% task completion rate, Client Feedback Summary from 8 customer interviews, Action Items with 12 pending tasks assigned to team members, Decision Log including approval of new hiring strategy, Risk Mitigation plans for upcoming deadlines, Resource Requests for 2 additional developers, and Next Steps planning for April initiatives.',
    tags: ['meetings', 'minutes', 'march', 'team'],
    type: 'meeting',
    author: 'Team Lead',
    shared: true,
    location: '/team-updates/march-2024/',
    version: '1.0',
    lastUpdated: '2024-03-12T11:30:00Z'
  },
  {
    id: 'pdf-slack-2',
    name: 'Client_Proposal_TechCorp.pdf',
    platform: 'Slack',
    size: '4.7 MB',
    lastModified: '2024-03-05',
    uploadDate: '2024-03-05',
    summary: 'Comprehensive proposal for TechCorp client including project scope, timeline, deliverables, and pricing structure.',
    detailedContent: 'TechCorp proposal featuring: Executive Summary highlighting $250K project value, Scope of Work including custom software development, 6-month timeline with monthly milestones, Team Composition with 8 specialists (4 developers, 2 designers, 1 PM, 1 QA), Deliverables breakdown with 3 major releases, Technical Architecture using cloud-native solutions, Pricing Structure with $150K development and $100K support costs, Success Metrics targeting 99.9% uptime and 2-second load times, Risk Assessment covering technical and timeline risks, and Terms & Conditions with payment schedule and IP ownership details.',
    tags: ['proposal', 'client', 'techcorp', 'pricing'],
    type: 'business',
    author: 'Sales Team',
    location: '/client-proposals/techcorp/',
    version: '2.3',
    lastUpdated: '2024-03-05T15:20:00Z'
  },
  {
    id: 'pdf-slack-3',
    name: 'Invoice_February_2024.pdf',
    platform: 'Slack',
    size: '320 KB',
    lastModified: '2024-02-28',
    uploadDate: '2024-02-28',
    summary: 'Monthly invoice for February 2024 services including detailed breakdown of billable hours and expenses.',
    detailedContent: 'February invoice details: Total Amount of $28,750 for professional services, Billable Hours breakdown showing 230 hours across 4 projects, Hourly Rates ranging from $85-150 based on seniority, Project Allocation with 40% on Client A, 35% on Client B, 25% on internal projects, Expense Categories including $2,300 software licenses, $850 travel costs, and $1,200 equipment, Payment Terms of Net 30 days, Tax Information with 8.5% sales tax applied, Previous Balance of $0 with all prior invoices paid, and Banking Details for electronic payment processing.',
    tags: ['invoice', 'february', 'billing', 'expenses'],
    type: 'financial',
    author: 'Accounting',
    location: '/accounting/invoices/2024/',
    version: '1.0',
    lastUpdated: '2024-02-28T17:00:00Z'
  },

  // Dropbox PDFs (3 consistent files)
  {
    id: 'pdf-dropbox-1',
    name: 'Employee_Handbook_2024.pdf',
    platform: 'Dropbox',
    size: '6.8 MB',
    lastModified: '2024-02-20',
    uploadDate: '2024-02-20',
    summary: 'Updated employee handbook covering company policies, benefits, procedures, and workplace guidelines.',
    detailedContent: 'Employee handbook containing: Company Mission and Values emphasizing innovation and collaboration, Code of Conduct with 15 core behavioral expectations, Benefits Package including health insurance, 401k matching, and 25 PTO days, Remote Work Policy allowing 3 days/week flexibility, Performance Review Process with quarterly check-ins and annual evaluations, Compensation Structure with salary bands and bonus criteria, Professional Development budget of $3,000 per employee annually, Diversity & Inclusion initiatives and training requirements, Safety Protocols for office and remote work, and Disciplinary Procedures with progressive warning system.',
    tags: ['hr', 'handbook', 'policies', 'benefits'],
    type: 'hr',
    author: 'HR Department',
    location: '/HR/Policies/2024/',
    version: '4.1',
    lastUpdated: '2024-02-20T10:00:00Z'
  },
  {
    id: 'pdf-dropbox-2',
    name: 'Technical_Documentation.pdf',
    platform: 'Dropbox',
    size: '8.3 MB',
    lastModified: '2024-02-15',
    uploadDate: '2024-02-15',
    summary: 'Comprehensive technical documentation for API integration, system architecture, and development guidelines.',
    detailedContent: 'Technical documentation including: API Reference with 47 endpoints and authentication methods, System Architecture showing microservices design with 12 core services, Database Schema with 28 tables and relationship mappings, Development Guidelines covering coding standards, Git workflow, and testing requirements, Deployment Procedures using Docker and Kubernetes, Security Protocols including OAuth 2.0 and data encryption, Performance Benchmarks showing 99.9% uptime and 150ms average response time, Troubleshooting Guide with common issues and solutions, Integration Examples with sample code in 5 programming languages, and Version Control strategy with semantic versioning.',
    tags: ['technical', 'api', 'documentation', 'architecture'],
    type: 'technical',
    author: 'Engineering Team',
    location: '/Engineering/Documentation/',
    version: '5.2',
    lastUpdated: '2024-02-15T14:15:00Z'
  },
  {
    id: 'pdf-dropbox-3',
    name: 'Training_Materials_Q1.pdf',
    platform: 'Dropbox',
    size: '4.5 MB',
    lastModified: '2024-01-25',
    uploadDate: '2024-01-25',
    summary: 'Q1 training materials covering new software tools, processes, and professional development resources.',
    detailedContent: 'Q1 training materials featuring: Software Tools Training on Slack, Notion, and Figma with hands-on exercises, Process Updates including new project management workflow and client onboarding procedures, Leadership Development program for senior staff with 8-week curriculum, Technical Skills workshops covering React, TypeScript, and cloud computing, Communication Skills training focusing on presentation and writing, Compliance Training on data privacy and security requirements, Assessment Methods with practical projects and knowledge tests, Resource Library with 50+ video tutorials and documentation, and Certification Tracking with completion requirements and renewal dates.',
    tags: ['training', 'Q1', 'development', 'tools'],
    type: 'training',
    author: 'Training Department',
    location: '/Training/Q1_2024/',
    version: '2.0',
    lastUpdated: '2024-01-25T13:45:00Z'
  },

  // OneDrive PDFs (3 consistent files)
  {
    id: 'pdf-onedrive-1',
    name: 'Contract_Agreement_ABC.pdf',
    platform: 'OneDrive',
    size: '1.2 MB',
    lastModified: '2024-03-01',
    uploadDate: '2024-03-01',
    summary: 'Legal contract agreement with ABC Company covering terms, conditions, deliverables, and payment schedules.',
    detailedContent: 'ABC Company contract including: Scope of Services for custom software development over 8 months, Financial Terms totaling $180K with milestone-based payments, Intellectual Property clauses ensuring client ownership of deliverables, Performance Standards requiring 99.5% uptime and 24/7 support, Liability Limitations capping damages at contract value, Termination Clauses allowing 30-day notice period, Confidentiality Agreement protecting both parties\' proprietary information, Dispute Resolution through arbitration in Delaware, Force Majeure provisions for unforeseen circumstances, and Amendment Procedures requiring written consent from both parties.',
    tags: ['contract', 'legal', 'abc company', 'agreement'],
    type: 'legal',
    author: 'Legal Team',
    location: '/Legal/Contracts/2024/',
    version: '3.1',
    lastUpdated: '2024-03-01T16:30:00Z'
  },
  {
    id: 'pdf-onedrive-2',
    name: 'Project_Timeline_Alpha.pdf',
    platform: 'OneDrive',
    size: '900 KB',
    lastModified: '2024-02-22',
    uploadDate: '2024-02-22',
    summary: 'Detailed project timeline for Project Alpha including milestones, dependencies, and resource allocation.',
    detailedContent: 'Project Alpha timeline featuring: Phase 1 (Weeks 1-4) covering requirements gathering and design, Phase 2 (Weeks 5-12) for core development and testing, Phase 3 (Weeks 13-16) including integration and deployment, Resource Allocation with 6 developers, 2 designers, and 1 project manager, Critical Dependencies on third-party API integrations and client approval cycles, Milestone Schedule with 8 major deliverables and review points, Risk Mitigation strategies for technical and schedule risks, Budget Tracking showing $120K allocated across 16 weeks, Quality Assurance plan with automated testing and code reviews, and Stakeholder Communication plan with weekly status updates.',
    tags: ['project', 'timeline', 'alpha', 'milestones'],
    type: 'project',
    author: 'Project Manager',
    location: '/Projects/Alpha/Planning/',
    version: '1.4',
    lastUpdated: '2024-02-22T12:00:00Z'
  },
  {
    id: 'pdf-onedrive-3',
    name: 'Security_Audit_Report.pdf',
    platform: 'OneDrive',
    size: '2.1 MB',
    lastModified: '2024-02-18',
    uploadDate: '2024-02-18',
    summary: 'Comprehensive security audit report covering system vulnerabilities, compliance status, and recommended improvements.',
    detailedContent: 'Security audit report containing: Vulnerability Assessment identifying 3 high-priority and 12 medium-priority issues, Compliance Review showing 94% adherence to SOC 2 Type II standards, Network Security analysis with firewall configuration recommendations, Access Control evaluation revealing need for multi-factor authentication, Data Protection review ensuring GDPR and CCPA compliance, Incident Response plan testing and improvement suggestions, Security Training assessment showing 87% staff completion rate, Third-Party Risk evaluation for 8 vendor relationships, Remediation Timeline with 30-60-90 day action items, and Cost Analysis showing $45K needed for security improvements.',
    tags: ['security', 'audit', 'compliance', 'vulnerabilities'],
    type: 'security',
    author: 'Security Team',
    location: '/Security/Audits/2024/',
    version: '1.0',
    lastUpdated: '2024-02-18T09:30:00Z'
  },

  // Notion PDFs (3 consistent files)
  {
    id: 'pdf-notion-1',
    name: 'Research_Report_AI_Trends.pdf',
    platform: 'Notion',
    size: '7.1 MB',
    lastModified: '2024-03-18',
    uploadDate: '2024-03-18',
    summary: 'In-depth research report on current AI trends, market analysis, and future predictions for the technology sector.',
    detailedContent: 'AI trends research including: Market Analysis showing $87B AI market size with 32% YoY growth, Technology Trends covering Large Language Models, Computer Vision, and Autonomous Systems, Industry Applications across healthcare, finance, and manufacturing sectors, Investment Patterns with $24B in venture funding during 2023, Regulatory Landscape analysis of AI governance in US, EU, and Asia, Competitive Landscape profiling 25 leading AI companies, Future Predictions including AGI timeline and job market impacts, Ethical Considerations covering bias, privacy, and transparency issues, Technical Challenges in AI safety and explainability, and Strategic Recommendations for businesses adopting AI technologies.',
    tags: ['research', 'ai', 'trends', 'market analysis'],
    type: 'research',
    author: 'Research Team',
    location: '/Research/AI_Trends/',
    version: '2.3',
    lastUpdated: '2024-03-18T11:15:00Z'
  },
  {
    id: 'pdf-notion-2',
    name: 'User_Guide_Platform.pdf',
    platform: 'Notion',
    size: '2.8 MB',
    lastModified: '2024-02-10',
    uploadDate: '2024-02-10',
    summary: 'Comprehensive user guide for the platform including setup instructions, features overview, and troubleshooting.',
    detailedContent: 'Platform user guide containing: Getting Started section with account setup and initial configuration, Feature Overview covering 15 core platform capabilities, Navigation Guide with step-by-step interface instructions, User Permissions explaining admin, editor, and viewer roles, Integration Setup for connecting external tools and APIs, Customization Options including themes, workflows, and automation, Best Practices based on 1,000+ user experiences, Troubleshooting Guide with 50 common issues and solutions, Advanced Features for power users including scripting and custom fields, and Support Resources with contact information and community links.',
    tags: ['user guide', 'platform', 'instructions', 'troubleshooting'],
    type: 'documentation',
    author: 'Product Team',
    location: '/Documentation/User_Guides/',
    version: '4.7',
    lastUpdated: '2024-02-10T14:20:00Z'
  },
  {
    id: 'pdf-notion-3',
    name: 'Compliance_Guidelines.pdf',
    platform: 'Notion',
    size: '3.4 MB',
    lastModified: '2024-01-30',
    uploadDate: '2024-01-30',
    summary: 'Updated compliance guidelines covering regulatory requirements, data protection, and security protocols.',
    detailedContent: 'Compliance guidelines featuring: Regulatory Overview covering GDPR, CCPA, SOX, and industry-specific requirements, Data Protection protocols including encryption, access controls, and retention policies, Privacy Framework with consent management and data subject rights, Security Standards following ISO 27001 and NIST frameworks, Audit Procedures with quarterly reviews and external assessments, Training Requirements for all staff with annual certification, Incident Response plan for compliance violations and data breaches, Documentation Standards for maintaining compliance records, Third-Party Management ensuring vendor compliance alignment, and Continuous Monitoring systems for ongoing compliance validation.',
    tags: ['compliance', 'regulations', 'security', 'data protection'],
    type: 'compliance',
    author: 'Compliance Team',
    location: '/Compliance/Guidelines/',
    version: '3.5',
    lastUpdated: '2024-01-30T16:45:00Z'
  }
];

// Enhanced search functions
export const searchPDFs = (query: string): PDFFile[] => {
  const lowerQuery = query.toLowerCase();
  
  return demoPDFs.filter(pdf => 
    pdf.name.toLowerCase().includes(lowerQuery) ||
    pdf.summary.toLowerCase().includes(lowerQuery) ||
    pdf.detailedContent?.toLowerCase().includes(lowerQuery) ||
    pdf.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    pdf.platform.toLowerCase().includes(lowerQuery) ||
    pdf.type.toLowerCase().includes(lowerQuery) ||
    pdf.author?.toLowerCase().includes(lowerQuery)
  );
};

export const getPDFsByPlatform = (platforms: string[]): PDFFile[] => {
  const normalizedPlatforms = platforms.map(p => p.toLowerCase());
  
  return demoPDFs.filter(pdf => 
    normalizedPlatforms.some(platform => 
      pdf.platform.toLowerCase().includes(platform)
    )
  );
};

export const getAllPDFs = (): PDFFile[] => {
  return demoPDFs;
};

export const getRecentPDFs = (days: number = 30): PDFFile[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return demoPDFs.filter(pdf => {
    const uploadDate = new Date(pdf.uploadDate);
    return uploadDate >= cutoffDate;
  }).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
};

export const findPDFByNameAndPlatform = (fileName: string, platform?: string): PDFFile | null => {
  const lowerFileName = fileName.toLowerCase();
  const lowerPlatform = platform?.toLowerCase();
  
  return demoPDFs.find(pdf => {
    const nameMatch = pdf.name.toLowerCase().includes(lowerFileName) || 
                     lowerFileName.includes(pdf.name.toLowerCase().replace('.pdf', ''));
    const platformMatch = !lowerPlatform || pdf.platform.toLowerCase().includes(lowerPlatform);
    return nameMatch && platformMatch;
  }) || null;
};

export const locatePDF = (fileName: string, platform?: string): { file: PDFFile; location: string } | null => {
  const file = findPDFByNameAndPlatform(fileName, platform);
  if (!file) return null;
  
  return {
    file,
    location: `${file.platform}${file.location}${file.name}`
  };
};

export const updatePDFVersion = (fileName: string, platform?: string): PDFFile | null => {
  const file = findPDFByNameAndPlatform(fileName, platform);
  if (!file) return null;
  
  // Simulate version update
  const versionParts = file.version?.split('.') || ['1', '0'];
  const newMinorVersion = parseInt(versionParts[1]) + 1;
  const newVersion = `${versionParts[0]}.${newMinorVersion}`;
  
  return {
    ...file,
    version: newVersion,
    lastUpdated: new Date().toISOString(),
    lastModified: new Date().toLocaleDateString()
  };
};
