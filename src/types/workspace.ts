
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'team-lead' | 'contributor' | 'viewer';
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

export interface SampleFile {
  id: string;
  name: string;
  type: string;
  size: string;
  platform: string;
  lastModified: Date;
  owner: string;
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
