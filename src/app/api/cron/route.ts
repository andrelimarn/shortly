import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('urls')
      .select('id')
      .limit(1)
      .single();

    if (error) {
      console.error('Erro no Cron:', error.message);
    }

    return NextResponse.json({ ok: true, received: data });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
