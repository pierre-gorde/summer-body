import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ACCENT_PRIMARY, BG_BASE } from '../constants/colors';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={ACCENT_PRIMARY} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_BASE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
