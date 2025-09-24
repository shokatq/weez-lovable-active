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