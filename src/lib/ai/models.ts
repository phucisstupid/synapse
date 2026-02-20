export type AIProvider = "openai" | "anthropic" | "google" | "deepseek";

export interface ProviderConfig {
  id: AIProvider;
  name: string;
  baseUrl?: string;
  models: ModelConfig[];
  apiKeyPrefix?: string;
  docsUrl: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  description?: string;
  maxTokens: number;
  supportsVision?: boolean;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "gpt-4o", name: "GPT-4o", maxTokens: 128000, supportsVision: true },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", maxTokens: 128000 },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", maxTokens: 128000, supportsVision: true },
      { id: "o1", name: "o1", maxTokens: 200000 },
      { id: "o1-mini", name: "o1 Mini", maxTokens: 128000 },
    ],
    apiKeyPrefix: "sk-",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", maxTokens: 200000, supportsVision: true },
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", maxTokens: 200000, supportsVision: true },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", maxTokens: 200000 },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus", maxTokens: 200000, supportsVision: true },
    ],
    apiKeyPrefix: "sk-ant-",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "google",
    name: "Google AI",
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", maxTokens: 1000000, supportsVision: true },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", maxTokens: 2000000, supportsVision: true },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", maxTokens: 1000000, supportsVision: true },
    ],
    docsUrl: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat", maxTokens: 64000 },
      { id: "deepseek-reasoner", name: "DeepSeek Reasoner", maxTokens: 64000 },
    ],
    apiKeyPrefix: "sk-",
    docsUrl: "https://platform.deepseek.com/api_keys",
  },
];

export function getProviderConfig(provider: AIProvider): ProviderConfig | undefined {
  return PROVIDERS.find((p) => p.id === provider);
}

export function getModelConfig(provider: AIProvider, modelId: string): ModelConfig | undefined {
  const config = getProviderConfig(provider);
  return config?.models.find((m) => m.id === modelId);
}
