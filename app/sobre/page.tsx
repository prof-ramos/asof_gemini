import type { Metadata } from 'next';
import Image from 'next/image';
import { Shield, FileText, Target, Heart } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Sobre a ASOF',
  description: 'Conheça a história, missão e valores da Associação Nacional dos Oficiais de Chancelaria do Serviço Exterior Brasileiro.',
};

const directors = [
  { name: 'José Silva Santos', role: 'Presidente', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
  { name: 'Maria Oliveira Costa', role: 'Vice-Presidente', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
  { name: 'Carlos Eduardo Lima', role: 'Tesoureiro', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop' },
  { name: 'Ana Paula Ferreira', role: 'Secretária-Geral', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
];

const timeline = [
  { year: '1992', event: 'Fundação da ASOF em Brasília' },
  { year: '2005', event: 'Primeira conquista de reajuste salarial significativo' },
  { year: '2012', event: 'Ampliação de benefícios para associados' },
  { year: '2018', event: 'Reconhecimento nacional como entidade representativa' },
  { year: '2023', event: 'Mais de 3.000 associados em todo o Brasil e no exterior' },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Nossa História
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              Desde 1992, a ASOF representa com excelência os Oficiais de Chancelaria,
              defendendo os direitos, promovendo a integração e valorizando a carreira
              que sustenta o Serviço Exterior Brasileiro.
            </p>
          </div>
        </Container>
      </Section>

      {/* Missão, Visão e Valores */}
      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-t-4 border-accent">
              <Target className="mx-auto mb-4 text-accent" size={48} aria-hidden="true" />
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Missão</h3>
              <p className="text-primary-dark leading-relaxed">
                Defender os interesses da carreira de Oficial de Chancelaria, promovendo
                a valorização profissional e o bem-estar dos associados.
              </p>
            </Card>

            <Card className="text-center border-t-4 border-accent">
              <Shield className="mx-auto mb-4 text-accent" size={48} aria-hidden="true" />
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Visão</h3>
              <p className="text-primary-dark leading-relaxed">
                Ser referência em representatividade sindical, garantindo condições
                dignas de trabalho e reconhecimento da importância dos Oficiais de
                Chancelaria para o Brasil.
              </p>
            </Card>

            <Card className="text-center border-t-4 border-accent">
              <Heart className="mx-auto mb-4 text-accent" size={48} aria-hidden="true" />
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Valores</h3>
              <p className="text-primary-dark leading-relaxed">
                Ética, transparência, solidariedade, compromisso com o serviço público e
                defesa intransigente dos direitos dos associados.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section className="bg-neutral">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-primary text-center mb-12">
              Linha do Tempo
            </h2>

            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="shrink-0 w-24 text-right">
                    <span className="text-2xl font-serif font-bold text-accent">
                      {item.year}
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <div className="absolute left-0 top-3 w-4 h-4 bg-accent rounded-full -translate-x-8 group-hover:scale-125 transition-transform"></div>
                    {idx < timeline.length - 1 && (
                      <div className="absolute left-0 top-7 w-px h-full bg-slate-300 -translate-x-6"></div>
                    )}
                    <Card className="ml-4">
                      <p className="text-lg text-primary-dark">{item.event}</p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Diretoria */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Nossa Diretoria
            </h2>
            <p className="text-lg text-primary-dark max-w-2xl mx-auto">
              Profissionais experientes comprometidos com a excelência na
              representação dos Oficiais de Chancelaria.
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

      {/* Conquistas */}
      <Section className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Nossas Conquistas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-serif font-bold text-accent mb-2">30+</p>
              <p className="text-sm uppercase tracking-wider">Anos de História</p>
            </div>
            <div>
              <p className="text-5xl font-serif font-bold text-accent mb-2">3.000+</p>
              <p className="text-sm uppercase tracking-wider">Associados</p>
            </div>
            <div>
              <p className="text-5xl font-serif font-bold text-accent mb-2">50+</p>
              <p className="text-sm uppercase tracking-wider">Postos no Exterior</p>
            </div>
            <div>
              <p className="text-5xl font-serif font-bold text-accent mb-2">100%</p>
              <p className="text-sm uppercase tracking-wider">Dedicação</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Estatuto */}
      <Section className="bg-white" id="estatuto">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <FileText className="mx-auto mb-6 text-accent" size={64} aria-hidden="true" />
            <h2 className="text-4xl font-serif font-bold text-primary mb-6">
              Estatuto Social
            </h2>
            <p className="text-lg text-primary-dark mb-8">
              Nosso estatuto define os princípios, direitos e deveres que regem a ASOF
              e seus associados. Transparência e ética são pilares fundamentais de
              nossa gestão.
            </p>
            <Button variant="primary">Baixar Estatuto (PDF)</Button>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-neutral">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-primary mb-6">
              Faça Parte da ASOF
            </h2>
            <p className="text-lg text-primary-dark mb-8">
              Junte-se a milhares de Oficiais de Chancelaria que já contam com a
              representação e os benefícios da ASOF. Fortaleça a carreira e defenda
              seus direitos.
            </p>
            <Button variant="highlight">Associe-se Agora</Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
