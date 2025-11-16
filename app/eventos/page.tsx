import type { Metadata } from 'next';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Acompanhe os eventos, encontros e atividades da ASOF.',
};

// Placeholder para eventos futuros
const upcomingEvents = [
  {
    title: 'Assembleia Geral Ordinária 2025',
    date: '2025-12-15',
    time: '14:00',
    location: 'Auditório Paulo Nogueira, Brasília - DF',
    description: 'Reunião anual com todos os associados para prestação de contas e planejamento do próximo ano.',
    category: 'Assembleia',
    participants: 'Aberto a todos os associados',
  },
];

const pastEvents = [
  {
    title: 'Posse da Nova Diretoria - Biênio 2025-2027',
    date: '2025-06-30',
    time: '18:00',
    location: 'Auditório Paulo Nogueira, Brasília - DF',
    description: 'Cerimônia de posse da nova diretoria da ASOF para o biênio 2025-2027, com confraternização.',
    category: 'Institucional',
  },
];

export default function EventosPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Calendar className="mx-auto mb-6 text-accent" size={64} aria-hidden="true" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Eventos ASOF
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              Acompanhe nossos eventos, assembleias, encontros e atividades
              voltadas para os Oficiais de Chancelaria.
            </p>
          </div>
        </Container>
      </Section>

      {/* Próximos Eventos */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Próximos Eventos
            </h2>
            <p className="text-lg text-primary-dark">
              Marque em sua agenda e participe das próximas atividades da ASOF
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {upcomingEvents.map((event, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Data */}
                  <div className="shrink-0 text-center md:text-left">
                    <div className="inline-block bg-accent text-white rounded-lg p-4">
                      <div className="text-3xl font-serif font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-sm uppercase">
                        {new Date(event.date).toLocaleDateString('pt-BR', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-2xl font-serif font-bold text-primary">
                        {event.title}
                      </h3>
                      <Badge variant="accent">{event.category}</Badge>
                    </div>

                    <p className="text-primary-dark mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-primary-dark">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-accent" aria-hidden="true" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-accent" aria-hidden="true" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-accent" aria-hidden="true" />
                        <span>{event.participants}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Eventos Passados */}
      <Section className="bg-neutral">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Eventos Realizados
            </h2>
            <p className="text-lg text-primary-dark">
              Confira os principais eventos já realizados pela ASOF
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {pastEvents.map((event, idx) => (
              <Card key={idx} className="opacity-90">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Data */}
                  <div className="shrink-0 text-center md:text-left">
                    <div className="inline-block bg-slate-400 text-white rounded-lg p-4">
                      <div className="text-3xl font-serif font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-sm uppercase">
                        {new Date(event.date).toLocaleDateString('pt-BR', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-2xl font-serif font-bold text-primary">
                        {event.title}
                      </h3>
                      <Badge variant="default">{event.category}</Badge>
                    </div>

                    <p className="text-primary-dark mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-primary-dark">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" aria-hidden="true" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-slate-400" aria-hidden="true" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Tipos de Eventos */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-primary mb-6">
                Tipos de Eventos
              </h2>
              <p className="text-lg text-primary-dark">
                A ASOF promove diferentes tipos de eventos para seus associados
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Assembleias Gerais
                </h3>
                <p className="text-primary-dark leading-relaxed">
                  Reuniões ordinárias e extraordinárias para deliberações importantes,
                  prestação de contas e planejamento estratégico.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Encontros de Confraternização
                </h3>
                <p className="text-primary-dark leading-relaxed">
                  Eventos sociais para integração e fortalecimento dos laços entre
                  os Oficiais de Chancelaria e suas famílias.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Cursos e Capacitações
                </h3>
                <p className="text-primary-dark leading-relaxed">
                  Atividades de desenvolvimento profissional e atualização técnica
                  para os associados.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  Eventos Institucionais
                </h3>
                <p className="text-primary-dark leading-relaxed">
                  Cerimônias de posse, homenagens e celebrações de marcos
                  importantes da associação.
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
              Participe dos Nossos Eventos
            </h2>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
              Associados da ASOF recebem convites exclusivos e podem participar
              de todos os eventos promovidos pela associação.
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
