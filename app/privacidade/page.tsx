import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao início
            </Link>
          </div>

          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
            Política de Privacidade
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Introdução
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A plataforma Ruralize está comprometida com a proteção da privacidade 
                e dos dados pessoais de seus usuários. Esta política descreve como coletamos, 
                usamos, armazenamos e protegemos suas informações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Dados Coletados
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Coletamos os seguintes tipos de dados:
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Dados de Cadastro</h3>
                  <p className="text-sm text-muted-foreground">
                    Nome completo, CPF, e-mail, telefone, login e senha (criptografada).
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Dados de Empreendedores</h3>
                  <p className="text-sm text-muted-foreground">
                    CNPJ, razão social, endereço da propriedade, dados bancários para 
                    recebimento de pagamentos.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Dados de Uso</h3>
                  <p className="text-sm text-muted-foreground">
                    Histórico de reservas, mensagens enviadas, preferências de navegação 
                    e interações com a plataforma.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Uso dos Dados
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Utilizamos seus dados para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Criar e gerenciar sua conta na plataforma</li>
                <li>Processar reservas e pagamentos</li>
                <li>Facilitar a comunicação entre visitantes e empreendedores</li>
                <li>Enviar notificações sobre reservas e atualizações</li>
                <li>Gerar relatórios gerenciais para empreendedores</li>
                <li>Melhorar nossos serviços e experiência do usuário</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Compartilhamento de Dados
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Seus dados podem ser compartilhados com:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Empreendedores rurais (para realizar reservas)</li>
                <li>Processadores de pagamento (para transações financeiras)</li>
                <li>Autoridades (quando exigido por lei)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Não vendemos seus dados pessoais a terceiros para fins de marketing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Segurança dos Dados
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Implementamos medidas de segurança para proteger seus dados:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Senhas armazenadas de forma criptografada</li>
                <li>Conexões seguras via HTTPS</li>
                <li>Acesso restrito a dados sensíveis</li>
                <li>Backups periódicos para prevenção de perda</li>
                <li>Bloqueio após tentativas inválidas de login</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Direitos do Usuário
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Em conformidade com a LGPD, você tem direito a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimentos fornecidos</li>
                <li>Solicitar portabilidade dos dados</li>
                <li>Obter informações sobre compartilhamento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos cookies para melhorar sua experiência de navegação, manter 
                sua sessão ativa e coletar dados de uso. Você pode configurar seu 
                navegador para recusar cookies, mas isso pode afetar algumas 
                funcionalidades da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Retenção de Dados
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos seus dados pelo tempo necessário para fornecer nossos serviços 
                e cumprir obrigações legais. Após a exclusão da conta, dados podem ser 
                mantidos por até 5 anos para fins fiscais e legais, de forma anonimizada 
                quando possível.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Menores de Idade
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A plataforma não é destinada a menores de 18 anos. Não coletamos 
                intencionalmente dados de menores. Caso identifiquemos que dados de 
                menores foram coletados, tomaremos medidas para removê-los.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Alterações na Política
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Esta política pode ser atualizada periodicamente. Notificaremos sobre 
                mudanças significativas através do e-mail cadastrado ou avisos na 
                plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Contato do DPO
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Para questões relacionadas à privacidade e proteção de dados, entre em 
                contato com nosso Encarregado de Proteção de Dados através do e-mail: 
                privacidade@turismorural.com.br
              </p>
            </section>

            <p className="text-sm text-muted-foreground border-t pt-6">
              Última atualização: Dezembro de 2025
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
