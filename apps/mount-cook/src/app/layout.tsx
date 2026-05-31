import '@aws-amplify/ui-react/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

import ConfigureAmplifyClientSide from '@/components/ConfigureAmplify';
import Logout from '@/components/auth/logout/Logout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wherely',
  description: 'Go where your interests lead.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        <div className="flex h-full flex-col">
          <div className="h-[100px]">
            <Logout />
            <Link href="/map-layout-editor">Map Layout Editor</Link>
          </div>
          <div className="relative flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
