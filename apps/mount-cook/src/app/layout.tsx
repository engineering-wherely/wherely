import '@aws-amplify/ui-react/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import styles from './layout.module.css';

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
        <div className={styles.container}>
          <div className={styles.navBar}>
            <Logout />
            <Link href="/map-layout-editor">Map Layout Editor</Link>
          </div>
          <div className={styles.contentContainer}>{children}</div>
        </div>
      </body>
    </html>
  );
}
