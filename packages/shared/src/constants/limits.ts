/**
 * Validation bounds for profile fields.
 * Sources:
 * - Height/weight: physiological extremes for adults.
 * - Age: minimum 13 (general app age threshold), max 120.
 */

export const MIN_AGE_YEARS = 13;
export const MAX_AGE_YEARS = 120;

export const MIN_HEIGHT_CM = 100;
export const MAX_HEIGHT_CM = 250;

export const MIN_WEIGHT_KG = 30;
export const MAX_WEIGHT_KG = 300;

export const MIN_SPORT_FREQ_PER_WEEK = 0;
export const MAX_SPORT_FREQ_PER_WEEK = 14;

export const MIN_SPORT_DURATION_MIN = 0;
export const MAX_SPORT_DURATION_MIN = 600;

export const MIN_COMMUTE_MINUTES_PER_DAY = 0;
export const MAX_COMMUTE_MINUTES_PER_DAY = 600;

/**
 * Calorie delta vs maintenance, in percent.
 * Negative = deficit (weight loss), 0 = maintain, positive = surplus (weight gain).
 * The UI exposes presets but lets the user fine-tune freely within these bounds.
 */
export const MIN_KCAL_DELTA_PERCENT = -50;
export const MAX_KCAL_DELTA_PERCENT = 50;
export const DEFAULT_KCAL_DELTA_LOSS_PERCENT = -10;
export const DEFAULT_KCAL_DELTA_GAIN_PERCENT = 10;
export const KCAL_DELTA_MAINTAIN_PERCENT = 0;
