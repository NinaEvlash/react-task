import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '../providers/redux-provider';
import ThemeProvider from '../providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'Pokemon Search',
  description: 'Pokemon Search App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}