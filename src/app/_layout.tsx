import { useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AppProviders } from '@/core/config/app-providers';
import { setUnauthorizedHandler } from '@/core/network';
import { useTheme } from '@/core/theme';
import { authStore, useAuthStore } from '@/features/auth';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

/**
 * Composition root for routing: the only place that connects the session
 * store to navigation. Screens behind a failing guard are unreachable, and
 * expo-router redirects to the first allowed route when the guard flips.
 */
function RootNavigator() {
  const status = useAuthStore((state) => state.status);
  const queryClient = useQueryClient();
  const { colors } = useTheme();

  useEffect(() => {
    void authStore.getState().restoreSession();
    // A 401 from any request ends the session.
    setUnauthorizedHandler(() => void authStore.getState().signOut());
    return () => setUnauthorizedHandler(undefined);
  }, []);

  useEffect(() => {
    if (status !== 'initializing') void SplashScreen.hideAsync();
    // Never show the previous user's cached server data to the next user.
    if (status === 'unauthenticated') queryClient.clear();
  }, [status, queryClient]);

  if (status === 'initializing') return null;
  const signedIn = status === 'authenticated';

  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
