# Synapse - AI Study Assistant

A cross-platform desktop study app powered by multiple AI providers.

## Features

- **AI Tutor/Chat** - Streaming responses, conversation history
- **Quiz Generator** - AI-generated multiple choice quizzes with explanations
- **Flashcards** - AI-generated flashcards with flip animation
- **Document Analysis** - Upload docs, get summaries & study questions
- **Study Planner** - AI-generated study schedules with progress tracking

## Tech Stack

- **Desktop**: Tauri 2.10
- **Frontend**: React 19, TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **UI**: Radix UI + shadcn/ui
- **State**: Zustand 5
- **AI**: Vercel AI SDK 6

## AI Providers

- OpenAI (GPT-4o, GPT-4-turbo, o1)
- Anthropic (Claude 3.5 Sonnet, Opus, Haiku)
- Google (Gemini 2.0 Flash, Gemini 1.5 Pro)
- DeepSeek (DeepSeek Chat, DeepSeek Reasoner)

## Getting Started

```bash
# Install dependencies
bun install

# Run in development
bun run tauri dev

# Build for production
bun run tauri build
```

## Configuration

1. Open Settings in the app
2. Add your API key for your preferred provider
3. Select your model
4. Start studying!

## License

MIT
