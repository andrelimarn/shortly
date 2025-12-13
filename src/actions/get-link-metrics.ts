'use server';

import { createClient } from '@/utils/supabase/server';

export async function getLinkMetrics(slugs: string[]) {
  const supabase = await createClient();

  // Busca apenas os slugs solicitados
  const { data, error } = await supabase
    .from('urls')
    .select('slug, clicks')
    .in('slug', slugs);

  if (error) {
    console.error('Erro ao buscar métricas:', error);
    return [];
  }

  return data || [];
}
