import { Globe, FileText, Shield } from 'lucide-react';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import IconCard from '@/components/ui/IconCard';

const PillarsSection = () => {
  const pillars = [
    {
      icon: Globe,
      title: 'Assistência Consular',
      text: 'Apoio aos brasileiros no exterior, emissão de documentos e gestão de crises.',
    },
    {
      icon: FileText,
      title: 'Gestão Administrativa',
      text: 'Gerenciamento de recursos, patrimônio e pessoal nos postos e na SERE.',
    },
    {
      icon: Shield,
      title: 'Promoção Cultural',
      text: 'Promoção da imagem do Brasil e interface com a sociedade civil.',
    },
  ];

  return (
    <Section className="bg-neutral border-y border-blue-200/50" id="atuacao">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
            Pilares de Atuação
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((card, idx) => (
            <IconCard
              key={idx}
              icon={card.icon}
              title={card.title}
              description={card.text}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default PillarsSection;
