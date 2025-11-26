import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  avatar_url: z.string().url().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  eco_score: z.number().min(0).max(100),
  level: z.number().int().min(1),
  total_points: z.number().int().min(0),
  is_admin: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
});

export type User = z.infer<typeof UserSchema>;

export const OnboardingSchema = z.object({
  age: z.number().int().min(13).max(120),
  location: z.string().min(1),
  household_size: z.number().int().min(1).max(20),
  diet_type: z.enum(["vegetarian", "vegan", "omnivore", "pescatarian"]),
  transport_primary: z.enum([
    "car",
    "public_transport",
    "bicycle",
    "walking",
    "electric_vehicle",
  ]),
  has_pets: z.boolean(),
  energy_provider: z.string().optional(),
  monthly_electricity_kwh: z.number().min(0).optional(),
});

export type Onboarding = z.infer<typeof OnboardingSchema>;

