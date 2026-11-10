import { createStore, useStore } from 'zustand';

import { toFailure, type Failure } from '@/core/error';

import { authRepository } from '../../data/auth-repository-instance';
import type { AuthRepository } from '../../domain/auth-repository';
import type { Credentials } from '../../domain/credentials';
import type { User } from '../../domain/user';

/**
 * - `initializing`: restoring the persisted session at launch.
 * - `unauthenticated` / `authenticated`: settled states the route guard reads.
 */
export type AuthStatus = 'initializing' | 'unauthenticated' | 'authenticated';

export type AuthState = {
  status: AuthStatus;
  user: User | null;
  /** Failure from the last restore attempt, if any. Sign-in failures are thrown to the caller. */
  restoreFailure: Failure | null;
  restoreSession: () => Promise<void>;
  /** Resolves on success; throws a `FailureError` on failure and keeps the current state. */
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
};

/** Factory so tests can build isolated stores around a fake repository. */
export function createAuthStore(repository: AuthRepository) {
  return createStore<AuthState>()((set) => ({
    status: 'initializing',
    user: null,
    restoreFailure: null,

    restoreSession: async () => {
      try {
        const user = await repository.restoreSession();
        set({ user, status: user ? 'authenticated' : 'unauthenticated', restoreFailure: null });
      } catch (error) {
        set({ user: null, status: 'unauthenticated', restoreFailure: toFailure(error) });
      }
    },

    signIn: async (credentials) => {
      const user = await repository.signIn(credentials);
      set({ user, status: 'authenticated', restoreFailure: null });
    },

    signOut: async () => {
      try {
        await repository.signOut();
      } finally {
        // Even if clearing storage fails the user must leave the signed-in area.
        set({ user: null, status: 'unauthenticated' });
      }
    },
  }));
}

/** App-wide session store, wired to the repository chosen in the data layer. */
export const authStore = createAuthStore(authRepository);

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  return useStore(authStore, selector);
}
