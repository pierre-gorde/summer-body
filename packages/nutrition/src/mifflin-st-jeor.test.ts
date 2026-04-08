import { describe, expect, it } from 'vitest';
import { mifflinStJeorBmr } from './mifflin-st-jeor.js';

describe('mifflinStJeorBmr', () => {
  it('computes BMR for a 30 y/o male, 180 cm, 80 kg', () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
    expect(mifflinStJeorBmr({ sex: 'male', ageYears: 30, heightCm: 180, weightKg: 80 })).toBe(1780);
  });

  it('computes BMR for a 30 y/o female, 165 cm, 60 kg', () => {
    // 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25 -> 1320
    expect(mifflinStJeorBmr({ sex: 'female', ageYears: 30, heightCm: 165, weightKg: 60 })).toBe(
      1320,
    );
  });

  it('rounds to the nearest integer', () => {
    const result = mifflinStJeorBmr({
      sex: 'female',
      ageYears: 25,
      heightCm: 170,
      weightKg: 65,
    });
    expect(Number.isInteger(result)).toBe(true);
  });
});
