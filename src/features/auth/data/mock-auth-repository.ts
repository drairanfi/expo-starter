import { FailureError } from '@/core/error';
import { StorageKeys, type SecureStorage } from '@/core/storage';
import { sleep } from '@/core/utils';

import type { AuthRepository } from '../domain/auth-repository';
import type { Credentials } from '../domain/credentials';
import { UserSchema, type User } from '../domain/user';

export const MOCK_VALID_PASSWORD = 'password123';

/**
 * Offline {@link AuthRepository} for development and demos.
 *
 * Accepts any email with the password {@link MOCK_VALID_PASSWORD}. Swap it for
 * a real implementation in `auth-repository-instance.ts` (see README).
 */
export class MockAuthRepository implements AuthRepository {
  constructor(
    private readonly storage: SecureStorage,
    private readonly latencyMs = 600,
  ) {}

  async signIn({ email, password }: Credentials): Promise<User> {
    await sleep(this.latencyMs);
    if (password !== MOCK_VALID_PASSWORD) {
      throw new FailureError({ kind: 'invalidCredentials' });
    }

    const trimmed = email.trim();
    const user: User = {
      id: 'mock-user-1',
      email: trimmed,
      name: trimmed.split('@')[0] ?? trimmed,
    };
    await this.storage.write(StorageKeys.accessToken, 'mock-token');
    await this.storage.write(StorageKeys.currentUser, JSON.stringify(user));
    return user;
  }

  async restoreSession(): Promise<User | null> {
    const token = await this.storage.read(StorageKeys.accessToken);
    const raw = await this.storage.read(StorageKeys.currentUser);
    if (!token || !raw) return null;

    try {
      return UserSchema.parse(JSON.parse(raw));
    } catch {
      // Corrupt or outdated payload: drop the session instead of crashing.
      await this.signOut();
      return null;
    }
  }

  async signOut(): Promise<void> {
    await this.storage.delete(StorageKeys.accessToken);
    await this.storage.delete(StorageKeys.currentUser);
  }
}
