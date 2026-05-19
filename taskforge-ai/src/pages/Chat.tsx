import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Copy,
  Bookmark,
  Trash2,
  Plus,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { generateText, sampleResponses } from '../lib/aiProvider';
import { agents, getAgent } from '../lib/agents';
import {
  getProfile,
  getConversations,
  saveConversation,
  saveSavedOutput,
  saveTask,
  getSettings,
  generateId,
} from '../lib/storage';
import { ChatMessage, Conversation } from '../types';
import Toast from '../components/Toast';
import LoadingState from '../components/LoadingState';
import { useToast } from '../hooks/useToast';

const promptSuggestions = [
  'Generate 10 viral Facebook Reel captions about horror stories',
  'Write a 60-second emotional story script',
  'Create sad OPM-style lyrics',
  'Summarize this text for me',
  'Make a business idea for an online store',
  'Create AI video prompts for YouTube Shorts',
  'Write a professional email to a client',
  'Build an automation workflow for content publishing',
];

export default function Chat() {
  const [searchParams] = useSearchParams();
  const template = searchParams.get('template');

  const profile = getProfile();
  const settings = getSettings();
  const [selectedAgentId, setSelectedAgentId] = useState(profile?.selectedAgent || 'assistant-gpt');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(generateId());
  const [copied, setCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (template) {
      const templates: Record<string, string> = {
        captions: 'Generate 10 viral social media captions about ',
        script: 'Write a compelling 60-second video script about ',
        summarize: 'Please summarize the following text:\n\n',
        lyrics: 'Write original song lyrics about ',
        email: 'Write a professional email about ',
      };
      setInput(templates[template] || '');
    }
  }, [template]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
      agentId: selectedAgentId,
    };

    setMessages(prev => [...prev, userMsg]);
    const prompt = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const agent = getAgent(selectedAgentId);
      let response: string;

      if (settings.offlineSampleMode) {
        // Offline sample mode - clearly labeled
        await new Promise(resolve => setTimeout(resolve, 1000));
        response = sampleResponses.default;
        if (prompt.toLowerCase().includes('caption')) response = sampleResponses.captions;
        else if (prompt.toLowerCase().includes('lyric')) response = sampleResponses.lyrics;
        else if (prompt.toLowerCase().includes('workflow')) response = sampleResponses.workflow;
      } else {
        response = await generateText(prompt, agent.systemPrompt);
      }

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        agentId: selectedAgentId,
      };

      const updatedMessages = [...messages, userMsg, assistantMsg];
      setMessages(updatedMessages);

      // Save conversation
      const conv: Conversation = {
        id: conversationId,
        title: prompt.substring(0, 50),
        messages: updatedMessages,
        agentId: selectedAgentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveConversation(conv);

      // Save task record
      saveTask({
        id: generateId(),
        title: prompt.substring(0, 60),
        agentId: selectedAgentId,
        prompt,
        output: response,
        timestamp: new Date().toISOString(),
        status: 'completed',
        type: 'chat',
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'AI generation failed';
      const errorAssistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `⚠️ ${errMsg}`,
        timestamp: new Date().toISOString(),
        agentId: selectedAgentId,
      };
      setMessages(prev => [...prev, errorAssistantMsg]);
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    showToast('Copied to clipboard', 'success');
  };

  const handleSave = (content: string) => {
    saveSavedOutput({
      id: generateId(),
      title: content.substring(0, 50),
      content,
      type: 'chat',
      agentId: selectedAgentId,
      timestamp: new Date().toISOString(),
    });
    showToast('Output saved!', 'success');
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(generateId());
    setInput('');
  };

  const handleLoadConversation = (conv: Conversation) => {
    setMessages(conv.messages);
    setConversationId(conv.id);
    setSelectedAgentId(conv.agentId);
  };

  const conversations = getConversations();
  const currentAgent = getAgent(selectedAgentId);

  return (
    <div className="h-screen md:h-[calc(100vh)] flex flex-col">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentAgent.icon}</span>
          <div>
            <h1 className="text-sm font-semibold text-white">{currentAgent.name}</h1>
            <p className="text-xs text-zinc-500">{currentAgent.purpose}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
          >
            {agents.map(a => (
              <option key={a.id} value={a.id} className="bg-[#111]">{a.icon} {a.name}</option>
            ))}
          </select>
          <button onClick={handleNewChat} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversation sidebar (desktop) */}
        <div className="hidden lg:block w-56 border-r border-white/8 overflow-y-auto p-2">
          <p className="text-xs text-zinc-500 px-2 py-1 font-medium">Recent Chats</p>
          {conversations.slice(0, 10).map(conv => (
            <button
              key={conv.id}
              onClick={() => handleLoadConversation(conv)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs truncate mb-1 ${
                conv.id === conversationId ? 'bg-[#ff7a00]/10 text-[#ff7a00]' : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              {conv.title}
            </button>
          ))}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-6 pb-20">
              <p className="text-zinc-500 text-sm">Start a conversation with {currentAgent.name}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg w-full">
                {promptSuggestions.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-left glass rounded-xl p-3 text-xs text-zinc-300 hover:border-[#ff7a00]/30 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] ${
                  msg.role === 'user'
                    ? 'bg-[#ff7a00]/10 border border-[#ff7a00]/20 rounded-2xl rounded-br-md'
                    : 'glass rounded-2xl rounded-bl-md'
                } p-4`}>
                  <div className="text-sm text-white whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && !msg.content.startsWith('⚠️') && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        {copied === msg.id ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copied === msg.id ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleSave(msg.content)}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <Bookmark className="w-3 h-3" /> Save
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && <LoadingState message="AI is thinking..." />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-white/8 bg-[#050505]">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#ff7a00]/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={`Ask ${currentAgent.name} anything...`}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-zinc-500"
              disabled={isLoading}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-[#ff7a00] to-[#ffb000] text-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </motion.button>
        </div>
        {settings.offlineSampleMode && (
          <p className="text-center text-xs text-amber-500 mt-2">
            ⚠️ Sample Mode is ON — responses are pre-written examples, not real AI
          </p>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}
