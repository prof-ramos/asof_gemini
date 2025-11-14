import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import ContactForm from './ContactForm';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a ASOF. Envie sua mensagem, dúvida ou sugestão.',
};

const faq = [
  {
    question: 'Como me tornar associado?',
    answer: 'Acesse a área "Associe-se" em nosso site e preencha o formulário de inscrição. Nossa equipe entrará em contato em até 48 horas.',
  },
  {
    question: 'Quais os benefícios da associação?',
    answer: 'Associados têm acesso a assessoria jurídica, descontos em convênios, eventos exclusivos e representatividade política.',
  },
  {
    question: 'Como funciona a mensalidade?',
    answer: 'A contribuição mensal é de 1% do salário base, com desconto direto em folha.',
  },
];

export default function ContatoPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <Section className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Fale Conosco
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              Estamos à disposição para esclarecer dúvidas, receber sugestões e
              atender às necessidades dos associados.
            </p>
          </div>
        </Container>
      </Section>

      {/* Formulário e Informações */}
      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">
                Envie sua Mensagem
              </h2>
              <ContactForm />
            </div>

            {/* Informações de Contato */}
            <div className="space-y-6">
              <Card>
                <MapPin className="text-accent mb-4" size={32} aria-hidden="true" />
                <h3 className="font-serif font-bold text-lg text-primary mb-2">
                  Endereço
                </h3>
                <p className="text-primary-dark text-sm">
                  {SITE_CONFIG.contact.address}
                  <br />
                  {SITE_CONFIG.contact.city}
                </p>
              </Card>

              <Card>
                <Phone className="text-accent mb-4" size={32} aria-hidden="true" />
                <h3 className="font-serif font-bold text-lg text-primary mb-2">
                  Telefone
                </h3>
                <a
                  href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, '')}`}
                  className="text-primary-dark text-sm hover:text-accent transition-colors"
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </Card>

              <Card>
                <Mail className="text-accent mb-4" size={32} aria-hidden="true" />
                <h3 className="font-serif font-bold text-lg text-primary mb-2">
                  E-mail
                </h3>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="text-primary-dark text-sm hover:text-accent transition-colors break-all"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </Card>

              <Card>
                <Clock className="text-accent mb-4" size={32} aria-hidden="true" />
                <h3 className="font-serif font-bold text-lg text-primary mb-2">
                  Horário de Atendimento
                </h3>
                <p className="text-primary-dark text-sm">
                  Segunda a Sexta
                  <br />
                  9h às 18h
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-neutral">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center">
              Perguntas Frequentes
            </h2>

            <div className="space-y-6">
              {faq.map((item, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <h3 className="font-serif font-bold text-xl text-primary mb-3">
                    {item.question}
                  </h3>
                  <p className="text-primary-dark leading-relaxed">{item.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Mapa (Placeholder) */}
      <Section className="bg-white py-0">
        <div className="w-full h-96 bg-slate-200 flex items-center justify-center">
          <p className="text-primary-dark">
            Mapa Google (Integração será adicionada posteriormente)
          </p>
        </div>
      </Section>
    </div>
  );
}
