/**
 * Typography tokens — Inter, mapped to React Native font weights.
 * Source of truth: docs/design-system.md
 */

import type { TextStyle } from 'react-native';

export const FONT_FAMILY_REGULAR = 'Inter_400Regular';
export const FONT_FAMILY_MEDIUM = 'Inter_500Medium';
export const FONT_FAMILY_SEMIBOLD = 'Inter_600SemiBold';
export const FONT_FAMILY_BOLD = 'Inter_700Bold';
export const FONT_FAMILY_EXTRABOLD = 'Inter_800ExtraBold';

export const TYPO_DISPLAY_XL: TextStyle = {
  fontFamily: FONT_FAMILY_EXTRABOLD,
  fontSize: 56,
  lineHeight: 60,
  letterSpacing: -1.1,
};

export const TYPO_DISPLAY_LG: TextStyle = {
  fontFamily: FONT_FAMILY_BOLD,
  fontSize: 40,
  lineHeight: 46,
  letterSpacing: -0.8,
};

export const TYPO_DISPLAY_MD: TextStyle = {
  fontFamily: FONT_FAMILY_BOLD,
  fontSize: 28,
  lineHeight: 34,
  letterSpacing: -0.5,
};

export const TYPO_BODY_LG: TextStyle = {
  fontFamily: FONT_FAMILY_MEDIUM,
  fontSize: 17,
  lineHeight: 24,
};

export const TYPO_BODY: TextStyle = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontSize: 15,
  lineHeight: 22,
};

export const TYPO_CAPTION: TextStyle = {
  fontFamily: FONT_FAMILY_MEDIUM,
  fontSize: 13,
  lineHeight: 18,
};

export const TYPO_LABEL: TextStyle = {
  fontFamily: FONT_FAMILY_SEMIBOLD,
  fontSize: 11,
  lineHeight: 14,
  letterSpacing: 0.55,
  textTransform: 'uppercase',
};
