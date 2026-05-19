import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Trash2, Download, History as HistoryIcon } from 'lucide-react';
import { getTasks, deleteTask } from '../lib/storage';
import { getAgent } from '../lib/agents';
import { TaskRecord } from '../types';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function History() {
  const [tasks, setTasks] = useState(getTasks());
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    setTasks(getTasks());
    showToast('Task deleted', 'info');
  };

  const handleExport = (task: TaskRecord) => {
    const content = `Task: ${task.title}\nAgent: ${getAgent(task.agentId).name}\nDate: ${new Date(task.timestamp).toLocaleString()}\n\nPrompt:\n${task.prompt}\n\nOutput:\n${task.output}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-${task.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported as .txt', 'success');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-2">Task History</h1>
        <p className="text-sm text-zinc-400 mb-6">{tasks.length} total tasks</p>
      </motion.div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 mb-6">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="bg-transparent flex-1 text-sm text-white outline-none placeholder-zinc-500"
        />
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No tasks yet"
          description="Your AI task history will appear here after you generate something"
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4"
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getAgent(task.agentId).icon}</span>
                    <p className="text-sm font-medium text-white truncate">{task.title}</p>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {getAgent(task.agentId).name} • {task.type} • {new Date(task.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ml-2 ${
                  task.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {task.status}
                </span>
              </div>

              {expandedId === task.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-white/5"
                >
                  <p className="text-xs text-zinc-400 mb-2">Prompt:</p>
                  <p className="text-sm text-zinc-300 mb-3 whitespace-pre-wrap">{task.prompt}</p>
                  <p className="text-xs text-zinc-400 mb-2">Output:</p>
                  <div className="text-sm text-zinc-300 whitespace-pre-wrap max-h-48 overflow-y-auto bg-white/5 rounded-xl p-3">
                    {task.output}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleCopy(task.output)}
                      className="px-3 py-1.5 text-xs bg-white/5 rounded-lg text-zinc-300 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                    <button
                      onClick={() => handleExport(task)}
                      className="px-3 py-1.5 text-xs bg-white/5 rounded-lg text-zinc-300 hover:text-white flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Export
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1.5 text-xs bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}
