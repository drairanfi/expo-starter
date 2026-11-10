/** Source of truth for translation keys. `es.ts` must satisfy the same shape. */
export const en = {
  app: { title: 'Expo Template' },
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to continue',
    hint: 'Demo credentials: any valid email and the password "password123".',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
  },
  home: {
    title: 'Home',
    welcome: 'Hello, {{name}}!',
    environment: 'Environment: {{environment}}',
    openSettings: 'Open settings',
  },
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    signOut: 'Sign out',
  },
  theme: {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  },
  validation: {
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email address',
    passwordRequired: 'Password is required',
  },
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'No connection. Check your internet and try again.',
    timeout: 'The request timed out. Please try again.',
    unauthorized: 'Your session has expired. Please sign in again.',
    notFound: 'We could not find what you were looking for.',
    server: 'The server had a problem. Please try again later.',
    invalidCredentials: 'Incorrect email or password.',
  },
  a11y: {
    loading: 'Loading',
  },
} as const;

type Widen<T> = T extends string ? string : { -readonly [K in keyof T]: Widen<T[K]> };
export type TranslationShape = Widen<typeof en>;
