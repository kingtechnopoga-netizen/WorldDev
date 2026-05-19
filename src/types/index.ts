export interface UserProfile {
  name: string;
  createdAt: string;
  selectedAgent: string;
}

export interface Agent {
  id: string;
  name: string;
  purpose: string;
  systemPrompt: string;
  icon: string;
  examples: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentId?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  agentId: string;
  prompt: string;
  output: string;
  timestamp: string;
  status: 'completed' | 'failed' | 'pending';
  type: string;
}

export interface SavedOutput {
  id: string;
  title: string;
  content: string;
  type: string;
  agentId: string;
  timestamp: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  dataUrl?: string;
  uploadedAt: string;
}

export interface WorkflowBlock {
  id: string;
  type: 'trigger' | 'input' | 'ai-generate' | 'ai-summarize' | 'ai-captions' | 'ai-lyrics' | 'ai-email' | 'save-output' | 'export-text';
  label: string;
  config: Record<string, string>;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

export interface Workflow {
  id: string;
  name: string;
  blocks: WorkflowBlock[];
  agentId: string;
  createdAt: string;
  lastRun?: string;
  lastOutput?: string;
}

export interface AppSettings {
  displayName: string;
  theme: 'dark';
  accentIntensity: 'low' | 'medium' | 'high';
  defaultAgent: string;
  puterEnabled: boolean;
  offlineSampleMode: boolean;
  mobileCompact: boolean;
}
