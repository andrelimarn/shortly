'use server';

import { createClient } from '@/utils/supabase/server';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';

const inputSchema = z.object({
  targetUrl: z.string().trim().min(1, 'O campo URL é obrigatório.'),
  expiresAt: z.date().nullable().optional(),
  customSlug: z
    .string()
    .max(20, 'O nome personalizado deve ter no máximo 20 caracteres')
    .optional(),
});

interface CreateLinkParams {
  targetUrl: string;
  expiresAt?: Date | null;
  customSlug?: string;
}

export async function createShortLink({
  targetUrl,
  expiresAt,
  customSlug,
}: CreateLinkParams) {
  // 1. Validação inicial
  const initialValidation = inputSchema.safeParse({
    targetUrl,
    expiresAt,
    customSlug,
  });
  if (!initialValidation.success) {
    return { error: initialValidation.error.issues[0].message };
  }

  // 2. Sanitização Inteligente
  let finalUrl = initialValidation.data.targetUrl;
  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = `https://${finalUrl}`;
  }

  // 3. Validação de Sintaxe
  try {
    const u = new URL(finalUrl);
    if (!u.hostname.includes('.')) {
      return { error: 'URL inválida. O domínio parece incompleto.' };
    }
  } catch (err) {
    return { error: 'URL inválida.' };
  }

  // ============================================================
  // 4. NOVO: Verificação de Disponibilidade (O Ping)
  // ============================================================
  const isReachable = await checkUrlAvailability(finalUrl);
  if (!isReachable) {
    return {
      error:
        'Não conseguimos acessar esse link. Verifique se o endereço está correto.',
    };
  }
  // ============================================================

  const supabase = await createClient();

  // Lógica de Slug Personalizado
  if (customSlug) {
    const { error } = await supabase
      .from('urls')
      .insert({ target_url: finalUrl, slug: customSlug, expires_at: expiresAt })
      .select()
      .single();

    if (error?.code === '23505')
      return { error: 'Este nome personalizado já está em uso.' };
    if (error) return { error: 'Erro ao criar link.' };
    return { success: true, slug: customSlug };
  }

  // Lógica Automática (Retry)
  let attempts = 0;
  while (attempts < 3) {
    const slug = generateSlug(6);
    const { error } = await supabase
      .from('urls')
      .insert({ target_url: finalUrl, slug: slug, expires_at: expiresAt })
      .select()
      .single();

    if (!error) return { success: true, slug: slug };
    if (error.code !== '23505') {
      console.error(error);
      return { error: 'Erro interno ao criar link.' };
    }
    attempts++;
  }

  return { error: 'Não foi possível gerar um link único.' };
}

// --- FUNÇÕES AUXILIARES ---

function generateSlug(length: number = 6): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = bytes[i] % charset.length;
    result += charset[randomIndex];
  }
  return result;
}

/**
 * Tenta acessar a URL para ver se ela existe.
 * Retorna FALSE apenas se tivermos certeza que falhou (404 ou DNS error).
 */
async function checkUrlAvailability(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    // Timeout curto de 3 segundos para não travar o usuário
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      method: 'HEAD', // Pede só o cabeçalho (rápido)
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShortlyBot/1.0)', // Identificação educada
      },
    });

    clearTimeout(timeoutId);

    // Se retornou 404 Not Found, o link certamente está quebrado.
    if (response.status === 404) {
      return false;
    }

    // Aceitamos qualquer outra coisa (200, 301, 403, 500) na dúvida
    return true;
  } catch (error) {
    // Se for erro de DNS (ENOTFOUND), o domínio não existe.
    // Se for Timeout, pode ser site lento, mas assumimos que falhou para não criar link ruim.
    return false;
  }
}
