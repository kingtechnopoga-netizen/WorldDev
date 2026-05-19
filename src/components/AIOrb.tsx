import { motion } from 'framer-motion';

interface AIORBProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export default function AIOrb({ size = 'md', animate = true }: AIORBProps) {
  const sizes = { sm: 'w-8 h-8', md: 'w-16 h-16', lg: 'w-24 h-24' };

  return (
    <motion.div
      animate={animate ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className={`${sizes[size]} relative rounded-full flex items-center justify-center`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff7a00] to-[#ffb000] opacity-30 blur-xl" />
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#ff7a00] to-[#ffb000] opacity-60" />
      <div className="absolute inset-2 rounded-full bg-[#111] flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#ff7a00] animate-pulse" />
      </div>
    </motion.div>
  );
}
