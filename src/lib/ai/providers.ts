import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { AIProvider } from "./models";

export interface ProviderClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export function createProviderClient(
  provider: AIProvider,
  options: ProviderClientOptions
) {
  switch (provider) {
    case "openai":
      return createOpenAI({
        apiKey: options.apiKey,
      });

    case "anthropic":
      return createAnthropic({
        apiKey: options.apiKey,
      });

    case "google":
      return createGoogleGenerativeAI({
        apiKey: options.apiKey,
      });

    case "deepseek":
      return createOpenAI({
        apiKey: options.apiKey,
        baseURL: "https://api.deepseek.com/v1",
      });

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export type ProviderClient = ReturnType<typeof createProviderClient>;
