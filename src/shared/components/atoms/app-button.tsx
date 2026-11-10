import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/core/theme';

export type AppButtonVariant = 'primary' | 'secondary' | 'danger';

export type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  /** Shows a spinner and blocks presses. */
  loading?: boolean;
  disabled?: boolean;
  /** Screen reader label while loading. */
  loadingLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  loadingLabel,
  testID,
  style,
}: AppButtonProps) {
  const { colors, radius, spacing, typography } = useTheme();
  const inactive = disabled || loading;

  const palette = {
    primary: { background: colors.primary, foreground: colors.onPrimary, border: colors.primary },
    secondary: { background: 'transparent', foreground: colors.primary, border: colors.border },
    danger: { background: colors.danger, foreground: colors.onDanger, border: colors.danger },
  }[variant];

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={loading ? (loadingLabel ?? title) : title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.lg,
          opacity: inactive ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          testID={testID ? `${testID}-spinner` : undefined}
          color={palette.foreground}
        />
      ) : (
        <Text style={[typography.label, { color: palette.foreground }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
