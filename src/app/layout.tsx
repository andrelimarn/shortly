import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/Header';
import { Footer } from '@/components/footer';
import { GoogleAdsense } from '@/components/google-adsense';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // <--- 1. Importante para o PageSpeed
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // <--- 1. Importante para o PageSpeed
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

  keywords: [
    // Termos Principais
    'encurtador',
    'encurtador de link',
    'encurtador de url',
    'url shortener',
    'shortly',

    // Ações comuns (O que a pessoa quer fazer)
    'encurtar link',
    'diminuir link',
    'criar link curto',
    'personalizar link',

    // Funcionalidades Específicas (Seus diferenciais)
    'qr code',
    'gerador de qr code',
    'qr code gratuito',
    'link com senha',
    'link seguro',
    'link temporário',
    'proteger link',

    // Casos de Uso (Onde a pessoa vai usar)
    'link na bio',
    'link para instagram',
    'link para whatsapp',
    'marketing digital',

    // Termos Comerciais
    'grátis',
    'free url shortener',
    'ferramenta gratuita',
  ],

  authors: [
    { name: 'André Lima', url: 'https://www.linkedin.com/in/andrelimarn/' },
  ],
  creator: 'André Lima',

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

  twitter: {
    card: 'summary_large_image',
    title: 'Shortly - Encurtador de Links Seguro',
    description: 'Encurte seus links com segurança e gere QR Codes.',
    images: ['/og-image.png'],
  },

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
        // 2. Adicionei 'font-sans' aqui para aplicar a fonte Geist corretamente
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900`}
      >
        <GoogleAdsense />
        <Header />
        <div className='pt-[84px] flex-1 w-full flex flex-col'>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
