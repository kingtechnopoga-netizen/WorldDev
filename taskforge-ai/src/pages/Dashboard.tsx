import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileText,
  Bookmark,
  FolderOpen,
  Sparkles,
  PenTool,
  Music,
  Mail,
  Workflow,
  Upload,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { getProfile, getTasks, getSavedOutputs, getFiles } from '../lib/storage';
import { getAgent } from '../lib/agents';

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = getProfile();
  const tasks = getTasks();
  const saved = getSavedOutputs();
  const files = getFiles();
  const agent = getAgent(profile?.selectedAgent || 'assistant-gpt');

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const quickActions = [
    { icon: MessageSquare, label: 'New AI Task', path: '/chat', color: '#ff7a00' },
    { icon: Sparkles, label: 'Captions', path: '/chat?template=captions', color: '#ffb000' },
    { icon: PenTool, label: 'Write Script', path: '/chat?template=script', color: '#ff7a00' },
    { icon: FileText, label: 'Summarize', path: '/chat?template=summarize', color: '#ffb000' },
    { icon: Music, label: 'Lyrics', path: '/chat?template=lyrics', color: '#ff7a00' },
    { icon: Workflow, label: 'Workflow', path: '/automation', color: '#ffb000' },
    { icon: Upload, label: 'Upload File', path: '/files', color: '#ff7a00' },
    { icon: Mail, label: 'Write Email', path: '/chat?template=email', color: '#ffb000' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {greeting}, {profile?.name || 'Guest'} 👋
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {' • '}
          {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        <StatCard icon={FileText} label="Tasks Created" value={tasks.length} />
        <StatCard icon={Bookmark} label="Saved Outputs" value={saved.length} color="#ffb000" />
        <StatCard icon={FolderOpen} label="Uploaded Files" value={files.length} color="#22c55e" />
        <StatCard icon={Sparkles} label="Active Agent" value={agent.name} color="#a855f7" />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.path)}
              className="glass rounded-2xl p-4 flex flex-col items-center gap-2 text-center hover:border-[#ff7a00]/30 transition-all"
            >
              <action.icon className="w-6 h-6" style={{ color: action.color }} />
              <span className="text-xs text-zinc-300 font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Tasks */}
      {tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Recent Tasks</h2>
          <div className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="glass rounded-xl p-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{task.title}</p>
                  <p className="text-xs text-zinc-500">
                    {getAgent(task.agentId).name} • {new Date(task.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
