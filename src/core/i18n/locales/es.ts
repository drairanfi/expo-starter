import type { TranslationShape } from './en';

/** Spanish translations. The type guarantees key parity with English at compile time. */
export const es: TranslationShape = {
  app: { title: 'Plantilla Expo' },
  login: {
    title: 'Bienvenido de nuevo',
    subtitle: 'Inicia sesión para continuar',
    hint: 'Credenciales de prueba: cualquier correo válido y la contraseña "password123".',
    email: 'Correo electrónico',
    password: 'Contraseña',
    submit: 'Iniciar sesión',
  },
  home: {
    title: 'Inicio',
    welcome: '¡Hola, {{name}}!',
    environment: 'Entorno: {{environment}}',
    openSettings: 'Abrir ajustes',
  },
  settings: {
    title: 'Ajustes',
    appearance: 'Apariencia',
    signOut: 'Cerrar sesión',
  },
  theme: {
    system: 'Sistema',
    light: 'Claro',
    dark: 'Oscuro',
  },
  validation: {
    emailRequired: 'El correo es obligatorio',
    emailInvalid: 'Introduce un correo válido',
    passwordRequired: 'La contraseña es obligatoria',
  },
  errors: {
    generic: 'Algo salió mal. Inténtalo de nuevo.',
    network: 'Sin conexión. Revisa tu internet e inténtalo de nuevo.',
    timeout: 'La solicitud tardó demasiado. Inténtalo de nuevo.',
    unauthorized: 'Tu sesión expiró. Inicia sesión de nuevo.',
    notFound: 'No encontramos lo que buscabas.',
    server: 'El servidor tuvo un problema. Inténtalo más tarde.',
    invalidCredentials: 'Correo o contraseña incorrectos.',
  },
  a11y: {
    loading: 'Cargando',
  },
};
