import { z } from 'zod';

/**
 * Login form schema. Messages are i18n keys (resolved by the UI), so
 * validation stays pure and language-agnostic.
 */
export const credentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'validation.emailRequired')
    .pipe(z.email('validation.emailInvalid')),
  password: z.string().min(1, 'validation.passwordRequired'),
});

export type Credentials = z.infer<typeof credentialsSchema>;
