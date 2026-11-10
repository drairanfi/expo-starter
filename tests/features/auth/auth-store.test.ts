import { FailureError } from '@/core/error';
import { InMemorySecureStorage, StorageKeys } from '@/core/storage';
import { createAuthStore } from '@/features/auth';
import { MockAuthRepository } from '@/features/auth/data/mock-auth-repository';

const credentials = { email: 'ana@example.com', password: 'password123' };

function setup() {
  const storage = new InMemorySecureStorage();
  const repository = new MockAuthRepository(storage, 0);
  const store = createAuthStore(repository);
  return { storage, repository, store };
}

describe('auth store', () => {
  it('starts in the initializing state with no user', () => {
    const { store } = setup();
    expect(store.getState()).toMatchObject({ status: 'initializing', user: null });
  });

  it('restores to unauthenticated when nothing is persisted', async () => {
    const { store } = setup();
    await store.getState().restoreSession();
    expect(store.getState()).toMatchObject({ status: 'unauthenticated', user: null });
  });

  it('restores a persisted session', async () => {
    const { store, repository } = setup();
    await repository.signIn(credentials);

    await store.getState().restoreSession();

    expect(store.getState().status).toBe('authenticated');
    expect(store.getState().user).toMatchObject({ email: 'ana@example.com', name: 'ana' });
  });

  it('treats a corrupt persisted user as signed out and clears it', async () => {
    const { store, storage } = setup();
    await storage.write(StorageKeys.accessToken, 'mock-token');
    await storage.write(StorageKeys.currentUser, '{not json');

    await store.getState().restoreSession();

    expect(store.getState().status).toBe('unauthenticated');
    expect(await storage.read(StorageKeys.accessToken)).toBeNull();
  });

  it('records a failure and settles as unauthenticated when restore throws', async () => {
    const repository = new MockAuthRepository(new InMemorySecureStorage(), 0);
    jest.spyOn(repository, 'restoreSession').mockRejectedValue(new Error('keychain locked'));
    const store = createAuthStore(repository);

    await store.getState().restoreSession();

    expect(store.getState().status).toBe('unauthenticated');
    expect(store.getState().restoreFailure).toEqual({
      kind: 'unknown',
      message: 'keychain locked',
    });
  });

  it('signs in with valid credentials and persists the token', async () => {
    const { store, storage } = setup();
    await store.getState().restoreSession();

    await store.getState().signIn(credentials);

    expect(store.getState().status).toBe('authenticated');
    expect(store.getState().user?.email).toBe('ana@example.com');
    expect(await storage.read(StorageKeys.accessToken)).toBe('mock-token');
  });

  it('rejects a wrong password with invalidCredentials and stays signed out', async () => {
    const { store } = setup();
    await store.getState().restoreSession();

    const error = await store
      .getState()
      .signIn({ ...credentials, password: 'nope' })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(FailureError);
    expect((error as FailureError).failure.kind).toBe('invalidCredentials');
    expect(store.getState()).toMatchObject({ status: 'unauthenticated', user: null });
  });

  it('signs out and clears persisted data', async () => {
    const { store, storage } = setup();
    await store.getState().signIn(credentials);

    await store.getState().signOut();

    expect(store.getState()).toMatchObject({ status: 'unauthenticated', user: null });
    expect(await storage.read(StorageKeys.accessToken)).toBeNull();
    expect(await storage.read(StorageKeys.currentUser)).toBeNull();
  });

  it('leaves the signed-in area even if clearing storage fails', async () => {
    const { store, repository } = setup();
    await store.getState().signIn(credentials);
    jest.spyOn(repository, 'signOut').mockRejectedValue(new Error('disk'));

    await expect(store.getState().signOut()).rejects.toThrow('disk');
    expect(store.getState().status).toBe('unauthenticated');
  });
});
