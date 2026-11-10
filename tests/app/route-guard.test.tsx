import { act, fireEvent, screen } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';

import { getHttpClient, setUnauthorizedHandler } from '@/core/network';
import { secureStorage, StorageKeys } from '@/core/storage';
import { authStore } from '@/features/auth';

import { mockAdapter } from '../core/network/mock-adapter';

/** Renders the REAL route files in src/app, so guard + layouts are covered. */
const render = (initialUrl = '/') => renderRouter('./src/app', { initialUrl });

async function seedPersistedSession() {
  await secureStorage.write(StorageKeys.accessToken, 'mock-token');
  await secureStorage.write(
    StorageKeys.currentUser,
    JSON.stringify({ id: 'u1', email: 'maria@example.com', name: 'maria' }),
  );
}

beforeEach(async () => {
  await secureStorage.delete(StorageKeys.accessToken);
  await secureStorage.delete(StorageKeys.currentUser);
  setUnauthorizedHandler(undefined);
  await act(() => authStore.setState({ status: 'initializing', user: null, restoreFailure: null }));
});

describe('auth route guard', () => {
  it('shows the login screen when signed out', async () => {
    const view = await render();

    expect(await screen.findByText('Welcome back')).toBeOnTheScreen();
    expect(view.getPathname()).toBe('/login');
  });

  it('shows home when a session is restored from secure storage', async () => {
    await seedPersistedSession();
    const view = await render();

    expect(await screen.findByText('Hello, maria!')).toBeOnTheScreen();
    expect(view.getPathname()).toBe('/');
    expect(screen.queryByText('Welcome back')).toBeNull();
  });

  it('shows the environment on home', async () => {
    await seedPersistedSession();
    await render();
    expect(await screen.findByText('Environment: dev')).toBeOnTheScreen();
  });

  it('blocks deep links to protected routes while signed out', async () => {
    const view = await render('/settings');

    expect(await screen.findByText('Welcome back')).toBeOnTheScreen();
    expect(view.getPathname()).toBe('/login');
  });

  it('goes to home after a successful sign-in', async () => {
    const view = await render();
    await fireEvent.changeText(await screen.findByTestId('login-email'), 'ana@example.com');
    await fireEvent.changeText(screen.getByTestId('login-password'), 'password123');
    await fireEvent.press(screen.getByTestId('login-submit'));
    await await act(() => jest.advanceTimersByTimeAsync(700));

    expect(await screen.findByText('Hello, ana!')).toBeOnTheScreen();
    expect(view.getPathname()).toBe('/');
  });

  it('stays on login after a failed sign-in', async () => {
    const view = await render();
    await fireEvent.changeText(await screen.findByTestId('login-email'), 'ana@example.com');
    await fireEvent.changeText(screen.getByTestId('login-password'), 'bad');
    await fireEvent.press(screen.getByTestId('login-submit'));
    await await act(() => jest.advanceTimersByTimeAsync(700));

    expect(await screen.findByText('Incorrect email or password.')).toBeOnTheScreen();
    expect(view.getPathname()).toBe('/login');
  });

  it('returns to login after signing out from settings', async () => {
    await seedPersistedSession();
    const view = await render();
    await screen.findByText('Hello, maria!');

    await fireEvent.press(screen.getByTestId('home-open-settings'));
    expect(view.getPathname()).toBe('/settings');

    await fireEvent.press(await screen.findByTestId('settings-sign-out'));

    expect(await screen.findByText('Welcome back')).toBeOnTheScreen();
    expect(view.getPathname()).toBe('/login');
    expect(await secureStorage.read(StorageKeys.accessToken)).toBeNull();
  });

  it('ends the session when the HTTP layer reports a 401', async () => {
    await seedPersistedSession();
    await render();
    await screen.findByText('Hello, maria!');

    // Real wiring: root layout -> unauthorized handler <- 401 interceptor.
    const client = getHttpClient();
    client.defaults.adapter = mockAdapter({ status: 401 });
    await act(async () => {
      await client.get('/me').catch(() => undefined);
    });

    expect(await screen.findByText('Welcome back')).toBeOnTheScreen();
  });
});
