import { en } from '@/core/i18n/locales/en';
import { es } from '@/core/i18n/locales/es';

/** Flattens a nested translation object into `a.b.c -> string` pairs. */
function flatten(node: unknown, prefix = ''): Record<string, string> {
  if (typeof node === 'string') return { [prefix]: node };
  return Object.entries(node as Record<string, unknown>).reduce<Record<string, string>>(
    (acc, [key, value]) => ({ ...acc, ...flatten(value, prefix ? `${prefix}.${key}` : key) }),
    {},
  );
}

const flatEn = flatten(en);
const flatEs = flatten(es);
const placeholders = (text: string) =>
  [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort();

describe('translations', () => {
  it('have identical key sets in en and es', () => {
    expect(Object.keys(flatEs).sort()).toEqual(Object.keys(flatEn).sort());
  });

  it('have no empty strings', () => {
    for (const [key, value] of [...Object.entries(flatEn), ...Object.entries(flatEs)]) {
      expect({ key, empty: value.trim() === '' }).toEqual({ key, empty: false });
    }
  });

  it('use the same interpolation placeholders in both languages', () => {
    for (const key of Object.keys(flatEn)) {
      expect({ key, vars: placeholders(flatEs[key] ?? '') }).toEqual({
        key,
        vars: placeholders(flatEn[key] ?? ''),
      });
    }
  });
});
