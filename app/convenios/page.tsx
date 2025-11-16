import type { Metadata } from 'next';
import { Handshake, Heart, GraduationCap, ShoppingBag, Plane } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Convênios',
  description: 'Confira os convênios e parcerias exclusivas para associados da ASOF.',
};

const convenioCategories = [
  {
    icon: Heart,
    title: 'Saúde e Bem-estar',
    description: 'Descontos em planos de saúde, academias, clínicas e farmácias.',
    color: 'text-red-500',
  },
  {
    icon: GraduationCap,
    title: 'Educação',
    description: 'Condições especiais em cursos, universidades e escolas de idiomas.',
    color: 'text-blue-500',
  },
  {
    icon: ShoppingBag,
    title: 'Comércio e Serviços',
    description: 'Descontos exclusivos em lojas, restaurantes e serviços diversos.',
    color: 'text-green-500',
  },
  {
    icon: Plane,
    title: 'Viagens e Turismo',
    description: 'Ofertas especiais em hotéis, passagens aéreas e pacotes turísticos.',
    color: 'text-purple-500',
  },
];

const benefits = [
  'Descontos exclusivos em estabelecimentos parceiros',
  'Condições diferenciadas de pagamento',
  'Atendimento prioritário em serviços',
  'Acesso a produtos e serviços premium',
  'Novos convênios adicionados regularmente',
];

export default function ConveniosPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Handshake className="mx-auto mb-6 text-accent" size={64} aria-hidden="true" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Convênios e Parcerias
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              Aproveite descontos exclusivos e condições especiais em diversos
              estabelecimentos e serviços parceiros da ASOF.
            </p>
          </div>
        </Container>
      </Section>

      {/* Categorias de Convênios */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-6">
              Categorias de Convênios
            </h2>
            <p className="text-lg text-primary-dark max-w-2xl mx-auto">
              Nossos convênios abrangem diversas áreas para atender às necessidades
              dos associados e suas famílias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {convenioCategories.map((category, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 ${category.color}`}>
                    <category.icon size={48} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-primary mb-3">
                      {category.title}
                    </h3>
                    <p className="text-primary-dark leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Benefícios */}
      <Section className="bg-neutral">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-primary mb-6">
                Vantagens para Associados
              </h2>
              <p className="text-lg text-primary-dark">
                Os convênios da ASOF oferecem benefícios exclusivos para você e sua família.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-lg text-primary-dark">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Lista de Convênios (Em breve) */}
      <Section className="bg-white">
        <Container>
          <Card className="max-w-3xl mx-auto text-center bg-gradient-to-br from-neutral to-white">
            <Handshake className="mx-auto mb-6 text-accent" size={64} aria-hidden="true" />
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              Convênios em Atualização
            </h2>
            <p className="text-lg text-primary-dark mb-8 leading-relaxed">
              Estamos trabalhando para trazer a você uma lista completa e atualizada
              de todos os nossos convênios e parcerias. Em breve, você poderá
              consultar todos os estabelecimentos participantes e seus benefícios.
            </p>
            <p className="text-primary-dark mb-6">
              Para informações sobre convênios específicos, entre em contato conosco:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" asChild>
                <a href="/contato">Entre em Contato</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:contato@asof.org.br">Enviar E-mail</a>
              </Button>
            </div>
          </Card>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Ainda Não é Associado?
            </h2>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
              Associe-se à ASOF e tenha acesso a todos os nossos convênios e
              benefícios exclusivos. Valorize sua carreira e economize no dia a dia.
            </p>
            <Button variant="highlight">
              Associe-se Agora
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
