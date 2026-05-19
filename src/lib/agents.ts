import { Agent } from '../types';

export const agents: Agent[] = [
  {
    id: 'content-gpt',
    name: 'ContentGPT',
    purpose: 'Captions, posts, scripts, blogs',
    icon: '✍️',
    systemPrompt: 'You are ContentGPT, an expert social media content creator. Create engaging, viral-ready, platform-friendly content. Keep outputs useful, clear, and ready to copy.',
    examples: [
      'Generate 10 viral Facebook Reel captions about horror stories',
      'Write a 60-second emotional story script',
      'Create 5 Instagram carousel ideas for entrepreneurs',
      'Write a YouTube video intro hook',
    ],
  },
  {
    id: 'music-gpt',
    name: 'MusicGPT',
    purpose: 'Lyrics, song ideas, chorus, verses, music prompts',
    icon: '🎵',
    systemPrompt: 'You are MusicGPT, an expert lyrics and song idea generator. Create original lyrics, song concepts, hooks, verses, chorus, and music prompts. Do not copy existing songs.',
    examples: [
      'Create sad OPM-style lyrics about lost love',
      'Write a rap verse about hustle and dreams',
      'Generate a pop chorus hook about summer nights',
      'Create a country song concept about small town life',
    ],
  },
  {
    id: 'code-gpt',
    name: 'CodeGPT',
    purpose: 'Website ideas, code help, app planning',
    icon: '💻',
    systemPrompt: 'You are CodeGPT, a practical coding assistant. Help build websites, apps, prompts, and technical plans with clean steps.',
    examples: [
      'Create a landing page structure for a SaaS product',
      'Help me plan a React Native app for habit tracking',
      'Write a Python script to organize files by date',
      'Explain how to set up a REST API with Node.js',
    ],
  },
  {
    id: 'marketing-gpt',
    name: 'MarketingGPT',
    purpose: 'Ads, product copy, sales captions',
    icon: '📈',
    systemPrompt: 'You are MarketingGPT, an expert in ads, sales copy, hooks, and product campaigns. Create persuasive but honest marketing content.',
    examples: [
      'Write a Facebook ad copy for a fitness app',
      'Create 5 email subject lines for a product launch',
      'Generate a product description for wireless earbuds',
      'Write a landing page headline for a cooking course',
    ],
  },
  {
    id: 'research-gpt',
    name: 'ResearchGPT',
    purpose: 'Summaries, organized notes, explanations',
    icon: '🔬',
    systemPrompt: 'You are ResearchGPT, a summarizer and organizer. Make clear summaries, bullet points, explanations, and study notes.',
    examples: [
      'Summarize the key concepts of machine learning',
      'Create study notes on climate change',
      'Explain blockchain in simple terms',
      'Organize these ideas into a structured outline',
    ],
  },
  {
    id: 'automation-gpt',
    name: 'AutomationGPT',
    purpose: 'Workflow steps and task automation planning',
    icon: '⚙️',
    systemPrompt: 'You are AutomationGPT, an expert workflow designer. Break tasks into clear automation steps, triggers, actions, and outputs.',
    examples: [
      'Design a content publishing workflow',
      'Create a customer onboarding automation plan',
      'Build a social media scheduling workflow',
      'Plan an email marketing automation sequence',
    ],
  },
  {
    id: 'assistant-gpt',
    name: 'AssistantGPT',
    purpose: 'General tasks, emails, productivity',
    icon: '🤖',
    systemPrompt: 'You are AssistantGPT, a general productivity assistant. Help with writing, planning, organizing, and daily tasks.',
    examples: [
      'Write a professional email to reschedule a meeting',
      'Create a weekly planner template',
      'Help me organize my project priorities',
      'Draft a thank you note for a colleague',
    ],
  },
];

export function getAgent(id: string): Agent {
  return agents.find(a => a.id === id) || agents[6];
}
