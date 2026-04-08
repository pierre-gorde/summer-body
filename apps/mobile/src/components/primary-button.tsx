import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { ACCENT_PRIMARY, ACCENT_PRIMARY_HOVER, BG_BASE, INK_MUTED } from '../constants/colors';
import { BUTTON_HEIGHT, RADIUS_PILL, SPACING_8 } from '../constants/spacing';
import { FONT_FAMILY_SEMIBOLD } from '../constants/typography';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, loading, disabled }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? <ActivityIndicator color={BG_BASE} /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: BUTTON_HEIGHT,
    paddingHorizontal: SPACING_8,
    borderRadius: RADIUS_PILL,
    backgroundColor: ACCENT_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: ACCENT_PRIMARY_HOVER,
  },
  disabled: {
    backgroundColor: INK_MUTED,
  },
  label: {
    fontFamily: FONT_FAMILY_SEMIBOLD,
    fontSize: 17,
    color: BG_BASE,
  },
});
