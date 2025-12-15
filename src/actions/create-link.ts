'use server';

import { createClient } from '@/utils/supabase/server';
import { nanoid } from 'nanoid';
import { hash } from 'bcryptjs';

export async function createLink(formData: FormData) {
  const supabase = await createClient();

  const url = formData.get('url')?.toString();
  const customSlug = formData.get('slug')?.toString();
  const expiresAt = formData.get('expires_at')?.toString();
  const password = formData.get('password')?.toString();

  if (!url) {
    return { error: 'A URL de destino é obrigatória.' };
  }

  // Define o Slug (Personalizado ou Aleatório)
  const finalSlug =
    customSlug && customSlug.trim() !== '' ? customSlug : nanoid(6);

  // Validação simples de slug (apenas letras, números e hífens)
  if (!/^[a-zA-Z0-9-_]+$/.test(finalSlug)) {
    return { error: 'O link personalizado contém caracteres inválidos.' };
  }

  // CRIPTOGRAFIA DA SENHA
  let passwordHash = null;
  if (password && password.trim() !== '') {
    passwordHash = await hash(password, 10);
  }

  // Verifica se o slug já existe
  const { data: existing } = await supabase
    .from('urls')
    .select('id')
    .eq('slug', finalSlug)
    .single();

  if (existing) {
    return { error: 'Este link personalizado já está em uso. Tente outro.' };
  }

  // Salva no banco
  const { error } = await supabase.from('urls').insert({
    target_url: url,
    slug: finalSlug,
    expires_at: expiresAt || null,
    password_hash: passwordHash,
  });

  if (error) {
    console.error('Erro Supabase:', error);
    return { error: 'Erro ao criar o link. Tente novamente.' };
  }

  return { success: true, slug: finalSlug };
}
