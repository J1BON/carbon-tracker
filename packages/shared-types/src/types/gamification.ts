import { z } from "zod";

export const BadgeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
  points_required: z.number().int().min(0),
});

export type Badge = z.infer<typeof BadgeSchema>;

export const UserBadgeSchema = z.object({
  user_id: z.string().uuid(),
  badge_id: z.string().uuid(),
  earned_at: z.string().datetime(),
});

export type UserBadge = z.infer<typeof UserBadgeSchema>;

export const LeaderboardEntrySchema = z.object({
  user_id: z.string().uuid(),
  name: z.string(),
  avatar_url: z.string().url().optional(),
  eco_score: z.number().min(0).max(100),
  total_points: z.number().int().min(0),
  level: z.number().int().min(1),
  rank: z.number().int().min(1).optional(),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export const ChallengeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  target_value: z.number(),
  current_unit: z.string(),
  reward_points: z.number().int().min(0),
  badge_reward: z.string().uuid().optional(),
  expires_at: z.string().datetime().optional(),
});

export type Challenge = z.infer<typeof ChallengeSchema>;

export const RewardClaimSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  reward_type: z.enum(["points", "badge", "discount"]),
  reward_value: z.string(),
  claimed_at: z.string().datetime(),
});

export type RewardClaim = z.infer<typeof RewardClaimSchema>;

