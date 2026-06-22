import {getRequestConfig} from 'next-intl/server';
import {routing, type Locale} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  const currentLocale: Locale =
    locale && routing.locales.includes(locale as Locale)
      ? (locale as Locale)
      : routing.defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  };
});