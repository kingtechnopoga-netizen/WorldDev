import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}

export default function StatCard({ icon: Icon, label, value, color = '#ff7a00' }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-2xl p-4 flex items-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-400">{label}</p>
      </div>
    </motion.div>
  );
}
