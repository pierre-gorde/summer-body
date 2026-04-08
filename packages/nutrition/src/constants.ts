import type { ActivityLevel, Goal } from '@summer-body/shared';

/**
 * Mifflin-St Jeor BMR coefficients.
 * Source: Mifflin MD, St Jeor ST, et al. (1990).
 *   BMR = 10*kg + 6.25*cm - 5*age + offset
 *   offset = +5 for men, -161 for women
 */
export const MIFFLIN_WEIGHT_COEFFICIENT = 10;
export const MIFFLIN_HEIGHT_COEFFICIENT = 6.25;
export const MIFFLIN_AGE_COEFFICIENT = -5;
export const MIFFLIN_OFFSET_MALE = 5;
export const MIFFLIN_OFFSET_FEMALE = -161;

/**
 * Physical Activity Level (PAL) multipliers applied to BMR to get TDEE.
 * Source: Harris-Benedict / WHO PAL classifications.
 */
export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/**
 * Calorie target multipliers per goal.
 * - maintain : no deficit
 * - lose_slow: ~15% deficit (sustainable, ~0.5 kg/week loss)
 * - lose_fast: ~25% deficit (aggressive, requires monitoring)
 */
export const GOAL_KCAL_MULTIPLIERS: Record<Goal, number> = {
  maintain: 1.0,
  lose_slow: 0.85,
  lose_fast: 0.75,
};
