import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIProvider } from "@/lib/ai/models";

interface SettingsState {
  provider: AIProvider;
  model: string;
  apiKeys: Record<AIProvider, string>;
  theme: "light" | "dark" | "system";
  
  setProvider: (provider: AIProvider) => void;
  setModel: (model: string) => void;
  setApiKey: (provider: AIProvider, key: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  getApiKey: (provider: AIProvider) => string | undefined;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      provider: "openai",
      model: "gpt-4o",
      apiKeys: {} as Record<AIProvider, string>,
      theme: "system",

      setProvider: (provider) => set({ provider }),
      setModel: (model) => set({ model }),
      setApiKey: (provider, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key },
        })),
      setTheme: (theme) => set({ theme }),
      getApiKey: (provider) => get().apiKeys[provider],
    }),
    {
      name: "synapse-settings",
      partialize: (state) => ({
        provider: state.provider,
        model: state.model,
        theme: state.theme,
      }),
    }
  )
);
