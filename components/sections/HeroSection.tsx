'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  heroContainer,
  heroBadge,
  heroTitle,
  heroDescription,
  heroButtons,
} from '@/lib/motion-variants';

const HeroSection = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
        }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1557127029-f9dc38d78e68?q=80&w=2070&auto=format&fit=crop"
          alt="Arquitetura moderna do Palácio do Itamaraty em Brasília, sede do Ministério das Relações Exteriores"
          fill
          priority
          quality={85}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
      </motion.div>

      {/* Hero Content */}
      <Container className="relative z-10 text-center text-white pt-20">
        <motion.div
          variants={!prefersReducedMotion ? heroContainer : undefined}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={!prefersReducedMotion ? heroBadge : undefined}
            className="inline-block mb-6 px-4 py-1 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-medium">
              Serviço Exterior Brasileiro
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={!prefersReducedMotion ? heroTitle : undefined}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-8 leading-tight"
          >
            Excelência em <br />
            <span className="italic text-accent">Gestão</span> e Serviço Consular.
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={!prefersReducedMotion ? heroDescription : undefined}
            className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto mb-8 font-light leading-relaxed opacity-90"
          >
            Representamos os Oficiais de Chancelaria, pilar fundamental da estrutura
            e funcionamento do Ministério das Relações Exteriores do Brasil.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={!prefersReducedMotion ? heroButtons : undefined}
            className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center"
          >
            <Button variant="highlight">Junte-se à Associação</Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Saiba Mais
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50"
      >
        <ArrowRight className="transform rotate-90" size={24} aria-hidden="true" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
