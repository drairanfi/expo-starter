import { fireEvent, screen, act } from '@testing-library/react-native';

import { secureStorage } from '@/core/storage';
import { authStore, LoginScreen } from '@/features/auth';

import { renderWithProviders } from '../../test-utils';

async function fill(email: string, password: string) {
  await fireEvent.changeText(await screen.findByTestId('login-email'), email);
  await fireEvent.changeText(screen.getByTestId('login-password'), password);
}

beforeEach(async () => {
  jest.useFakeTimers();
  await secureStorage.delete('access_token');
  await secureStorage.delete('current_user');
  await act(() => authStore.setState({ status: 'unauthenticated', user: null }));
});

afterEach(() => jest.useRealTimers());

describe('LoginScreen', () => {
  it('shows required-field errors without calling the repository', async () => {
    await renderWithProviders(<LoginScreen />);
    await fireEvent.press(await screen.findByTestId('login-submit'));

    expect(await screen.findByText('Email is required')).toBeOnTheScreen();
    expect(screen.getByText('Password is required')).toBeOnTheScreen();
    expect(authStore.getState().status).toBe('unauthenticated');
  });

  it('shows an invalid-email error', async () => {
    await renderWithProviders(<LoginScreen />);
    await fill('not-an-email', 'password123');
    await fireEvent.press(screen.getByTestId('login-submit'));

    expect(await screen.findByText('Enter a valid email address')).toBeOnTheScreen();
  });

  it('shows a localised error for wrong credentials', async () => {
    await renderWithProviders(<LoginScreen />);
    await fill('ana@example.com', 'wrong');
    await fireEvent.press(screen.getByTestId('login-submit'));
    await await act(() => jest.advanceTimersByTimeAsync(700));

    expect(await screen.findByText('Incorrect email or password.')).toBeOnTheScreen();
    expect(authStore.getState().status).toBe('unauthenticated');
  });

  it('shows a loading state while signing in, then authenticates', async () => {
    await renderWithProviders(<LoginScreen />);
    await fill('ana@example.com', 'password123');
    await fireEvent.press(screen.getByTestId('login-submit'));

    expect(await screen.findByTestId('login-submit-spinner')).toBeOnTheScreen();

    await await act(() => jest.advanceTimersByTimeAsync(700));
    expect(authStore.getState().status).toBe('authenticated');
    expect(authStore.getState().user?.name).toBe('ana');
  });
});
