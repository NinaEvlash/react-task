export const locales = ['en', 'pl'] as const;

export type Locale = (typeof locales)[number];

export const routing = {
  locales,
  defaultLocale: 'en',
} as const;
