import './globals.css'
import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google'

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
})

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-ibm-plex-sans-arabic',
})

export const metadata: Metadata = {
  title: 'GPT-IQ',
  description: 'Chat with GPT-IQ, an Arabic-focused AI assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className={`${ibmPlexSans.variable} ${ibmPlexSansArabic.variable}`}>
      <body className="min-h-screen bg-[#1B1C1D] font-sans">{children}</body>
    </html>
  )
}
