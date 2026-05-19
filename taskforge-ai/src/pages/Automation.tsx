import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  AlertCircle,
  Workflow as WorkflowIcon,
} from 'lucide-react';
import { generateText, generateCaptions, generateLyrics, summarizeText, writeEmail } from '../lib/aiProvider';
import { getAgent, agents } from '../lib/agents';
import { getProfile, getWorkflows, saveWorkflow, saveTask, saveSavedOutput, getSettings, generateId } from '../lib/storage';
import { WorkflowBlock, Workflow } from '../types';
import Toast from '../components/Toast';
import EmptyState from '../components/EmptyState';
import { useToast } from '../hooks/useToast';

const blockTypes: { type: WorkflowBlock['type']; label: string }[] = [
  { type: 'trigger', label: 'Manual Trigger' },
  { type: 'input', label: 'Text Input' },
  { type: 'ai-generate', label: 'AI Generate' },
  { type: 'ai-summarize', label: 'AI Summarize' },
  { type: 'ai-captions', label: 'AI Captions' },
  { type: 'ai-lyrics', label: 'AI Lyrics' },
  { type: 'ai-email', label: 'AI Email Writer' },
  { type: 'save-output', label: 'Save Output' },
  { type: 'export-text', label: 'Export Text' },
];

export default function Automation() {
  const profile = getProfile();
  const settings = getSettings();
  const [workflows, setWorkflows] = useState<Workflow[]>(getWorkflows());
  const [workflowName, setWorkflowName] = useState('');
  const [blocks, setBlocks] = useState<WorkflowBlock[]>([
    { id: generateId(), type: 'trigger', label: 'Manual Trigger', config: {} },
  ]);
  const [selectedAgentId, setSelectedAgentId] = useState(profile?.selectedAgent || 'assistant-gpt');
  const [taskInput, setTaskInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runStatus, setRunStatus] = useState<string[]>([]);
  const [finalOutput, setFinalOutput] = useState('');
  const { toast, showToast, hideToast } = useToast();

  const addBlock = (type: WorkflowBlock['type'], label: string) => {
    setBlocks(prev => [...prev, { id: generateId(), type, label, config: {} }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const runWorkflow = async () => {
    if (!taskInput.trim()) {
      showToast('Please enter a task instruction', 'error');
      return;
    }
    if (blocks.length < 2) {
      showToast('Add at least one action block', 'error');
      return;
    }

    setIsRunning(true);
    setRunStatus([]);
    setFinalOutput('');
    const statuses: string[] = [];

    try {
      statuses.push('✓ Reading input...');
      setRunStatus([...statuses]);
      await new Promise(r => setTimeout(r, 500));

      statuses.push(`✓ Selecting agent: ${getAgent(selectedAgentId).name}`);
      setRunStatus([...statuses]);
      await new Promise(r => setTimeout(r, 500));

      let output = '';
      const agent = getAgent(selectedAgentId);

      for (const block of blocks) {
        if (block.type === 'trigger') continue;
        if (block.type === 'input') {
          statuses.push('✓ Processing text input...');
          setRunStatus([...statuses]);
          continue;
        }

        statuses.push(`⟳ Running: ${block.label}...`);
        setRunStatus([...statuses]);

        if (settings.offlineSampleMode) {
          await new Promise(r => setTimeout(r, 1000));
          output = `[SAMPLE MODE] Example output for ${block.label}\n\nThis is a sample result. Enable Puter.js for real AI generation.`;
        } else {
          switch (block.type) {
            case 'ai-generate':
              output = await generateText(taskInput, agent.systemPrompt);
              break;
            case 'ai-summarize':
              output = await summarizeText(taskInput);
              break;
            case 'ai-captions':
              output = await generateCaptions(taskInput);
              break;
            case 'ai-lyrics':
              output = await generateLyrics(taskInput);
              break;
            case 'ai-email':
              output = await writeEmail(taskInput);
              break;
            case 'save-output':
              if (output) {
                saveSavedOutput({
                  id: generateId(),
                  title: workflowName || taskInput.substring(0, 40),
                  content: output,
                  type: 'workflow',
                  agentId: selectedAgentId,
                  timestamp: new Date().toISOString(),
                });
              }
              break;
            case 'export-text':
              // handled after loop
              break;
          }
        }

        statuses[statuses.length - 1] = `✓ Completed: ${block.label}`;
        setRunStatus([...statuses]);
      }

      setFinalOutput(output);
      statuses.push('✓ Workflow completed!');
      setRunStatus([...statuses]);

      // Save task
      saveTask({
        id: generateId(),
        title: workflowName || `Workflow: ${taskInput.substring(0, 40)}`,
        agentId: selectedAgentId,
        prompt: taskInput,
        output,
        timestamp: new Date().toISOString(),
        status: 'completed',
        type: 'workflow',
      });

      // Save workflow
      const wf: Workflow = {
        id: generateId(),
        name: workflowName || `Workflow ${workflows.length + 1}`,
        blocks,
        agentId: selectedAgentId,
        createdAt: new Date().toISOString(),
        lastRun: new Date().toISOString(),
        lastOutput: output,
      };
      saveWorkflow(wf);
      setWorkflows(getWorkflows());
      showToast('Workflow completed successfully!', 'success');
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Workflow failed';
      statuses.push(`✗ Error: ${errMsg}`);
      setRunStatus([...statuses]);
      showToast(errMsg, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleExport = () => {
    if (!finalOutput) return;
    const blob = new Blob([finalOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName || 'workflow-output'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported as .txt', 'success');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-2">Automation Builder</h1>
        <p className="text-sm text-zinc-400 mb-6">Create and run AI-powered workflows</p>
      </motion.div>

      {/* Workflow Config */}
      <div className="glass rounded-2xl p-5 mb-6 space-y-4">
        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder="Workflow name (optional)"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-zinc-500 focus:border-[#ff7a00]/50"
        />

        <select
          value={selectedAgentId}
          onChange={(e) => setSelectedAgentId(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
        >
          {agents.map(a => (
            <option key={a.id} value={a.id} className="bg-[#111]">{a.icon} {a.name}</option>
          ))}
        </select>

        <textarea
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter task instruction (e.g., 'Generate 10 horror captions for Facebook Reels')"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-zinc-500 focus:border-[#ff7a00]/50 resize-none"
        />
      </div>

      {/* Blocks */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Workflow Blocks</h3>
        <div className="space-y-2">
          {blocks.map((block, idx) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 w-6">{idx + 1}.</span>
                <span className="text-sm text-white">{block.label}</span>
              </div>
              {idx > 0 && (
                <button onClick={() => removeBlock(block.id)} className="text-zinc-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {blockTypes.filter(bt => bt.type !== 'trigger').map(bt => (
            <button
              key={bt.type}
              onClick={() => addBlock(bt.type, bt.label)}
              className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-zinc-300 hover:border-[#ff7a00]/30 hover:text-[#ff7a00] flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Run */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={runWorkflow}
        disabled={isRunning}
        className="w-full py-4 bg-gradient-to-r from-[#ff7a00] to-[#ffb000] text-black font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
        {isRunning ? 'Running Workflow...' : 'Run Workflow'}
      </motion.button>

      {/* Run Status */}
      <AnimatePresence>
        {runStatus.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 glass rounded-2xl p-4"
          >
            <h4 className="text-sm font-medium text-white mb-3">Execution Log</h4>
            {runStatus.map((s, i) => (
              <p key={i} className={`text-xs mb-1 ${
                s.startsWith('✓') ? 'text-green-400' :
                s.startsWith('✗') ? 'text-red-400' :
                'text-amber-400'
              }`}>{s}</p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output */}
      {finalOutput && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white">Result</h4>
            <button onClick={handleExport} className="text-xs text-[#ff7a00] hover:underline">
              Export .txt
            </button>
          </div>
          <div className="text-sm text-zinc-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
            {finalOutput}
          </div>
        </motion.div>
      )}

      {/* Saved Workflows */}
      {workflows.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Workflow History</h3>
          <div className="space-y-2">
            {workflows.slice(0, 5).map(wf => (
              <div key={wf.id} className="glass rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{wf.name}</p>
                  <p className="text-xs text-zinc-500">{wf.blocks.length} blocks • {new Date(wf.createdAt).toLocaleDateString()}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {workflows.length === 0 && !isRunning && !finalOutput && (
        <div className="mt-8">
          <EmptyState
            icon={WorkflowIcon}
            title="No workflows yet"
            description="Configure blocks above and run your first AI workflow"
          />
        </div>
      )}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}
