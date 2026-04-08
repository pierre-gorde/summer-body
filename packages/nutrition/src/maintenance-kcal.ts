import type { ActivityLevel, KcalDeltaPercent, MaintenanceInput } from '@summer-body/shared';
import { ACTIVITY_FACTORS, PERCENT_DIVISOR } from './constants.js';
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
 * Applies a signed percentage delta to a maintenance value.
 * - Negative percent  → deficit (weight loss)
 * - 0                 → maintain
 * - Positive percent  → surplus (weight gain)
 *
 * Example: targetKcal(2000, -10) → 1800
 */
export function targetKcal(maintenance: number, kcalDeltaPercent: KcalDeltaPercent): number {
  return Math.round(maintenance * (1 + kcalDeltaPercent / PERCENT_DIVISOR));
}
