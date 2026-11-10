/* eslint-disable no-console -- the logger is the one sanctioned console user */

type Level = 'debug' | 'info' | 'warn' | 'error';

/**
 * Minimal logger. `debug`/`info` are dev-only (`__DEV__`); `warn`/`error`
 * always reach the console so crash reporting can hook in here later.
 */
export const logger = {
  debug: (...args: unknown[]) => write('debug', args),
  info: (...args: unknown[]) => write('info', args),
  warn: (...args: unknown[]) => write('warn', args),
  error: (...args: unknown[]) => write('error', args),
};

function write(level: Level, args: unknown[]): void {
  if ((level === 'debug' || level === 'info') && !__DEV__) return;
  console[level](...args);
}
