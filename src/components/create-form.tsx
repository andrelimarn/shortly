'use client';

import { useState } from 'react';
import { createLink } from '@/actions/create-link';

export function CreateForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await createLink(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      const currentHistory = JSON.parse(
        localStorage.getItem('shortly_history') || '[]'
      );

      const password = formData.get('password')?.toString();
      const hasPassword = !!(password && password.trim() !== '');

      const newLink = {
        slug: result.slug,
        original: formData.get('url')?.toString(),
        createdAt: new Date().toISOString(),
        expiresAt: formData.get('expires_at')?.toString() || null,
        hasPassword: hasPassword,
      };

      localStorage.setItem(
        'shortly_history',
        JSON.stringify([newLink, ...currentHistory])
      );

      const event = new CustomEvent('link-created', {
        detail: { slug: result.slug },
      });
      window.dispatchEvent(event);

      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className='w-full space-y-4'>
      <div className='relative group'>
        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-slate-400 group-focus-within:text-indigo-500 transition-colors'
          >
            <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
            <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
          </svg>
        </div>
        <input
          type='url'
          name='url'
          required
          placeholder='Cole um link para encurtar'
          className='w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-base text-slate-800'
        />
      </div>

      <div className='flex flex-col'>
        {!showOptions ? (
          <button
            type='button'
            onClick={() => setShowOptions(true)}
            className='w-full border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 transition-all duration-200 group bg-transparent'
          >
            <div className='bg-slate-100 group-hover:bg-indigo-100 p-1.5 rounded-md transition-colors'>
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
                <line x1='12' y1='5' x2='12' y2='19' />
                <line x1='5' y1='12' x2='19' y2='12' />
              </svg>
            </div>
            <span className='font-medium text-sm'>
              Adicionar link personalizado, senha ou validade
            </span>
          </button>
        ) : (
          <div className='bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in slide-in-from-top-2 duration-300'>
            <div className='flex items-center justify-between border-b border-slate-100 pb-3 mb-2'>
              <h3 className='text-sm font-semibold text-slate-800 flex items-center gap-2'>
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
                  className='text-indigo-500'
                >
                  <circle cx='12' cy='12' r='3' />
                  <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' />
                </svg>
                Configurações Avançadas
              </h3>
              <button
                type='button'
                onClick={() => setShowOptions(false)}
                className='text-xs text-slate-400 hover:text-red-500 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors'
              >
                Fechar
              </button>
            </div>

            <div>
              <label className='block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5'>
                Link Personalizado
              </label>
              <div className='flex'>
                <span className='bg-slate-50 text-slate-400 px-3 py-2.5 rounded-l-lg border border-r-0 border-slate-200 text-sm font-mono flex items-center'>
                  shortly.com/
                </span>
                <input
                  type='text'
                  name='slug'
                  placeholder='minha-url'
                  pattern='[a-zA-Z0-9-_]+'
                  className='flex-1 px-3 py-2.5 border border-slate-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5'>
                  Validade (Opcional)
                </label>
                <input
                  type='datetime-local'
                  name='expires_at'
                  className='w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-600 bg-white'
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1'>
                  Proteção por Senha
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    name='password'
                    placeholder='******'
                    className='w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white'
                  />
                  <div className='absolute left-3 top-2.5 text-slate-400'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='14'
                      height='14'
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-6 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2'
      >
        {loading ? (
          <>
            <span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
            Encurtando...
          </>
        ) : (
          <>
            Encurtar Agora
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='m9 18 6-6-6-6' />
            </svg>
          </>
        )}
      </button>

      {error && (
        <div className='p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3 animate-in fade-in'>
          <div className='bg-red-100 p-1.5 rounded-full'>
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
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </div>
          {error}
        </div>
      )}
    </form>
  );
}
