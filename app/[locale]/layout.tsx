import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { ReduxProvider } from '@/providers/redux-provider';
import ThemeProvider from '@/providers/ThemeProvider';
import Navigation from '@/components/Navigation/Navigation';

function isLocale(value: string): value is (typeof routing.locales)[number] {
  return routing.locales.includes(value as (typeof routing.locales)[number]);
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: string };

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <ReduxProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider>
          <Navigation />
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </ReduxProvider>
  );
}