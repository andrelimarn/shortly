'use client';

import { createShortLink } from '@/actions/create-link';
import { useRef, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type='submit'
      className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg p-3 transition-colors font-medium mt-4'
    >
      {pending ? 'Encurtando...' : 'Encurtar Link'}
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
  const [showOptions, setShowOptions] = useState(false); // Controla visibilidade das opções avançadas

  // Remove o domínio (https://...) para mostrar no prefixo do input visualmente
  const domain =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, '') ||
    'shortly.com';

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
    const customSlug = formData.get('customSlug') as string; // Captura o slug personalizado

    // Captura data apenas se o campo estiver visível/preenchido
    const expiresAtRaw = formData.get('expiresAt') as string;
    const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

    // Envia para o servidor
    const res = await createShortLink({
      targetUrl: url,
      expiresAt,
      customSlug: customSlug || undefined, // Envia undefined se estiver vazio
    });

    if (res?.error) {
      setError(res.error);
    } else if (res?.success && res.slug) {
      setResultSlug(res.slug);

      saveToLocalHistory({
        slug: res.slug,
        original: url,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt ? expiresAt.toISOString() : null,
      });

      window.dispatchEvent(new Event('link-created'));
      formRef.current?.reset();
      setShowOptions(false); // Reseta as opções
    }
  }

  function saveToLocalHistory(newLink: LocalLink) {
    const saved = localStorage.getItem('shortly_history');
    const history = saved ? JSON.parse(saved) : [];
    const updated = [newLink, ...history];
    localStorage.setItem('shortly_history', JSON.stringify(updated));
  }

  return (
    <section className='bg-white rounded-2xl p-6 shadow-sm mb-6 border border-slate-100'>
      <h2 className='text-2xl font-bold text-slate-800'>Encurtar URL</h2>
      <p className='mt-1 text-sm text-slate-500 mb-6'>
        Cole seu link longo e transforme em algo curto e memorável.
      </p>

      <form
        ref={formRef}
        action={clientAction}
        className='space-y-4'
        noValidate
      >
        {/* INPUT DE URL (Principal) */}
        <div>
          <label className='block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider'>
            URL de Destino
          </label>
          <div className='relative'>
            <input
              name='url'
              type='url'
              required
              placeholder='https://exemplo.com/pagina-muito-longa'
              className='w-full p-3 pl-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400'
            />
            {/* Ícone de Link */}
            <div className='absolute left-3 top-3.5 text-slate-400'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
                <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
              </svg>
            </div>
          </div>
        </div>

        {/* TOGGLE DE OPÇÕES */}
        <div className='pt-2'>
          <button
            type='button'
            onClick={() => setShowOptions(!showOptions)}
            className='flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors'
          >
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
              className={`transition-transform duration-200 ${
                showOptions ? 'rotate-180' : ''
              }`}
            >
              <polyline points='6 9 12 15 18 9' />
            </svg>
            {showOptions
              ? 'Ocultar opções'
              : 'Configurações (Link personalizado, Expiração)'}
          </button>
        </div>

        {/* ÁREA DE OPÇÕES AVANÇADAS (Collapsible) */}
        {showOptions && (
          <div className='space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-200'>
            {/* 1. SLUG PERSONALIZADO */}
            <div>
              <label className='block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider'>
                Personalizar Link
              </label>
              <div className='flex rounded-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all'>
                <div className='bg-slate-50 px-3 py-3 text-slate-500 text-sm border-r border-slate-200 select-none'>
                  {domain}/
                </div>
                <input
                  name='customSlug'
                  type='text'
                  maxLength={20}
                  placeholder='meu-link'
                  className='flex-1 p-3 focus:outline-none text-slate-800 placeholder:text-slate-400 text-sm'
                />
              </div>
              <p className='text-[10px] text-slate-400 mt-1 ml-1'>
                Deixe em branco para gerar aleatoriamente.
              </p>
            </div>

            {/* 2. DATA DE EXPIRAÇÃO */}
            <div>
              <label className='block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider'>
                Data de Expiração
              </label>
              <input
                name='expiresAt'
                type='datetime-local'
                className='w-full p-3 rounded-lg border border-slate-200 text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
              />
            </div>
          </div>
        )}

        <SubmitButton />
      </form>

      {/* ERROS */}
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

      {/* SUCESSO */}
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
