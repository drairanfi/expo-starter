import type { ComponentRef, Ref } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/core/theme';

export type LabeledTextFieldProps = TextInputProps & {
  label: string;
  /** Already-localised error message. Shown under the field when set. */
  error?: string;
  /** Ref to the underlying TextInput (e.g. to focus the next field). */
  inputRef?: Ref<ComponentRef<typeof TextInput>>;
};

/** Label + input + error text. Compatible with react-hook-form's `Controller`. */
export function LabeledTextField({
  label,
  error,
  style,
  inputRef,
  ...inputProps
}: LabeledTextFieldProps) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={[typography.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        ref={inputRef}
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          typography.body,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
          },
          style,
        ]}
        {...inputProps}
      />
      {error ? (
        <Text accessibilityRole="alert" style={[typography.caption, { color: colors.danger }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: MIN_TOUCH_TARGET, borderWidth: 1 },
});
