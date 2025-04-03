import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Something Happened (.wtf)',
  description:
    'A zero-knowledge blockchain explorer where... something happens? Explore the playful take on privacy and transaction obfuscation.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${ibmPlexSans.variable} font-sans antialiased min-h-screen bg-background`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
