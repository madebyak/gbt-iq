export type MessageRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  name?: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  loading: boolean;
  error: string | null;
}
