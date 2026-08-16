import ConfigureAmplifyClientSide from '@/app/components/ConfigureAmplify';
import Header from '@/app/components/Header';
import '@aws-amplify/ui-react/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'np-westland/style.css';
import { cn } from 'np-westland/utils';
import './globals.css';

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
      <body className={cn(inter.className, 'isolate')}>
        <ConfigureAmplifyClientSide />
        <div className="flex h-full flex-col">
          <Header />
          <div className="relative flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
