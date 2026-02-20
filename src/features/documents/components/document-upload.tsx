import { useState } from "react";
import { Upload, FileText, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsStore } from "@/lib/store";
import { createAIClient } from "@/lib/ai";

interface DocumentSummary {
  summary: string;
  keyPoints: string[];
  topics: string[];
  studyQuestions: string[];
}

export function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<DocumentSummary | null>(null);

  const { provider, model, getApiKey } = useSettingsStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setSummary(null);

    const text = await selectedFile.text();
    setContent(text.slice(0, 50000));
  };

  const analyzeDocument = async () => {
    if (!content) return;

    const apiKey = getApiKey(provider);
    if (!apiKey) {
      alert("Please add your API key in Settings");
      return;
    }

    setIsLoading(true);
    try {
      const client = createAIClient({ provider, apiKey, model });
      const result = await client.summarizeDocument(content);
      setSummary(result);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to analyze document",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-accent transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">TXT, MD, or PDF</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".txt,.md,.pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {file && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                File loaded: {(file.size / 1024).toFixed(1)} KB
              </p>
              <Button
                onClick={analyzeDocument}
                disabled={isLoading || !content}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Document
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">{summary.summary}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Key Points</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {summary.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Topics Covered</h4>
              <div className="flex flex-wrap gap-2">
                {summary.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Study Questions</h4>
              <ul className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                {summary.studyQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
