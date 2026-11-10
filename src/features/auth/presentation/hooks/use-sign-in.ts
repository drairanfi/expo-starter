import { useMutation } from '@tanstack/react-query';

import type { Credentials } from '../../domain/credentials';
import { authStore } from './auth-store';

/** Sign-in as a TanStack mutation: gives screens `isPending` and `error` for free. */
export function useSignIn() {
  return useMutation({
    mutationFn: (credentials: Credentials) => authStore.getState().signIn(credentials),
  });
}
