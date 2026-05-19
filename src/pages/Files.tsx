import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  Image,
  File,
  Trash2,
  Search,
  Sparkles,
  Eye,
  X,
  Edit2,
  Check,
  FolderOpen,
} from 'lucide-react';
import { getFiles, saveFile as saveFileRecord, deleteFile, renameFile, generateId } from '../lib/storage';
import { summarizeText } from '../lib/aiProvider';
import { UploadedFile } from '../types';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function Files() {
  const [files, setFiles] = useState<UploadedFile[]>(getFiles());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'text' | 'image' | 'other'>('all');
  const [preview, setPreview] = useState<UploadedFile | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast, showToast, hideToast } = useToast();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach(file => {
      const reader = new FileReader();
      const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.csv') || file.name.endsWith('.json');
      const isImage = file.type.startsWith('image/');

      reader.onload = () => {
        const fileRecord: UploadedFile = {
          id: generateId(),
          name: file.name,
          type: file.type || (isText ? 'text/plain' : 'application/octet-stream'),
          size: file.size,
          content: isText ? (reader.result as string) : undefined,
          dataUrl: isImage ? (reader.result as string) : undefined,
          uploadedAt: new Date().toISOString(),
        };
        saveFileRecord(fileRecord);
        setFiles(getFiles());
        showToast(`Uploaded: ${file.name}`, 'success');
      };

      if (isText) {
        reader.readAsText(file);
      } else if (isImage) {
        reader.readAsDataURL(file);
      } else {
        // Save metadata only for unsupported types
        const fileRecord: UploadedFile = {
          id: generateId(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };
        saveFileRecord(fileRecord);
        setFiles(getFiles());
        showToast(`Uploaded: ${file.name}`, 'success');
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (dt.files.length > 0 && fileInputRef.current) {
      const input = fileInputRef.current;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleDelete = (id: string) => {
    deleteFile(id);
    setFiles(getFiles());
    if (preview?.id === id) setPreview(null);
    showToast('File deleted', 'info');
  };

  const handleRename = (id: string) => {
    if (!renameValue.trim()) return;
    renameFile(id, renameValue.trim());
    setFiles(getFiles());
    setRenamingId(null);
    showToast('File renamed', 'success');
  };

  const handleSummarize = async (content: string) => {
    if (!content) return;
    setIsSummarizing(true);
    setAiSummary('');
    try {
      const summary = await summarizeText(content);
      setAiSummary(summary);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Summarization failed';
      setAiSummary(`⚠️ ${errMsg}`);
      showToast(errMsg, 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredFiles = files.filter(f => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'text' && !f.type.startsWith('text/') && !f.name.match(/\.(txt|md|csv|json)$/)) return false;
    if (filter === 'image' && !f.type.startsWith('image/')) return false;
    if (filter === 'other' && (f.type.startsWith('text/') || f.type.startsWith('image/'))) return false;
    return true;
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('text/') || type.includes('json')) return FileText;
    return File;
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-2">File Manager</h1>
        <p className="text-sm text-zinc-400 mb-6">Upload and manage your local files</p>
      </motion.div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="glass rounded-2xl p-8 text-center border-2 border-dashed border-white/10 hover:border-[#ff7a00]/30 transition-all mb-6 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-10 h-10 text-[#ff7a00] mx-auto mb-3" />
        <p className="text-sm text-white mb-1">Click or drag files here to upload</p>
        <p className="text-xs text-zinc-500">Supports text, images, and other files</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="bg-transparent flex-1 text-sm text-white outline-none placeholder-zinc-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
        >
          <option value="all" className="bg-[#111]">All</option>
          <option value="text" className="bg-[#111]">Text</option>
          <option value="image" className="bg-[#111]">Images</option>
          <option value="other" className="bg-[#111]">Other</option>
        </select>
      </div>

      {/* File List */}
      {filteredFiles.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No files uploaded"
          description="Upload text files, images, or documents to manage them here"
        />
      ) : (
        <div className="space-y-2">
          {filteredFiles.map(file => {
            const Icon = getFileIcon(file.type);
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-3 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Icon className="w-5 h-5 text-[#ff7a00] shrink-0" />
                  <div className="min-w-0 flex-1">
                    {renamingId === file.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="bg-white/10 rounded px-2 py-1 text-sm text-white outline-none flex-1"
                          onKeyDown={(e) => e.key === 'Enter' && handleRename(file.id)}
                          autoFocus
                        />
                        <button onClick={() => handleRename(file.id)} className="text-green-400"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setRenamingId(null)} className="text-zinc-400"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <p className="text-sm text-white truncate">{file.name}</p>
                    )}
                    <p className="text-xs text-zinc-500">{formatSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(file.content || file.dataUrl) && (
                    <button onClick={() => { setPreview(file); setAiSummary(''); }} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400">
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {file.content && (
                    <button onClick={() => handleSummarize(file.content!)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400">
                      <Sparkles className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => { setRenamingId(file.id); setRenameValue(file.name); }} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(file.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] rounded-2xl p-5 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">{preview.name}</h3>
              <button onClick={() => setPreview(null)} className="text-zinc-400"><X className="w-5 h-5" /></button>
            </div>
            {preview.dataUrl && (
              <img src={preview.dataUrl} alt={preview.name} className="w-full rounded-xl mb-4" />
            )}
            {preview.content && (
              <pre className="text-xs text-zinc-300 whitespace-pre-wrap bg-white/5 rounded-xl p-3 max-h-60 overflow-y-auto">
                {preview.content.substring(0, 5000)}
              </pre>
            )}
            {preview.content && (
              <button
                onClick={() => handleSummarize(preview.content!)}
                className="mt-3 px-4 py-2 bg-[#ff7a00]/10 text-[#ff7a00] rounded-xl text-xs font-medium flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3" /> Summarize with AI
              </button>
            )}
            {!preview.content && !preview.dataUrl && (
              <p className="text-sm text-zinc-500">Preview not available for this file type.</p>
            )}
          </motion.div>
        </div>
      )}

      {/* AI Summary */}
      {isSummarizing && <LoadingState message="Summarizing with AI..." />}
      {aiSummary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass rounded-2xl p-4"
        >
          <h4 className="text-sm font-semibold text-white mb-2">AI Summary</h4>
          <p className="text-sm text-zinc-300 whitespace-pre-wrap">{aiSummary}</p>
        </motion.div>
      )}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}
