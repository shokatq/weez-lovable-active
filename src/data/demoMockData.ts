export interface DemoFile {
  id: string;
  name: string;
  type: string;
  platform: string;
  description: string;
  lastModified: string;
}

export interface DemoRFP {
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export const demoFiles: DemoFile[] = [
  {
    id: "1",
    name: "JavaBasics.pdf",
    type: "PDF",
    platform: "Google Drive",
    description: "Comprehensive guide to Java fundamentals and object-oriented programming concepts",
    lastModified: "2 hours ago"
  },
  {
    id: "2", 
    name: "ProjectPlan.docx",
    type: "DOCX",
    platform: "OneDrive",
    description: "Sample project planning document with timelines and resource allocation",
    lastModified: "1 day ago"
  },
  {
    id: "3",
    name: "TeamNotes.txt", 
    type: "TXT",
    platform: "Slack",
    description: "Mock team meeting notes discussing project milestones and deliverables",
    lastModified: "3 days ago"
  },
  {
    id: "4",
    name: "TechnicalSpecs.md",
    type: "MD", 
    platform: "GitHub",
    description: "Technical specification document outlining system architecture and requirements",
    lastModified: "5 days ago"
  },
  {
    id: "5",
    name: "UserManual.pdf",
    type: "PDF",
    platform: "SharePoint", 
    description: "Complete user manual with step-by-step instructions and troubleshooting guide",
    lastModified: "1 week ago"
  },
  {
    id: "6",
    name: "APIDocumentation.pdf",
    type: "PDF",
    platform: "Confluence",
    description: "REST API documentation with authentication, endpoints, and code examples",
    lastModified: "2 days ago"
  },
  {
    id: "7",
    name: "SecurityPolicy.docx",
    type: "DOCX",
    platform: "Google Drive",
    description: "Corporate security policies and data protection guidelines for enterprise systems",
    lastModified: "1 week ago"
  },
  {
    id: "8",
    name: "DatabaseDesign.xlsx",
    type: "XLSX",
    platform: "OneDrive",
    description: "Database schema design with entity relationships and normalization strategies",
    lastModified: "4 days ago"
  },
  {
    id: "9",
    name: "MeetingMinutes_Q4.pdf",
    type: "PDF",
    platform: "Slack",
    description: "Quarterly review meeting minutes with action items and strategic decisions",
    lastModified: "6 hours ago"
  },
  {
    id: "10",
    name: "CloudArchitecture.pptx",
    type: "PPTX",
    platform: "SharePoint",
    description: "Cloud infrastructure architecture presentation with AWS services overview",
    lastModified: "3 days ago"
  },
  {
    id: "11",
    name: "ComplianceReport.pdf",
    type: "PDF",
    platform: "Google Drive",
    description: "SOX compliance audit report with findings and remediation recommendations",
    lastModified: "2 weeks ago"
  },
  {
    id: "12",
    name: "ProductRoadmap.md",
    type: "MD",
    platform: "GitHub",
    description: "Product development roadmap with feature priorities and release timelines",
    lastModified: "5 days ago"
  },
  {
    id: "13",
    name: "VendorContracts.docx",
    type: "DOCX",
    platform: "OneDrive",
    description: "Software vendor contracts and licensing agreements for enterprise tools",
    lastModified: "1 day ago"
  },
  {
    id: "14",
    name: "TestingProcedures.txt",
    type: "TXT",
    platform: "Jira",
    description: "Quality assurance testing procedures and automated test case documentation",
    lastModified: "8 hours ago"
  },
  {
    id: "15",
    name: "BudgetAnalysis.xlsx",
    type: "XLSX",
    platform: "SharePoint",
    description: "Annual IT budget analysis with cost breakdowns and variance reports",
    lastModified: "1 week ago"
  }
];

export const demoRFPOutput: DemoRFP = {
  title: "Sample RFP - Cloud Migration & Modernization",
  sections: [
    {
      heading: "Project Overview",
      content: "This RFP outlines requirements for migrating legacy systems to a modern cloud environment. The project aims to improve scalability, reduce operational costs, and enhance system reliability through cloud-native architecture."
    },
    {
      heading: "Technical Requirements", 
      content: "Support for AWS, Azure, and Google Cloud platforms with hybrid deployment options. Must include containerization using Docker/Kubernetes, microservices architecture, and automated CI/CD pipelines. Security compliance with SOC 2 and ISO 27001 standards required."
    },
    {
      heading: "Timeline & Milestones",
      content: "Expected project completion within 6 months. Phase 1: Assessment and planning (4 weeks). Phase 2: Infrastructure setup and migration (12 weeks). Phase 3: Testing and optimization (6 weeks). Phase 4: Go-live and support (2 weeks)."
    },
    {
      heading: "Budget & Resources",
      content: "Total project budget ranges from $250,000 to $400,000. Requires dedicated project manager, cloud architects, DevOps engineers, and QA specialists. 24/7 support during migration phase and 3-month post-deployment warranty required."
    },
    {
      heading: "Evaluation Criteria",
      content: "Proposals will be evaluated based on technical expertise (40%), cost-effectiveness (30%), timeline feasibility (20%), and post-deployment support capabilities (10%). Preference given to vendors with proven cloud migration experience in similar industries."
    }
  ]
};