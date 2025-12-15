'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  slug: string;
}

export function QrModal({ isOpen, onClose, url, slug }: QrModalProps) {
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const downloadUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = `qrcode-${slug}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const copyToClipboard = async () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    setCopying(true);

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      const size = 500;
      const padding = 40;

      canvas.width = size;
      canvas.height = size;

      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        if (!ctx) return;

        // 1. Pinta tudo de branco (Fundo + Borda)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // 2. Desenha o QR Code centralizado
        ctx.drawImage(
          img,
          padding,
          padding,
          size - padding * 2,
          size - padding * 2
        );

        canvas.toBlob(async (blob) => {
          if (!blob) return;

          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error('Falha ao copiar:', err);
            alert('Erro ao copiar imagem. Tente usar o botão de baixar.');
          } finally {
            setCopying(false);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      };

      img.src = url;
    } catch (e) {
      console.error(e);
      setCopying(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 relative text-center'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-colors'
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

        <h3 className='text-xl font-bold text-slate-900 mb-1'>QR Code</h3>
        <p className='text-sm text-slate-500 mb-6 truncate px-8'>/{slug}</p>

        <div className='bg-white p-6 rounded-2xl border-2 border-slate-100 inline-block mb-6 shadow-sm'>
          <QRCode
            id='qr-code-svg'
            value={url}
            size={200}
            level='H'
            fgColor='#1e293b'
          />
        </div>

        <div className='flex flex-col gap-3'>
          <button
            onClick={copyToClipboard}
            disabled={copying || copied}
            className={`w-full font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border-2 ${
              copied
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-indigo-600 border-transparent hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5'
            }`}
          >
            {copied ? (
              <>
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
                  <path d='M20 6 9 17l-5-5' />
                </svg>
                Copiado!
              </>
            ) : copying ? (
              <>
                <span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
                Copiando...
              </>
            ) : (
              <>
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
                  <rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
                  <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
                </svg>
                Copiar Imagem
              </>
            )}
          </button>

          <button
            onClick={downloadQR}
            className='w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200'
          >
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
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
              <polyline points='7 10 12 15 17 10' />
              <line x1='12' y1='15' x2='12' y2='3' />
            </svg>
            Baixar Arquivo
          </button>
        </div>
      </div>
    </div>
  );
}
