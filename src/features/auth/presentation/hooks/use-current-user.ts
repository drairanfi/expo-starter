import type { User } from '../../domain/user';
import { useAuthStore } from './auth-store';

/** The signed-in user, or null while signed out. */
export function useCurrentUser(): User | null {
  return useAuthStore((state) => state.user);
}
