import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  createdAt: number;
  nextReview: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  cardCount: number;
}

export interface Quiz {
  id: string;
  topic: string;
  questions: QuizQuestion[];
  createdAt: number;
  score?: number;
  completedAt?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  userAnswer?: number;
}

interface QuizState {
  decks: Deck[];
  flashcards: Flashcard[];
  quizzes: Quiz[];

  createDeck: (name: string, description?: string) => string;
  deleteDeck: (id: string) => void;
  addFlashcards: (
    deckId: string,
    cards: { front: string; back: string }[],
  ) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  getDeckFlashcards: (deckId: string) => Flashcard[];

  createQuiz: (topic: string, questions: QuizQuestion[]) => string;
  updateQuizAnswer: (
    quizId: string,
    questionId: string,
    answer: number,
  ) => void;
  completeQuiz: (quizId: string, score: number) => void;
  deleteQuiz: (id: string) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      decks: [],
      flashcards: [],
      quizzes: [],

      createDeck: (name, description) => {
        const id = crypto.randomUUID();
        set((state) => ({
          decks: [
            { id, name, description, createdAt: Date.now(), cardCount: 0 },
            ...state.decks,
          ],
        }));
        return id;
      },

      deleteDeck: (id) =>
        set((state) => ({
          decks: state.decks.filter((d) => d.id !== id),
          flashcards: state.flashcards.filter((f) => f.deckId !== id),
        })),

      addFlashcards: (deckId, cards) => {
        const newCards: Flashcard[] = cards.map((card) => ({
          id: crypto.randomUUID(),
          deckId,
          front: card.front,
          back: card.back,
          createdAt: Date.now(),
          nextReview: Date.now(),
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0,
        }));

        set((state) => ({
          flashcards: [...state.flashcards, ...newCards],
          decks: state.decks.map((d) =>
            d.id === deckId
              ? { ...d, cardCount: d.cardCount + cards.length }
              : d,
          ),
        }));
      },

      updateFlashcard: (id, updates) =>
        set((state) => ({
          flashcards: state.flashcards.map((f) =>
            f.id === id ? { ...f, ...updates } : f,
          ),
        })),

      deleteFlashcard: (id) =>
        set((state) => {
          const card = state.flashcards.find((f) => f.id === id);
          return {
            flashcards: state.flashcards.filter((f) => f.id !== id),
            decks: state.decks.map((d) =>
              d.id === card?.deckId ? { ...d, cardCount: d.cardCount - 1 } : d,
            ),
          };
        }),

      getDeckFlashcards: (deckId) =>
        get().flashcards.filter((f) => f.deckId === deckId),

      createQuiz: (topic, questions) => {
        const id = crypto.randomUUID();
        set((state) => ({
          quizzes: [
            {
              id,
              topic,
              questions,
              createdAt: Date.now(),
            },
            ...state.quizzes,
          ],
        }));
        return id;
      },

      updateQuizAnswer: (quizId, questionId, answer) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                  ...q,
                  questions: q.questions.map((question) =>
                    question.id === questionId
                      ? { ...question, userAnswer: answer }
                      : question,
                  ),
                }
              : q,
          ),
        })),

      completeQuiz: (quizId, score) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId ? { ...q, score, completedAt: Date.now() } : q,
          ),
        })),

      deleteQuiz: (id) =>
        set((state) => ({
          quizzes: state.quizzes.filter((q) => q.id !== id),
        })),
    }),
    {
      name: "synapse-quiz",
    },
  ),
);
