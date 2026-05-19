# TASKFORGE AI

> No-key AI automation workspace for creators, builders, and productivity.

**This app uses Puter.js for no-api-key AI generation. No OpenAI, Gemini, or paid API key is required.**

## Features

- **AI Chat Workspace** — Real AI conversations powered by Puter.js
- **7 AI Agents** — ContentGPT, MusicGPT, CodeGPT, MarketingGPT, ResearchGPT, AutomationGPT, AssistantGPT
- **Automation Builder** — Create and run AI-powered workflows
- **File Manager** — Upload, preview, and AI-summarize local files
- **Task History** — Full history of all AI tasks
- **Saved Outputs** — Bookmark and export AI results
- **No API Key Required** — Everything runs in the browser via Puter.js
- **Mobile-First Design** — Beautiful on Android/iOS
- **PWA Support** — Install as a mobile app
- **Data Export/Import** — Full JSON backup and restore
- **Offline Sample Mode** — Optional pre-written examples (clearly labeled)

## How Puter.js Works

Puter.js is loaded via a script tag in `index.html`. It provides free AI generation directly in the browser without requiring any API key, backend server, or account setup. The AI calls go through Puter's infrastructure.

- No `.env` file needed
- No server-side code
- No paid subscriptions
- Works immediately in any modern browser

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- Lucide React Icons
- Puter.js (AI provider)
- localStorage (data persistence)
- Browser File API (file uploads)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the `dist` folder to Netlify
```

### Render
1. Connect your GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`

## PWA Support

The app includes a `manifest.json` for PWA installation. To fully enable offline support, add a service worker (e.g., via `vite-plugin-pwa`).

## Limitations

- AI generation requires internet connection (Puter.js cloud)
- Image/PDF AI analysis not available in no-key mode
- Large file storage limited by browser localStorage (~5-10MB)
- No real-time collaboration (local-only data)

## Expanding Later

- Add `vite-plugin-pwa` for full offline support
- Connect to Supabase/Firebase for cloud sync
- Add additional AI providers (with optional API keys)
- Implement team collaboration features
- Add more automation block types

## License

MIT
