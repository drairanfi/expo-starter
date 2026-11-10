import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { AppProviders } from '@/core/config/app-providers';

/** Renders UI inside the same global providers as the app (query cache + theme). */
export function renderWithProviders(ui: ReactElement) {
  return render(<AppProviders>{ui}</AppProviders>);
}
