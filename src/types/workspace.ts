
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  joinDate: Date;
  lastActive: Date;
  avatar?: string;
  department?: string;
}

export interface FileStats {
  platform: string;
  totalFiles: number;
  fileTypes: {
    [key: string]: number;
  };
}

export interface WorkspaceStats {
  totalEmployees: number;
  totalFiles: number;
  filesByPlatform: FileStats[];
  recentActivity: {
    date: Date;
    action: string;
    user: string;
    file?: string;
  }[];
}

export interface Workspace {
  id: string;
  name: string;
  employees: Employee[];
  stats: WorkspaceStats;
  createdAt: Date;
}
