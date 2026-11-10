import type { z } from 'zod';

import { FailureError } from '@/core/error';

/**
 * Validates an API payload against a Zod schema. A mismatch becomes an
 * `invalidResponse` failure instead of letting `undefined` leak into the UI.
 */
export function parseResponse<S extends z.ZodType>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new FailureError({ kind: 'invalidResponse', message: result.error.message });
  }
  return result.data;
}
