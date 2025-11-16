import type { Metadata } from 'next';
import Image from 'next/image';
import { Users, Award, Target } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Membros e Diretoria',
  description: 'Conheça a diretoria e membros da ASOF - Associação Nacional dos Oficiais de Chancelaria.',
};

const directors = [
  { name: 'Manuel Alves Bezerra', role: 'Presidente', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
  { name: 'Cesar Dunstan Fleury Curado', role: 'Vice-Presidente', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop' },
  { name: 'Aline de Souza', role: 'Diretora-Executiva', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
  { name: 'Ariel Antonio Seleme', role: 'Diretor-Financeiro', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
];

const fiscalCouncil = [
  { name: 'Sérgio Gondim Simão', role: 'Presidente do Conselho Fiscal', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { name: 'Selma Teles da Silva', role: '1ª Vice-Presidente do Conselho', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
  { name: 'Célia Flores', role: '2ª Vice-Presidente do Conselho', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
];

const stats = [
  { number: '3.000+', label: 'Associados' },
  { number: '50+', label: 'Postos no Exterior' },
  { number: '30+', label: 'Anos de História' },
  { number: '100%', label: 'Dedicação' },
];

export default function MembrosPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
        <Container className="relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="mx-auto mb-6 text-accent drop-shadow-lg" size={64} aria-hidden="true" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-shadow-medium">
              Membros e Diretoria
            </h1>
            <p className="text-xl text-white leading-relaxed text-shadow-soft">
              Conheça a diretoria eleita para o biênio 2025-2027 e saiba mais
              sobre os membros da ASOF.
            </p>
          </div>
        </Container>
      </Section>

      {/* Estatísticas */}
      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl md:text-5xl font-serif font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base uppercase tracking-wider text-primary-dark">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Diretoria-Executiva */}
      <Section className="bg-neutral">
        <Container>
          <div className="text-center mb-12">
            <Award className="mx-auto mb-4 text-accent" size={48} aria-hidden="true" />
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Diretoria-Executiva
            </h2>
            <p className="text-lg text-primary-dark max-w-2xl mx-auto">
              Eleita em processo democrático, a diretoria representa e conduz
              as ações da ASOF no biênio 2025-2027.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {directors.map((director, idx) => (
              <Card key={idx} className="text-center hover:shadow-xl transition-shadow">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={director.image}
                    alt={`Foto de ${director.name}, ${director.role} da ASOF`}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold text-primary mb-2">
                  {director.name}
                </h3>
                <p className="text-sm uppercase tracking-wider text-accent font-semibold">
                  {director.role}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Conselho Fiscal */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <Target className="mx-auto mb-4 text-accent" size={48} aria-hidden="true" />
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Conselho Fiscal
            </h2>
            <p className="text-lg text-primary-dark max-w-2xl mx-auto">
              Responsável pela fiscalização da gestão financeira e administrativa
              da associação, garantindo transparência e ética.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {fiscalCouncil.map((member, idx) => (
              <Card key={idx} className="text-center hover:shadow-xl transition-shadow">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`Foto de ${member.name}, ${member.role} da ASOF`}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold text-primary mb-2">
                  {member.name}
                </h3>
                <p className="text-sm uppercase tracking-wider text-accent font-semibold">
                  {member.role}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Posse */}
      <Section className="bg-neutral">
        <Container>
          <Card className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-4">
                  Cerimônia de Posse
                </h2>
                <p className="text-lg text-primary-dark mb-4 leading-relaxed">
                  A atual diretoria tomou posse em{' '}
                  <strong className="text-accent">30 de junho de 2025</strong>{' '}
                  no Auditório Paulo Nogueira, em Brasília.
                </p>
                <p className="text-primary-dark leading-relaxed">
                  O evento contou com a participação de associados de todo o Brasil
                  e representantes do Ministério das Relações Exteriores, reafirmando
                  o compromisso com a valorização dos Oficiais de Chancelaria.
                </p>
              </div>
              <div className="relative h-64 md:h-full min-h-[300px] rounded-lg overflow-hidden bg-slate-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="text-accent" size={64} aria-hidden="true" />
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      {/* Objetivos da Gestão */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-primary mb-6">
                Compromissos da Gestão 2025-2027
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Valorização Profissional
                </h3>
                <p className="text-primary-dark leading-relaxed">
                  Continuar lutando por melhores salários, condições de trabalho
                  e reconhecimento da importância dos Oficiais de Chancelaria.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Fortalecimento Institucional
                </h3>
                <p className="text-primary-dark leading-relaxed">
                  Ampliar a representatividade da ASOF junto aos órgãos governamentais
                  e na defesa dos interesses da categoria.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Diálogo com Filiados
                </h3>
                <p className="text-primary-dark leading-relaxed">
                  Manter canal aberto de comunicação com todos os associados,
                  ouvindo sugestões e trabalhando em conjunto.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Transparência e Ética
                </h3>
                <p className="text-primary-dark leading-relaxed">
                  Garantir gestão transparente, prestação de contas regular e
                  conduta ética em todas as ações da associação.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Faça Parte da ASOF
            </h2>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
              Junte-se a mais de 3.000 Oficiais de Chancelaria que já contam
              com a representação e os benefícios da ASOF.
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
