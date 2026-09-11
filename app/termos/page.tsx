import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"

export default function TermosPage() {
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
            Termos de Uso
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e utilizar a plataforma Ruralize, você concorda com estes 
                Termos de Uso. Se você não concordar com algum termo, por favor, não 
                utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Descrição do Serviço
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O Ruralize é uma plataforma que conecta visitantes a propriedades 
                rurais, permitindo a divulgação de serviços turísticos, realização de 
                reservas e comunicação entre as partes. A plataforma funciona como 
                intermediária, não sendo responsável direta pelos serviços prestados 
                pelos empreendedores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Cadastro de Usuário
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Para utilizar os serviços da plataforma, é necessário realizar cadastro 
                fornecendo informações verdadeiras e atualizadas. O usuário é responsável 
                por manter a confidencialidade de suas credenciais de acesso.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Cada pessoa pode ter apenas uma conta ativa</li>
                <li>CPF e login são únicos e não podem ser alterados</li>
                <li>O usuário pode solicitar a exclusão de sua conta a qualquer momento</li>
                <li>Dados falsos podem resultar em cancelamento da conta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Perfis de Usuário
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A plataforma possui dois tipos de perfis:
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Visitante/Turista</h3>
                  <p className="text-sm text-muted-foreground">
                    Pode consultar propriedades, realizar reservas, enviar mensagens aos 
                    empreendedores e gerenciar suas reservas.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Empreendedor Rural</h3>
                  <p className="text-sm text-muted-foreground">
                    Pode cadastrar propriedades e atividades, gerenciar reservas, responder 
                    mensagens e acessar relatórios gerenciais.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Reservas e Pagamentos
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As reservas são realizadas diretamente pela plataforma. O visitante deve 
                verificar a disponibilidade e as condições antes de confirmar.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>O pagamento deve ser realizado conforme as opções disponíveis</li>
                <li>A confirmação da reserva está sujeita à disponibilidade</li>
                <li>Cada propriedade define suas próprias políticas de cancelamento</li>
                <li>Reembolsos seguem as regras estabelecidas pelo empreendedor</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Cancelamentos
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O cancelamento de reservas deve seguir as normas de reembolso estabelecidas 
                por cada empreendimento. O sistema exibirá as regras aplicáveis antes da 
                confirmação do cancelamento. Cancelamentos fora do prazo podem não ter 
                direito a reembolso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Responsabilidades do Empreendedor
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Manter informações atualizadas sobre propriedades e serviços</li>
                <li>Respeitar as reservas confirmadas</li>
                <li>Cumprir com as normas de segurança rural e ambiental</li>
                <li>Responder às mensagens dos visitantes em tempo hábil</li>
                <li>Garantir a qualidade dos serviços oferecidos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Responsabilidades do Visitante
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Fornecer informações verdadeiras no cadastro e nas reservas</li>
                <li>Respeitar as regras e políticas de cada propriedade</li>
                <li>Comparecer nas datas reservadas ou cancelar com antecedência</li>
                <li>Zelar pelas instalações e recursos da propriedade</li>
                <li>Comunicar problemas imediatamente ao empreendedor</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Limitação de Responsabilidade
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A plataforma Ruralize atua como intermediária e não se responsabiliza 
                por eventuais problemas decorrentes da prestação de serviços pelos 
                empreendedores, incluindo mas não limitado a: qualidade das acomodações, 
                condições climáticas, acidentes ou imprevistos durante as atividades.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Alterações nos Termos
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                As alterações entrarão em vigor após a publicação na plataforma. O uso 
                continuado dos serviços após as alterações constitui aceitação dos novos 
                termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Contato
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Para dúvidas ou esclarecimentos sobre estes termos, entre em contato 
                através do e-mail: contato@turismorural.com.br
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
