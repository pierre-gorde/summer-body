import type { Sex } from '@summer-body/shared';
import {
  MIFFLIN_AGE_COEFFICIENT,
  MIFFLIN_HEIGHT_COEFFICIENT,
  MIFFLIN_OFFSET_FEMALE,
  MIFFLIN_OFFSET_MALE,
  MIFFLIN_WEIGHT_COEFFICIENT,
} from './constants.js';

export interface MifflinStJeorInput {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
}

/**
 * Computes Basal Metabolic Rate (kcal/day) using the Mifflin-St Jeor equation.
 * Returns an integer rounded to the nearest kcal.
 */
export function mifflinStJeorBmr(input: MifflinStJeorInput): number {
  const offset = input.sex === 'male' ? MIFFLIN_OFFSET_MALE : MIFFLIN_OFFSET_FEMALE;
  const bmr =
    MIFFLIN_WEIGHT_COEFFICIENT * input.weightKg +
    MIFFLIN_HEIGHT_COEFFICIENT * input.heightCm +
    MIFFLIN_AGE_COEFFICIENT * input.ageYears +
    offset;
  return Math.round(bmr);
}
