
import { Workspace, Employee, FileStats } from "@/types/workspace";

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

export const demoFileStats: FileStats[] = [
  {
    platform: "Google Drive",
    totalFiles: 2847,
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
    fileTypes: {
      ".md": 834,
      ".pdf": 445,
      ".docx": 255
    }
  },
  {
    platform: "OneDrive",
    totalFiles: 1892,
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
    fileTypes: {
      ".pdf": 234,
      ".png": 123,
      ".jpg": 89,
      ".docx": 121
    }
  }
];

export const demoWorkspace: Workspace = {
  id: "workspace-1",
  name: "TechCorp Enterprise",
  employees: demoEmployees,
  stats: {
    totalEmployees: demoEmployees.length,
    totalFiles: demoFileStats.reduce((sum, platform) => sum + platform.totalFiles, 0),
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
  },
  createdAt: new Date("2024-01-01")
};
