import { describe, expect, it } from 'vitest';
import { ACTIVITY_FACTORS } from './constants.js';
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
  it('returns maintenance unchanged when delta is 0', () => {
    expect(targetKcal(2000, 0)).toBe(2000);
  });

  it('applies a negative delta as a deficit', () => {
    expect(targetKcal(2000, -10)).toBe(1800);
    expect(targetKcal(2000, -25)).toBe(1500);
  });

  it('applies a positive delta as a surplus', () => {
    expect(targetKcal(2000, 10)).toBe(2200);
    expect(targetKcal(2500, 15)).toBe(2875);
  });

  it('rounds to the nearest integer', () => {
    // 2200 * (1 - 0.07) = 2046 exactly
    expect(targetKcal(2200, -7)).toBe(2046);
    // 2200 * 0.83 = 1826
    expect(targetKcal(2200, -17)).toBe(1826);
  });
});
