export default function TermsPage() {
  return (
    <div className='max-w-3xl mx-auto py-12 px-6'>
      <h1 className='text-3xl font-bold text-slate-900 mb-6'>Termos de Uso</h1>

      <div className='prose prose-slate text-slate-600'>
        <p className='mb-4 text-sm text-slate-500'>
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <h2 className='text-xl font-semibold text-slate-800 mt-8 mb-4'>
          1. Visão Geral
        </h2>
        <p className='mb-4'>
          O <strong>Shortly</strong> é uma ferramenta gratuita de encurtamento
          de URLs. Ao utilizar este serviço, você concorda que ele é fornecido
          &quot;como está&quot;, sem garantias de disponibilidade permanente
          (SLA) ou suporte técnico dedicado.
        </p>

        <h2 className='text-xl font-semibold text-slate-800 mt-8 mb-4'>
          2. Uso Aceitável
        </h2>
        <p className='mb-2'>
          Você concorda em utilizar o Shortly apenas para fins lícitos. É
          estritamente proibido:
        </p>
        <ul className='list-disc pl-5 space-y-2 mb-4'>
          <li>
            Encurtar links para sites de{' '}
            <strong>phishing, malware, vírus</strong> ou qualquer software
            malicioso.
          </li>
          <li>
            Disseminar conteúdo de ódio, violência, abuso infantil ou material
            ilegal.
          </li>
          <li>
            Utilizar o serviço para campanhas de <strong>spam</strong> (e-mail,
            SMS, WhatsApp).
          </li>
        </ul>

        <h2 className='text-xl font-semibold text-slate-800 mt-8 mb-4'>
          3. Política Anti-Abuso e Limitações
        </h2>
        <p className='mb-4'>
          Para garantir a qualidade do serviço e a segurança de todos os
          usuários, aplicamos as seguintes medidas:
        </p>
        <ul className='list-disc pl-5 space-y-2 mb-4'>
          <li>
            <strong>Remoção Imediata:</strong> Links identificados como abusivos
            ou maliciosos serão deletados imediatamente sem aviso prévio.
          </li>
          <li>
            <strong>Bloqueio de Acesso:</strong> Reservamo-nos o direito de
            bloquear endereços IP ou faixas de IP que demonstrem comportamento
            abusivo, como a geração automatizada de links em massa (botnets).
          </li>
          <li>
            <strong>Limitação de Taxa (Rate Limiting):</strong> Podemos impor
            limites técnicos na quantidade de links criados por usuário/IP em um
            determinado período para evitar sobrecarga do sistema.
          </li>
          <li>
            <strong>Denúncia:</strong> Colaboramos com autoridades e provedores
            de segurança reportando URLs maliciosas.
          </li>
        </ul>

        <h2 className='text-xl font-semibold text-slate-800 mt-8 mb-4'>
          4. Limitação de Responsabilidade
        </h2>
        <p className='mb-4'>
          O desenvolvedor deste projeto não se responsabiliza por danos diretos,
          indiretos ou incidentais decorrentes do uso ou da impossibilidade de
          uso do serviço. Não nos responsabilizamos pelo conteúdo dos links
          encurtados pelos usuários, apenas fornecemos a tecnologia de
          redirecionamento.
        </p>

        <h2 className='text-xl font-semibold text-slate-800 mt-8 mb-4'>
          5. Modificações
        </h2>
        <p>
          Podemos alterar estes termos a qualquer momento. O uso contínuo do
          serviço após as alterações constitui aceitação dos novos termos.
        </p>
      </div>
    </div>
  );
}
