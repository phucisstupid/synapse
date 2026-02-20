import { useState } from "react";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizStore, type Quiz } from "@/lib/store";
import { cn } from "@/lib/utils/cn";

interface QuizViewProps {
  quiz: Quiz;
  onComplete?: () => void;
}

export function QuizView({ quiz }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const { updateQuizAnswer, completeQuiz } = useQuizStore();

  const currentQuestion = quiz.questions[currentIndex];
  const isAnswered = currentQuestion.userAnswer !== undefined;
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;
    updateQuizAnswer(quiz.id, currentQuestion.id, answerIndex);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const correct = quiz.questions.filter(
        (q) => q.userAnswer === q.correctIndex,
      ).length;
      const score = Math.round((correct / quiz.questions.length) * 100);
      completeQuiz(quiz.id, score);
      setShowResult(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowResult(false);
  };

  if (showResult) {
    const correct = quiz.questions.filter(
      (q) => q.userAnswer === q.correctIndex,
    ).length;
    const score = Math.round((correct / quiz.questions.length) * 100);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete: {quiz.topic}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-5xl font-bold">{score}%</div>
            <p className="mt-2 text-muted-foreground">
              {correct} out of {quiz.questions.length} correct
            </p>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((q) => (
              <div
                key={q.id}
                className={cn(
                  "rounded-lg border p-3",
                  q.userAnswer === q.correctIndex
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-red-500 bg-red-50 dark:bg-red-950",
                )}
              >
                <p className="font-medium">{q.question}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Correct answer: {q.options[q.correctIndex]}
                </p>
                {q.explanation && (
                  <p className="mt-2 text-sm">{q.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <Button onClick={handleRestart} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{quiz.topic}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {quiz.questions.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{currentQuestion.question}</p>

        <div className="space-y-2">
          {currentQuestion.options.map((option, i) => {
            const isSelected = currentQuestion.userAnswer === i;
            const isCorrect = i === currentQuestion.correctIndex;
            const showFeedback = isAnswered;

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={isAnswered}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors",
                  showFeedback &&
                    isCorrect &&
                    "border-green-500 bg-green-50 dark:bg-green-950",
                  showFeedback &&
                    isSelected &&
                    !isCorrect &&
                    "border-red-500 bg-red-50 dark:bg-red-950",
                  !showFeedback && "hover:border-primary hover:bg-accent",
                )}
              >
                <span className="mr-2 font-medium">
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
                {showFeedback && isCorrect && (
                  <CheckCircle className="ml-2 inline h-4 w-4 text-green-500" />
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <XCircle className="ml-2 inline h-4 w-4 text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && currentQuestion.explanation && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <Button onClick={handleNext} className="w-full">
            {isLastQuestion ? "See Results" : "Next Question"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
