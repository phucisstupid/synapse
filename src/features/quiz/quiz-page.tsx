import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizGenerator } from "./components/quiz-generator";
import { QuizView } from "./components/quiz-view";
import { FlashcardView } from "./components/flashcard-view";
import { useQuizStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Layers } from "lucide-react";

export function QuizPage() {
  const { quizzes } = useQuizStore();
  const incompleteQuizzes = quizzes.filter((q) => !q.completedAt);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <Tabs defaultValue="quiz" className="w-full">
        <TabsList>
          <TabsTrigger value="quiz">
            <BookOpen className="mr-2 h-4 w-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="flashcards">
            <Layers className="mr-2 h-4 w-4" />
            Flashcards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <QuizGenerator />
            {incompleteQuizzes[0] && <QuizView quiz={incompleteQuizzes[0]} />}
          </div>
        </TabsContent>

        <TabsContent value="flashcards" className="mt-4">
          <FlashcardView />
        </TabsContent>
      </Tabs>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">Recent Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {quizzes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No quizzes yet. Generate one to get started!
              </p>
            ) : (
              <div className="space-y-2">
                {quizzes.slice(0, 10).map((quiz) => (
                  <div
                    key={quiz.id}
                    className="rounded-lg border p-3 text-sm"
                  >
                    <p className="font-medium">{quiz.topic}</p>
                    <p className="text-muted-foreground">
                      {quiz.questions.length} questions
                      {quiz.score !== undefined && ` • ${quiz.score}%`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
