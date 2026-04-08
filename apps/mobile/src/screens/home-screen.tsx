import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BG_BASE, INK_PRIMARY, INK_SECONDARY } from '../constants/colors';
import {
  SCREEN_PADDING_HORIZONTAL,
  SCREEN_PADDING_VERTICAL,
  SPACING_2,
} from '../constants/spacing';
import { HOME_GREETING_PREFIX, HOME_LOGOUT } from '../constants/strings';
import { TYPO_BODY, TYPO_DISPLAY_LG } from '../constants/typography';
import { useSessionStore } from '../state/session-store';

export function HomeScreen() {
  const user = useSessionStore((s) => s.user);
  const signOut = useSessionStore((s) => s.signOut);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View>
          <Text style={styles.greeting}>
            {HOME_GREETING_PREFIX} {user?.name ?? ''}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <Pressable onPress={signOut}>
          <Text style={styles.logout}>{HOME_LOGOUT}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_BASE,
  },
  content: {
    flex: 1,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingVertical: SCREEN_PADDING_VERTICAL,
    justifyContent: 'space-between',
  },
  greeting: {
    ...TYPO_DISPLAY_LG,
    color: INK_PRIMARY,
  },
  email: {
    ...TYPO_BODY,
    color: INK_SECONDARY,
    marginTop: SPACING_2,
  },
  logout: {
    ...TYPO_BODY,
    color: INK_SECONDARY,
    textAlign: 'center',
  },
});
