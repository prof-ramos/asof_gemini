import type { Metadata } from 'next';
import { FileText, Download, Eye, Shield } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Transparência',
  description: 'Portal da Transparência da ASOF - Acesse demonstrações financeiras, prestação de contas e informações institucionais.',
};

const financialYears = [2024, 2023, 2022, 2021, 2020];

const documents = [
  { title: 'Demonstração Financeira 2024', type: 'Balanço Anual', date: '2024-12-31' },
  { title: 'Prestação de Contas 2023', type: 'Relatório Completo', date: '2023-12-31' },
  { title: 'Ata da Assembleia Geral 2024', type: 'Ata', date: '2024-03-15' },
  { title: 'Relatório de Gestão 2023-2024', type: 'Relatório', date: '2024-01-30' },
];

export default function TransparenciaPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <Section className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="mx-auto mb-6" size={64} aria-hidden="true" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Portal da Transparência
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              Compromisso com a ética, prestação de contas e acesso à informação para
              todos os associados e sociedade.
            </p>
          </div>
        </Container>
      </Section>

      {/* Demonstrações Financeiras */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Demonstrações Financeiras
            </h2>
            <p className="text-lg text-primary-dark max-w-2xl mx-auto">
              Acesse os balanços e relatórios financeiros da ASOF
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left py-4 px-4 font-serif text-lg text-primary">Ano</th>
                    <th className="text-left py-4 px-4 font-serif text-lg text-primary">Receitas</th>
                    <th className="text-left py-4 px-4 font-serif text-lg text-primary">Despesas</th>
                    <th className="text-left py-4 px-4 font-serif text-lg text-primary">Resultado</th>
                    <th className="text-right py-4 px-4 font-serif text-lg text-primary">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {financialYears.map((year) => (
                    <tr key={year} className="border-b border-slate-200 hover:bg-neutral/30 transition-colors">
                      <td className="py-4 px-4 font-bold text-primary">{year}</td>
                      <td className="py-4 px-4 text-primary-dark">R$ 2.450.000,00</td>
                      <td className="py-4 px-4 text-primary-dark">R$ 2.280.000,00</td>
                      <td className="py-4 px-4 text-accent font-semibold">+ R$ 170.000,00</td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-accent hover:text-accent-light transition-colors flex items-center gap-2 ml-auto">
                          <Download size={16} aria-hidden="true" />
                          <span className="text-sm">Baixar PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>

      {/* Documentos */}
      <Section className="bg-neutral">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">
              Documentos e Atas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {documents.map((doc, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <FileText className="text-accent shrink-0 mt-1" size={32} aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-lg text-primary mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-primary-dark mb-2">{doc.type}</p>
                    <p className="text-xs text-slate-500 mb-3">{new Date(doc.date).toLocaleDateString('pt-BR')}</p>
                    <button className="text-sm text-accent hover:text-accent-light font-semibold flex items-center gap-2">
                      <Download size={14} aria-hidden="true" />
                      Baixar Documento
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Lei de Acesso à Informação */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Eye className="mx-auto mb-4 text-accent" size={48} aria-hidden="true" />
              <h2 className="text-4xl font-serif font-bold text-primary mb-4">
                Lei de Acesso à Informação
              </h2>
            </div>

            <Card className="bg-neutral/50">
              <p className="text-lg text-primary-dark mb-6 leading-relaxed">
                Em cumprimento à Lei nº 12.527/2011, a ASOF garante o acesso a
                informações públicas, promovendo transparência e accountability em
                todas as suas ações.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <p className="text-primary-dark">
                    Acesso livre a demonstrações financeiras e documentos institucionais
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <p className="text-primary-dark">
                    Prazo de resposta: até 20 dias para solicitações de informação
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <p className="text-primary-dark">
                    Canal direto para solicitações: transparencia@asof.org.br
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button variant="primary">Solicitar Informação</Button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Canal de Denúncias */}
      <Section className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="mx-auto mb-6" size={48} aria-hidden="true" />
            <h2 className="text-4xl font-serif font-bold mb-6">Canal de Denúncias</h2>
            <p className="text-lg text-slate-200 mb-8 leading-relaxed">
              A ASOF disponibiliza canal seguro e confidencial para denúncias de
              irregularidades, garantindo o anonimato do denunciante.
            </p>
            <Button variant="ghost" className="border-2">
              Acessar Canal de Denúncias
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
