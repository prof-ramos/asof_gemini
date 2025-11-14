import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1557127029-f9dc38d78e68?q=80&w=2070&auto=format&fit=crop"
          alt="Arquitetura moderna do Palácio do Itamaraty em Brasília, símbolo da diplomacia brasileira"
          fill
          priority
          quality={85}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
      </div>

      {/* Hero Content */}
      <Container className="relative z-10 text-center text-white pt-20">
        <div className="inline-block mb-6 px-4 py-1 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm">
          <span className="text-xs uppercase tracking-[0.2em] font-medium">
            Serviço Exterior Brasileiro
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-8 leading-tight animate-fade-in-up">
          Excelência na <br />
          <span className="italic text-accent">Diplomacia</span> e Gestão.
        </h2>
        <p className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto mb-8 font-light leading-relaxed opacity-90">
          Representamos os Oficiais de Chancelaria, pilar fundamental da estrutura
          e funcionamento do Ministério das Relações Exteriores do Brasil.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button variant="highlight">Junte-se à Associação</Button>
          <button className="px-8 py-3 border border-white text-white hover:bg-white hover:text-primary transition-all duration-300 uppercase text-sm tracking-widest font-medium rounded-sm">
            Saiba Mais
          </button>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <ArrowRight className="transform rotate-90" size={24} aria-hidden="true" />
      </div>
    </section>
  );
};

export default HeroSection;
