import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/Header';
import { Footer } from '@/components/footer';
import { GoogleAdsense } from '@/components/google-adsense';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
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

  // --- ATUALIZADO AQUI ---
  keywords: [
    // Termos Principais
    'encurtador',
    'url shortener',
    'encurtador de link',
    'shortly',
    'encurtar link',
    'diminuir link',

    // Funcionalidade: Validade / Expiração (O que você pediu)
    'link com validade',
    'prazo de validade na url',
    'colocar validade no link',
    'link que expira',
    'link temporário',
    'agendar expiração de link',
    'validade de url',

    // Funcionalidade: Senha e Segurança
    'link com senha',
    'proteger link',
    'link seguro',

    // Funcionalidade: QR Code
    'qr code',
    'gerador de qr code',

    // Termos de Uso Comum
    'link na bio',
    'link para whatsapp',
    'marketing digital',
    'grátis',
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
