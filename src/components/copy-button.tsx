'use client';

import { useState } from 'react';

export function CopyButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [label, setLabel] = useState('Copiar');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setLabel('Copiado!');
      setTimeout(() => setLabel('Copiar'), 1500);
    } catch (err) {
      console.error('Falha ao copiar', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type='button' // Importante para não submeter forms
      className={
        className ||
        'px-3 py-1 border rounded text-sm hover:bg-slate-50 transition-colors'
      }
    >
      {label}
    </button>
  );
}
