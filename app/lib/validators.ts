import { z } from "zod";

export const questFormSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(1_000).optional().default(""),
  type: z.enum(["daily", "weekly", "major"]),
  difficulty: z.enum(["easy", "medium", "hard", "boss"]).optional(),
  dueDate: z.string().date().optional(),
  xpReward: z.coerce.number().int().min(1).max(10_000),
});

export const habitFormSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(1_000).optional().default(""),
  type: z.enum(["good", "bad"]),
  xpReward: z.coerce.number().int().min(0).max(10_000),
});

export const dailyCheckInSchema = z.object({
  dailyIntention: z.string().trim().min(1).max(255),
  ifThenPlan: z.string().trim().max(255).optional().default(""),
  cravingIntensity: z.coerce.number().int().min(0).max(10).optional(),
  triggerNotes: z.string().trim().max(1_000).optional().default(""),
  reflection: z.string().trim().max(1_000).optional().default(""),
  slipHappened: z.boolean().default(false),
});

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});
