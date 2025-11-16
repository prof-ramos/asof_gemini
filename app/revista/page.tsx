import type { Metadata } from 'next';
import { BookOpen, Download, Calendar } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Revista ASOF',
  description: 'Revista oficial da Associação Nacional dos Oficiais de Chancelaria - ASOF.',
};

// Placeholder para edições futuras da revista
const editions = [
  {
    title: 'Revista ASOF - Edição 2025',
    date: '2025',
    description: 'Publicação em breve. Conteúdo com artigos, entrevistas e notícias relevantes para os Oficiais de Chancelaria.',
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=1000&fit=crop',
  },
];

export default function RevistaPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="absolute inset-0 bg-black/5"></div>
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="mx-auto mb-6 text-accent drop-shadow-lg" size={64} aria-hidden="true" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-shadow-medium">
              Revista ASOF
            </h1>
            <p className="text-xl text-white leading-relaxed text-shadow-soft">
              Publicação oficial da Associação Nacional dos Oficiais de Chancelaria,
              trazendo informações relevantes, artigos e notícias da carreira.
            </p>
          </div>
        </Container>
      </Section>

      {/* Sobre a Revista */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-primary mb-6">
                Nossa Publicação
              </h2>
              <p className="text-lg text-primary-dark leading-relaxed">
                A Revista ASOF é o veículo de comunicação oficial da associação,
                dedicada a informar, educar e conectar os Oficiais de Chancelaria
                em todo o Brasil e no exterior.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center">
                <BookOpen className="mx-auto mb-4 text-accent" size={40} aria-hidden="true" />
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Conteúdo Relevante
                </h3>
                <p className="text-primary-dark">
                  Artigos técnicos, entrevistas exclusivas e análises sobre a carreira
                  e o serviço exterior brasileiro.
                </p>
              </Card>

              <Card className="text-center">
                <Calendar className="mx-auto mb-4 text-accent" size={40} aria-hidden="true" />
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Publicação Regular
                </h3>
                <p className="text-primary-dark">
                  Edições periódicas mantêm os associados informados sobre
                  novidades, conquistas e desafios da categoria.
                </p>
              </Card>

              <Card className="text-center">
                <Download className="mx-auto mb-4 text-accent" size={40} aria-hidden="true" />
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Acesso Digital
                </h3>
                <p className="text-primary-dark">
                  Todas as edições disponíveis para download em formato PDF,
                  acessíveis a qualquer momento.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Edições */}
      <Section className="bg-neutral">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Edições Disponíveis
            </h2>
            <p className="text-lg text-primary-dark">
              Confira as edições da Revista ASOF
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {editions.map((edition, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg bg-slate-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="text-accent" size={64} aria-hidden="true" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif font-bold text-primary">
                    {edition.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-primary-dark">
                    <Calendar size={16} aria-hidden="true" />
                    <span>{edition.date}</span>
                  </div>
                  <p className="text-primary-dark leading-relaxed">
                    {edition.description}
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Em Breve
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA para Associados */}
      <Section className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Faça Parte da ASOF
            </h2>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
              Associados têm acesso exclusivo a todas as edições da revista,
              além de outros benefícios e serviços oferecidos pela ASOF.
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
