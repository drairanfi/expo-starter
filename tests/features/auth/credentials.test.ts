import { credentialsSchema } from '@/features/auth/domain/credentials';

function firstMessage(input: { email: string; password: string }) {
  const result = credentialsSchema.safeParse(input);
  return result.success ? null : result.error.issues.map((i) => i.message);
}

describe('credentialsSchema', () => {
  it('accepts a valid email and password and trims the email', () => {
    expect(credentialsSchema.parse({ email: '  ana@example.com ', password: 'x' }).email).toBe(
      'ana@example.com',
    );
  });

  it('requires an email', () => {
    expect(firstMessage({ email: '  ', password: 'x' })).toContain('validation.emailRequired');
  });

  it('rejects an invalid email', () => {
    expect(firstMessage({ email: 'ana@', password: 'x' })).toContain('validation.emailInvalid');
  });

  it('requires a password', () => {
    expect(firstMessage({ email: 'ana@example.com', password: '' })).toContain(
      'validation.passwordRequired',
    );
  });
});
