'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 scale-100'>
        <div className='flex flex-col items-center text-center'>
          <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M3 6h18' />
              <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
              <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
              <line x1='10' x2='10' y1='11' y2='17' />
              <line x1='14' x2='14' y1='11' y2='17' />
            </svg>
          </div>

          <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
          <p className='text-sm text-slate-500 mt-2'>{description}</p>
        </div>

        <div className='flex gap-3 mt-6'>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors text-sm disabled:opacity-50'
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors text-sm shadow-sm flex items-center justify-center disabled:opacity-50'
          >
            {isLoading ? 'Aguarde...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
