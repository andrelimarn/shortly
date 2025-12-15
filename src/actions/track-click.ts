'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export async function trackClick(slug: string) {
  const supabase = await createClient();

  const { error: rpcError } = await supabase.rpc('increment_clicks', {
    slug_input: slug,
  });

  if (rpcError) {
    console.error(
      '[Analytics Error] Falha ao incrementar contador:',
      rpcError.message
    );
  }

  try {
    const headersList = await headers();
    const referer = headersList.get('referer') || 'Direto';
    const ua = headersList.get('user-agent') || '';

    // Detecção simples de dispositivo
    const isMobile = /mobile/i.test(ua);
    const device = isMobile ? 'Mobile' : 'Desktop';

    // GeoIP fornecido pela Vercel
    const country = headersList.get('x-vercel-ip-country') || 'Desconhecido';
    const city = headersList.get('x-vercel-ip-city') || null;

    const { error: logError } = await supabase.from('clicks').insert({
      url_slug: slug,
      referrer: referer,
      device: device,
      country: country,
      city: city,
    });

    if (logError) {
      console.error('[Analytics Error] Falha ao salvar log:', logError.message);
    }
  } catch (err) {
    console.error('[Analytics Error] Erro crítico desconhecido:', err);
  }
}
