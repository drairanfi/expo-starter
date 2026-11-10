import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { buildTheme, type Theme } from './tokens';
import { useThemeStore } from './theme-store';

const ThemeContext = createContext<Theme | null>(null);

/** Waits for the persisted mode so the first frame is not the wrong theme. */
function useThemeHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useThemeStore.persist.onFinishHydration(onChange),
    () => useThemeStore.persist.hasHydrated(),
    () => false,
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((state) => state.mode);
  const systemScheme = useColorScheme();
  const hydrated = useThemeHydrated();

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  if (!hydrated) return null;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside <ThemeProvider>');
  return theme;
}
