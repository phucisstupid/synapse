import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StudySession {
  id: string;
  subject: string;
  topic: string;
  scheduledAt: number;
  duration: number;
  tasks: string[];
  completed: boolean;
  completedAt?: number;
}

export interface StudyPlan {
  id: string;
  name: string;
  sessions: StudySession[];
  createdAt: number;
}

interface PlannerState {
  plans: StudyPlan[];
  activePlanId: string | null;

  createPlan: (
    name: string,
    sessions: Omit<StudySession, "id" | "completed">[],
  ) => string;
  deletePlan: (id: string) => void;
  setActivePlan: (id: string | null) => void;
  completeSession: (sessionId: string) => void;
  rescheduleSession: (sessionId: string, newTime: number) => void;
  getActivePlan: () => StudyPlan | undefined;
  getTodaySessions: () => StudySession[];
  getProgress: () => { completed: number; total: number };
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      plans: [],
      activePlanId: null,

      createPlan: (name, sessions) => {
        const planId = crypto.randomUUID();
        const fullSessions: StudySession[] = sessions.map((s) => ({
          ...s,
          id: crypto.randomUUID(),
          completed: false,
        }));

        set((state) => ({
          plans: [
            {
              id: planId,
              name,
              sessions: fullSessions,
              createdAt: Date.now(),
            },
            ...state.plans,
          ],
          activePlanId: planId,
        }));

        return planId;
      },

      deletePlan: (id) =>
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== id),
          activePlanId: state.activePlanId === id ? null : state.activePlanId,
        })),

      setActivePlan: (id) => set({ activePlanId: id }),

      completeSession: (sessionId) =>
        set((state) => ({
          plans: state.plans.map((p) => ({
            ...p,
            sessions: p.sessions.map((s) =>
              s.id === sessionId
                ? { ...s, completed: true, completedAt: Date.now() }
                : s,
            ),
          })),
        })),

      rescheduleSession: (sessionId, newTime) =>
        set((state) => ({
          plans: state.plans.map((p) => ({
            ...p,
            sessions: p.sessions.map((s) =>
              s.id === sessionId ? { ...s, scheduledAt: newTime } : s,
            ),
          })),
        })),

      getActivePlan: () => {
        const state = get();
        return state.plans.find((p) => p.id === state.activePlanId);
      },

      getTodaySessions: () => {
        const state = get();
        const plan = state.plans.find((p) => p.id === state.activePlanId);
        if (!plan) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return plan.sessions.filter(
          (s) =>
            s.scheduledAt >= today.getTime() &&
            s.scheduledAt < tomorrow.getTime(),
        );
      },

      getProgress: () => {
        const state = get();
        const plan = state.plans.find((p) => p.id === state.activePlanId);
        if (!plan) return { completed: 0, total: 0 };

        const total = plan.sessions.length;
        const completed = plan.sessions.filter((s) => s.completed).length;
        return { completed, total };
      },
    }),
    {
      name: "synapse-planner",
    },
  ),
);
