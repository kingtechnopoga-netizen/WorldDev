import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, MessageSquare } from 'lucide-react';
import { agents } from '../lib/agents';
import { getProfile, saveProfile } from '../lib/storage';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function Agents() {
  const navigate = useNavigate();
  const profile = getProfile();
  const [selectedId, setSelectedId] = useState(profile?.selectedAgent || 'assistant-gpt');
  const { toast, showToast, hideToast } = useToast();

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (profile) {
      saveProfile({ ...profile, selectedAgent: id });
    }
    showToast(`Agent switched to ${agents.find(a => a.id === id)?.name}`, 'success');
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-2">AI Agents</h1>
        <p className="text-sm text-zinc-400 mb-6">Choose a specialized AI agent for your task</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className={`glass rounded-2xl p-5 cursor-pointer transition-all ${
              selectedId === agent.id ? 'border border-[#ff7a00]/50 glow-orange' : ''
            }`}
            onClick={() => handleSelect(agent.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{agent.icon}</div>
              {selectedId === agent.id && (
                <CheckCircle className="w-5 h-5 text-[#ff7a00]" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{agent.name}</h3>
            <p className="text-sm text-zinc-400 mb-4">{agent.purpose}</p>

            <div className="space-y-2">
              <p className="text-xs text-zinc-500 font-medium">Example tasks:</p>
              {agent.examples.slice(0, 2).map((ex, idx) => (
                <p key={idx} className="text-xs text-zinc-400 truncate">• {ex}</p>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(agent.id);
                navigate('/chat');
              }}
              className="mt-4 w-full py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-zinc-300 hover:bg-[#ff7a00]/10 hover:border-[#ff7a00]/30 hover:text-[#ff7a00] transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3 h-3" /> Chat with {agent.name}
            </button>
          </motion.div>
        ))}
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}
