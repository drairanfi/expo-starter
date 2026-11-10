/** Resolves after `ms` milliseconds. Used by mock repositories to simulate latency. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
