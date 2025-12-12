import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function IntermediaryPage({ params }: PageProps) {
  // 1. Next 15/16: Desembrulha a Promise dos params
  const { slug } = await params;

  const supabase = await createClient();

  // 2. Busca usando o nome correto da coluna: 'target_url'
  const { data: urlData, error } = await supabase
    .from('urls')
    .select('target_url')
    .eq('slug', slug)
    .single();

  // 3. Verificação de erros
  if (error || !urlData || !urlData.target_url) {
    if (error) console.error('Erro ao buscar slug:', error);
    return notFound();
  }

  // 4. Redirecionamento usando a coluna correta
  redirect(urlData.target_url);
}
