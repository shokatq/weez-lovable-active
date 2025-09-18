import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useSpace } from '@/hooks/useSpace';
import { useAuth } from '@/hooks/useAuth';
import { Paperclip, Send } from 'lucide-react';

export default function SpacePage() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { user } = useAuth();
  const { members, messages, files, permissions, loading, error, sendMessage, uploadFile } = useSpace(spaceId, {
    apiBaseUrl: ''
  });

  const [text, setText] = React.useState('');
  const canUpload = !!permissions?.canUploadFiles;

  const onSend = async () => {
    if (!text.trim()) return;
    await sendMessage(text.trim());
    setText('');
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold truncate">Space</h1>
          <p className="text-sm text-muted-foreground">Chat, files and operations</p>
        </div>
        <div className="flex -space-x-2">
          {members.slice(0, 5).map(m => (
            <Avatar key={m.user_id} className="h-7 w-7 ring-2 ring-background">
              <AvatarImage src={m.avatar_url || undefined} />
              <AvatarFallback>{(m.first_name?.[0] || 'U')}{(m.last_name?.[0] || '')}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Chat */}
        <Card className="p-3 flex flex-col min-h-[60vh]">
          <div className="flex-1 overflow-auto space-y-2 pr-1">
            {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}
            {!loading && messages.map(msg => (
              <div key={msg.id} className="flex items-start gap-2 text-sm">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={msg.user?.avatar_url || undefined} />
                  <AvatarFallback>{msg.user?.email?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-muted-foreground text-xs">{new Date(msg.created_at).toLocaleString()}</div>
                  <div>{msg.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2">
            {canUpload && (
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <Paperclip className="h-4 w-4" />
                <input type="file" className="hidden" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f);
                }} />
              </label>
            )}
            <Input value={text} onChange={e => setText(e.target.value)} placeholder="Write a message…" onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }} />
            <Button size="sm" onClick={onSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Right: Files */}
        <Card className="p-3 min-h-[60vh]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Files</h2>
            {canUpload && (
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <Paperclip className="h-4 w-4" />
                <input type="file" className="hidden" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f);
                }} />
                Upload
              </label>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map(f => (
              <div key={f.id} className="border rounded p-2 text-sm">
                <div className="font-medium truncate">{f.file_name}</div>
                <div className="text-xs text-muted-foreground">{f.file_type}</div>
              </div>
            ))}
            {!loading && files.length === 0 && (
              <div className="text-sm text-muted-foreground">No files yet.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}



