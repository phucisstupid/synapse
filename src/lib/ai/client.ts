import { generateText, streamText, generateObject } from "ai";
import { z } from "zod";
import { createProviderClient, type ProviderClient } from "./providers";
import type { AIProvider } from "./models";

export interface SynapseAIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

export class SynapseAIClient {
  private client: ProviderClient;
  private modelId: string;

  constructor(config: SynapseAIConfig) {
    this.client = createProviderClient(config.provider, {
      apiKey: config.apiKey,
    });
    this.modelId = config.model;
  }

  async chat(prompt: string, systemPrompt?: string) {
    const result = await generateText({
      model: this.client(this.modelId),
      prompt,
      system: systemPrompt,
    });
    return result.text;
  }

  async *chatStream(prompt: string, systemPrompt?: string) {
    const result = streamText({
      model: this.client(this.modelId),
      prompt,
      system: systemPrompt,
    });

    for await (const chunk of result.textStream) {
      yield chunk;
    }
  }

  async generateQuiz(topic: string, count: number = 5) {
    const { object } = await generateObject({
      model: this.client(this.modelId),
      schema: z.object({
        questions: z.array(
          z.object({
            question: z.string(),
            options: z.array(z.string()).length(4),
            correctIndex: z.number().min(0).max(3),
            explanation: z.string(),
          })
        ),
      }),
      prompt: `Generate ${count} multiple choice quiz questions about: ${topic}. 
               Make them educational and test understanding, not just memorization.
               Vary difficulty levels.`,
    });
    return object.questions;
  }

  async generateFlashcards(topic: string, count: number = 10) {
    const { object } = await generateObject({
      model: this.client(this.modelId),
      schema: z.object({
        cards: z.array(
          z.object({
            front: z.string(),
            back: z.string(),
          })
        ),
      }),
      prompt: `Generate ${count} flashcards about: ${topic}.
               Front should be a question or term.
               Back should be a concise answer or definition.
               Focus on key concepts and definitions.`,
    });
    return object.cards;
  }

  async summarizeDocument(content: string) {
    const { object } = await generateObject({
      model: this.client(this.modelId),
      schema: z.object({
        summary: z.string(),
        keyPoints: z.array(z.string()),
        topics: z.array(z.string()),
        studyQuestions: z.array(z.string()),
      }),
      prompt: `Analyze the following document and provide:
               1. A comprehensive summary
               2. Key points (main takeaways)
               3. Topics covered
               4. Study questions for review

               Document content:
               ${content}`,
    });
    return object;
  }

  async createStudyPlan(subjects: string[], durationDays: number, hoursPerDay: number) {
    const { object } = await generateObject({
      model: this.client(this.modelId),
      schema: z.object({
        schedule: z.array(
          z.object({
            day: z.number(),
            subject: z.string(),
            topic: z.string(),
            duration: z.number(),
            tasks: z.array(z.string()),
          })
        ),
      }),
      prompt: `Create a study plan for the next ${durationDays} days.
               Subjects to cover: ${subjects.join(", ")}
               Available study time: ${hoursPerDay} hours per day
               
               Create a balanced schedule that:
               - Distributes subjects evenly
               - Includes review sessions
               - Breaks topics into manageable chunks`,
    });
    return object.schedule;
  }

  async explainConcept(topic: string, level: "beginner" | "intermediate" | "advanced" = "intermediate") {
    const result = await generateText({
      model: this.client(this.modelId),
      prompt: `Explain the following concept at a ${level} level.
               Use clear language, examples, and analogies where helpful.
               Structure the explanation with headings.
               
               Topic: ${topic}`,
    });
    return result.text;
  }
}

export function createAIClient(config: SynapseAIConfig): SynapseAIClient {
  return new SynapseAIClient(config);
}
