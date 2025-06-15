
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  files?: FileAttachment[];
  isUploading?: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  platform: string;
  size: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  timestamp: Date;
}
