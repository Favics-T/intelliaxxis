export interface ResearchMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  createdAt: string;
}

export interface ResearchSession {
  id: string;
  title: string;
  messages: ResearchMessage[];
  createdAt: string;
  updatedAt: string;
}