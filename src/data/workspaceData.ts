
import { Workspace, Employee, FileStats } from "@/types/workspace";
import { FileText, Users, HardDrive, Activity } from "lucide-react";

export const demoEmployees: Employee[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "admin",
    joinDate: new Date("2024-01-15"),
    lastActive: new Date(),
    department: "Engineering"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "employee",
    joinDate: new Date("2024-02-20"),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    department: "Marketing"
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@company.com",
    role: "employee",
    joinDate: new Date("2024-03-10"),
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    department: "Sales"
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily.chen@company.com",
    role: "admin",
    joinDate: new Date("2024-01-05"),
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    department: "Operations"
  }
];

export const workspaceStats = [
  {
    title: "Total Files",
    value: "7,774",
    change: "+12.5%",
    color: "bg-blue-500",
    icon: FileText
  },
  {
    title: "Team Members",
    value: "24",
    change: "+8.2%",
    color: "bg-emerald-500",
    icon: Users
  },
  {
    title: "Storage Used",
    value: "847 GB",
    change: "+5.1%",
    color: "bg-purple-500",
    icon: HardDrive
  },
  {
    title: "Active Today",
    value: "18",
    change: "+15.3%",
    color: "bg-orange-500",
    icon: Activity
  }
];

export const recentFiles = [
  {
    name: "Project_Proposal_2024.pdf",
    platform: "Google Drive",
    size: "2.4 MB",
    lastModified: "2 hours ago",
    status: "Active"
  },
  {
    name: "Marketing_Strategy.docx",
    platform: "OneDrive",
    size: "1.8 MB",
    lastModified: "5 hours ago",
    status: "Processing"
  },
  {
    name: "Sales_Report_Q2.xlsx",
    platform: "Google Drive",
    size: "956 KB",
    lastModified: "1 day ago",
    status: "Active"
  },
  {
    name: "Team_Meeting_Notes.md",
    platform: "Notion",
    size: "124 KB",
    lastModified: "3 days ago",
    status: "Active"
  },
  {
    name: "Budget_Analysis.xlsx",
    platform: "OneDrive",
    size: "2.1 MB",
    lastModified: "5 days ago",
    status: "Pending"
  }
];

export const teamMembers = [
  {
    name: "John Smith",
    role: "Administrator",
    status: "Active"
  },
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    status: "Active"
  },
  {
    name: "Mike Davis",
    role: "Sales Rep",
    status: "Active"
  },
  {
    name: "Emily Chen",
    role: "Operations Lead",
    status: "Processing"
  }
];

export const demoFileStats: FileStats[] = [
  {
    platform: "Google Drive",
    totalFiles: 2847,
    total_files: 2847,
    total_size: 15000000000,
    recent_uploads: 45,
    fileTypes: {
      ".pdf": 1240,
      ".docx": 892,
      ".xlsx": 445,
      ".pptx": 270
    }
  },
  {
    platform: "Notion",
    totalFiles: 1534,
    total_files: 1534,
    total_size: 8500000000,
    recent_uploads: 23,
    fileTypes: {
      ".md": 834,
      ".pdf": 445,
      ".docx": 255
    }
  },
  {
    platform: "OneDrive",
    totalFiles: 1892,
    total_files: 1892,
    total_size: 12300000000,
    recent_uploads: 34,
    fileTypes: {
      ".xlsx": 745,
      ".pptx": 523,
      ".docx": 445,
      ".pdf": 179
    }
  },
  {
    platform: "Dropbox",
    totalFiles: 934,
    total_files: 934,
    total_size: 6200000000,
    recent_uploads: 12,
    fileTypes: {
      ".pdf": 445,
      ".jpg": 234,
      ".png": 123,
      ".docx": 132
    }
  },
  {
    platform: "Slack",
    totalFiles: 567,
    total_files: 567,
    total_size: 3800000000,
    recent_uploads: 8,
    fileTypes: {
      ".pdf": 234,
      ".png": 123,
      ".jpg": 89,
      ".docx": 121
    }
  }
];

export const sampleFiles = [
  {
    id: "1",
    name: "Project_Proposal_2024.pdf",
    type: "pdf",
    size: "2.4 MB",
    platform: "Google Drive",
    lastModified: new Date("2024-06-10"),
    owner: "John Smith"
  },
  {
    id: "2",
    name: "Marketing_Strategy.docx",
    type: "docx",
    size: "1.8 MB",
    platform: "OneDrive",
    lastModified: new Date("2024-06-12"),
    owner: "Sarah Johnson"
  },
  {
    id: "3",
    name: "Sales_Report_Q2.xlsx",
    type: "xlsx",
    size: "956 KB",
    platform: "Google Drive",
    lastModified: new Date("2024-06-11"),
    owner: "Mike Davis"
  },
  {
    id: "4",
    name: "Team_Meeting_Notes.md",
    type: "md",
    size: "124 KB",
    platform: "Notion",
    lastModified: new Date("2024-06-13"),
    owner: "Emily Chen"
  },
  {
    id: "5",
    name: "Budget_Analysis.xlsx",
    type: "xlsx",
    size: "2.1 MB",
    platform: "OneDrive",
    lastModified: new Date("2024-06-09"),
    owner: "John Smith"
  },
  {
    id: "6",
    name: "Product_Roadmap.pptx",
    type: "pptx",
    size: "3.2 MB",
    platform: "Google Drive",
    lastModified: new Date("2024-06-08"),
    owner: "Sarah Johnson"
  },
  {
    id: "7",
    name: "User_Feedback.pdf",
    type: "pdf",
    size: "1.5 MB",
    platform: "Dropbox",
    lastModified: new Date("2024-06-07"),
    owner: "Mike Davis"
  },
  {
    id: "8",
    name: "Design_Guidelines.pdf",
    type: "pdf",
    size: "4.1 MB",
    platform: "Slack",
    lastModified: new Date("2024-06-06"),
    owner: "Emily Chen"
  }
];

// Demo workspace interface extending Workspace
interface DemoWorkspace extends Workspace {
  employees: Employee[];
  stats: {
    totalEmployees: number;
    total_files: number;
    filesByPlatform: FileStats[];
    recentActivity: Array<{
      date: Date;
      action: string;
      user: string;
      file?: string;
      target?: string;
    }>;
  };
}

export const demoWorkspace: DemoWorkspace = {
  id: "workspace-1",
  name: "TechCorp Enterprise",
  owner_id: "user-1",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  employees: demoEmployees,
  stats: {
    totalEmployees: demoEmployees.length,
    total_files: demoFileStats.reduce((sum, platform) => sum + platform.total_files, 0),
    filesByPlatform: demoFileStats,
    recentActivity: [
      {
        date: new Date(Date.now() - 30 * 60 * 1000),
        action: "File uploaded",
        user: "Sarah Johnson",
        file: "Q4_Report.pdf"
      },
      {
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        action: "Employee promoted to admin",
        user: "John Smith"
      },
      {
        date: new Date(Date.now() - 4 * 60 * 60 * 1000),
        action: "New employee added",
        user: "Mike Davis"
      },
      {
        date: new Date(Date.now() - 6 * 60 * 60 * 1000),
        action: "File searched",
        user: "Emily Chen",
        file: "Project_Proposal.docx"
      }
    ]
  }
};
