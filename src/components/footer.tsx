'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className='w-full bg-slate-50 border-t border-slate-200 mt-auto'>
      <div className='max-w-4xl mx-auto px-6 py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          <div className='flex flex-col items-center md:items-start gap-1 min-w-fit'>
            <span className='text-sm font-bold text-slate-800'>Shortly</span>
            <span className='text-xs text-slate-600 font-medium whitespace-nowrap'>
              © {new Date().getFullYear()} Todos os direitos reservados.
            </span>
          </div>

          <div className='flex flex-col items-center md:items-end gap-3'>
            <div className='flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-600'>
              <Link
                href='/terms'
                className='hover:text-indigo-600 transition-colors'
              >
                Termos de Uso
              </Link>
              <Link
                href='/privacy'
                className='hover:text-indigo-600 transition-colors'
              >
                Política de Privacidade
              </Link>
            </div>

            <div className='text-xs text-slate-500 font-medium flex items-center gap-1'>
              <span>Developed by</span>
              <a
                href='https://www.linkedin.com/in/andrelimarn/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-indigo-600 hover:text-indigo-800 transition-colors font-bold'
              >
                André Lima
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
