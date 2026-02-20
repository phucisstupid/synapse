import { useState } from "react";
import { Sparkles, BookPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizStore, useSettingsStore } from "@/lib/store";
import { createAIClient } from "@/lib/ai";
import type { QuizQuestion } from "@/lib/store/quiz-store";

export function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const { createQuiz } = useQuizStore();
  const { provider, model, getApiKey } = useSettingsStore();

  const generateQuiz = async () => {
    if (!topic.trim()) return;

    const apiKey = getApiKey(provider);
    if (!apiKey) {
      alert("Please add your API key in Settings");
      return;
    }

    setIsLoading(true);
    try {
      const client = createAIClient({ provider, apiKey, model });
      const questions = await client.generateQuiz(topic, count);

      const quizQuestions: QuizQuestion[] = questions.map((q) => ({
        id: crypto.randomUUID(),
        ...q,
      }));

      createQuiz(topic, quizQuestions);
      setTopic("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to generate quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., World War II, Photosynthesis, Calculus..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="count">Number of Questions</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 5)}
          />
        </div>
        <Button
          onClick={generateQuiz}
          disabled={!topic.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <BookPlus className="mr-2 h-4 w-4" />
              Generate Quiz
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
