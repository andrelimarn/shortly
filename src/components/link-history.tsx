'use client';

import { useEffect, useState } from 'react';
import { CopyButton } from './copy-button';
import { ConfirmModal } from './confirm-modal';
import { getLinkMetrics } from '@/actions/get-link-metrics';
import { AnalyticsModal } from './analytics-modal';
import { QrModal } from './qr-modal';

interface LocalLink {
  slug: string;
  original: string;
  createdAt: string;
  expiresAt?: string | null;
  clicks?: number;
  hasPassword?: boolean;
}

export function LinkHistory() {
  const [links, setLinks] = useState<LocalLink[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  // Estado para o Modal de Analytics
  const [selectedLinkStats, setSelectedLinkStats] = useState<{
    slug: string;
    clicks: number;
  } | null>(null);

  // Estado para o Modal de QR Code
  const [qrLink, setQrLink] = useState<{ slug: string; url: string } | null>(
    null
  );

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    async function loadAndSyncLinks() {
      const saved = localStorage.getItem('shortly_history');
      if (!saved) return;

      try {
        const localData: LocalLink[] = JSON.parse(saved);
        setLinks(localData);

        // Sincroniza contagem de cliques com o servidor
        if (localData.length > 0) {
          const slugs = localData.map((l) => l.slug);
          const metrics = await getLinkMetrics(slugs);

          setLinks((currentLinks) => {
            return currentLinks.map((link) => {
              const remoteMetric = metrics?.find((m) => m.slug === link.slug);
              return {
                ...link,
                clicks: remoteMetric ? remoteMetric.clicks : 0,
              };
            });
          });
        }
      } catch (e) {
        console.error('Erro ao ler histórico', e);
      }
    }

    loadAndSyncLinks();

    // Atualiza o relógio para verificar expiração em tempo real
    const frameId = requestAnimationFrame(() => setNow(Date.now()));
    const interval = setInterval(() => setNow(Date.now()), 1000);

    // Ouve eventos de criação de link para atualizar a lista instantaneamente
    window.addEventListener('link-created', loadAndSyncLinks);

    return () => {
      window.removeEventListener('link-created', loadAndSyncLinks);
      clearInterval(interval);
      cancelAnimationFrame(frameId);
    };
  }, []);

  function confirmClear() {
    localStorage.removeItem('shortly_history');
    setLinks([]);
    setShowConfirmModal(false);
  }

  function getTimeRemaining(expiresAt: string, currentTime: number) {
    const total = Date.parse(expiresAt) - currentTime;
    if (total <= 0) return null;

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds}s`;
  }

  if (links.length === 0) {
    return (
      <div className='text-center py-10 text-slate-400 mt-6 border-t border-slate-200 pt-10'>
        <p>Seus links recentes aparecerão aqui.</p>
        <p className='text-xs mt-1'>
          Eles ficam salvos apenas neste navegador.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className='mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-medium text-slate-800'>
            Histórico Recente
          </h3>
          <button
            onClick={() => setShowConfirmModal(true)}
            className='text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1'
          >
            Limpar
          </button>
        </div>

        <div className='space-y-3'>
          {links.map((link) => {
            let isExpired = false;
            let badgeText = 'Ativo';
            let timeRemaining = null;

            if (link.expiresAt && now !== null) {
              const expDate = new Date(link.expiresAt);
              isExpired = now > expDate.getTime();
              timeRemaining = getTimeRemaining(link.expiresAt, now);

              if (!isExpired && timeRemaining) {
                badgeText = `Expira em ${timeRemaining}`;
              } else if (isExpired) {
                badgeText = 'Expirado';
              }
            }

            const fullUrl = `${baseUrl}/${link.slug}`;

            return (
              <div
                key={link.slug}
                className={`p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border transition-all duration-300 ${
                  isExpired
                    ? 'bg-slate-50 border-slate-200 opacity-60 grayscale-[0.5]'
                    : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                {/* LADO ESQUERDO: Informações */}
                <div className='overflow-hidden w-full'>
                  <div className='flex items-center flex-wrap gap-2 mb-1'>
                    <span className='text-[10px] uppercase tracking-wider text-slate-400 font-semibold'>
                      {new Date(link.createdAt).toLocaleDateString('pt-BR')}
                    </span>

                    {/* Badge Expiração */}
                    {link.expiresAt && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 transition-colors duration-300 ${
                          isExpired
                            ? 'bg-red-100 text-red-600'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {!isExpired && (
                          <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                        )}
                        {badgeText}
                      </span>
                    )}

                    {/* Badge Senha */}
                    {link.hasPassword && (
                      <span className='text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-orange-100 text-orange-700 flex items-center gap-1'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='10'
                          height='10'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='3'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <rect
                            x='3'
                            y='11'
                            width='18'
                            height='11'
                            rx='2'
                            ry='2'
                          />
                          <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                        </svg>
                        Protegido
                      </span>
                    )}
                  </div>

                  <div className='flex items-center gap-2 font-medium'>
                    <span
                      className={`px-2 py-0.5 rounded text-sm ${
                        isExpired
                          ? 'text-slate-500 bg-slate-200 line-through'
                          : 'text-indigo-600 bg-indigo-50'
                      }`}
                    >
                      /{link.slug}
                    </span>
                    <span className='text-slate-600 text-sm truncate block flex-1 max-w-[200px] sm:max-w-md'>
                      {link.original}
                    </span>
                  </div>

                  {/* Área de Analytics */}
                  <div className='flex items-center gap-3 mt-2'>
                    <div className='flex items-center gap-1 text-xs text-slate-500 font-medium'>
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
                        <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                        <polyline points='14 2 14 8 20 8' />
                        <line x1='16' y1='13' x2='8' y2='13' />
                        <line x1='16' y1='17' x2='8' y2='17' />
                        <polyline points='10 9 9 9 8 9' />
                      </svg>
                      {link.clicks !== undefined ? (
                        <span>{link.clicks} cliques</span>
                      ) : (
                        <span className='animate-pulse bg-slate-200 h-3 w-10 rounded'></span>
                      )}
                    </div>

                    {!isExpired && (link.clicks || 0) > 0 && (
                      <button
                        onClick={() =>
                          setSelectedLinkStats({
                            slug: link.slug,
                            clicks: link.clicks || 0,
                          })
                        }
                        className='flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-all'
                      >
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
                          <line x1='18' y1='20' x2='18' y2='10' />
                          <line x1='12' y1='20' x2='12' y2='4' />
                          <line x1='6' y1='20' x2='6' y2='14' />
                        </svg>
                        Ver detalhes
                      </button>
                    )}
                  </div>
                </div>

                {/* LADO DIREITO: Ações */}
                <div className='flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0'>
                  {isExpired ? (
                    <button
                      disabled
                      className='w-full sm:w-auto text-xs font-semibold px-3 py-2 bg-slate-100 text-slate-400 rounded-md border border-slate-200 cursor-not-allowed text-center'
                    >
                      LINK VENCIDO
                    </button>
                  ) : (
                    <>
                      <a
                        href={`/${link.slug}`}
                        target='_blank'
                        className='flex-1 sm:flex-none text-slate-600 hover:text-indigo-600 text-xs font-semibold px-3 py-2 bg-slate-50 hover:bg-indigo-50 rounded-md transition-all border border-slate-200 hover:border-indigo-200 text-center flex items-center justify-center gap-1'
                      >
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
                          <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                          <polyline points='15 3 21 3 21 9' />
                          <line x1='10' y1='14' x2='21' y2='3' />
                        </svg>
                        ABRIR
                      </a>

                      <CopyButton
                        text={fullUrl}
                        className='px-3 py-2 border border-slate-200 rounded-md text-xs hover:bg-slate-50 text-slate-600'
                      />

                      {/* Botão QR Code */}
                      <button
                        onClick={() =>
                          setQrLink({ slug: link.slug, url: fullUrl })
                        }
                        className='px-3 py-2 border border-slate-200 rounded-md text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all'
                        title='Gerar QR Code'
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
                        >
                          <rect x='3' y='3' width='7' height='7' />
                          <rect x='14' y='3' width='7' height='7' />
                          <rect x='14' y='14' width='7' height='7' />
                          <rect x='3' y='14' width='7' height='7' />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal de Limpar Histórico */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmClear}
        title='Limpar Histórico?'
        description='Você tem certeza que deseja apagar todos os links salvos? Essa ação é irreversível e limpará a lista apenas neste dispositivo.'
        confirmLabel='Sim, limpar tudo'
      />

      {/* Modal de Analytics (GeoIP e Dispositivos) */}
      {selectedLinkStats && (
        <AnalyticsModal
          key={selectedLinkStats.slug}
          isOpen={!!selectedLinkStats}
          slug={selectedLinkStats.slug}
          totalClicks={selectedLinkStats.clicks}
          onClose={() => setSelectedLinkStats(null)}
        />
      )}

      {/* Modal de QR Code */}
      {qrLink && (
        <QrModal
          isOpen={!!qrLink}
          onClose={() => setQrLink(null)}
          url={qrLink.url}
          slug={qrLink.slug}
        />
      )}
    </>
  );
}
