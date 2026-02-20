import { StudyCalendar } from "./components/study-calendar";

export function PlannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Study Planner</h2>
        <p className="text-muted-foreground">
          AI-generated study schedules tailored to your needs
        </p>
      </div>

      <StudyCalendar />
    </div>
  );
}
