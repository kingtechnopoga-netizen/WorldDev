import { UserProfile, Conversation, TaskRecord, SavedOutput, UploadedFile, Workflow, AppSettings } from '../types';

const KEYS = {
  PROFILE: 'taskforge_profile',
  CONVERSATIONS: 'taskforge_conversations',
  TASKS: 'taskforge_tasks',
  SAVED_OUTPUTS: 'taskforge_saved_outputs',
  FILES: 'taskforge_files',
  WORKFLOWS: 'taskforge_workflows',
  SETTINGS: 'taskforge_settings',
};

function get<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save failed:', e);
  }
}

// Profile
export function getProfile(): UserProfile | null {
  return get<UserProfile | null>(KEYS.PROFILE, null);
}

export function saveProfile(profile: UserProfile): void {
  set(KEYS.PROFILE, profile);
}

export function clearProfile(): void {
  localStorage.removeItem(KEYS.PROFILE);
}

// Conversations
export function getConversations(): Conversation[] {
  return get<Conversation[]>(KEYS.CONVERSATIONS, []);
}

export function saveConversation(conv: Conversation): void {
  const convs = getConversations();
  const idx = convs.findIndex(c => c.id === conv.id);
  if (idx >= 0) {
    convs[idx] = conv;
  } else {
    convs.unshift(conv);
  }
  set(KEYS.CONVERSATIONS, convs);
}

export function deleteConversation(id: string): void {
  const convs = getConversations().filter(c => c.id !== id);
  set(KEYS.CONVERSATIONS, convs);
}

// Tasks
export function getTasks(): TaskRecord[] {
  return get<TaskRecord[]>(KEYS.TASKS, []);
}

export function saveTask(task: TaskRecord): void {
  const tasks = getTasks();
  tasks.unshift(task);
  set(KEYS.TASKS, tasks);
}

export function deleteTask(id: string): void {
  const tasks = getTasks().filter(t => t.id !== id);
  set(KEYS.TASKS, tasks);
}

// Saved Outputs
export function getSavedOutputs(): SavedOutput[] {
  return get<SavedOutput[]>(KEYS.SAVED_OUTPUTS, []);
}

export function saveSavedOutput(output: SavedOutput): void {
  const outputs = getSavedOutputs();
  outputs.unshift(output);
  set(KEYS.SAVED_OUTPUTS, outputs);
}

export function deleteSavedOutput(id: string): void {
  const outputs = getSavedOutputs().filter(o => o.id !== id);
  set(KEYS.SAVED_OUTPUTS, outputs);
}

// Files
export function getFiles(): UploadedFile[] {
  return get<UploadedFile[]>(KEYS.FILES, []);
}

export function saveFile(file: UploadedFile): void {
  const files = getFiles();
  files.unshift(file);
  set(KEYS.FILES, files);
}

export function deleteFile(id: string): void {
  const files = getFiles().filter(f => f.id !== id);
  set(KEYS.FILES, files);
}

export function renameFile(id: string, newName: string): void {
  const files = getFiles();
  const file = files.find(f => f.id === id);
  if (file) {
    file.name = newName;
    set(KEYS.FILES, files);
  }
}

// Workflows
export function getWorkflows(): Workflow[] {
  return get<Workflow[]>(KEYS.WORKFLOWS, []);
}

export function saveWorkflow(workflow: Workflow): void {
  const workflows = getWorkflows();
  const idx = workflows.findIndex(w => w.id === workflow.id);
  if (idx >= 0) {
    workflows[idx] = workflow;
  } else {
    workflows.unshift(workflow);
  }
  set(KEYS.WORKFLOWS, workflows);
}

export function deleteWorkflow(id: string): void {
  const workflows = getWorkflows().filter(w => w.id !== id);
  set(KEYS.WORKFLOWS, workflows);
}

// Settings
export function getSettings(): AppSettings {
  return get<AppSettings>(KEYS.SETTINGS, {
    displayName: '',
    theme: 'dark',
    accentIntensity: 'medium',
    defaultAgent: 'assistant-gpt',
    puterEnabled: true,
    offlineSampleMode: false,
    mobileCompact: false,
  });
}

export function saveSettings(settings: AppSettings): void {
  set(KEYS.SETTINGS, settings);
}

// Export/Import all data
export function exportAllData(): string {
  const data = {
    profile: getProfile(),
    conversations: getConversations(),
    tasks: getTasks(),
    savedOutputs: getSavedOutputs(),
    files: getFiles().map(f => ({ ...f, content: undefined, dataUrl: undefined })), // Don't export file binary data
    workflows: getWorkflows(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.profile) set(KEYS.PROFILE, data.profile);
    if (data.conversations) set(KEYS.CONVERSATIONS, data.conversations);
    if (data.tasks) set(KEYS.TASKS, data.tasks);
    if (data.savedOutputs) set(KEYS.SAVED_OUTPUTS, data.savedOutputs);
    if (data.files) set(KEYS.FILES, data.files);
    if (data.workflows) set(KEYS.WORKFLOWS, data.workflows);
    if (data.settings) set(KEYS.SETTINGS, data.settings);
    return true;
  } catch {
    return false;
  }
}

export function clearAllData(): void {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}

// Utility
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
