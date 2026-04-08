import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/primary-button';
import { BG_BASE, INK_PRIMARY, INK_SECONDARY } from '../constants/colors';
import {
  SCREEN_PADDING_HORIZONTAL,
  SCREEN_PADDING_VERTICAL,
  SPACING_3,
} from '../constants/spacing';
import {
  APP_NAME,
  APP_TAGLINE,
  ERROR_AUTH_FAILED,
  WELCOME_CTA_GOOGLE,
  WELCOME_CTA_LOADING,
} from '../constants/strings';
import { TYPO_BODY_LG, TYPO_DISPLAY_LG } from '../constants/typography';
import { useGoogleSignIn } from '../services/google-sign-in';
import { useSessionStore } from '../state/session-store';

export function WelcomeScreen() {
  const { isReady, promptAsync } = useGoogleSignIn();
  const signIn = useSessionStore((s) => s.signInWithGoogleIdToken);
  const [submitting, setSubmitting] = useState(false);

  const onPressGoogle = async () => {
    setSubmitting(true);
    try {
      const idToken = await promptAsync();
      if (!idToken) {
        setSubmitting(false);
        return;
      }
      await signIn(idToken);
    } catch {
      Alert.alert(ERROR_AUTH_FAILED);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>
        </View>
        <PrimaryButton
          label={submitting ? WELCOME_CTA_LOADING : WELCOME_CTA_GOOGLE}
          onPress={onPressGoogle}
          loading={submitting}
          disabled={!isReady}
        />
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
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACING_3,
  },
  title: {
    ...TYPO_DISPLAY_LG,
    color: INK_PRIMARY,
  },
  tagline: {
    ...TYPO_BODY_LG,
    color: INK_SECONDARY,
  },
});
