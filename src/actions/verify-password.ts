'use server';

import { createClient } from '@/utils/supabase/server';
import { compare } from 'bcryptjs';

export async function verifyPassword(slug: string, passwordInput: string) {
  const supabase = await createClient();

  // Busca apenas o hash e a URL de destino
  const { data, error } = await supabase
    .from('urls')
    .select('password_hash, target_url')
    .eq('slug', slug)
    .single();

  if (error || !data || !data.password_hash) {
    return { success: false };
  }

  // Compara a senha digitada com o Hash do banco
  const isValid = await compare(passwordInput, data.password_hash);

  if (isValid) {
    return { success: true, url: data.target_url };
  }

  return { success: false };
}
