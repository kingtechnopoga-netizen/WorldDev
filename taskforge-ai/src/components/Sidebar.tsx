import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Workflow,
  FolderOpen,
  History,
  Bookmark,
  Settings,
} from 'lucide-react';
import AIOrb from './AIOrb';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { to: '/agents', icon: Users, label: 'Agents' },
  { to: '/automation', icon: Workflow, label: 'Automation' },
  { to: '/files', icon: FolderOpen, label: 'Files' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/saved', icon: Bookmark, label: 'Saved' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0a0a0a] border-r border-white/8 z-40">
      <div className="p-5 flex items-center gap-3 border-b border-white/8">
        <AIOrb size="sm" />
        <div>
          <h1 className="text-lg font-bold text-white">TASKFORGE</h1>
          <p className="text-xs text-[#ff7a00]">AI</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/8">
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-zinc-400">Powered by</p>
          <p className="text-sm font-semibold text-[#ff7a00]">Puter.js AI</p>
          <p className="text-xs text-zinc-500 mt-1">No API key needed</p>
        </div>
      </div>
    </aside>
  );
}
