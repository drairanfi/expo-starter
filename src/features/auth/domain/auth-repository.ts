import type { Credentials } from './credentials';
import type { User } from './user';

/** Contract for authentication. Implementations throw a `FailureError` on error. */
export interface AuthRepository {
  /** Signs in and persists the session. Throws `invalidCredentials` (or another failure). */
  signIn(credentials: Credentials): Promise<User>;

  /** Returns the persisted user, or null when there is no valid session. */
  restoreSession(): Promise<User | null>;

  /** Clears the persisted session. */
  signOut(): Promise<void>;
}
