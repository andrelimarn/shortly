'use client';

import { useState } from 'react';
import { verifyPassword } from '@/actions/verify-password';
import { RedirectTimer } from './redirect-timer';

interface LinkGateProps {
  slug: string;
  hasPassword: boolean;
  targetUrl?: string;
}

export function LinkGate({
  slug,
  hasPassword,
  targetUrl: initialUrl,
}: LinkGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(!hasPassword);
  const [targetUrl, setTargetUrl] = useState<string | null>(initialUrl || null);

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError('');

    const result = await verifyPassword(slug, password);

    if (result.success && result.url) {
      setTargetUrl(result.url);
      setIsUnlocked(true);
    } else {
      setError('Senha incorreta.');
      setPassword('');
    }
    setLoading(false);
  }

  // 1. ESTADO BLOQUEADO
  if (!isUnlocked) {
    return (
      <div className='bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full text-center animate-in zoom-in-95 duration-300'>
        {/* Ícone de Cadeado */}
        <div className='w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='32'
            height='32'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
            <path d='M7 11V7a5 5 0 0 1 10 0v4' />
          </svg>
        </div>

        {/* Título mais escuro */}
        <h1 className='text-2xl font-bold text-slate-900 mb-3'>
          Link Protegido
        </h1>

        {/* Descrição mais escura e legível */}
        <p className='text-base text-slate-700 mb-8 px-2 font-medium'>
          O criador deste link definiu uma senha de acesso. Por favor, insira
          abaixo para continuar.
        </p>

        <form onSubmit={handleUnlock} className='space-y-4'>
          <div className='relative'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Digite a senha...'
              // MUDANÇA: Texto preto (slate-900) e placeholder mais visível
              className={`w-full px-5 py-4 text-lg border rounded-xl focus:ring-4 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 ${
                error
                  ? 'border-red-300 focus:ring-red-100'
                  : 'border-slate-300 focus:ring-indigo-50'
              }`}
              autoFocus
            />
          </div>

          {error && (
            <div className='text-red-600 text-sm font-semibold bg-red-50 py-3 px-4 rounded-lg flex items-center justify-center gap-2 animate-in fade-in border border-red-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10' />
                <line x1='12' y1='8' x2='12' y2='12' />
                <line x1='12' y1='16' x2='12.01' y2='16' />
              </svg>
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={loading || !password}
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
          >
            {loading ? (
              <span className='w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
            ) : (
              'Desbloquear Acesso'
            )}
          </button>
        </form>
      </div>
    );
  }

  // 2. ESTADO LIBERADO
  return targetUrl ? (
    <div className='bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center'>
      <h1 className='text-xl font-semibold text-slate-800 mb-1'>
        Redirecionando...
      </h1>
      <p className='text-sm text-slate-500 mb-6 break-all'>
        Destino: {targetUrl}
      </p>

      <RedirectTimer targetUrl={targetUrl} />

      <div className='mt-8 pt-6 border-t border-slate-100'>
        <p className='text-xs text-slate-400'>Encurtado com Shortly</p>
      </div>
    </div>
  ) : null;
}
