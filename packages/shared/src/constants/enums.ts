/**
 * Domain enums shared between API and mobile.
 *
 * Per CLAUDE.md, no inline string literals in business code: import these
 * tuples (and the union types derived in `schemas/`) instead of typing the
 * value directly.
 */

export const SEX_VALUES = ['male', 'female'] as const;

export const ACTIVITY_LEVEL_VALUES = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very_active',
] as const;

export const GOAL_VALUES = ['maintain', 'lose_slow', 'lose_fast'] as const;

export const SPORT_INTENSITY_VALUES = ['low', 'moderate', 'high'] as const;

export const COMMUTE_MODE_VALUES = ['walk', 'bike', 'public_transit', 'car', 'mixed'] as const;
