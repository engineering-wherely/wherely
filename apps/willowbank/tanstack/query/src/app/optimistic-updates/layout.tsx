import type { Metadata } from 'next'
import type React from 'react'
import Providers from './providers'

export const metaData: Metadata = {
  title: 'TansStack Query - Optimistic Updates',
  description: 'Next.js App Router example with optimistic updates'
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <Providers>{children}</Providers>
  )
}