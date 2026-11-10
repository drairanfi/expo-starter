import { fireEvent, screen } from '@testing-library/react-native';

import { ThemeModeSelector } from '@/features/settings/presentation/components/theme-mode-selector';

import { renderWithProviders } from '../../test-utils';

describe('ThemeModeSelector', () => {
  it('renders the three modes with the selected one marked', async () => {
    await renderWithProviders(<ThemeModeSelector selected="dark" onChange={jest.fn()} />);

    expect(await screen.findByText('System')).toBeOnTheScreen();
    expect(screen.getByText('Light')).toBeOnTheScreen();
    expect(screen.getByTestId('theme-mode-dark').props.accessibilityState.selected).toBe(true);
    expect(screen.getByTestId('theme-mode-light').props.accessibilityState.selected).toBe(false);
  });

  it('reports the tapped mode', async () => {
    const onChange = jest.fn();
    await renderWithProviders(<ThemeModeSelector selected="system" onChange={onChange} />);
    await fireEvent.press(await screen.findByTestId('theme-mode-light'));
    expect(onChange).toHaveBeenCalledWith('light');
  });
});
