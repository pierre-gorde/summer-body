import { describe, expect, it } from 'vitest';
import { ACTIVITY_FACTORS, GOAL_KCAL_MULTIPLIERS } from './constants.js';
import { activityFactor, maintenanceKcal, targetKcal } from './maintenance-kcal.js';

describe('activityFactor', () => {
  it('returns the table value for each level', () => {
    for (const level of Object.keys(ACTIVITY_FACTORS) as Array<keyof typeof ACTIVITY_FACTORS>) {
      expect(activityFactor(level)).toBe(ACTIVITY_FACTORS[level]);
    }
  });
});

describe('maintenanceKcal', () => {
  it('combines BMR with the activity factor', () => {
    // BMR = 1780 (male, 30, 180, 80) ; moderate = 1.55 -> 2759
    expect(
      maintenanceKcal({
        sex: 'male',
        ageYears: 30,
        heightCm: 180,
        weightKg: 80,
        activityLevel: 'moderate',
      }),
    ).toBe(2759);
  });

  it('returns a positive integer', () => {
    const result = maintenanceKcal({
      sex: 'female',
      ageYears: 28,
      heightCm: 165,
      weightKg: 60,
      activityLevel: 'light',
    });
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThan(0);
  });
});

describe('targetKcal', () => {
  it('applies the goal multiplier', () => {
    expect(targetKcal(2000, 'maintain')).toBe(2000);
    expect(targetKcal(2000, 'lose_slow')).toBe(Math.round(2000 * GOAL_KCAL_MULTIPLIERS.lose_slow));
    expect(targetKcal(2000, 'lose_fast')).toBe(Math.round(2000 * GOAL_KCAL_MULTIPLIERS.lose_fast));
  });
});
