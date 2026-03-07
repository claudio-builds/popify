import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Popify - Notificações de Prova Social para Aumentar Vendas',
  description: 'Aumente suas conversões com notificações de prova social em tempo real. Mostre aos visitantes quando outros compram, se cadastram ou agem. Teste grátis!',
  keywords: 'prova social, notificações, conversões, ecommerce, saas, marketing, social proof, popify, aumentar vendas, widget de vendas, popup de vendas',
  authors: [{ name: 'Claudio Tools' }],
  openGraph: {
    title: 'Popify - Notificações de Prova Social',
    description: 'Aumente conversões com notificações de prova social em tempo real. Instale em 2 minutos. Teste grátis!',
    type: 'website',
    url: 'https://popify-app.vercel.app',
    siteName: 'Popify',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Popify - Prova Social que Converte',
    description: 'Notificações de prova social em tempo real para seu site. Aumente vendas em minutos.',
  },
  alternates: {
    canonical: 'https://popify-app.vercel.app',
  },
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Popify",
              "description": "Notificações de prova social em tempo real para aumentar conversões do seu site.",
              "url": "https://popify-app.vercel.app",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL",
                "description": "Plano gratuito disponível"
              },
              "author": {
                "@type": "Organization",
                "name": "Claudio Tools"
              }
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
