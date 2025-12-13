import { createClient } from '@supabase/supabase-js';

// Verifica se a chave existe antes de tentar criar (ajuda a debuggar)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
  throw new Error('Faltando SUPABASE_SERVICE_ROLE_KEY no .env.local');
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey, // <--- Aqui que estava dando erro
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
