import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useLocalizedError } from '@/core/i18n';
import { useTheme } from '@/core/theme';
import { AppButton } from '@/shared/components/atoms/app-button';
import { LabeledTextField } from '@/shared/components/molecules/labeled-text-field';
import { AppScreen } from '@/shared/components/organisms/app-screen';

import { credentialsSchema, type Credentials } from '../../domain/credentials';
import { useSignIn } from '../hooks/use-sign-in';

export function LoginScreen() {
  const { t } = useTranslation();
  const { colors, spacing, typography } = useTheme();
  const localizeError = useLocalizedError();
  const signIn = useSignIn();

  const { control, handleSubmit } = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit((values) => signIn.mutate(values));

  // Validation messages are i18n keys produced by the domain schema.
  const fieldError = (message?: string) => (message ? t(message as never) : undefined);

  return (
    <AppScreen centered>
      <View style={{ gap: spacing.xs }}>
        <Text accessibilityRole="header" style={[typography.headline, { color: colors.text }]}>
          {t('login.title')}
        </Text>
        <Text style={[typography.body, { color: colors.textMuted }]}>{t('login.subtitle')}</Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <LabeledTextField
            label={t('login.email')}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldError(fieldState.error?.message)}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
            testID="login-email"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <LabeledTextField
            label={t('login.password')}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldError(fieldState.error?.message)}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={() => void submit()}
            testID="login-password"
          />
        )}
      />

      {signIn.error ? (
        <Text accessibilityRole="alert" style={[typography.body, { color: colors.danger }]}>
          {localizeError(signIn.error)}
        </Text>
      ) : null}

      <AppButton
        testID="login-submit"
        title={t('login.submit')}
        loading={signIn.isPending}
        loadingLabel={t('a11y.loading')}
        onPress={() => void submit()}
      />

      <Text style={[typography.caption, { color: colors.textMuted }]}>{t('login.hint')}</Text>
    </AppScreen>
  );
}
