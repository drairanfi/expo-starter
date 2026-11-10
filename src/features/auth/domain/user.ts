import { z } from 'zod';

/** Authenticated user entity. Also used to validate persisted / API data. */
export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().min(1),
  name: z.string().min(1),
});

export type User = z.infer<typeof UserSchema>;
