'use client';

import { Globe, FileText, Shield, Users, Scale, Briefcase, Heart, Award } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import IconCard from '@/components/ui/IconCard';
import Button from '@/components/ui/Button';

const mainAreas = [
  {
    icon: Globe,
    title: 'Assistência Consular',
    description: 'Suporte aos brasileiros no exterior através de emissão de documentos, assistência em crises e proteção consular.',
  },
  {
    icon: FileText,
    title: 'Gestão Administrativa',
    description: 'Gerenciamento de recursos humanos, financeiros e patrimoniais nos postos diplomáticos e na SERE.',
  },
  {
    icon: Shield,
    title: 'Promoção Cultural',
    description: 'Promoção da imagem do Brasil no exterior e interface entre o Itamaraty e a sociedade civil.',
  },
];

const benefits = [
  { icon: Scale, title: 'Assessoria Jurídica', description: 'Suporte legal especializado em questões trabalhistas e administrativas' },
  { icon: Heart, title: 'Plano de Saúde', description: 'Condições diferenciadas em planos de saúde para associados e dependentes' },
  { icon: Briefcase, title: 'Convênios Comerciais', description: 'Descontos exclusivos em diversos estabelecimentos e serviços' },
  { icon: Award, title: 'Eventos e Capacitação', description: 'Acesso a cursos, seminários e eventos de desenvolvimento profissional' },
  { icon: Users, title: 'Networking', description: 'Conexão com oficiais de todo o Brasil e do exterior' },
  { icon: Shield, title: 'Representação Política', description: 'Defesa de interesses junto ao governo e órgãos competentes' },
];

const successCases = [
  {
    title: 'Reajuste Salarial 2023',
    description: 'Negociação bem-sucedida resultou em reajuste de 12% para a categoria, acima da inflação do período.',
  },
  {
    title: 'Isonomia com Outras Carreiras',
    description: 'Conquista de equiparação de benefícios com carreiras correlatas do serviço público federal.',
  },
  {
    title: 'Melhoria nas Condições de Trabalho',
    description: 'Implementação de melhorias estruturais em postos no exterior e na SERE.',
  },
];

export default function AtuacaoPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <Section className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Áreas de Atuação
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              A ASOF atua em múltiplas frentes para garantir a valorização da carreira
              e o bem-estar dos Oficiais de Chancelaria.
            </p>
          </div>
        </Container>
      </Section>

      {/* Principais Áreas */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Pilares de Atuação
            </h2>
            <p className="text-lg text-primary-dark max-w-2xl mx-auto">
              Os Oficiais de Chancelaria desempenham funções essenciais no Ministério
              das Relações Exteriores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainAreas.map((area, idx) => (
              <IconCard
                key={idx}
                icon={area.icon}
                title={area.title}
                description={area.description}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Detalhamento Assistência Consular */}
      <Section className="bg-neutral">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-primary mb-6">
                Assistência Consular
              </h2>
              <p className="text-lg text-primary-dark mb-6 leading-relaxed">
                Os Oficiais de Chancelaria são responsáveis pelo atendimento direto aos
                cidadãos brasileiros no exterior, prestando serviços essenciais como:
              </p>
              <ul className="space-y-3">
                {[
                  'Emissão de passaportes e documentos de viagem',
                  'Registro de nascimento, casamento e óbito',
                  'Assistência a brasileiros em situação de vulnerabilidade',
                  'Proteção e defesa de direitos de cidadãos',
                  'Gestão de crises e emergências consulares',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-primary-dark">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-l-4 border-accent">
                <p className="text-6xl font-serif font-bold text-accent mb-4">500K+</p>
                <p className="text-lg text-primary font-semibold mb-2">
                  Atendimentos Anuais
                </p>
                <p className="text-primary-dark">
                  Em mais de 220 postos consulares e embaixadas em todo o mundo
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Defesa de Direitos */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Defesa de Direitos
            </h2>
            <p className="text-lg text-primary-dark max-w-2xl mx-auto">
              A ASOF trabalha incansavelmente na proteção e ampliação dos direitos da
              carreira
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {successCases.map((caseItem, idx) => (
              <Card key={idx} className="border-t-4 border-accent">
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  {caseItem.title}
                </h3>
                <p className="text-primary-dark leading-relaxed">{caseItem.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Benefícios para Associados */}
      <Section className="bg-neutral" id="beneficios">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Benefícios para Associados
            </h2>
            <p className="text-lg text-primary-dark max-w-2xl mx-auto">
              Associados da ASOF têm acesso a uma ampla gama de benefícios exclusivos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <Icon className="text-accent mb-4" size={40} aria-hidden="true" />
                  <h3 className="text-lg font-serif font-bold text-primary mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-primary-dark">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Defenda seus Direitos
            </h2>
            <p className="text-lg text-slate-200 mb-8 leading-relaxed">
              Faça parte da maior associação de Oficiais de Chancelaria do Brasil.
              Juntos, somos mais fortes na defesa da carreira e na busca por melhores
              condições de trabalho.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="ghost" className="border-2">Associe-se Agora</Button>
              <Button variant="outline" className="bg-white text-primary hover:bg-neutral">
                Conheça os Benefícios
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
