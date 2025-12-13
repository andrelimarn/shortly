'use server';

import { createClient } from '@/utils/supabase/server';

export interface ClickLog {
  country: string | null;
  city: string | null;
  device: string | null;
  created_at: string;
}

export async function getAnalytics(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('clicks')
    .select('country, city, device, created_at')
    .eq('url_slug', slug)
    .order('created_at', { ascending: false })
    .limit(50); // Pegamos os últimos 50 para não pesar

  if (error) {
    console.error('Erro ao buscar analytics:', error);
    return [];
  }

  return data as ClickLog[];
}
