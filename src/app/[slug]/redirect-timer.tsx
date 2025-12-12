'use client';
import { useEffect, useState } from 'react';

export function RedirectTimer({ targetUrl }: { targetUrl: string }) {
  const [count, setCount] = useState(5); // Timer de 5s [cite: 41]

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRedirect = () => {
    window.location.href = targetUrl; // Redirecionamento final [cite: 19]
  };

  // Auto-redirect após timer (opcional, mas comum)
  useEffect(() => {
    if (count === 0) {
      const auto = setTimeout(handleRedirect, 2000);
      return () => clearTimeout(auto);
    }
  }, [count]);

  return (
    <div className='text-center w-full'>
      <div className='text-4xl font-bold text-indigo-600 mb-2'>
        {count > 0 ? count : 'GO'}
      </div>
      <div className='text-xs text-slate-400 mb-4'>segundos</div>

      {/* Botão habilitado apenas após timer [cite: 42] */}
      <button
        onClick={handleRedirect}
        disabled={count > 0}
        className='w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm'
      >
        {count > 0 ? 'Aguarde...' : 'Prosseguir'}
      </button>
    </div>
  );
}
