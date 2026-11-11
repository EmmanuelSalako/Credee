import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider } from '../state/application';
import { colors } from '../theme';

export default function RootLayout() {
  const [loaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, SpaceGrotesk_700Bold });

  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.ground }} />;

  return (
    <SafeAreaProvider>
      <ApplicationProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground } }}>
          <Stack.Screen name="analysing" options={{ gestureEnabled: false }} />
          <Stack.Screen name="score" options={{ gestureEnabled: false }} />
        </Stack>
      </ApplicationProvider>
    </SafeAreaProvider>
  );
}
