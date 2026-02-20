import { useSettingsStore } from "@/lib/store";
import { PROVIDERS } from "@/lib/ai/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Header() {
  const { provider, model, setProvider, setModel } = useSettingsStore();
  const providerConfig = PROVIDERS.find((p) => p.id === provider);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <h1 className="text-lg font-semibold">AI Study Assistant</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Select
            value={provider}
            onValueChange={(v) => {
              setProvider(v as any);
              const defaultModel = PROVIDERS.find((p) => p.id === v)?.models[0];
              if (defaultModel) setModel(defaultModel.id);
            }}
          >
            <SelectTrigger className="w-32">
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

          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {providerConfig?.models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
