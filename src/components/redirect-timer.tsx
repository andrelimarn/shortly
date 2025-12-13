'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectTimerProps {
  targetUrl: string;
}

export function RedirectTimer({ targetUrl }: RedirectTimerProps) {
  const [timeLeft, setTimeLeft] = useState(5);
  const router = useRouter();

  useEffect(() => {
    // Função para decrescer o tempo
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          // Verifica se a URL começa com http/https, se não adiciona
          const finalUrl = targetUrl.startsWith('http')
            ? targetUrl
            : `https://${targetUrl}`;

          window.location.href = finalUrl; // Redirecionamento forçado
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl, router]);

  return (
    <div className='flex flex-col items-center justify-center py-4'>
      <div className='text-4xl font-bold text-indigo-600 mb-2'>{timeLeft}s</div>
      <div className='w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden'>
        <div
          className='h-full bg-indigo-600 transition-all duration-1000 ease-linear'
          style={{ width: `${(timeLeft / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}
