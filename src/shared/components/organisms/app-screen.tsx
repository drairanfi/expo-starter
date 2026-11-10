import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/core/theme';

export type AppScreenProps = {
  children: ReactNode;
  /** Wrap content in a ScrollView (forms, long content). Defaults to true. */
  scroll?: boolean;
  /** Centre content vertically. */
  centered?: boolean;
};

/** Themed, safe-area aware, keyboard aware page container. */
export function AppScreen({ children, scroll = true, centered = false }: AppScreenProps) {
  const { colors, spacing } = useTheme();
  const contentStyle = [
    styles.content,
    { padding: spacing.xl, gap: spacing.lg },
    centered && styles.centered,
  ];

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={[styles.flex, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView contentContainerStyle={contentStyle} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, ...contentStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  centered: { justifyContent: 'center' },
});
