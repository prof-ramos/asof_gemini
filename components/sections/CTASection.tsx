import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const CTASection = () => {
  return (
    <Section className="bg-gradient-to-r from-primary-dark to-accent text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Container className="relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-serif mb-6">
          Fortaleça nossa carreira
        </h2>
        <p className="text-slate-100 text-lg max-w-2xl mx-auto mb-10 font-light">
          Juntos somos mais fortes. Associe-se à ASOF e tenha acesso a assessoria
          jurídica, convênios exclusivos e representatividade política.
        </p>
        <Button variant="ghost" className="px-12 py-4 text-base border-2">
          Quero me Associar
        </Button>
      </Container>
    </Section>
  );
};

export default CTASection;
