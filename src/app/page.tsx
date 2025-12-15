import { CreateForm } from '@/components/create-form';
import { LinkHistory } from '@/components/link-history';

export const revalidate = 0;

export default async function Home() {
  return (
    <div className='min-h-[calc(100vh-84px)] font-sans'>
      <main className='max-w-4xl mx-auto p-6 pt-10'>
        <CreateForm />
        <LinkHistory />
      </main>
    </div>
  );
}
