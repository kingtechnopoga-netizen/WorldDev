import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Brain, Workflow, Shield, ArrowRight } from 'lucide-react';
import AIOrb from '../components/AIOrb';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: Brain, title: 'AI Agents', desc: '7 specialized AI agents for any task' },
    { icon: Workflow, title: 'Automation', desc: 'Build real AI workflows' },
    { icon: Shield, title: 'No API Key', desc: 'Powered by Puter.js — free' },
    { icon: Zap, title: 'Instant', desc: 'Generate content in seconds' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="flex justify-center mb-6">
          <AIOrb size="lg" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          TASKFORGE{' '}
          <span className="text-[#ff7a00] glow-text">AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-zinc-400 mb-8"
        >
          No-key AI automation workspace for creators, builders, and productivity.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          className="px-8 py-4 bg-gradient-to-r from-[#ff7a00] to-[#ffb000] text-black font-bold rounded-2xl text-lg flex items-center gap-2 mx-auto glow-orange"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="glass rounded-2xl p-4 text-center"
            >
              <f.icon className="w-8 h-8 text-[#ff7a00] mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-white">{f.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-xs text-zinc-600 mt-12">
          Powered by Puter.js • No API key required • Works in your browser
        </p>
      </motion.div>
    </div>
  );
}
