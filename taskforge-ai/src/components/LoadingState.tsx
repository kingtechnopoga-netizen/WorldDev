import { motion } from 'framer-motion';
import AIOrb from './AIOrb';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Generating...' }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-8 gap-4"
    >
      <AIOrb size="md" animate={true} />
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 rounded-full bg-[#ff7a00]"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-[#ff7a00]"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-[#ff7a00]"
          />
        </div>
        <span className="text-sm text-zinc-400">{message}</span>
      </div>
    </motion.div>
  );
}
