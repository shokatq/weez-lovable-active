// hooks/useSpace.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SpaceFile, SpaceMember, SpaceMessage, SpacePermissions, SpaceService } from '@/services/spaceService';

interface UseSpaceOptions {
  apiBaseUrl?: string;
}

export function useSpace(spaceId: string | undefined, options: UseSpaceOptions = {}) {
  const apiBaseUrl = options.apiBaseUrl || '';
  const serviceRef = useRef<SpaceService | null>(null);
  if (!serviceRef.current) serviceRef.current = new SpaceService(apiBaseUrl);
  const service = serviceRef.current;

  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [messages, setMessages] = useState<SpaceMessage[]>([]);
  const [files, setFiles] = useState<SpaceFile[]>([]);
  const [permissions, setPermissions] = useState<SpacePermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    if (!spaceId) return;
    setLoading(true);
    setError(null);
    try {
      const [m, msg, f, p] = await Promise.all([
        service.getMembers(spaceId),
        service.getMessages(spaceId),
        service.getFiles(spaceId),
        service.getPermissions(spaceId)
      ]);
      setMembers(m);
      setMessages(msg);
      setFiles(f);
      setPermissions(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [spaceId, service]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const sendMessage = useCallback(async (content: string) => {
    if (!spaceId) return;
    const newMsg = await service.sendMessage(spaceId, content);
    setMessages(prev => [...prev, newMsg]);
  }, [spaceId, service]);

  const uploadFile = useCallback(async (file: File) => {
    if (!spaceId) return;
    const uploaded = await service.uploadFile(spaceId, file);
    setFiles(prev => [uploaded, ...prev]);
  }, [spaceId, service]);

  const deleteFile = useCallback(async (fileId: string) => {
    if (!spaceId) return;
    await service.deleteFile(spaceId, fileId);
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, [spaceId, service]);

  return {
    members,
    messages,
    files,
    permissions,
    loading,
    error,
    reload: loadAll,
    sendMessage,
    uploadFile,
    deleteFile,
  };
}



