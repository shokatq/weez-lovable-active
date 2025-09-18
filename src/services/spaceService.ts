// services/spaceService.ts
// Thin client for space-scoped APIs. Adapts to existing auth and returns typed data.

export type SpaceRole = 'admin' | 'manager' | 'member';

export interface SpaceMember {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url: string | null;
  role: SpaceRole;
}

export interface SpaceMessage {
  id: string;
  space_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'file' | 'system';
  created_at: string;
  user?: Pick<SpaceMember, 'first_name' | 'last_name' | 'avatar_url' | 'email' | 'user_id'>;
}

export interface SpaceFile {
  id: string;
  space_id: string;
  uploaded_by: string;
  file_name: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

export interface SpacePermissions {
  canManageSpace: boolean;
  canUploadFiles: boolean;
  canDeleteFiles?: boolean;
  canManageMembers?: boolean;
  canViewAllFiles?: boolean;
  canEditAllFiles?: boolean;
  canDeleteOwnFiles?: boolean;
  canEditOwnFiles?: boolean;
  canAssignTasks?: boolean;
  canViewAssignedFiles?: boolean;
  canEditAssignedFiles?: boolean;
  canComment?: boolean;
}

export class SpaceService {
  constructor(private readonly apiBaseUrl: string) {}

  async getMembers(spaceId: string): Promise<SpaceMember[]> {
    const res = await fetch(`${this.apiBaseUrl}/api/spaces/${spaceId}/members`);
    if (!res.ok) throw new Error('Failed to load members');
    return res.json();
  }

  async getMessages(spaceId: string): Promise<SpaceMessage[]> {
    const res = await fetch(`${this.apiBaseUrl}/api/spaces/${spaceId}/messages`);
    if (!res.ok) throw new Error('Failed to load messages');
    return res.json();
  }

  async sendMessage(spaceId: string, content: string): Promise<SpaceMessage> {
    const res = await fetch(`${this.apiBaseUrl}/api/spaces/${spaceId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  }

  async getFiles(spaceId: string): Promise<SpaceFile[]> {
    const res = await fetch(`${this.apiBaseUrl}/api/spaces/${spaceId}/files`);
    if (!res.ok) throw new Error('Failed to load files');
    return res.json();
  }

  async uploadFile(spaceId: string, file: File): Promise<SpaceFile> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${this.apiBaseUrl}/api/spaces/${spaceId}/files`, { method: 'POST', body: form });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
  }

  async deleteFile(spaceId: string, fileId: string): Promise<void> {
    const res = await fetch(`${this.apiBaseUrl}/api/spaces/${spaceId}/files/${fileId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete file');
  }

  async getPermissions(spaceId: string): Promise<SpacePermissions> {
    const res = await fetch(`${this.apiBaseUrl}/api/spaces/${spaceId}/permissions`);
    if (!res.ok) throw new Error('Failed to load permissions');
    return res.json();
  }
}



