import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import AIOrb from '../components/AIOrb';
import { saveProfile } from '../lib/storage';

export default function Login() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleGuest = () => {
    const displayName = name.trim() || 'Guest User';
    saveProfile({
      name: displayName,
      createdAt: new Date().toISOString(),
      selectedAgent: 'assistant-gpt',
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <AIOrb size="md" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Welcome to TASKFORGE AI
        </h1>
        <p className="text-sm text-zinc-400 text-center mb-8">
          Set up your workspace — no account required
        </p>

        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Display Name (optional)</label>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 focus-within:border-[#ff7a00]/50">
              <User className="w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="bg-transparent flex-1 text-white placeholder-zinc-500 outline-none text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleGuest()}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGuest}
            className="w-full py-4 bg-gradient-to-r from-[#ff7a00] to-[#ffb000] text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2"
          >
            Continue as Guest <ArrowRight className="w-4 h-4" />
          </motion.button>

          <div className="text-center">
            <p className="text-xs text-zinc-500">
              Your data is stored locally in your browser.
              <br />
              No account, no server, no API key needed.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
