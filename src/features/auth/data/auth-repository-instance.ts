import { secureStorage } from '@/core/storage';

import type { AuthRepository } from '../domain/auth-repository';
import { MockAuthRepository } from './mock-auth-repository';

/**
 * Single place that decides which {@link AuthRepository} the app uses.
 * Replace {@link MockAuthRepository} with your real implementation here.
 */
export const authRepository: AuthRepository = new MockAuthRepository(secureStorage);
