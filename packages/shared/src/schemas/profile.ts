import { z } from 'zod';
import {
  ACTIVITY_LEVEL_VALUES,
  COMMUTE_MODE_VALUES,
  GOAL_VALUES,
  SEX_VALUES,
  SPORT_INTENSITY_VALUES,
} from '../constants/enums.js';
import {
  MAX_AGE_YEARS,
  MAX_COMMUTE_MINUTES_PER_DAY,
  MAX_HEIGHT_CM,
  MAX_SPORT_DURATION_MIN,
  MAX_SPORT_FREQ_PER_WEEK,
  MAX_WEIGHT_KG,
  MIN_AGE_YEARS,
  MIN_COMMUTE_MINUTES_PER_DAY,
  MIN_HEIGHT_CM,
  MIN_SPORT_DURATION_MIN,
  MIN_SPORT_FREQ_PER_WEEK,
  MIN_WEIGHT_KG,
} from '../constants/limits.js';

export const SexSchema = z.enum(SEX_VALUES);
export type Sex = z.infer<typeof SexSchema>;

export const ActivityLevelSchema = z.enum(ACTIVITY_LEVEL_VALUES);
export type ActivityLevel = z.infer<typeof ActivityLevelSchema>;

export const GoalSchema = z.enum(GOAL_VALUES);
export type Goal = z.infer<typeof GoalSchema>;

export const SportIntensitySchema = z.enum(SPORT_INTENSITY_VALUES);
export type SportIntensity = z.infer<typeof SportIntensitySchema>;

export const CommuteModeSchema = z.enum(COMMUTE_MODE_VALUES);
export type CommuteMode = z.infer<typeof CommuteModeSchema>;

export const SportEntrySchema = z.object({
  type: z.string().min(1),
  freqPerWeek: z.number().int().min(MIN_SPORT_FREQ_PER_WEEK).max(MAX_SPORT_FREQ_PER_WEEK),
  durationMin: z.number().int().min(MIN_SPORT_DURATION_MIN).max(MAX_SPORT_DURATION_MIN),
  intensity: SportIntensitySchema,
});
export type SportEntry = z.infer<typeof SportEntrySchema>;

export const CommuteHabitsSchema = z.object({
  mode: CommuteModeSchema,
  minutesPerDay: z.number().int().min(MIN_COMMUTE_MINUTES_PER_DAY).max(MAX_COMMUTE_MINUTES_PER_DAY),
});
export type CommuteHabits = z.infer<typeof CommuteHabitsSchema>;

/**
 * Full user profile required to compute maintenance calories.
 * `maintenanceKcal` and `targetKcal` are server-computed.
 */
export const ProfileSchema = z.object({
  userId: z.string().uuid(),
  sex: SexSchema,
  ageYears: z.number().int().min(MIN_AGE_YEARS).max(MAX_AGE_YEARS),
  heightCm: z.number().min(MIN_HEIGHT_CM).max(MAX_HEIGHT_CM),
  weightKg: z.number().min(MIN_WEIGHT_KG).max(MAX_WEIGHT_KG),
  activityLevel: ActivityLevelSchema,
  sportDetails: z.array(SportEntrySchema),
  commuteHabits: CommuteHabitsSchema,
  goal: GoalSchema,
  maintenanceKcal: z.number().int().nonnegative().optional(),
  targetKcal: z.number().int().nonnegative().optional(),
});
export type Profile = z.infer<typeof ProfileSchema>;

/** Inputs needed to compute the maintenance calorie value. */
export const MaintenanceInputSchema = ProfileSchema.pick({
  sex: true,
  ageYears: true,
  heightCm: true,
  weightKg: true,
  activityLevel: true,
});
export type MaintenanceInput = z.infer<typeof MaintenanceInputSchema>;
