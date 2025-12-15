export default function PrivacyPage() {
  return (
    <div className='max-w-3xl mx-auto py-12 px-6'>
      <h1 className='text-3xl font-bold text-slate-900 mb-6'>
        Política de Privacidade
      </h1>

      <div className='prose prose-slate text-slate-600'>
        <p className='mb-4'>
          Sua privacidade é importante para nós. Esta política explica como o{' '}
          <strong>Shortly</strong> trata seus dados.
        </p>

        <h2 className='text-xl font-semibold text-slate-800 mt-8 mb-4'>
          1. Coleta de Dados
        </h2>
        <p>
          O Shortly coleta o mínimo de informações necessárias para o
          funcionamento do serviço:
        </p>
        <ul className='list-disc pl-5 space-y-2 mb-4'>
          <li>
            <strong>URLs:</strong> Armazenamos a URL original e o link encurtado
            gerado.
          </li>
          <li>
            <strong>Estatísticas:</strong> Podemos coletar dados anônimos de
            cliques (país, cidade e tipo de dispositivo) para fins de
            estatística de uso do link.
          </li>
        </ul>

        <h2 className='text-xl font-semibold text-slate-800 mt-8 mb-4'>
          2. Uso de Cookies e LocalStorage
        </h2>
        <p>
          Utilizamos tecnologias de armazenamento para melhorar sua experiência:
        </p>
        <ul className='list-disc pl-5 space-y-2 mb-4'>
          <li>
            <strong>Histórico Local (LocalStorage):</strong> Os links que você
            cria são salvos no armazenamento local do seu navegador para criar o
            histórico &quot;Meus Links Recentes&quot;. Esses dados{' '}
            <strong>não</strong> são enviados para nossos servidores de forma
            vinculada a uma conta pessoal.
          </li>
          <li>
            <strong>Cookies Essenciais:</strong> Podemos usar cookies técnicos
            para garantir a segurança da aplicação e prevenir ataques (como
            CSRF).
          </li>
        </ul>

        <h2 className='text-xl font-semibold text-slate-800 mt-8 mb-4'>
          3. Compartilhamento
        </h2>
        <p>
          Não vendemos nem compartilhamos seus dados pessoais com terceiros.
          Este é um projeto de código aberto e educacional.
        </p>

        <h2 className='text-xl font-semibold text-slate-800 mt-8 mb-4'>
          4. Contato
        </h2>
        <p>
          Para dúvidas sobre esta política, entre em contato através do LinkedIn
          do desenvolvedor.
        </p>
      </div>
    </div>
  );
}
