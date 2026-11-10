import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { getAppConfig } from '@/core/config';
import { useTheme } from '@/core/theme';
import { useCurrentUser } from '@/features/auth';
import { AppButton } from '@/shared/components/atoms/app-button';
import { AppScreen } from '@/shared/components/organisms/app-screen';

export function HomeScreen() {
  const { t } = useTranslation();
  const { colors, typography } = useTheme();
  const router = useRouter();
  const user = useCurrentUser();

  return (
    <AppScreen centered>
      <Text
        accessibilityRole="header"
        style={[typography.headline, { color: colors.text, textAlign: 'center' }]}
      >
        {t('home.welcome', { name: user?.name ?? '' })}
      </Text>
      <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
        {t('home.environment', { environment: getAppConfig().envName })}
      </Text>
      <AppButton
        testID="home-open-settings"
        variant="secondary"
        title={t('home.openSettings')}
        onPress={() => router.push('/settings')}
      />
    </AppScreen>
  );
}
