/**
 * Public API of the auth feature. Other features and `src/app` may only import
 * from here (enforced by ESLint), never from `data/`, `domain/` or `presentation/`.
 */
export { LoginScreen } from './presentation/screens/login-screen';
export { authStore, createAuthStore, useAuthStore } from './presentation/hooks/auth-store';
export type { AuthState, AuthStatus } from './presentation/hooks/auth-store';
export { useCurrentUser } from './presentation/hooks/use-current-user';
export type { AuthRepository } from './domain/auth-repository';
export type { User } from './domain/user';
