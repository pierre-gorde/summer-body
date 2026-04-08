import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { HomeScreen } from '../screens/home-screen';
import { LoadingScreen } from '../screens/loading-screen';
import { WelcomeScreen } from '../screens/welcome-screen';
import { useSessionStore } from '../state/session-store';

const ROUTE_WELCOME = 'Welcome';
const ROUTE_HOME = 'Home';

type RootStackParamList = {
  [ROUTE_WELCOME]: undefined;
  [ROUTE_HOME]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const status = useSessionStore((s) => s.status);
  const hydrate = useSessionStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (status === 'idle' || status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {status === 'authenticated' ? (
          <Stack.Screen name={ROUTE_HOME} component={HomeScreen} />
        ) : (
          <Stack.Screen name={ROUTE_WELCOME} component={WelcomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
