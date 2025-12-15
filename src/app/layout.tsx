import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/Header';
import { Footer } from '@/components/footer';
import { GoogleAdsense } from '@/components/google-adsense';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Shortly - Encurtador de Links Seguro',
    template: '%s | Shortly',
  },
  description:
    'Encurte, proteja e compartilhe seus links com segurança. Gerador de QR Code e proteção por senha gratuitos.',

  // Palavras-chave para motores de busca
  keywords: [
    'encurtador',
    'url shortener',
    'link seguro',
    'qr code',
    'proteção por senha',
    'shortly',
  ],

  // Autoria
  authors: [
    { name: 'André Lima', url: 'https://www.linkedin.com/in/seu-linkedin' },
  ],
  creator: 'André Lima',

  // Configuração para Robôs de busca
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph (Como aparece no WhatsApp, LinkedIn, Facebook)
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: baseUrl,
    title: 'Shortly - Encurtador de Links Seguro',
    description:
      'Ferramenta gratuita para encurtar URLs, gerar QR Codes e proteger links com senha.',
    siteName: 'Shortly',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Shortly Preview',
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Shortly - Encurtador de Links Seguro',
    description: 'Encurte seus links com segurança e gere QR Codes.',
    images: ['/og-image.png'],
  },

  // Ícones
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900`}
      >
        <GoogleAdsense />
        <Header />
        <div className='pt-[84px] flex-1 w-full flex flex-col'>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
