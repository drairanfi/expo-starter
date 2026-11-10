import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { useTheme, useThemeStore } from '@/core/theme';
import { useAuthStore } from '@/features/auth';
import { AppButton } from '@/shared/components/atoms/app-button';
import { AppScreen } from '@/shared/components/organisms/app-screen';

import { ThemeModeSelector } from '../components/theme-mode-selector';

export function SettingsScreen() {
  const { t } = useTranslation();
  const { colors, typography } = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <AppScreen>
      <Text style={[typography.title, { color: colors.text }]}>{t('settings.appearance')}</Text>
      <ThemeModeSelector selected={mode} onChange={setMode} />
      <AppButton
        testID="settings-sign-out"
        variant="danger"
        title={t('settings.signOut')}
        onPress={() => void signOut()}
      />
    </AppScreen>
  );
}
