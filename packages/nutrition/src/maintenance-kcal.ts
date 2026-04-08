import type { ActivityLevel, Goal, MaintenanceInput } from '@summer-body/shared';
import { ACTIVITY_FACTORS, GOAL_KCAL_MULTIPLIERS } from './constants.js';
import { mifflinStJeorBmr } from './mifflin-st-jeor.js';

/**
 * Computes Total Daily Energy Expenditure (TDEE) — the user's
 * maintenance calorie target.
 */
export function maintenanceKcal(input: MaintenanceInput): number {
  const bmr = mifflinStJeorBmr({
    sex: input.sex,
    ageYears: input.ageYears,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
  });
  const factor = activityFactor(input.activityLevel);
  return Math.round(bmr * factor);
}

export function activityFactor(level: ActivityLevel): number {
  return ACTIVITY_FACTORS[level];
}

/**
 * Applies the goal-specific deficit multiplier to a maintenance value.
 */
export function targetKcal(maintenance: number, goal: Goal): number {
  return Math.round(maintenance * GOAL_KCAL_MULTIPLIERS[goal]);
}
