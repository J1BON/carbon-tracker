import { z } from "zod";

export const CarbonLogSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  category: z.enum([
    "transport",
    "diet",
    "energy",
    "shopping",
    "lifestyle",
    "other",
  ]),
  activity: z.string(),
  carbon_amount_kg: z.number().min(0),
  metadata: z.record(z.any()).optional(),
  created_at: z.string().datetime(),
});

export type CarbonLog = z.infer<typeof CarbonLogSchema>;

export const CarbonInputSchema = z.object({
  category: z.enum(["transport", "diet", "energy", "shopping", "lifestyle", "other"]),
  activity: z.string().min(1),
  amount: z.number().min(0),
  unit: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CarbonInput = z.infer<typeof CarbonInputSchema>;

export const CarbonStatSchema = z.object({
  total_kg: z.number().min(0),
  daily_average_kg: z.number().min(0),
  monthly_kg: z.number().min(0),
  by_category: z.record(z.number()),
  trend: z.array(
    z.object({
      date: z.string().date(),
      amount_kg: z.number().min(0),
    })
  ),
});

export type CarbonStat = z.infer<typeof CarbonStatSchema>;

