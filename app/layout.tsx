import type { Metadata } from 'next';
import './globals.css';

import { ReduxProvider } from '../providers/redux-provider';
import ThemeProvider from '../providers/ThemeProvider';
import Navigation from '../components/Navigation/Navigation';

export const metadata: Metadata = {
  title: 'Pokemon Search',
  description: 'Pokemon Search App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ReduxProvider>
            <Navigation />
            {children}
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}