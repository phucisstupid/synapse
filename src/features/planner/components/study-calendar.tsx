import { useState } from "react";
import { CheckCircle, Clock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlannerStore, useSettingsStore } from "@/lib/store";
import { createAIClient } from "@/lib/ai";
import { cn } from "@/lib/utils/cn";

export function StudyCalendar() {
  const [subjects, setSubjects] = useState("");
  const [duration, setDuration] = useState(7);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const { createPlan, completeSession, getActivePlan, getProgress } =
    usePlannerStore();
  const { provider, model, getApiKey } = useSettingsStore();

  const activePlan = getActivePlan();
  const progress = getProgress();

  const generatePlan = async () => {
    if (!subjects.trim()) return;

    const apiKey = getApiKey(provider);
    if (!apiKey) {
      alert("Please add your API key in Settings");
      return;
    }

    setIsLoading(true);
    try {
      const client = createAIClient({ provider, apiKey, model });
      const sessions = await client.createStudyPlan(
        subjects.split(",").map((s) => s.trim()),
        duration,
        hoursPerDay,
      );

      createPlan(
        `Study Plan - ${subjects}`,
        sessions.map((s) => ({
          subject: s.subject,
          topic: s.topic,
          scheduledAt: Date.now() + s.day * 24 * 60 * 60 * 1000,
          duration: s.duration,
          tasks: s.tasks,
        })),
      );

      setSubjects("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to generate plan");
    } finally {
      setIsLoading(false);
    }
  };

  if (!activePlan) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Study Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Subjects (comma-separated)</Label>
            <Input
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="e.g., Math, Physics, History"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration (days)</Label>
              <Input
                type="number"
                min={1}
                max={30}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 7)}
              />
            </div>
            <div className="space-y-2">
              <Label>Hours/day</Label>
              <Input
                type="number"
                min={1}
                max={12}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 2)}
              />
            </div>
          </div>
          <Button
            onClick={generatePlan}
            disabled={!subjects.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Generate Plan"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{activePlan.name}</h2>
          <p className="text-muted-foreground">
            {progress.completed} of {progress.total} sessions completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-2xl font-bold">
              {Math.round((progress.completed / progress.total) * 100) || 0}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {activePlan.sessions.map((session) => (
          <Card
            key={session.id}
            className={cn(
              "transition-opacity",
              session.completed && "opacity-60",
            )}
          >
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{session.subject}</h4>
                  <p className="text-sm text-muted-foreground">
                    {session.topic}
                  </p>
                </div>
                {session.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {session.duration} min
              </div>

              <div className="text-sm text-muted-foreground">
                {new Date(session.scheduledAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              {session.tasks.length > 0 && (
                <ul className="text-xs text-muted-foreground space-y-1">
                  {session.tasks.slice(0, 3).map((task, i) => (
                    <li key={i}>• {task}</li>
                  ))}
                </ul>
              )}

              {!session.completed && (
                <Button
                  size="sm"
                  onClick={() => completeSession(session.id)}
                  className="w-full mt-2"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
