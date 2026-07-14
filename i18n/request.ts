import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing, type Locale } from './routing';

import enMessages from '../messages/en.json';
import plMessages from '../messages/pl.json';

const messages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  pl: plMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});
