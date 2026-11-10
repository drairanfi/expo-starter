import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { THEME_MODES, useTheme, type ThemeMode } from '@/core/theme';

type Props = {
  selected: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

/** Segmented control for choosing the theme mode. */
export function ThemeModeSelector({ selected, onChange }: Props) {
  const { t } = useTranslation();
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View
      accessibilityRole="radiogroup"
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        overflow: 'hidden',
      }}
    >
      {THEME_MODES.map((mode) => {
        const active = mode === selected;
        return (
          <Pressable
            key={mode}
            testID={`theme-mode-${mode}`}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(mode)}
            style={{
              flex: 1,
              minHeight: 48,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: spacing.sm,
              backgroundColor: active ? colors.primary : 'transparent',
            }}
          >
            <Text style={[typography.label, { color: active ? colors.onPrimary : colors.text }]}>
              {t(`theme.${mode}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
