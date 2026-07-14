import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { routing } from '@/i18n/routing';
import Navigation from '@/components/Navigation/Navigation';
import { ReduxProvider } from '@/providers/redux-provider';
import ThemeProvider from '@/providers/ThemeProvider';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

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
