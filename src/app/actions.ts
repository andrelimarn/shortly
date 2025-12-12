'use server';

import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/utils/generateSlug';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const schema = z.object({ url: z.string().url() });

export async function createUrl(formData: FormData) {
  const url = formData.get('url') as string;
  const validation = schema.safeParse({ url });

  if (!validation.success) return { error: 'URL inválida' };

  const slug = generateSlug(); // [cite: 14]

  const { error } = await supabase
    .from('urls') // [cite: 21]
    .insert({ target_url: url, slug }); // [cite: 23, 24]

  if (error) return { error: 'Erro ao salvar' };

  revalidatePath('/');
  return { success: true, slug };
}

export async function incrementClick(slug: string) {
  // RPC ou Update direto para contar cliques [cite: 25]
  const { data } = await supabase
    .from('urls')
    .select('clicks')
    .eq('slug', slug)
    .single();
  if (data) {
    await supabase
      .from('urls')
      .update({ clicks: (data.clicks || 0) + 1 })
      .eq('slug', slug);
  }
}
