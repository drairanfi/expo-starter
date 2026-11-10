import { fireEvent, screen } from '@testing-library/react-native';

import { AppButton } from '@/shared/components/atoms/app-button';

import { renderWithProviders } from '../test-utils';

describe('AppButton', () => {
  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await renderWithProviders(<AppButton title="Save" onPress={onPress} />);
    await fireEvent.press(await screen.findByText('Save'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner, hides the title and blocks presses while loading', async () => {
    const onPress = jest.fn();
    await renderWithProviders(<AppButton testID="btn" title="Save" loading onPress={onPress} />);
    expect(await screen.findByTestId('btn-spinner')).toBeOnTheScreen();
    expect(screen.queryByText('Save')).toBeNull();
    await fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await renderWithProviders(<AppButton testID="btn" title="Save" disabled onPress={onPress} />);
    await fireEvent.press(await screen.findByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes accessibility role and state', async () => {
    await renderWithProviders(<AppButton testID="btn" title="Save" disabled onPress={jest.fn()} />);
    const button = await screen.findByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
  });

  it('renders each variant with a different background', async () => {
    const backgrounds: unknown[] = [];
    for (const variant of ['primary', 'secondary', 'danger'] as const) {
      const { unmount } = await renderWithProviders(
        <AppButton testID="btn" title="Go" variant={variant} onPress={jest.fn()} />,
      );
      const style = (await screen.findByTestId('btn')).props.style;
      const flat = Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
      backgrounds.push(flat.backgroundColor);
      await unmount();
    }
    expect(new Set(backgrounds).size).toBe(3);
  });
});
