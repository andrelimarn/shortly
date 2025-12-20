'use client';

import Script from 'next/script';

export function GoogleAdsense() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script
      async
      src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3495920239859464'
      crossOrigin='anonymous'
      strategy='lazyOnload'
    />
  );
}
