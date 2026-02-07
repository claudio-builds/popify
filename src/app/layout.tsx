import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Popify - Social Proof Notifications',
  description: 'Boost conversions with real-time social proof notifications. Show visitors when others buy, sign up, or take action.',
  keywords: 'social proof, notifications, conversions, ecommerce, saas, marketing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
