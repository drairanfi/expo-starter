import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { initI18n } from '@/core/i18n';
import { createQueryClient } from '@/core/network';
import { ThemeProvider } from '@/core/theme';

// Bundled resources: initialised synchronously before the first render.
initI18n();

/** Global providers: server-state cache and theme. Feature-agnostic. */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
