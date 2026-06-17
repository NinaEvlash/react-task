import type { Metadata } from 'next';
import { ReduxProvider } from '../providers/redux-provider';

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
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}