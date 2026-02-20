import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuizStore, useSettingsStore } from "@/lib/store";
import { createAIClient } from "@/lib/ai";
import { cn } from "@/lib/utils/cn";

export function FlashcardView() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const { flashcards, createDeck, addFlashcards } = useQuizStore();
  const { provider, model, getApiKey } = useSettingsStore();

  const generateFlashcards = async () => {
    if (!topic.trim()) return;

    const apiKey = getApiKey(provider);
    if (!apiKey) {
      alert("Please add your API key in Settings");
      return;
    }

    setIsLoading(true);
    try {
      const client = createAIClient({ provider, apiKey, model });
      const cards = await client.generateFlashcards(topic, count);
      const deckId = createDeck(topic);
      addFlashcards(
        deckId,
        cards.map((c) => ({ front: c.front, back: c.back }))
      );
      setTopic("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to generate flashcards");
    } finally {
      setIsLoading(false);
    }
  };

  const allFlashcards = flashcards;
  const currentCard = allFlashcards[currentCardIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((i) => (i + 1) % allFlashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((i) => (i - 1 + allFlashcards.length) % allFlashcards.length);
  };

  if (allFlashcards.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Flashcards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-topic">Topic</Label>
            <Input
              id="card-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Spanish vocabulary, Physics formulas..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-count">Number of Cards</Label>
            <Input
              id="card-count"
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 10)}
            />
          </div>
          <Button
            onClick={generateFlashcards}
            disabled={!topic.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Generate Flashcards"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="text-center text-sm text-muted-foreground">
        Card {currentCardIndex + 1} of {allFlashcards.length}
      </div>

      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={cn(
          "relative h-64 cursor-pointer perspective-1000",
          "[transform-style:preserve-3d] transition-transform duration-500",
          isFlipped && "[transform:rotateY(180deg)]"
        )}
      >
        <Card
          className={cn(
            "absolute inset-0 flex items-center justify-center p-6 text-center",
            "[backface-visibility:hidden]"
          )}
        >
          <p className="text-xl">{currentCard?.front}</p>
        </Card>
        <Card
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground p-6 text-center",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]"
          )}
        >
          <p className="text-xl">{currentCard?.back}</p>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => setIsFlipped(!isFlipped)}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Flip
        </Button>
        <Button variant="outline" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
