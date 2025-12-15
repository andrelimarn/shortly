'use client';

import Script from 'next/script';

export function GoogleAdsense() {
  // Evita carregar os anúncios enquanto você desenvolve em localhost (opcional)
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script
      async
      src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3495920239859464'
      crossOrigin='anonymous'
      strategy='afterInteractive'
    />
  );
}
