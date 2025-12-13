'use client';

import { useEffect, useState } from 'react';
import { getAnalytics, ClickLog } from '@/actions/get-analytics';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  totalClicks: number;
}

export function AnalyticsModal({
  isOpen,
  onClose,
  slug,
  totalClicks,
}: AnalyticsModalProps) {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ClickLog[]>([]);

  useEffect(() => {
    if (isOpen && slug) {
      getAnalytics(slug).then((data) => {
        setLogs(data);
        setLoading(false);
      });
    }
  }, [isOpen, slug]);

  if (!isOpen) return null;

  // Função auxiliar para agrupar dados
  // Agora aceita um "transform" opcional para customizar o valor (ex: Cidade ou País)
  function groupData(field: keyof ClickLog, fallbackField?: keyof ClickLog) {
    const counts: Record<string, number> = {};

    logs.forEach((log) => {
      // Lógica de Prioridade: Tenta o campo principal (City), se falhar tenta o fallback (Country)
      let value = log[field];

      if (!value && fallbackField) {
        value = log[fallbackField];
      }

      const finalLabel = value || 'Desconhecido';
      counts[finalLabel] = (counts[finalLabel] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Mudança aqui: Agrupamos por CITY, com fallback para COUNTRY
  const locations = groupData('city', 'country');
  const devices = groupData('device');

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 relative'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1'
        >
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
            <line x1='18' y1='6' x2='6' y2='18' />
            <line x1='6' y1='6' x2='18' y2='18' />
          </svg>
        </button>

        <div className='mb-6'>
          <h3 className='text-xl font-bold text-slate-800'>Estatísticas</h3>
          <p className='text-sm text-slate-500'>/{slug}</p>
        </div>

        {loading ? (
          <div className='py-10 flex justify-center'>
            <div className='w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : logs.length === 0 ? (
          <div className='text-center py-8 text-slate-400 bg-slate-50 rounded-lg'>
            <p>Ainda não há dados detalhados para este link.</p>
          </div>
        ) : (
          <div className='space-y-6'>
            {/* Total */}
            <div className='bg-indigo-50 p-4 rounded-lg flex items-center justify-between'>
              <span className='text-sm font-medium text-indigo-900'>
                Total de Cliques
              </span>
              <span className='text-2xl font-bold text-indigo-600'>
                {totalClicks}
              </span>
            </div>

            {/* CIDADES / LOCAIS */}
            <div>
              <h4 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3'>
                Principais Cidades
              </h4>
              <div className='space-y-2'>
                {locations.slice(0, 5).map((item) => (
                  <div
                    key={item.name}
                    className='flex items-center gap-3 text-sm'
                  >
                    {/* AQUI ESTÁ A MUDANÇA VISUAL: w-32 (128px) dá muito mais espaço */}
                    <div
                      className='w-32 font-medium text-slate-700 truncate'
                      title={item.name}
                    >
                      {item.name}
                    </div>

                    <div className='flex-1 bg-slate-100 rounded-full h-2 overflow-hidden'>
                      <div
                        className='bg-indigo-500 h-full rounded-full'
                        style={{
                          width: `${(item.count / logs.length) * 100}%`,
                        }}
                      />
                    </div>
                    <div className='text-slate-500 w-6 text-right'>
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispositivos */}
            <div>
              <h4 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3'>
                Dispositivos
              </h4>
              <div className='grid grid-cols-2 gap-3'>
                {devices.map((item) => (
                  <div
                    key={item.name}
                    className='bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between'
                  >
                    <span className='text-sm text-slate-700'>{item.name}</span>
                    <span className='font-bold text-slate-900'>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
