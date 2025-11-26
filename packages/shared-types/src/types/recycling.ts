import { z } from "zod";

export const RecyclingPointSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  waste_types_accepted: z.array(z.string()),
  opening_hours: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  verified: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type RecyclingPoint = z.infer<typeof RecyclingPointSchema>;

export const RecyclingTipSchema = z.object({
  waste_type: z.string(),
  tip: z.string(),
  source: z.string().optional(),
});

export type RecyclingTip = z.infer<typeof RecyclingTipSchema>;

