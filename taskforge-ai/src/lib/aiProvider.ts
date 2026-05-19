/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    puter: any;
  }
}

function isPuterAvailable(): boolean {
  return typeof window !== 'undefined' && window.puter && window.puter.ai;
}

export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
  if (!isPuterAvailable()) {
    throw new Error('AI provider unavailable. Please check Puter.js connection. Make sure you are running this app in a browser with internet access.');
  }

  try {
    const messages: any[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await window.puter.ai.chat(messages);
    
    if (response && typeof response === 'string') {
      return response;
    }
    if (response && response.message && response.message.content) {
      return response.message.content;
    }
    if (response && response.text) {
      return response.text;
    }
    if (response && typeof response === 'object') {
      // Try to extract text from various response formats
      const text = response.content || response.result || response.output || JSON.stringify(response);
      return text;
    }
    throw new Error('Unexpected AI response format');
  } catch (error: any) {
    if (error.message?.includes('AI provider unavailable')) {
      throw error;
    }
    throw new Error(`AI generation failed: ${error.message || 'Unknown error'}`);
  }
}

export async function summarizeText(text: string): Promise<string> {
  return generateText(
    `Please summarize the following text concisely, keeping the key points:\n\n${text}`,
    'You are a helpful summarizer. Create clear, concise summaries that capture the essential information.'
  );
}

export async function generateCaptions(topic: string): Promise<string> {
  return generateText(
    `Generate 10 engaging, viral-ready social media captions about: ${topic}. Number each caption. Make them catchy, emotional, and ready to copy-paste.`,
    'You are ContentGPT, an expert social media content creator. Create engaging, viral-ready, platform-friendly content.'
  );
}

export async function generateScript(topic: string): Promise<string> {
  return generateText(
    `Write a compelling 60-second video script about: ${topic}. Include hook, body, and call-to-action. Format it clearly with timestamps or sections.`,
    'You are ContentGPT, an expert social media content creator. Create engaging scripts that hook viewers in the first 3 seconds.'
  );
}

export async function generateLyrics(topic: string): Promise<string> {
  return generateText(
    `Write original song lyrics about: ${topic}. Include verse 1, chorus, verse 2, and bridge. Make it emotional and singable.`,
    'You are MusicGPT, an expert lyrics and song idea generator. Create original lyrics with strong hooks and emotional depth. Do not copy existing songs.'
  );
}

export async function generateWorkflow(task: string): Promise<string> {
  return generateText(
    `Design a step-by-step automation workflow for: ${task}. Include trigger, steps, actions, conditions, and expected output. Format as numbered steps.`,
    'You are AutomationGPT, an expert workflow designer. Break tasks into clear automation steps, triggers, actions, and outputs.'
  );
}

export async function improvePrompt(prompt: string): Promise<string> {
  return generateText(
    `Improve and enhance this prompt to get better AI results. Make it more specific, detailed, and effective:\n\nOriginal prompt: "${prompt}"\n\nProvide the improved prompt only.`,
    'You are a prompt engineering expert. Enhance prompts to be more specific, structured, and effective for AI generation.'
  );
}

export async function translateText(text: string, language: string): Promise<string> {
  return generateText(
    `Translate the following text to ${language}. Provide only the translation:\n\n${text}`,
    'You are a professional translator. Provide accurate, natural-sounding translations.'
  );
}

export async function writeEmail(context: string): Promise<string> {
  return generateText(
    `Write a professional email based on this context: ${context}. Include subject line, greeting, body, and sign-off.`,
    'You are AssistantGPT, a professional email writer. Create clear, polite, and effective emails.'
  );
}

export async function createContentPlan(topic: string): Promise<string> {
  return generateText(
    `Create a 7-day content plan for: ${topic}. For each day, include: platform, content type, topic/angle, caption idea, and best posting time. Format as a clear schedule.`,
    'You are ContentGPT, an expert content strategist. Create actionable content plans with specific ideas for each day.'
  );
}

// Offline sample responses (only used when user explicitly enables sample mode)
export const sampleResponses: Record<string, string> = {
  captions: `1. "The shadows whisper secrets only the brave dare to hear... 👻🖤"\n2. "What lurks in the dark isn't always what you think... 😱"\n3. "Some stories are better left untold. This isn't one of them. 💀"\n4. "The last thing she heard before the lights went out... 🕯️"\n5. "Every haunted house has a story. This one has a warning. ⚠️👁️"\n\n[SAMPLE MODE - This is a pre-written example, not real AI generation]`,
  lyrics: `[Verse 1]\nIn the silence of the night\nI hear your voice fade away\nEvery memory burns so bright\nBut you're gone, gone to stay\n\n[Chorus]\nWhy did you leave without goodbye\nLeft me drowning in these tears I cry\nThe stars don't shine the same above\nSince I lost your love\n\n[SAMPLE MODE - This is a pre-written example, not real AI generation]`,
  workflow: `Step 1: TRIGGER - New content request received\nStep 2: INPUT - Gather topic, platform, and audience info\nStep 3: GENERATE - AI creates initial content draft\nStep 4: REVIEW - Check content quality and tone\nStep 5: OPTIMIZE - Adjust for platform best practices\nStep 6: OUTPUT - Deliver final content ready to publish\n\n[SAMPLE MODE - This is a pre-written example, not real AI generation]`,
  default: `This is a sample response generated in offline mode. Enable Puter.js connection for real AI generation.\n\n[SAMPLE MODE - Not real AI output]`,
};
