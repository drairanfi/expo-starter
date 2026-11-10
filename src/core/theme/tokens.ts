import type { TextStyle } from 'react-native';

/** Semantic colour roles. Features use these names, never raw hex values. */
export type ColorTokens = {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  danger: string;
  onDanger: string;
};

export const lightColors: ColorTokens = {
  background: '#FFFFFF',
  surface: '#F5F6FA',
  surfaceMuted: '#E8EAF2',
  border: '#C9CDDC',
  text: '#111322',
  textMuted: '#5B6075',
  primary: '#3F51B5',
  onPrimary: '#FFFFFF',
  danger: '#B3261E',
  onDanger: '#FFFFFF',
};

export const darkColors: ColorTokens = {
  background: '#0F1117',
  surface: '#1A1D27',
  surfaceMuted: '#262A38',
  border: '#3A3F52',
  text: '#F2F3F8',
  textMuted: '#A3A8BC',
  primary: '#8C9EFF',
  onPrimary: '#0F1117',
  danger: '#F2B8B5',
  onDanger: '#0F1117',
};

/** Spacing scale: multiples of 4. */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  pill: 999,
} as const;

type TypographyRole = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight'>;

export const typography = {
  headline: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
  title: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
} as const satisfies Record<string, TypographyRole>;

export type Theme = {
  isDark: boolean;
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
};

export function buildTheme(isDark: boolean): Theme {
  return { isDark, colors: isDark ? darkColors : lightColors, spacing, radius, typography };
}

/** Minimum touch target (dp) recommended by iOS HIG and Material. */
export const MIN_TOUCH_TARGET = 48;
