import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Trash2, Download, Bookmark } from 'lucide-react';
import { getSavedOutputs, deleteSavedOutput } from '../lib/storage';
import { getAgent } from '../lib/agents';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function Saved() {
  const [outputs, setOutputs] = useState(getSavedOutputs());
  const { toast, showToast, hideToast } = useToast();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast('Copied to clipboard', 'success');
  };

  const handleDelete = (id: string) => {
    deleteSavedOutput(id);
    setOutputs(getSavedOutputs());
    showToast('Deleted', 'info');
  };

  const handleDownload = (output: { title: string; content: string }) => {
    const blob = new Blob([output.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${output.title.replace(/[^a-z0-9]/gi, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded as .txt', 'success');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-2">Saved Outputs</h1>
        <p className="text-sm text-zinc-400 mb-6">{outputs.length} saved items</p>
      </motion.div>

      {outputs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved outputs"
          description="Save AI-generated content from chat or workflows to access them here"
        />
      ) : (
        <div className="space-y-3">
          {outputs.map((output) => (
            <motion.div
              key={output.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-white">{output.title}</p>
                  <p className="text-xs text-zinc-500">
                    {getAgent(output.agentId).name} • {output.type} • {new Date(output.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-sm text-zinc-300 whitespace-pre-wrap max-h-40 overflow-y-auto bg-white/5 rounded-xl p-3 mb-3">
                {output.content}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(output.content)}
                  className="px-3 py-1.5 text-xs bg-white/5 rounded-lg text-zinc-300 hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
                <button
                  onClick={() => handleDownload(output)}
                  className="px-3 py-1.5 text-xs bg-white/5 rounded-lg text-zinc-300 hover:text-white flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
                <button
                  onClick={() => handleDelete(output.id)}
                  className="px-3 py-1.5 text-xs bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}
