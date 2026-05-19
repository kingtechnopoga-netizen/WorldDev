import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Download, Upload, Trash2, AlertCircle } from 'lucide-react';
import { getSettings, saveSettings, getProfile, saveProfile, exportAllData, importAllData, clearAllData } from '../lib/storage';
import { agents } from '../lib/agents';
import { AppSettings } from '../types';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const profile = getProfile();
  const [displayName, setDisplayName] = useState(profile?.name || '');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const { toast, showToast, hideToast } = useToast();

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleSaveName = () => {
    if (profile) {
      saveProfile({ ...profile, name: displayName.trim() || 'Guest User' });
      showToast('Display name updated', 'success');
    }
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskforge-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported', 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const success = importAllData(reader.result as string);
      if (success) {
        showToast('Data imported successfully! Refresh to see changes.', 'success');
        setSettings(getSettings());
      } else {
        showToast('Import failed — invalid file format', 'error');
      }
    };
    reader.readAsText(file);
    if (importRef.current) importRef.current.value = '';
  };

  const handleClearAll = () => {
    clearAllData();
    showToast('All data cleared. Refresh the page.', 'info');
    setShowClearConfirm(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-sm text-zinc-400 mb-6">Configure your workspace preferences</p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Profile</h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-zinc-500 focus:border-[#ff7a00]/50"
            />
            <button
              onClick={handleSaveName}
              className="px-4 py-3 bg-[#ff7a00] text-black rounded-xl text-sm font-medium"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Settings */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-2">AI Configuration</h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Default Agent</p>
              <p className="text-xs text-zinc-500">Used for new tasks</p>
            </div>
            <select
              value={settings.defaultAgent}
              onChange={(e) => updateSetting('defaultAgent', e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id} className="bg-[#111]">{a.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Puter.js Enabled</p>
              <p className="text-xs text-zinc-500">Real AI generation via Puter.js</p>
            </div>
            <button
              onClick={() => updateSetting('puterEnabled', !settings.puterEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${settings.puterEnabled ? 'bg-[#ff7a00]' : 'bg-zinc-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.puterEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Offline Sample Mode</p>
              <p className="text-xs text-zinc-500">Use pre-written examples (not real AI)</p>
            </div>
            <button
              onClick={() => updateSetting('offlineSampleMode', !settings.offlineSampleMode)}
              className={`w-12 h-6 rounded-full transition-colors ${settings.offlineSampleMode ? 'bg-amber-500' : 'bg-zinc-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.offlineSampleMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {settings.offlineSampleMode && (
            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-400">
                Sample mode uses local example responses and is not real AI generation. Disable this for actual AI output via Puter.js.
              </p>
            </div>
          )}
        </div>

        {/* Display */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-2">Display</h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Accent Intensity</p>
              <p className="text-xs text-zinc-500">Glow and highlight strength</p>
            </div>
            <select
              value={settings.accentIntensity}
              onChange={(e) => updateSetting('accentIntensity', e.target.value as AppSettings['accentIntensity'])}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="low" className="bg-[#111]">Low</option>
              <option value="medium" className="bg-[#111]">Medium</option>
              <option value="high" className="bg-[#111]">High</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Mobile Compact Mode</p>
              <p className="text-xs text-zinc-500">Reduce spacing on mobile</p>
            </div>
            <button
              onClick={() => updateSetting('mobileCompact', !settings.mobileCompact)}
              className={`w-12 h-6 rounded-full transition-colors ${settings.mobileCompact ? 'bg-[#ff7a00]' : 'bg-zinc-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.mobileCompact ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Data */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-2">Data Management</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Export All Data
            </button>

            <button
              onClick={() => importRef.current?.click()}
              className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Import Data
            </button>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>

          <div className="pt-2">
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Clear All Local Data
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-3 bg-red-600 rounded-xl text-sm text-white font-medium"
                >
                  Confirm Delete All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 bg-white/5 rounded-xl text-sm text-zinc-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}
