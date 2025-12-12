'use client';

import { createUrl } from '@/app/actions';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { CopyButton } from './copy-button';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type='submit'
      className='bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg p-3 transition-colors font-medium'
    >
      {pending ? 'Encurtando...' : 'Encurtar'}
    </button>
  );
}

export function CreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [resultSlug, setResultSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  async function clientAction(formData: FormData) {
    setError(null);
    setResultSlug(null);

    const res = await createUrl(formData);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success && res.slug) {
      setResultSlug(res.slug);
      formRef.current?.reset();
    }
  }

  const fullShortUrl = resultSlug ? `${baseUrl}/${resultSlug}` : '';

  return (
    <section className='bg-white rounded-2xl p-6 shadow-sm mb-6'>
      <h2 className='text-2xl font-semibold'>Encurtar URL</h2>
      <p className='mt-1 text-sm text-slate-500'>
        Cole uma URL longa e gere um link curto para compartilhar.
      </p>

      <form
        ref={formRef}
        action={clientAction}
        className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'
      >
        <input
          name='url'
          type='url'
          required
          placeholder='https://exemplo.com/pagina-longa'
          className='col-span-2 p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300'
        />
        <SubmitButton />
      </form>

      {error && (
        <div className='mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100'>
          {error}
        </div>
      )}

      {/* Área de Resultado (Só aparece se tiver slug) */}
      {resultSlug && (
        <div className='mt-4 animate-in fade-in slide-in-from-top-2'>
          <label className='block text-xs text-slate-500'>Link curto</label>
          <div className='mt-2 flex items-center gap-3'>
            <input
              readOnly
              value={fullShortUrl}
              className='flex-1 p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700'
            />
            <CopyButton
              text={fullShortUrl}
              className='px-3 py-2 border rounded-lg text-sm hover:bg-slate-50'
            />
            <a
              href={`/${resultSlug}`}
              target='_blank'
              className='px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors'
            >
              Abrir
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
