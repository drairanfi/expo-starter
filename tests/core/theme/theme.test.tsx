import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import {
  THEME_STORAGE_KEY,
  buildTheme,
  radius,
  spacing,
  useTheme,
  useThemeStore,
} from '@/core/theme';

import { renderWithProviders } from '../../test-utils';

function Probe() {
  const { isDark, colors } = useTheme();
  return <Text testID="probe">{`${isDark ? 'dark' : 'light'}:${colors.background}`}</Text>;
}

describe('theme tokens', () => {
  it('uses a 4pt spacing scale', () => {
    for (const value of Object.values(spacing)) expect(value % 4).toBe(0);
  });

  it('has radius tokens and distinct light/dark palettes', () => {
    expect(radius.md).toBeGreaterThan(radius.sm);
    expect(buildTheme(true).colors.background).not.toBe(buildTheme(false).colors.background);
  });
});

describe('theme mode', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await act(() => useThemeStore.setState({ mode: 'system' }));
  });

  it('follows the system scheme by default (light under test)', async () => {
    await renderWithProviders(<Probe />);
    expect((await screen.findByTestId('probe')).props.children).toMatch(/^light:/);
  });

  it('switches to dark when the mode changes', async () => {
    await renderWithProviders(<Probe />);
    await screen.findByTestId('probe');
    await act(() => useThemeStore.getState().setMode('dark'));
    expect((await screen.findByTestId('probe')).props.children).toMatch(/^dark:/);
  });

  it('persists the chosen mode in AsyncStorage', async () => {
    await act(() => useThemeStore.getState().setMode('dark'));
    const raw = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    expect(JSON.parse(raw ?? '{}').state.mode).toBe('dark');
  });
});
