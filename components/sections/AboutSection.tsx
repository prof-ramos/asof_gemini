'use client';

import Image from 'next/image';
import { Shield, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { staggerContainer, fadeInUp, iconFloat } from '@/lib/motion-variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const AboutSection = () => {
  const prefersReducedMotion = useReducedMotion();

  const features = [
    {
      icon: Shield,
      title: 'Defesa de Direitos',
      description: 'Proteção jurídica e representação sindical ativa.',
    },
    {
      icon: Users,
      title: 'Integração',
      description: 'Conexão entre oficiais no Brasil e no exterior.',
    },
    {
      icon: Award,
      title: 'Valorização',
      description: 'Busca constante por reconhecimento e isonomia.',
    },
  ];

  return (
    <Section className="bg-white" id="sobre">
      <Container>
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Image Section */}
          <RevealOnScroll variant="fadeInLeft" className="w-full md:w-1/2">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                alt="Escritório do Palácio do Itamaraty, representando a tradição e modernidade do Serviço Exterior Brasileiro"
                width={800}
                height={1000}
                className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-sm shadow-2xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-primary-dark p-8 text-white hidden md:block shadow-lg rounded-sm">
                <p className="text-4xl font-serif font-bold">30+</p>
                <p className="text-xs uppercase tracking-widest mt-2">Anos de História</p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Content Section */}
          <div className="w-full md:w-1/2">
            <RevealOnScroll variant="fadeInUp" delay={0.1}>
              <h3 className="text-primary-dark font-bold text-sm tracking-[0.2em] uppercase mb-4">
                Quem Somos
              </h3>
            </RevealOnScroll>

            <RevealOnScroll variant="fadeInUp" delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-serif text-primary mb-8 leading-tight">
                Defendendo os interesses da carreira e fortalecendo o Brasil.
              </h2>
            </RevealOnScroll>

            <RevealOnScroll variant="fadeInUp" delay={0.3}>
              <p className="text-primary-dark mb-6 leading-relaxed font-light text-lg">
                A ASOF atua incansavelmente na valorização da carreira de Oficial de
                Chancelaria, garantindo que os profissionais tenham as condições
                necessárias para desempenhar seu papel vital no Serviço Exterior Brasileiro
                e na assistência consular.
              </p>
            </RevealOnScroll>

            {/* Features with stagger */}
            <motion.div
              variants={!prefersReducedMotion ? staggerContainer : undefined}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 gap-8 mt-10"
            >
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={!prefersReducedMotion ? fadeInUp : undefined}
                    className="flex gap-4"
                  >
                    <motion.div
                      animate={!prefersReducedMotion ? iconFloat.animate : undefined}
                    >
                      <Icon className="text-accent shrink-0" size={28} aria-hidden="true" />
                    </motion.div>
                    <div>
                      <h4 className="font-serif text-lg font-bold mb-2 text-primary">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-primary-dark">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default AboutSection;
