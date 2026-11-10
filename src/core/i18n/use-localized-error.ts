import { useTranslation } from 'react-i18next';

import { failureMessageKey, toFailure } from '@/core/error';

/** Turns anything thrown into a user-facing, localised message. */
export function useLocalizedError() {
  const { t } = useTranslation();
  return (error: unknown): string => t(failureMessageKey(toFailure(error)));
}
