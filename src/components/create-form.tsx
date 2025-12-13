'use client';

import { createShortLink } from '@/actions/create-link';
import { useRef, useState, useEffect } from 'react'; // Adicionado useEffect
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type='submit'
      className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg p-3 transition-colors font-medium mt-2'
    >
      {pending ? 'Encurtando...' : 'Encurtar'}
    </button>
  );
}

interface LocalLink {
  slug: string;
  original: string;
  createdAt: string;
  expiresAt?: string | null;
}

export function CreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [resultSlug, setResultSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExpiration, setShowExpiration] = useState(false);

  // Efeito para limpar a mensagem de sucesso automaticamente após 3 segundos
  useEffect(() => {
    if (resultSlug) {
      const timer = setTimeout(() => {
        setResultSlug(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [resultSlug]);

  async function clientAction(formData: FormData) {
    setError(null);
    setResultSlug(null);

    const url = formData.get('url') as string;

    const expiresAtRaw = showExpiration
      ? (formData.get('expiresAt') as string)
      : null;
    const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

    // 1. Cria no Servidor
    const res = await createShortLink({ targetUrl: url, expiresAt });

    if (res?.error) {
      setError(res.error);
    } else if (res?.success && res.slug) {
      setResultSlug(res.slug);

      // 2. Salva no Navegador
      saveToLocalHistory({
        slug: res.slug,
        original: url,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt ? expiresAt.toISOString() : null,
      });

      window.dispatchEvent(new Event('link-created'));

      formRef.current?.reset();
      setShowExpiration(false);
    }
  }

  function saveToLocalHistory(newLink: LocalLink) {
    const saved = localStorage.getItem('shortly_history');
    const history = saved ? JSON.parse(saved) : [];
    const updated = [newLink, ...history];
    localStorage.setItem('shortly_history', JSON.stringify(updated));
  }

  return (
    <section className='bg-white rounded-2xl p-6 shadow-sm mb-6'>
      <h2 className='text-2xl font-semibold'>Encurtar URL</h2>
      <p className='mt-1 text-sm text-slate-500 mb-6'>
        Seus links ficam salvos apenas neste navegador.
      </p>

      <form
        ref={formRef}
        action={clientAction}
        className='space-y-4'
        noValidate
      >
        <div>
          <label className='block text-xs font-medium text-slate-700 mb-1'>
            URL de Destino
          </label>
          <input
            name='url'
            type='url'
            required
            placeholder='https://exemplo.com'
            className='w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300'
          />
        </div>

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='toggle-expiration'
            checked={showExpiration}
            onChange={(e) => setShowExpiration(e.target.checked)}
            className='w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer'
          />
          <label
            htmlFor='toggle-expiration'
            className='text-sm text-slate-600 cursor-pointer select-none'
          >
            Definir expiração
          </label>
        </div>

        {showExpiration && (
          <div className='animate-in fade-in slide-in-from-top-1 duration-200'>
            <input
              name='expiresAt'
              type='datetime-local'
              required={showExpiration}
              className='w-full p-3 rounded-lg border border-slate-200 text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300'
            />
          </div>
        )}

        <SubmitButton />
      </form>

      {/* Exibe erro se houver */}
      {error && (
        <div className='mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1'>
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
            <line x1='12' x2='12' y1='8' y2='12' />
            <line x1='12' x2='12.01' y1='16' y2='16' />
          </svg>
          {error}
        </div>
      )}

      {/* MENSAGEM DE SUCESSO TEMPORÁRIA */}
      {resultSlug && (
        <div className='mt-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-100 flex items-center justify-center gap-2 font-medium animate-in fade-in slide-in-from-top-2'>
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
            <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
            <polyline points='22 4 12 14.01 9 11.01' />
          </svg>
          Link criado com sucesso!
        </div>
      )}
    </section>
  );
}
