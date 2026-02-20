import { useState } from "react";
import { Key, ExternalLink, Check, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSettingsStore } from "@/lib/store";
import { PROVIDERS, type AIProvider } from "@/lib/ai/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SettingsPage() {
  const { provider, model, setProvider, setModel, apiKeys, setApiKey, theme, setTheme } = useSettingsStore();
  const [showKeys, setShowKeys] = useState<Record<AIProvider, boolean>>({} as any);

  const toggleShowKey = (p: AIProvider) => {
    setShowKeys((prev) => ({ ...prev, [p]: !prev[p] }));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-muted-foreground">
          Configure your AI providers and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>
            Your API keys are stored locally and never sent to our servers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {PROVIDERS.map((p) => (
            <div key={p.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${p.id}-key`}>{p.name}</Label>
                <a
                  href={p.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Get API Key <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id={`${p.id}-key`}
                    type={showKeys[p.id] ? "text" : "password"}
                    value={apiKeys[p.id] || ""}
                    onChange={(e) => setApiKey(p.id, e.target.value)}
                    placeholder={`Enter your ${p.name} API key`}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(p.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKeys[p.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {apiKeys[p.id] && (
                  <div className="flex items-center justify-center w-10 h-9 rounded-md bg-green-100 dark:bg-green-900">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Provider</CardTitle>
          <CardDescription>
            Choose your preferred AI provider and model.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={provider}
                onValueChange={(v) => {
                  setProvider(v as AIProvider);
                  const defaultModel = PROVIDERS.find((p) => p.id === v)?.models[0];
                  if (defaultModel) setModel(defaultModel.id);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.find((p) => p.id === provider)?.models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how Synapse looks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Synapse v0.1.0</p>
          <p>An AI-powered study assistant for students.</p>
          <p>
            Your data stays local. API keys are stored in your browser's local
            storage and all conversations are saved locally.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
